import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import Helmet from 'react-helmet';
import _ from 'lodash';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input } from 'antd';

import {
  getIsReloading,
  getAuthenticatedUser,
  getProfileSaveStatus,
  getSavingProfileSettings
} from '../reducers';
import socialProfiles from '../helpers/socialProfiles';
import withEditor from '../components/Editor/withEditor';
import EditorInput from '../components/Editor/EditorInput';
import { remarkable } from '../components/Story/Body';
import BodyContainer from '../containers/Story/BodyContainer';
import Action from '../components/Button/Action';
import {
  saveProfileSettings,
  startSavingProfileSettings,
  resetProfileSettingsStatus
} from './settingsActions';
//src/client/settings/settingsActions.js
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import './Settings.less';

const FormItem = Form.Item;

function mapPropsToFields(props) {
  let metadata = _.attempt(JSON.parse, props.user.json_metadata);
  if (_.isError(metadata)) metadata = {};

  const profile = metadata.profile || {};

  return Object.keys(profile).reduce(
    (a, b) => ({
      ...a,
      [b]: Form.createFormField({
        value: profile[b],
      }),
    }),
    {},
  );
}

@requiresLogin
@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    reloading: getIsReloading(state),
    profileSaveStaus: getProfileSaveStatus(state),
    isSavingProfileSettings: getSavingProfileSettings(state)
  }),
  { saveProfileSettings, startSavingProfileSettings, resetProfileSettingsStatus }
)
@Form.create({
  mapPropsToFields,
})
@withEditor
export default class ProfileSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    saveProfileSettings: PropTypes.func,
    startSavingProfileSettings: PropTypes.func,
    resetProfileSettingsStatus: PropTypes.func,
  };

  static defaultProps = {
    onImageUpload: () => {},
    onImageInvalid: () => {},
    saveProfileSettings: () => {},
    startSavingProfileSettings: () => {},
    resetProfileSettingsStatus: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      bodyHTML: '',
    };

    this.handleSignatureChange = this.handleSignatureChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  componentWillUnmount() {
    this.props.resetProfileSettingsStatus();
  }

  redirectAfterSuccess() {
    return <Redirect to={`/@${this.props.user.name}`}/>
  }

  handleSignatureChange(body) {
    _.throttle(this.renderBody, 200, { leading: false, trailing: true })(body);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;

    if (!form.isFieldsTouched()) return;

    form.validateFields((err, values) => {
      // console.log("EDIT PROFILE RAW values: ",values);
      if (!err) {
        this.props.startSavingProfileSettings();
        const cleanValues = Object.keys(values)
          .filter(field => form.isFieldTouched(field))
          .reduce(
            (a, b) => ({
              ...a,
              [b]: values[b] || '',
            }),
            {},
          );
        // console.log("cleanValues: ",cleanValues);
        //this.props.saveProfileSettings(cleanValues);
        this.props.saveProfileSettings(values);
      }
    });
  }

  renderBody(body) {
    this.setState({
      bodyHTML: remarkable.render(body),
    });
  }

  render() {
    const { intl, form, profileSaveStaus } = this.props;
    const { bodyHTML } = this.state;
    const { getFieldDecorator } = form;

    if(profileSaveStaus==='success') {
      return this.redirectAfterSuccess();
    } else if(profileSaveStaus === "error") {
      this.props.resetProfileSettingsStatus();
    }

    const socialInputs = socialProfiles.map(profile => (
      <FormItem key={profile.id}>
        {getFieldDecorator(profile.id, {
          rules: [
            {
              message: intl.formatMessage({
                id: 'profile_social_profile_incorrect',
                defaultMessage:
                  "This doesn't seem to be valid username. Only alphanumeric characters, hyphens, underscores and dots are allowed.",
              }),
              pattern: /^[0-9A-Za-z-_.]+$/,
            },
          ],
        })(
          <Input
            size="large"
            prefix={
              <i
                className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
                style={{
                  color: profile.color,
                }}
              />
            }
            placeholder={profile.name}
          />,
        )}
      </FormItem>
    ));

    return (
      <div className="shifted">
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'edit_profile', defaultMessage: 'Edit profile' })} - Banter
          </title>
        </Helmet>
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <h1>
              <FormattedMessage id="edit_profile" defaultMessage="Edit Profile" />
            </h1>
            <Form onSubmit={this.handleSubmit}>
              <div className="Settings">
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_name" defaultMessage="Name" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('name')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_name_placeholder',
                            defaultMessage: 'Name to display on your profile',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_about" defaultMessage="About me" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('about')(
                        <Input.TextArea
                          autosize={{ minRows: 2, maxRows: 6 }}
                          placeholder={intl.formatMessage({
                            id: 'profile_about_placeholder',
                            defaultMessage: 'Few words about you',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_location" defaultMessage="Location" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('location')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_location_placeholder',
                            defaultMessage: 'Your location',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_website" defaultMessage="Website" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('website')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_website_placeholder',
                            defaultMessage: 'Your website URL',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_picture" defaultMessage="Profile picture" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('profile_image')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_picture',
                            defaultMessage: 'Profile picture',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_cover" defaultMessage="Cover picture" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('cover_image')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_cover',
                            defaultMessage: 'Cover picture',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage
                      id="profile_social_profiles"
                      defaultMessage="Social profiles"
                    />
                  </h3>
                  <div className="Settings__section__inputs">{socialInputs}</div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_signature" defaultMessage="Signature" />
                  </h3>
                  <div className="Settings__section__inputs">
                    {getFieldDecorator('signature', {
                      initialValue: '',
                    })(
                      <EditorInput
                        rows={6}
                        onChange={this.handleSignatureChange}
                        onImageUpload={this.props.onImageUpload}
                        onImageInvalid={this.props.onImageInvalid}
                        inputId={'profile-inputfile'}
                      />,
                    )}
                    {bodyHTML && (
                      <Form.Item label={<FormattedMessage id="preview" defaultMessage="Preview" />}>
                        <BodyContainer full body={bodyHTML} />
                      </Form.Item>
                    )}
                  </div>
                </div>
                {/*<Action primary big type="submit" disabled={true} />*/}
                <Action primary big type="submit" disabled={!form.isFieldsTouched() || this.props.isSavingProfileSettings} >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Action>
                {profileSaveStaus === "error" ?
                  <div style={{color: 'red'}}>Something went wrong!</div> : null}
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
