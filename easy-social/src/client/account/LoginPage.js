import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';

import { getIsAuthFetching, getIsAuthenticated, getIsLoaded } from '../reducers';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input } from 'antd';
import { login } from "./loginActions";
import { startLogin } from "../auth/authActions";
import './Settings.less';

@injectIntl
@connect(
  state => (
    {
      authenticated: getIsAuthenticated(state),
      isLoaded: getIsLoaded(state),
      isAuthFetching: getIsAuthFetching(state)
  })
  ,
  {
    login,
    startLogin
  },
)

export default class LoginPage extends React.Component {
  static propTypes = {
    login: PropTypes.func
  };

  static defaultProps = {
    login: ()=>{}
  };

  constructor(props) {
    super(props);
    this.state = {
      dynamicGlobal: null,
      isDisabledSubmit: false,
      accountName: null,
      password: null
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onUpdate(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(e) {
    e.stopPropagation();
    const lowerCaseAccountName = this.state.accountName.toLowerCase();
    this.setState({ isDisabledSubmit: true });

    this.props.startLogin();
    this.props.login(lowerCaseAccountName, this.state.password);
  }

  render() {
    const buttonClass = this.state.isDisabledSubmit ? 'CommentForm__button_disabled' : 'CommentForm__button_primary';
    const disabled = this.state.isDisabledSubmit && this.props.isAuthFetching;

    let isAuthenticated = this.props.authenticated;
    if(isAuthenticated){
      return <Redirect to="/"/>

    } else if (!isAuthenticated) {
      return (

        <div className="shifted">
          <div className="settings-layout container">
            <div className="center">
              <h1 className={"banter-light"}>
                Login
              </h1>

              <div className="Settings">
                <div className="Settings__section">
                  <div className="Invite__input-container">
                    <Form.Item
                      label={
                        <span className="Editor__label banter-light">
                        Account name
                      </span>
                      }
                    >
                      <Input
                        onChange={this.onUpdate}
                        className="Editor__title"
                        placeholder="Account name"
                        type="text"
                        name="accountName"
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="Editor__label banter-light">
                        Password
                      </span>
                      }
                    >
                      <Input
                        onChange={this.onUpdate}
                        className="Editor__title"
                        placeholder="Password"
                        type="password"
                        name="password"
                      />
                    </Form.Item>

                  </div>
                  <button
                    onClick={this.handleSubmit}
                    disabled={disabled}
                    className={`CommentForm__button ${buttonClass} `}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      );
    }
  }
}
