import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import Helmet from 'react-helmet';
// import {ChainStore, PrivateKey, key, Aes} from "bitsharesjs";
// import {Apis, ChainConfig} from "bitsharesjs-ws";
// import WalletDb from "./loginBts/stores/WalletDb";
import { getIsAuthFetching, getIsAuthenticated, getIsLoaded } from '../reducers';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Select, Radio, Checkbox, Input } from 'antd';
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
    //this.handleUpvoteSettingChange = this.handleUpvoteSettingChange.bind(this);
    this.state = {
      dynamicGlobal: null,
      isDisabledSubmit: false,
      accountName: null,
      password: null
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  componentWillMount() {
    // let isLocked = WalletDb.isLocked();
    //console.log("isLocked: ",isLocked)
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
    // let dynamicGlobal = ChainStore.getObject("2.1.0");
    // if(dynamicGlobal) {
    //   // this.setState({dynamicGlobal: dynamicGlobal}, () => {
    //   //   console.log("dynamicGlobal: ", dynamicGlobal)
    //   // });
    //   console.log("dynamicGlobal: ", dynamicGlobal)
    // }

  }

  _initBtsCallBack(status) {

  }
  componentDidMount() {
    // setTimeout(()=>{
    //   let asset1 = ChainStore.getAccount("1.2.784756");
    //   console.log("ComponentDidMount Account : ",asset1);
    //
    // },3000);

    /*
    setTimeout(()=> {
      if (!Apis.instance().db_api()) {
        console.log("ChainStore IS NOT INIT")

        // ChainStore.init(false).then(()=>{
        //   console.log("ChainStore ALREADY INIT")
        // })

        let counter = 1;
        let id = setInterval(() => {
          if (counter === 10) {
            clearInterval(id);
          }

          console.log("counter I: ", counter);
          let acc = ChainStore.getAccount("1.2.784756");
          // if(acc){
          if (Apis.instance().db_api() && acc) {
            console.log("Account I: ", acc);
            console.log("---------------------------------");
            clearInterval(id)
          }
          console.log("=================================");
          counter++;
        }, 400);


      } else {
        console.log("ChainStore IS INITIALIZED")
        let acc3 = ChainStore.getAccount("1.2.784756");
        console.log("Account 3: ", acc3);

        let counter2 = 1;
        let id = setInterval(() => {
          if (counter2 === 10) {
            clearInterval(id);
          }
          console.log("counter II: ", counter2);
          let acc2 = ChainStore.getAccount("1.2.784756");
          if (acc2) {
            console.log("Account 2: ", acc2);
            console.log("---------------------------------");
            clearInterval(id)
          }
          console.log("=================================");
          counter2++;
        }, 200);

      }
    },100);
    */

    //this.props.reload();
  }

  onUpdate(event) {
    //console.log("target value: ",event.target.value);
    //console.log("target input name: ",event.target.name);
    //console.log("target input type: ",event.target.type);
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(e) {
    e.stopPropagation();

    // var Buffer = require("safe-buffer").Buffer;

    // let keys = WalletDb.generateKeyFromPassword(this.state.accountName, 'posting', this.state.password);
    // console.log("KEYS 1: ",keys);
    // let pk = keys.privKey;
    // let pubk = keys.pubKey;
    // console.log("KEYS 2 pk: ",pk);
    // console.log("KEYS 2 pubk: ",pubk);


    // let buf = pk.d.toBuffer(32);
    // let isBuf = Buffer.isBuffer(buf);
    // console.log("KEYS 3 isBuf: ",isBuf);
    // let from_buffer = PrivateKey.fromBuffer(buf);
    // console.log("KEYS 3 from_buffer: ",from_buffer);
    // console.log("KEYS 3 from_buffer str: ",from_buffer.toString());

    // var private_key = WalletDb.getPrivateKey(pubk);
    // let wif= private_key.toWif();
    // console.log("KEYS 4 wif : ",wif);


    //return;


    this.setState({ isDisabledSubmit: true });

    // console.log("S accountName: ", this.state.accountName);
    // console.log("S password: ", this.state.password);
    this.props.startLogin();
    this.props.login(this.state.accountName, this.state.password);
  }

  render() {

    const buttonClass = this.state.isDisabledSubmit ? 'CommentForm__button_disabled' : 'CommentForm__button_primary';

    // console.log("IS LOADED: ",this.props.isLoaded);
    // console.log("IS AuthFetching: ",this.props.isAuthFetching);
    let disabled = this.state.isDisabledSubmit && this.props.isAuthFetching;

    let isAuthenticated = this.props.authenticated;
    //{this.context.router.push('/some-path')}
    if(isAuthenticated){
      return <Redirect to="/"/>

    } else if (!isAuthenticated) {
      return (

        <div className="shifted">
          <div className="settings-layout container">
            <div className="center">
              <h1 className={"banter-light"}>
                login
              </h1>

              <div className="Settings">
                <div className="Settings__section">
                  <div className="Invite__input-container">
                    <Form.Item
                      label={
                        <span className="Editor__label banter-light">
                        account name
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
                        password
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
                    login
                  </button>
                </div>
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
}
