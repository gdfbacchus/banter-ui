import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import SteemConnect from '../steemConnectAPI';
const dsteem = require('dsteem');
import dsteemAPIClient from '../dsteemAPI';
// import WalletDb from "../account/loginBts/stores/WalletDb";
import { getAuthenticatedUser } from '../reducers';
import { getUserAccountHistory } from './walletActions';
import { reload } from '../auth/authActions';
import Action from '../components/Button/Action';
import './ClaimRewardsBlock.less';
import '../components/Sidebar/SidebarContentBlock.less';

@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
  }),
  {
    getUserAccountHistory,
    reload,
  },
)
class ClaimRewardsBlock extends Component {
  static propTypes = {
    user: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
  };

  state = {
    loading: false,
    rewardClaimed: false,
  };

  handleClaimRewards = () => {
    // const { user } = this.props;
    // // console.log("CR->USER: ",user);
    // const {
    //   name,
    //   reward_steem_balance: steemBalance,
    //   reward_sbd_balance: sbdBalance,
    //   reward_vesting_balance: vestingBalance,
    // } = user;
    // this.setState({
    //   loading: true,
    // });
    // // SteemConnect.claimRewardBalance(name, steemBalance, sbdBalance, vestingBalance, err => {
    // //   if (!err) {
    // //     this.setState({
    // //       loading: false,
    // //       rewardClaimed: true,
    // //     });
    // //     this.props.getUserAccountHistory(name).then(() => this.props.reload());
    // //   } else {
    // //     this.setState({
    // //       loading: false,
    // //     });
    // //   }
    // // });
    //
    // const posting_pubk = this.props.user.posting.key_auths[0][0];
    // //console.log("PUBLIC POSTING KEY: ",posting_pubk)
    // const private_posting_key = WalletDb.getPrivateKey(posting_pubk);
    // const wifP = private_posting_key.toWif();
    // //console.log("PRIVATE POSTING KEY wifP : ", wifP);
    //
    // const privKey = dsteem.PrivateKey.from(wifP);//That's Working
    //
    // const op = [
    //   'claim_reward_balance',
    //   {
    //     account: name,
    //     reward_steem: steemBalance,
    //     reward_sbd: sbdBalance,
    //     reward_vests: vestingBalance,
    //   },
    // ];
    // //console.log("CLAIM REWARDS wifP: ",wifP);
    // //console.log("CLAIM REWARDS rivateKey.from: ",privKey);
    // console.log("CLAIM REWARDS Operations before send: ",op);
    //
    // let _that = this;
    // dsteemAPIClient.broadcast.sendOperations([op], privKey).then(
    //   function(result) {
    //     _that.setState({
    //       loading: false,
    //       rewardClaimed: true,
    //     });
    //     _that.props.getUserAccountHistory(name).then(() => _that.props.reload());
    //   },
    //   function(error) {
    //     console.error(error);
    //
    //     _that.setState({
    //       loading: false,
    //     });
    //   }
    // );


  };

  renderReward = (value, currency, rewardField) => (
    <div className="ClaimRewardsBlock__reward">
      <span className="ClaimRewardsBlock__reward__field">
        <FormattedMessage
          id={rewardField}
          defaultMessage={_.startCase(rewardField.replace('_', ''))}
        />
      </span>
      <span className="ClaimRewardsBlock__reward__value">
        <FormattedNumber value={value} minimumFractionDigits={3} maximumFractionDigits={3} />
        {` ${currency}`}
      </span>
    </div>
  );

  render() {
    const { user, intl } = this.props;
    const { rewardClaimed } = this.state;
    const rewardSteem = parseFloat(user.reward_steem_balance);
    //const rewardSteem = 7000000.0;
    const rewardSbd = parseFloat(user.reward_sbd_balance);
    const rewardSP = parseFloat(user.reward_vesting_steem);
    const userHasRewards = rewardSteem > 0 || rewardSbd > 0 || rewardSP > 0;

    const buttonText = rewardClaimed
      ? intl.formatMessage({
          id: 'reward_claimed',
          defaultMessage: 'Reward Claimed',
        })
      : intl.formatMessage({
          id: 'claim_rewards',
          defaultMessage: 'Claim Rewards',
        });

    console.log("CLAIM REWARDS 1 !userHasRewards->: ",!userHasRewards);
    console.log("CLAIM REWARDS 2 rewardClaimed->: ",rewardClaimed);
    if (!userHasRewards || rewardClaimed) return null;

    return (
      <div className="SidebarContentBlock ClaimRewardsBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-ranking SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="rewards" defaultMessage="Rewards" />
        </h4>
        <div className="SidebarContentBlock__content">
          {!rewardClaimed && (
            <div>
              {rewardSteem > 0 && this.renderReward(rewardSteem, 'STEEM', 'steem')}
              {rewardSbd > 0 && this.renderReward(rewardSbd, 'SBD', 'steem_dollar')}
              {rewardSP > 0 && this.renderReward(rewardSP, 'SP', 'steem_power')}
            </div>
          )}
          <Action
            primary
            big
            disabled={rewardClaimed}
            loading={this.state.loading}
            style={{ width: '100%' }}
            onClick={this.handleClaimRewards}
          >
            {buttonText}
          </Action>
        </div>
      </div>
    );
  }
}

export default ClaimRewardsBlock;
