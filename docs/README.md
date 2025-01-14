Keycloak
========

1- Local testing

Build docker image : 

```docker build -t unic-keycloak .```

Run docker image : 

```docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin unic-keycloak:latest```

Then access to admin console here : http://localhost:8080/auth/

Login with admin/admin

In realm settings -> theme -> login theme, choose keycloakify-unic-app

Logout and try to login -> you will see the login page defined in theme -> unic
