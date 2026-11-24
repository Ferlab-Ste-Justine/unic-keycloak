FROM node:18-alpine3.15 as builder-theme
WORKDIR /app
COPY . /app
RUN cd unic-theme/ && npm install --legacy-peer-deps && npm run keycloak

FROM maven:3-amazoncorretto-17 as builder-providers
WORKDIR /app
COPY . /app
RUN cd unic-providers/ && mvn clean package -DskipTests

# keycloak:21.1.1 bundles OpenJDK 17.0.7, which is vulnerable to CVE-2026-114938 (Java4Shell).
# This stage installs the patched JDK (17.0.21.1) so the final stage can replace the bundled one.
# Remove it once the Keycloak base image ships a fixed JDK.
# The Keycloak base image is ubi9-micro (no package manager), so the JDK is installed into a separate root filesystem.
# The setup package is removed so the copy does not overwrite Keycloak's /etc/passwd.
FROM registry.access.redhat.com/ubi9:9.9-1795197514 as builder-jdk
RUN mkdir -p /mnt/rootfs && \
    dnf install --installroot /mnt/rootfs --releasever 9 --setopt install_weak_deps=false --nodocs -y \
      java-17-openjdk-headless-1:17.0.21.1.2 && \
    dnf --installroot /mnt/rootfs clean all && \
    rpm --root /mnt/rootfs -e --nodeps setup

FROM quay.io/keycloak/keycloak:21.1.1

# Replace the bundled JDK 17.0.7 with the patched one from builder-jdk
USER root
RUN rm -rf /usr/lib/jvm/*17.0.7*
COPY --from=builder-jdk /mnt/rootfs /
USER 1000

ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_DEBUG=true
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false
ENV KC_CACHE=ispn
ENV KC_CACHE_STACK=kubernetes
ENV JAVA_OPTS_APPEND=-Djgroups.dns.query=keycloak-headless

WORKDIR /opt/keycloak

COPY --from=builder-providers /app/unic-providers/target/bio.ferlab.keycloak.unic-keycloak-ext-jar-with-dependencies.jar /opt/keycloak/providers
COPY --from=builder-theme /app/unic-theme/build_keycloak/src/main/resources/theme/keycloakify-unic-app /opt/keycloak/themes/keycloakify-unic-app

RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

