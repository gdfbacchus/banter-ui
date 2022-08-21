import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import Helmet from 'react-helmet';
import _ from 'lodash';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Button, Upload  } from 'antd';

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
import constants from '../../server/routes/common/constants.js'

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
      profileImage: '',
      coverImage: ''
    };

    this.handleSignatureChange = this.handleSignatureChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.isImagesTouched = this.isImagesTouched.bind(this);
    this.onRemoveUploadedFile = this.onRemoveUploadedFile.bind(this);
    this.onChangeImageUpload = this.onChangeImageUpload.bind(this);
  }

  componentDidMount() {
    console.log('[BANTER] ProfileSettings this.props.user: ', this.props.user);
    if (this.props.user && this.props.user.json_metadata !== undefined) {
      if (this.props.user.json_metadata.length) {
        const metadata = _.attempt(JSON.parse, this.props.user.json_metadata);
        console.log('[BANTER] ProfileSettings parsed metadata: ', metadata);
        this.setState({profileImage: metadata.profile && metadata.profile.profile_image || '', coverImage: metadata.profile && metadata.profile.cover_image || ''})
      }

    }
  }

  componentWillUnmount() {
    this.props.resetProfileSettingsStatus();
  }

  onRemoveUploadedFile(fieldName, stateFieldName) {
    // const metadata = _.attempt(JSON.parse, this.props.user.json_metadata);
    // this.setState({[fieldName]: metadata.profile[fieldName] || ''})
    this.setState({[stateFieldName]: ''});

    // TODO remove file on the server
  }

  onChangeImageUpload(info, stateFieldName) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log('[BANTER] Upload file uploaded successfully');
      console.log('[BANTER] Upload state: ', this.state);
      console.log('[BANTER] Upload file:', info.file);
      console.log('[BANTER] Upload info.file.response.url:', info.file.response.url);
      if (info.file.response && info.file.response.url) {
        this.setState({[stateFieldName]: info.file.response.url})
      }
    } else if (info.file.status === 'error') {
      console.error(`[BANTER] ${info.file.name} file upload failed.`);
    }
  }

  isImagesTouched() {
    const fields = {};
    const { profileImage, coverImage } = this.state;

    if (this.props.user && this.props.user.json_metadata) {

      const metadata = _.attempt(JSON.parse, this.props.user.json_metadata);

      if (profileImage !== metadata.profile.profile_image && profileImage.trim().length) {
      // if (profileImage !== metadata.profile.profile_image) {
        fields.profile_image = profileImage;
      }
      if (coverImage !==  metadata.profile.cover_image && coverImage.trim().length) {
      // if (coverImage !==  metadata.profile.cover_image) {
        fields.cover_image = coverImage;
      }
      console.log('[BANTER] Touched image fields: ', fields);
      if (Object.keys(fields).length) {
        return fields;
      }
    } else {
      if (profileImage.trim().length) {
        // if (profileImage !== metadata.profile.profile_image) {
        fields.profile_image = profileImage;
      }
      if (coverImage.trim().length) {
        // if (coverImage !==  metadata.profile.cover_image) {
        fields.cover_image = coverImage;
      }
      console.log('[BANTER] Touched image fields 2: ', fields);
      if (Object.keys(fields).length) {
        return fields;
      }
    }
    return false;
  }

  handleSignatureChange(body) {
    _.throttle(this.renderBody, 200, { leading: false, trailing: true })(body);
  }

  redirectAfterSuccess() {
    return <Redirect to={`/@${this.props.user.name}`}/>
  }


  handleSubmit(e) {
    e.preventDefault();
    const { form } = this.props;

    if (!form.isFieldsTouched() && !this.isImagesTouched()) return;
    const touchedImages = this.isImagesTouched();


    form.validateFields((err, values) => {
      // console.log("EDIT PROFILE RAW values: ",values);
      if (!err) {
        this.props.startSavingProfileSettings();
        // const cleanValues = Object.keys(values)
        //   .filter(field => form.isFieldTouched(field))
        //   .reduce(
        //     (a, b) => ({
        //       ...a,
        //       [b]: values[b] || '',
        //     }),
        //     {},
        //   );
        Object.keys(touchedImages).forEach((field) => {
          values[field] = touchedImages[field];
        })

        console.log("[BANTER] ProfileSettings -> handleSubmit() values: ",values);
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
    const { bodyHTML, profileImage, coverImage } = this.state;
    const { getFieldDecorator } = form;
    const isImagesTouched = this.isImagesTouched();
    console.log('[BANTER] render isImagesTouched: ', isImagesTouched)
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
                          autoSize={{ minRows: 2, maxRows: 6 }}
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
                {/* PROFILE IMAGE */}
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_picture" defaultMessage="Profile picture" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                        <Input
                          value={this.state.profileImage}
                          onChange={(event) => {
                            console.log('[BANTER] NEW profileImage value event.target.value: ', event.target.value);
                            this.setState({profileImage: event.target.value}, () => {
                              console.log('[BANTER] NEW profileImage value state: ', this.state);
                            })
                          }}
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_picture',
                            defaultMessage: 'Profile picture',
                          })}
                        />
                    </FormItem>
                  </div>

                  <Upload
                    action= {`${constants.BASE_URL}${constants.UPLOAD_IMAGE_URL}`}
                    onChange ={(info) => {this.onChangeImageUpload(info, 'profileImage');}}
                    onRemove = {() => this.onRemoveUploadedFile('profile_image', 'profileImage')}
                  >
                    <Button className="upload-image-btn" >Upload Profile Picture</Button>
                  </Upload>
                </div>

                {/* COVER IMAGE */}
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_cover" defaultMessage="Cover picture" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      <Input
                        value={this.state.coverImage}
                        onChange={(event) => {
                          this.setState({coverImage: event.target.value})
                        }}
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'profile_cover',
                          defaultMessage: 'Cover picture',
                        })}
                      />
                    </FormItem>
                  </div>
                  <Upload
                    action= {`${constants.BASE_URL}${constants.UPLOAD_IMAGE_URL}`}
                    onChange ={(info) => {this.onChangeImageUpload(info, 'coverImage');}}
                    onRemove = {() => this.onRemoveUploadedFile('cover_image', 'coverImage')}
                  >
                    <Button className="upload-image-btn" >Upload Cover Picture</Button>
                  </Upload>
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
                {/*<Action primary big type="submit" disabled={!form.isFieldsTouched() || this.props.isSavingProfileSettings} >*/}
                <Action primary big type="submit" disabled={!form.isFieldsTouched() && !isImagesTouched } >
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
