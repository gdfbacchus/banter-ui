
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import './UserCard.less';
import { getAccount } from '../helpers/apiHelpers';

export default class UserCard extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    alt: PropTypes.node,
  };

  static defaultProps = {
    alt: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      profileImage: ''
    }
    this._isMounted_ = false;
  }

  componentDidMount(){
    //console.log("Card isAuthenticated: ", this.props.isAuthenticated);
    this._isMounted_ = true;
    // console.log("Card this.props: ", this.props);
    // console.log("Card username: ", this.props.username);
    const username = this.props.username;
    getAccount(username).then((resp)=>{
      if (!this._isMounted_){
        return;
      }
      let user = resp;
      let profileImage =
        user.json_metadata
        && user.json_metadata.profile
        && user.json_metadata.profile.profile_image ? user.json_metadata.profile.profile_image : '';
      this.setState({profileImage})
    });
  }
  componentWillUnmount() {
    this._isMounted_ = false;
  }

  render() {
    // let username = this.props.username;
    const { username, isAuthenticated } = this.props;
    return (
      <div className="UserCard">
        <div className="UserCard__left">
          <Link to={`/@${username}`}>
            <Avatar username={username} size={40} profileImage={this.state.profileImage}/>
          </Link>
          <Link to={`/@${username}`}>
            <span className="username">{username}</span>
          </Link>
          {this.props.alt && <span className="UserCard__alt">{this.props.alt}</span>}
        </div>
        { isAuthenticated ? <FollowButton username={username} secondary /> : null }

      </div>
    );
  }
}

