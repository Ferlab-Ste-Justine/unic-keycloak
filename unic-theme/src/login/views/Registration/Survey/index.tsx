import { useDispatch } from 'react-redux';
import { Button, Checkbox, Form, Input, Space, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';
import cx from 'classnames';
import { I18n } from 'keycloakify/login/i18n';
import { KcContext } from 'login/keycloak/kcContext';

import { userLogin } from 'store/registrationFlow/thunks';

import { LINKEDIN_REGEX, sortOptionsLabelsByName } from '../../../../utils';

import styles from './index.module.scss';

enum FORM_FIELDS {
  ROLES = 'roles',
  OTHER_ROLE = 'other_role',
  AFFILIATION = 'affiliation',
  NO_AFFILIATION = 'no_affiliation',
  RESEARCH_DOMAINS = 'research_domains',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  USER_TITLE = 'user_title',
  EMAIL = 'email',
  LINKEDIN = 'linkedin',
  OTHER_RESEARCH_DOMAINS = 'other_research_domains',
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

  const OTHER_KEY = 'other';

  const validateMessages = {
    required: advancedMsgStr('required_field_error'),
  };

  const removeOtherKey = (list: string[], otherValue: string) => {
    const listWithoutOtherKey = list.filter((value) => value !== OTHER_KEY);
    if (otherValue) {
      listWithoutOtherKey.push(otherValue);
    }
    return listWithoutOtherKey;
  };

  const hasOtherRole = (userRoles: string[]) =>
    userRoles.find((role) => !roleOptions.find((defaultRole) => defaultRole.value === role));

  return (
    <Form
      form={form}
      className={styles.registrationForm}
      fields={[
        {
          name: [FORM_FIELDS.NO_AFFILIATION],
          value: kcContext.userProfile.affiliation ? false : undefined,
        },
        {
          name: [FORM_FIELDS.ROLES],
          value: hasOtherRole(kcContext.userProfile.roles ?? [])
            ? [...(kcContext.userProfile.roles ?? []), OTHER_KEY]
            : kcContext.userProfile.roles,
        },
        {
          name: [FORM_FIELDS.OTHER_ROLE],
          value: hasOtherRole(kcContext.userProfile.roles ?? []),
        },
        {
          name: [FORM_FIELDS.RESEARCH_DOMAINS],
          value: hasOtherRole(kcContext.userProfile.research_domains ?? [])
            ? [...(kcContext.userProfile.research_domains ?? []), OTHER_KEY]
            : kcContext.userProfile.research_domains,
        },
        {
          name: [FORM_FIELDS.OTHER_RESEARCH_DOMAINS],
          value: hasOtherRole(kcContext.userProfile.research_domains ?? []),
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
          value: kcContext.userProfile.title,
        },
        {
          name: [FORM_FIELDS.EMAIL],
          value: kcContext.userProfile.email,
        },
        {
          name: [FORM_FIELDS.LINKEDIN],
          value: kcContext.userProfile.linkedin,
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
              email: kcContext.userProfile.email,
              external_individual_email: values[FORM_FIELDS.EMAIL],
              linkedin: values[FORM_FIELDS.LINKEDIN],
              affiliation: values[FORM_FIELDS.AFFILIATION],
              roles: removeOtherKey(
                values[FORM_FIELDS.ROLES] || [],
                values[FORM_FIELDS.OTHER_ROLE],
              ),
              research_domains: removeOtherKey(
                values[FORM_FIELDS.RESEARCH_DOMAINS] || [],
                values[FORM_FIELDS.OTHER_RESEARCH_DOMAINS],
              ),
            },
          }),
        );
      }}
      layout="vertical"
      validateMessages={validateMessages}
    >
      <Title level={3} className={styles.subSectionTitle}>
        {advancedMsgStr('survey_identification_title')}
      </Title>
      <Text className={styles.allFieldRequiredNotice}>{advancedMsg('survey_introduction')}</Text>
      <Form.Item
        name={FORM_FIELDS.FIRST_NAME}
        label={advancedMsgStr('first_name')}
        required={true}
        rules={[{ required: true, type: 'string' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={FORM_FIELDS.LAST_NAME}
        label={advancedMsgStr('last_name')}
        required={true}
        rules={[{ required: true, type: 'string' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={FORM_FIELDS.USER_TITLE}
        label={advancedMsgStr('user_title')}
        required={false}
        rules={[{ required: false, type: 'string' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={FORM_FIELDS.AFFILIATION}
        label={advancedMsgStr('survey_form_affiliation_help')}
        required={true}
        rules={[{ required: true, type: 'string' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.EMAIL] !== currentValues[FORM_FIELDS.EMAIL]
        }
      >
        <Form.Item
          name={FORM_FIELDS.EMAIL}
          label={advancedMsgStr('emailScopeConsentText')}
          required={true}
          rules={[
            {
              required: true,
              type: 'email',
              message: advancedMsg('emailScopeConsentTextNonValid'),
              validateTrigger: 'onSubmit',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.LINKEDIN] !== currentValues[FORM_FIELDS.LINKEDIN]
        }
      >
        <Form.Item
          name={FORM_FIELDS.LINKEDIN}
          label={advancedMsgStr('survey_form_user_linkedin')}
          required={false}
          rules={[
            {
              required: false,
              pattern: LINKEDIN_REGEX,
              message: advancedMsg('survey_form_user_linkedin_non_valid'),
              validateTrigger: 'onSubmit',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form.Item>
      <Title level={3} className={styles.subSectionTitle}>
        {advancedMsgStr('survey_form_function')}
      </Title>
      <Form.Item
        className={styles.withCustomHelp}
        name={FORM_FIELDS.ROLES}
        label={advancedMsg('survey_form_roles_label')}
      >
        <Checkbox.Group className={styles.checkBoxGroup}>
          <span className={styles.help}>{advancedMsgStr('checkbox_help')}</span>
          <Space direction="vertical">
            {roleOptionsSorted.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
            <Checkbox value={OTHER_KEY}>{advancedMsgStr('other_label')}</Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.ROLES] !== currentValues[FORM_FIELDS.ROLES]
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(FORM_FIELDS.ROLES)?.includes(OTHER_KEY) ? (
            <Form.Item
              className={styles.dynamicField}
              name={FORM_FIELDS.OTHER_ROLE}
              label={advancedMsgStr('role_other_label')}
            >
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item>
      <Title level={3} className={styles.subSectionTitle}>
        {advancedMsgStr('survey_form_research_domain_label')}
      </Title>
      <Form.Item
        className={styles.withCustomHelp}
        name={FORM_FIELDS.RESEARCH_DOMAINS}
        label={advancedMsg('survey_form_roles_label')}
      >
        <Checkbox.Group className={styles.checkBoxGroup}>
          <Space direction="vertical">
            <span className={styles.help}>{advancedMsgStr('checkbox_help')}</span>
            {researchDomainOptionsSorted.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
            <Checkbox value={OTHER_KEY}>{advancedMsgStr('other_label')}</Checkbox>
          </Space>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[FORM_FIELDS.RESEARCH_DOMAINS] !== currentValues[FORM_FIELDS.RESEARCH_DOMAINS]
        }
      >
        {({ getFieldValue }) =>
          getFieldValue(FORM_FIELDS.RESEARCH_DOMAINS)?.includes(OTHER_KEY) ? (
            <Form.Item
              className={styles.dynamicField}
              name={FORM_FIELDS.OTHER_RESEARCH_DOMAINS}
              label={advancedMsgStr('role_other_label')}
            >
              <Input />
            </Form.Item>
          ) : null
        }
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
