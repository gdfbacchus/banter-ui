// import React from "react";
// import ZfApi from "react-foundation-apps/src/utils/foundation-api";
// import PasswordInput from "../Forms/PasswordInput";
// import notify from "actions/NotificationActions";
// import AltContainer from "alt-container";
// import WalletDb from "stores/WalletDb";
// import WalletUnlockStore from "stores/WalletUnlockStore";
// import WalletManagerStore from "stores/WalletManagerStore";
// import BackupStore from "stores/BackupStore";
// import AccountStore from "stores/AccountStore";
// import WalletUnlockActions from "actions/WalletUnlockActions";
// import WalletActions from "actions/WalletActions";
// import BackupActions, {restore, backup} from "actions/BackupActions";
// import AccountActions from "actions/AccountActions";
// import {Apis} from "bitsharesjs-ws";
// import utils from "common/utils";
// import AccountSelector from "../Account/AccountSelector";
// import {PrivateKey} from "bitsharesjs";
// import {saveAs} from "file-saver";
// import LoginTypeSelector from "./LoginTypeSelector";
// import counterpart from "counterpart";
// import {
//   WalletSelector,
//   CreateLocalWalletLink,
//   WalletDisplay,
//   CustomPasswordInput,
//   LoginButtons,
//   BackupWarning,
//   BackupFileSelector,
//   DisableChromeAutocomplete,
//   CustomError,
//   KeyFileLabel
// } from "./WalletUnlockModalLib";
// import {backupName} from "common/backupUtils";
// import {withRouter} from "react-router-dom";
//
// import willTransitionTo from "./routerTransition";
//
// class WalletUnlockModal extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = this.initialState(props);
//   }
//
//   initialState = (props = this.props) => {
//     const {passwordAccount, currentWallet} = props;
//     return {
//       passwordError: null,
//       accountName: passwordAccount,
//       walletSelected: !!currentWallet,
//       customError: null,
//       isOpen: false,
//       restoringBackup: false,
//       stopAskingForBackup: false
//     };
//   };
//
//   componentWillReceiveProps(np) {
//     const {walletSelected, restoringBackup, accountName} = this.state;
//     const {
//       currentWallet: newCurrentWallet,
//       passwordAccount: newPasswordAccount
//     } = np;
//
//     const newState = {};
//     if (newPasswordAccount && !accountName)
//       newState.accountName = newPasswordAccount;
//     if (walletSelected && !restoringBackup && !newCurrentWallet)
//       newState.walletSelected = false;
//     if (this.props.passwordLogin != np.passwordLogin) {
//       newState.passwordError = false;
//       newState.customError = null;
//     }
//
//     this.setState(newState);
//   }
//
//   shouldComponentUpdate(np, ns) {
//     if (this.state.isOpen && !ns.isOpen) return false;
//     return (
//       !utils.are_equal_shallow(np, this.props) ||
//       !utils.are_equal_shallow(ns, this.state)
//     );
//   }
//
//   componentWillMount(){
//     import willTransitionTo from "./routerTransition";
//   }
//
//   componentDidMount() {
//     const {passwordLogin} = this.props;
//
//     if (passwordLogin) {
//       const {password_input, account_input} = this.refs;
//       const {accountName} = this.state;
//
//       if (accountName && password_input) {
//         password_input.focus();
//       } else if (
//         account_input &&
//         typeof account_input.focus === "function"
//       ) {
//         account_input.focus();
//       }
//     }
//   }
//
//   componentDidUpdate() {
//     const {resolve, modalId, isLocked} = this.props;
//
//     if (resolve)
//       if (isLocked) {
//         ZfApi.publish(modalId, "open");
//       } else {
//         resolve();
//       }
//     else ZfApi.publish(this.props.modalId, "close");
//   }
//
//   validate = (password, account) => {
//     const {passwordLogin, resolve} = this.props;
//     const {stopAskingForBackup} = this.state;
//
//     const {cloudMode} = WalletDb.validatePassword(
//       password || "",
//       true, //unlock
//       account
//     );
//
//     if (WalletDb.isLocked()) {
//       this.setState({passwordError: true});
//     } else {
//       const password_input = this.passwordInput();
//       if (!passwordLogin) {
//         password_input.clear();
//       } else {
//         password_input.value = "";
//         if (cloudMode) AccountActions.setPasswordAccount(account);
//       }
//       WalletUnlockActions.change();
//       if (stopAskingForBackup) WalletActions.setBackupDate();
//       else if (this.shouldUseBackupLogin()) this.backup();
//       resolve();
//       WalletUnlockActions.cancel();
//     }
//   };
//
//   passwordInput = () =>
//   this.refs.password_input ||
//   this.refs.custom_password_input.refs.password_input;
//
//   restoreBackup = (password, callback) => {
//     const {backup} = this.props;
//     const privateKey = PrivateKey.fromSeed(password || "");
//     const walletName = backup.name.split(".")[0];
//     restore(privateKey.toWif(), backup.contents, walletName)
//       .then(() => {
//         return WalletActions.setWallet(walletName)
//           .then(() => {
//             BackupActions.reset();
//             callback();
//           })
//           .catch(e => this.setState({customError: e.message}));
//       })
//       .catch(e => {
//         const message = typeof e === "string" ? e : e.message;
//         const invalidBackupPassword =
//           message === "invalid_decryption_key";
//         this.setState({
//           customError: invalidBackupPassword ? null : message,
//           passwordError: invalidBackupPassword
//         });
//       });
//   };
//
//   handleLogin = e => {
//     if (e) e.preventDefault();
//
//     const {passwordLogin, backup} = this.props;
//     const {walletSelected, accountName} = this.state;
//
//     if (!passwordLogin && !walletSelected) {
//       this.setState({
//         customError: counterpart.translate(
//           "wallet.ask_to_select_wallet"
//         )
//       });
//     } else {
//       this.setState({passwordError: null}, () => {
//         const password_input = this.passwordInput();
//         const password = passwordLogin
//           ? password_input.value
//           : password_input.value();
//         if (!passwordLogin && backup.name) {
//           this.restoreBackup(password, () => this.validate(password));
//         } else {
//           const account = passwordLogin ? accountName : null;
//           this.validate(password, account);
//         }
//       });
//     }
//   };
//
//   closeRedirect = path => {
//     WalletUnlockActions.cancel();
//     this.props.history.push(path);
//   };
//
//   backup = () =>
//     backup(this.props.dbWallet.password_pubkey).then(contents => {
//       const {currentWallet} = this.props;
//       const name = backupName(currentWallet);
//       BackupActions.incommingBuffer({name, contents});
//
//       const {backup} = this.props;
//       let blob = new Blob([backup.contents], {
//         type: "application/octet-stream; charset=us-ascii"
//       });
//       if (blob.size !== backup.size)
//         throw new Error("Invalid backup to download conversion");
//       saveAs(blob, name);
//       WalletActions.setBackupDate();
//       BackupActions.reset();
//     });
//
//   handleAskForBackupChange = e =>
//     this.setState({stopAskingForBackup: e.target.checked});
//
//   handleAccountNameChange = accountName =>
//     this.setState({accountName, error: null});
//
//   shouldShowBackupWarning = () =>
//   !this.props.passwordLogin &&
//   this.state.walletSelected &&
//   !this.state.restoringBackup &&
//   !(!!this.props.dbWallet && !!this.props.dbWallet.backup_date);
//
//   shouldUseBackupLogin = () =>
//   this.shouldShowBackupWarning() && !this.state.stopAskingForBackup;
//
//   render() {
//     const {
//       passwordError,
//       customError,
//       accountName,
//       stopAskingForBackup
//     } = this.state;
//
//     const errorMessage = passwordError
//       ? counterpart.translate("wallet.pass_incorrect")
//       : customError;
//
//     return (
//         <div>
//           <form onSubmit={this.handleLogin} className="full-width">
//             <LoginTypeSelector />
//
//             <div>
//               <DisableChromeAutocomplete />
//               <AccountSelector
//                 label="account.name"
//                 ref="account_input"
//                 accountName={accountName}
//                 account={accountName}
//                 onChange={this.handleAccountNameChange}
//                 onAccountChanged={() => {}}
//                 size={60}
//                 hideImage
//                 placeholder=" "
//                 useHR
//                 labelClass="login-label"
//                 reserveErrorSpace
//               />
//               <CustomPasswordInput
//                 password_error={passwordError}
//                 ref="custom_password_input"
//               />
//             </div>
//
//             <CustomError message={errorMessage} />
//             {this.shouldShowBackupWarning() && (
//               <BackupWarning
//                 onChange={this.handleAskForBackupChange}
//                 checked={stopAskingForBackup}
//               />
//             )}
//             <LoginButtons
//               onLogin={this.handleLogin}
//               backupLogin={this.shouldUseBackupLogin()}
//             />
//           </form>
//         </div>
//     );
//   }
// }
//
// WalletUnlockModal.defaultProps = {
//   modalId: "unlock_wallet_modal2"
// };
//
// WalletUnlockModal = withRouter(WalletUnlockModal);
//
// class WalletUnlockModalContainer extends React.Component {
//   render() {
//     return (
//       <AltContainer
//         stores={[
//           WalletUnlockStore,
//           AccountStore,
//           WalletManagerStore,
//           WalletDb,
//           BackupStore
//         ]}
//         inject={{
//           currentWallet: () =>
//             WalletManagerStore.getState().current_wallet,
//           walletNames: () =>
//             WalletManagerStore.getState().wallet_names,
//           dbWallet: () => WalletDb.getWallet(),
//           isLocked: () => WalletDb.isLocked(),
//           backup: () => BackupStore.getState(),
//           resolve: () => WalletUnlockStore.getState().resolve,
//           reject: () => WalletUnlockStore.getState().reject,
//           locked: () => WalletUnlockStore.getState().locked,
//           passwordLogin: () =>
//             WalletUnlockStore.getState().passwordLogin,
//           passwordAccount: () =>
//           AccountStore.getState().passwordAccount || ""
//         }}
//       >
//         <WalletUnlockModal {...this.props} />
//       </AltContainer>
//     );
//   }
// }
// export default WalletUnlockModalContainer;
//
