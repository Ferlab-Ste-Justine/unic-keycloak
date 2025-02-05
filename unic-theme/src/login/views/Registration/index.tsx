import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { Button } from 'antd';
import { PageProps } from 'keycloakify/login';
import { useGetClassName } from 'keycloakify/login/lib/useGetClassName';
import { assert } from 'keycloakify/tools/assert';
import SideImageLayout from 'layout/SideImage';
import { I18n } from 'login/keycloak/i18n';
import { KcContext } from 'login/keycloak/kcContext';
import { ErrorContainer } from 'login/views/Error';

import MainSideImage from 'assets/side-img-svg.svg';
import { useRegistrationFlow } from 'store/registrationFlow';

import SurveyStep from './Survey';

import styles from './index.module.scss';

export default function Registration(
  props: PageProps<Extract<KcContext, { pageId: 'login-update-profile.ftl' }>, I18n>,
) {
  const { hasError } = useRegistrationFlow();
  const { kcContext, i18n, doUseDefaultCss, classes } = props;

  const { realm, locale } = kcContext;

  const { currentLanguageTag, changeLocale, advancedMsg } = i18n;

  const { getClassName } = useGetClassName({
    doUseDefaultCss,
    classes,
  });

  const displayStep = () => (
    <SideImageLayout sideImgSrc={MainSideImage} theme="light" alignCenter={false}>
      <ScrollContent className={styles.joinPageWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.switchLang}>
            {realm.internationalizationEnabled &&
              (assert(locale !== undefined), true) &&
              locale.supported.length > 1 && (
                <div id="kc-locale-wrapper" className={getClassName('kcLocaleWrapperClass')}>
                  <div className="kc-dropdown" id="kc-locale-dropdown">
                    {locale.supported.map(({ languageTag }) => (
                      <Button
                        id={languageTag}
                        key={languageTag}
                        hidden={languageTag === currentLanguageTag}
                        onClick={() => {
                          changeLocale(languageTag);
                        }}
                        type="primary"
                      >
                        {languageTag.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
          </div>
          <SurveyStep kcContext={kcContext} i18n={i18n} />
        </div>
      </ScrollContent>
    </SideImageLayout>
  );

  const displayError = () => (
    <SideImageLayout sideImgSrc={MainSideImage} theme="light">
      <ErrorContainer redirectUrl={kcContext.redirectUrl} advancedMsg={advancedMsg} />
    </SideImageLayout>
  );

  return !hasError ? displayStep() : displayError();
}
