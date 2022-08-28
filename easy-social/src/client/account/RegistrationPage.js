import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input } from 'antd';
import {
  register,
  startRegistration,
  isAvailableAccount,
  isAvailablePassword,
  resetRegistration
} from "./registrationActions";

import { reload } from '../auth/authActions';
import {
  getIsAvailableAccount,
  getIsProcessing,
  getRegStatus
} from '../reducers';

import './Settings.less';

@withRouter
@injectIntl
@connect(
  state => (
    {
      availableAccountName: getIsAvailableAccount(state),
      isProcessing: getIsProcessing(state),
      regStatus: getRegStatus(state)
  }),

  { register, startRegistration, resetRegistration, isAvailableAccount, isAvailablePassword, reload }
)

export default class RegistrationPage extends React.Component {
  static propTypes = {
    login: PropTypes.func
  };

  static defaultProps = {
    availableAccountName: false,
    availablePassword: false,
    register: ()=>{}
  };

  constructor(props) {
    super(props);
    this.state = {
      dynamicGlobal: null,
      isDisabledSubmit: false,
      accountName: "",
      password: "",
      confPassword: "",
      isValidForm: false,
      isAvailableAccountName: false
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { regStatus } = this.props;
    if ((!prevProps.regStatus || prevProps.regStatus === 'error') && regStatus === 'success') {
      this.props.history.push('/login');
    }
  }

  componentWillUnmount() {
    this.props.resetRegistration();
  }
  onUpdate(event) {
    event.persist();
    const attrName = event.target.name;

    this.setState({ [attrName]: event.target.value }, () => {
      if (attrName === 'accountName') {
        this.validateAccountName(event);
      }
      this.validateForm();
    });

  }

  handleSubmit(e) {
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });
    const lowerCaseAccountName = this.state.accountName.toLowerCase();
    this.props.startRegistration();
    setTimeout(()=>{
      this.props.register(lowerCaseAccountName, this.state.password);
    },200);
  }

  validateAccountName(event) {
    event.persist();
    if(!event.target.value){
      return;
    }
    const accountName = this.state.accountName;
    const lowerCaseValue = accountName.toLowerCase();
    this.props.isAvailableAccount(lowerCaseValue);
  }

  validateForm() {
    const { password, confPassword } = this.state
    const { availableAccountName } = this.props;

    if(password === confPassword && availableAccountName) {
      this.setState({isValidForm: true, isDisabledSubmit: false});
    } else {
      this.setState({isValidForm: false, isDisabledSubmit: true});
    }
  }

  render() {
    const buttonClass =
      this.props.isProcessing
        ? 'CommentForm__button_disabled'
        : 'CommentForm__button_primary';

    const pass = this.state.password;
    const confPass = this.state.confPassword;
    const avPassLength = pass.length > 7;
    const diss = !(pass===confPass
                  && !this.state.isDisabledSubmit
                    // && this.props.availablePassword
                      && this.props.availableAccountName
                        && this.props.regStatus === ''
                          && avPassLength);

    const isFailed = this.props.regStatus === 'error' ? <div style={{color: 'red'}}>Registration failed!</div> : '';
    const isSuccess = this.props.regStatus === 'success' ? <div style={{color: '#52c41a'}}>You have successfully registered!</div> : '';
    return (

      <div className="shifted">
        <div className="settings-layout container">
          <div className="center">
            <h1 className={"banter-light"}>
              Register new account
            </h1>

            <div className="Settings">
              {isFailed}
              {!this.props.regStatus || this.props.regStatus === 'error'?
              <div className="Settings__section">
                <div className="Invite__input-container">
                  {/*ACCOUNT NAME*/}
                  <Form.Item
                    label={
                        <span className="Editor__label">
                          Account name - to register use account based username up to 16 symbols.
                        </span>
                    }
                  >
                    <Input
                      onChange={this.onUpdate}
                      onBlur={this.validateForm}
                      className="Editor__title"
                      placeholder="Account name"
                      type="text"
                      name="accountName"
                    />
                    {!this.props.availableAccountName && this.state.accountName.length > 0 ?
                      <div>
                        <div style={{color:"red"}}>
                          Account name is already taken, or it is unavailable.
                        </div>
                      </div>: null}
                  </Form.Item>

                  {/*PASSWORD*/}
                  <Form.Item
                    label={
                      <span className="Editor__label">
                      Password
                    </span>
                    }
                  >
                    <Input
                      onChange={this.onUpdate}
                      onBlur={this.validateForm}
                      className="Editor__title"
                      placeholder="Password"
                      type="password"
                      name="password"
                    />
                    {pass.length < 8 ?
                      <div style={{color:"red"}}>Incorrect password.
                      </div> : null}
                  </Form.Item>

                  {/*CONFIRM PASSWORD*/}
                  <Form.Item
                    label={
                      <span className="Editor__label">
                      Confirm password
                    </span>
                    }
                  >
                    <Input
                      onChange={this.onUpdate}
                      className="Editor__title"
                      placeholder="Confirm password"
                      type="password"
                      name="confPassword"
                    />
                    {confPass !== pass && pass.length > 0 ?
                      <div style={{color:"red"}}>Confirm password.
                      </div> : null}
                  </Form.Item>

                </div>
                <button
                  onClick={this.handleSubmit}
                  disabled={diss}
                  className={`CommentForm__button ${buttonClass}`}
                >
                  Register
                </button>
              </div>
                : isSuccess}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


