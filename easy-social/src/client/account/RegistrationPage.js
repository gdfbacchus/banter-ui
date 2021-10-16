import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {ChainStore,FetchChain} from "bitsharesjs";
import {Apis, ChainConfig} from "bitsharesjs-ws";
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Select, Radio, Checkbox, Input } from 'antd';
import {
  register,
  startRegistration,
  isAvailableAccount,
  isAvailablePassword,
  resetRegistration
} from "./registrationActions";

import Loading from '../components/Icon/Loading';

import {
  getIsAvailableAccount,
  getIsAvailablePassword,
  getIsProcessing,
  getRegStatus
} from '../reducers';

import './Settings.less';

@injectIntl
@connect(
  state => (
    {
      availableAccountName: getIsAvailableAccount(state),
      availablePassword: getIsAvailablePassword(state),
      isProcessing: getIsProcessing(state),
      regStatus: getRegStatus(state)
  }),

  { register, startRegistration, resetRegistration, isAvailableAccount, isAvailablePassword }
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
    //this.handleUpvoteSettingChange = this.handleUpvoteSettingChange.bind(this);
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



  componentWillMount() {
    // willTransitionTo(true,this._initBtsCallBack.bind(this)).then(()=>{
    //
    //   let asset = ChainStore.getAsset("1.3.4559");
    //   console.log("Asset SS: ",asset);
    //   // ChainStore.init(false).then(() => {
    //   //   //ChainStore.subscribe(this._updateState);
    //   //   // FetchChain("getAccount", "2.1.0").then((res)=>{
    //   //   //   console.log("obj res: ",res);
    //   //   // });
    //   //   setTimeout(()=>{
    //   //     let asset = ChainStore.getAsset("1.3.4559");
    //   //     console.log("Asset SS: ",asset);
    //   //   }, 2000)
    //   //   let asset1 = ChainStore.getAsset("1.3.4559");
    //   //   console.log("Asset SSss: ",asset1);
    //   //
    //   //   let isLocked = WalletDb.isLocked();
    //   //   console.log("isLocked: ",isLocked)
    //   //   console.log("is Logged In: ",!isLocked);
    //   //
    //   //   /*
    //   //    u: vasko-1-test30
    //   //    p: kenwoodd!vitOOO000#
    //   //   */
    //   //   const password = "kenwoodd!vitOOO000#";
    //   //   const account = "vasko-1-test30";
    //   //
    //   //   setTimeout(()=>{
    //   //     // let asset = ChainStore.getAsset("1.3.4559");
    //   //     // console.log("Asset SS: ",asset);
    //   //
    //   //     const {success, cloudMode} = WalletDb.validatePassword(
    //   //       password || "",
    //   //       true, //unlock
    //   //       account
    //   //     );
    //   //     console.log("success: ",success);
    //   //     console.log("cloudMode: ",cloudMode);
    //   //     if (WalletDb.isLocked()) {
    //   //       // this.setState({passwordError: true});
    //   //       console.log("Login error.")
    //   //     }
    //   //
    //   //
    //   //   }, 1000);
    //   //
    //   //
    //   // });
    //
    // }).catch(err => {
    //   console.log("willTransitionTo err:", err);
    // });


  }

  _updateState(object) {
    //console.log("this.state: ", this.state)
    let dynamicGlobal = ChainStore.getObject("2.1.0");
    if(dynamicGlobal) {
      // this.setState({dynamicGlobal: dynamicGlobal}, () => {
      //   console.log("dynamicGlobal: ", dynamicGlobal)
      // });
      console.log("dynamicGlobal: ", dynamicGlobal)
    }

  }

  _initBtsCallBack(status) {

  }
  componentDidMount() {
    /*
    if(!Apis.instance().db_api()){
      console.log("ChainStore IS NOT INIT")

      let counter=1;
      let id = setInterval(()=>{
        if(counter===10){
          clearInterval(id);
        }

        console.log("counter I: ",counter);
        let acc = ChainStore.getAccount("1.2.784756");
        // if(acc){
        if(Apis.instance().db_api() && acc){
          console.log("Account I: ",acc);
          console.log("---------------------------------");
          clearInterval(id)
        }
        console.log("=================================");
        counter++;
      },400);



    }
    else {
      console.log("ChainStore IS INITIALIZED")
      let acc3 = ChainStore.getAccount("1.2.784756");
      console.log("Account 3: ",acc3);

      let counter2=1;
      let id = setInterval(()=>{
        if(counter2===10){
          clearInterval(id);
        }
        console.log("counter II: ",counter2);
        let acc2 = ChainStore.getAccount("1.2.784756");
        if(acc2){
          console.log("Account 2: ",acc2);
          console.log("---------------------------------");
          clearInterval(id)
        }
        console.log("=================================");
        counter2++;
      },400);

    }
    */

    //this.props.reload();
  }

  componentWillUnmount() {
    this.props.resetRegistration();
  }
  onUpdate(event) {
    event.persist();

    // console.log("target value: ",event.target.value);
    // console.log("target input name: ",event.target.name);
    // console.log("target input type: ",event.target.type);
    this.setState({ [event.target.name]: event.target.value }, ()=>{
      if(event.target.name==="accountName"){this.validateForm(event)}
    });

  }

  handleSubmit(e) {
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });

    console.log("S accountName: ", this.state.accountName);
    console.log("S password: ", this.state.password);
    console.log("S confPassword: ", this.state.confPassword);
    this.props.startRegistration();
    setTimeout(()=>{
      this.props.register(this.state.accountName, this.state.password);
    },200);
  }

  validateForm(event) {
    event.persist();
    if(!event.target.value){
      return;
    }

    const accountName = this.state.accountName;
    const pass = this.state.password;

    console.log("accountName: ",accountName);
    console.log("pass: ",pass);


    this.props.isAvailableAccount(accountName);
    this.props.isAvailablePassword(accountName, pass);

    // const confPass = this.state.confPassword;
    // const avAccountName = this.props.availableAccountName;
    // const avPassword = this.props.availablePassword;
    //
    // console.log("avAccountName: ",avAccountName);
    // console.log("avPassword: ",avPassword);

    // if(pass === confPass && avAccountName) {
    //   //this.setState({isValidForm: true});
    //   return true;
    // } else {
    //   //this.setState({isValidForm: false, isDisabledSubmit: true});
    //   return false;
    // }


  }

  render() {
    const buttonClass =
      this.props.isProcessing
        ? 'CommentForm__button_disabled'
        : 'CommentForm__button_primary';

    // let disabled = !(this.props.availableAccountName &&
    //                   this.state.password===this.state.confPassword &&
    //                     this.state.password.length>7);

    const pass = this.state.password;
    const confPass = this.state.confPassword;

    let diss = !(pass===confPass
                  && !this.state.isDisabledSubmit
                    && this.props.availablePassword
                      && this.props.availableAccountName
                        && this.props.regStatus === '');
    console.log("Reg button is disabled[" + diss + "]");
    let disabled = diss;

    // console.log("RENDER-----------------------------------------------");
    // console.log("disabled button: ",disabled);
    // console.log("pass===confPass: ",pass===confPass);
    // console.log("this.props.availableAccountName: ",this.props.availableAccountName);
    // console.log("this.props.availablePassword: ",this.props.availablePassword);
    // console.log("END RENDER------------------------------------------------------");
    let isFailed = this.props.regStatus === 'error' ? <div style={{color: 'red'}}>Registration failed!</div> : '';
    let isSuccess = this.props.regStatus === 'success' ? <div style={{color: '#52c41a'}}>You have successfully registered!</div> : '';
    return (

      <div className="shifted">
        <div className="settings-layout container">
          <div className="center">
            <h1>
              Register new account
            </h1>

            <div className="Settings">
              {isFailed}
              {!this.props.regStatus || this.props.regStatus === 'error'?
              <div className="Settings__section">
                <div className="Invite__input-container">
                  <Form.Item
                    label={
                        <span className="Editor__label">
                          Account name - to register use any bitshares web account based username up to 16 symbols.
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
                        <div style={{color:"red"}}>Account name is already taken, or it is unavailable.
                        </div>
                        <div>
                          To register simply log in with your Bitshares account.<br />
                          If you don't have a Bitshares account or would like to start a new one click <a href="https://exchange.easydex.net/create-account/password" target="_blank" style={{fontWeight: 700}}>here</a>.
                        </div>
                      </div>: null}
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="Editor__label">
                      Password - your bitshares wallet password
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
                    {!this.props.availablePassword && pass.length > 0 ?
                      <div style={{color:"red"}}>Incorrect password.
                      </div> : null}
                  </Form.Item>

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
                  disabled={disabled}
                  className={`CommentForm__button ${buttonClass}`}
                >
                  Register
                </button>
              </div>
                : isSuccess}
              {/*<Action primary big loading={loading} onClick={this.handleSave}>*/}
              {/*<FormattedMessage id="save" defaultMessage="Save" />*/}
              {/*</Action>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


