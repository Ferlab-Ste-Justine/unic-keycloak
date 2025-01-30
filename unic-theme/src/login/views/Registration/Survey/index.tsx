import { useDispatch } from 'react-redux';
import { Button, Checkbox, Form, Input, Space, Typography } from 'antd';
import cx from 'classnames';
import { I18n } from 'keycloakify/login/i18n';
import { KcContext } from 'login/keycloak/kcContext';

import { userLogin } from 'store/registrationFlow/thunks';

import { sortOptionsLabelsByName } from '../../../../utils';

import styles from './index.module.scss';

enum FORM_FIELDS {
  ROLES = 'roles',
  AFFILIATION = 'affiliation',
  NO_AFFILIATION = 'no_affiliation',
  RESEARCH_DOMAINS = 'research_domains',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  USER_TITLE = 'user_title',
  EMAIL = 'email',
  LINKEDIN = 'linkedin',
}

const { Text } = Typography;

const roleMessagePrefix = 'survey_form_role_';
const researchDomainMessagePrefix = 'survey_form_research_domain_';

const SurveyStep = ({
  kcContext,
  i18n,
}: {
  kcContext: Extract<KcContext, { pageId: 'login-update-profile.ftl' }>;
  i18n: I18n;
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { redirectUrl } = kcContext;
  const { advancedMsg, advancedMsgStr } = i18n;

  const roleOptions = kcContext.userOptions.roleOptions || [];
  const researchDomainOptions = kcContext.userOptions.researchDomainOptions || [];
  const roleOptionsSorted = sortOptionsLabelsByName(roleOptions, advancedMsg, roleMessagePrefix);
  const researchDomainOptionsSorted = sortOptionsLabelsByName(
    researchDomainOptions,
    advancedMsg,
    researchDomainMessagePrefix,
  );

  const validateMessages = {
    required: advancedMsgStr('required_field_error'),
  };

  return (
    <Form
      form={form}
      className={styles.registrationForm}
      fields={[
        {
          name: [FORM_FIELDS.ROLES],
          value: kcContext.userProfile.roles,
        },
        {
          name: [FORM_FIELDS.AFFILIATION],
          value: kcContext.userProfile.affiliation,
        },
        {
          name: [FORM_FIELDS.NO_AFFILIATION],
          value: kcContext.userProfile.affiliation ? false : undefined,
        },
        {
          name: [FORM_FIELDS.RESEARCH_DOMAINS],
          value: kcContext.userProfile.research_domains,
        },
        {
          name: [FORM_FIELDS.FIRST_NAME],
          value: kcContext.userProfile.first_name,
        },
        {
          name: [FORM_FIELDS.LAST_NAME],
          value: kcContext.userProfile.last_name,
        },
        {
          name: [FORM_FIELDS.USER_TITLE],
          value: kcContext.userProfile.user_title,
        },
      ]}
      onFinish={(values) => {
        dispatch(
          userLogin({
            url: kcContext.url.loginAction,
            redirectUrl: kcContext.redirectUrl,
            userInfo: {
              first_name: values[FORM_FIELDS.FIRST_NAME],
              last_name: values[FORM_FIELDS.LAST_NAME],
              title: values[FORM_FIELDS.USER_TITLE],
              email: values[FORM_FIELDS.LAST_NAME],
              linkedin: values[FORM_FIELDS.LINKEDIN],
              roles: values[FORM_FIELDS.ROLES],
              affiliation: values[FORM_FIELDS.AFFILIATION],
              research_domains: values[FORM_FIELDS.RESEARCH_DOMAINS],
            },
          }),
        );
      }}
      layout="vertical"
      validateMessages={validateMessages}
    >
      <Text className={styles.allFieldRequiredNotice}>{advancedMsg('survey_introduction')}</Text>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.FIRST_NAME] !== currentValues[FORM_FIELDS.FIRST_NAME]
        }
      >
        <Form.Item
          className={cx(styles.withCustomHelp, styles.affiliationField)}
          label={advancedMsg('first_name')}
        >
          <span className={styles.help}>{advancedMsg('first_name')}</span>
          <Form.Item
            name={FORM_FIELDS.FIRST_NAME}
            className={styles.noMargin}
            required={false}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form.Item>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.LAST_NAME] !== currentValues[FORM_FIELDS.LAST_NAME]
        }
      >
        <Form.Item
          className={cx(styles.withCustomHelp, styles.affiliationField)}
          label={advancedMsg('last_name')}
        >
          <span className={styles.help}>{advancedMsg('last_name')}</span>
          <Form.Item
            name={FORM_FIELDS.LAST_NAME}
            className={styles.noMargin}
            required={false}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form.Item>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.USER_TITLE] !== currentValues[FORM_FIELDS.USER_TITLE]
        }
      >
        <Form.Item
          className={cx(styles.withCustomHelp, styles.affiliationField)}
          label={advancedMsg('user_title')}
        >
          <span className={styles.help}>{advancedMsg('user_title')}</span>
          <Form.Item name={FORM_FIELDS.USER_TITLE} className={styles.noMargin}>
            <Input />
          </Form.Item>
        </Form.Item>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.AFFILIATION] !== currentValues[FORM_FIELDS.AFFILIATION]
        }
      >
        <Form.Item
          className={cx(styles.withCustomHelp, styles.affiliationField)}
          label={advancedMsg('survey_form_affiliation_label')}
        >
          <span className={styles.help}>{advancedMsg('survey_form_affiliation_help')}</span>
          <Form.Item
            name={FORM_FIELDS.AFFILIATION}
            className={styles.noMargin}
            required={false}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form.Item>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.EMAIL] !== currentValues[FORM_FIELDS.EMAIL]
        }
      >
        <Form.Item
          className={cx(styles.withCustomHelp, styles.affiliationField)}
          label={advancedMsg('emailScopeConsentText')}
        >
          <span className={styles.help}>{advancedMsg('emailScopeConsentText')}</span>
          <Form.Item
            name={FORM_FIELDS.EMAIL}
            className={styles.noMargin}
            required={false}
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
        </Form.Item>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.LINKEDIN] !== currentValues[FORM_FIELDS.LINKEDIN]
        }
      >
        <Form.Item
          className={cx(styles.withCustomHelp, styles.affiliationField)}
          label={advancedMsg('survey_form_user_linkedin')}
        >
          <span className={styles.help}>{advancedMsg('survey_form_user_linkedin')}</span>
          <Form.Item name={FORM_FIELDS.LINKEDIN} className={styles.noMargin}>
            <Input />
          </Form.Item>
        </Form.Item>
      </Form.Item>
      <Form.Item
        className={styles.withCustomHelp}
        name={FORM_FIELDS.ROLES}
        label={advancedMsg('survey_form_function')}
        required={false}
        rules={[{ required: true }]}
      >
        <Checkbox.Group className={styles.checkBoxGroup}>
          <span className={styles.help}>{advancedMsg('checkbox_help')}</span>
          <Space direction="vertical">
            {roleOptionsSorted.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item
        className={styles.withCustomHelp}
        name={FORM_FIELDS.RESEARCH_DOMAINS}
        label={advancedMsg('survey_form_research_domain_label')}
        required={false}
        rules={[{ required: true }]}
      >
        <Checkbox.Group className={styles.checkBoxGroup}>
          <span className={styles.help}>{advancedMsg('checkbox_help')}</span>
          <Space direction="vertical">
            {researchDomainOptionsSorted.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Form.Item>
      <Space className={styles.registrationFooter}>
        <Space>
          <Button onClick={() => (window.location.href = redirectUrl)}>
            {advancedMsg('cancel')}
          </Button>
          <Button type="primary" htmlType="submit">
            {advancedMsg('submit')}
          </Button>
        </Space>
      </Space>
    </Form>
  );
};

export default SurveyStep;
