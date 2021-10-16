// import React from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import Avatar from '../Avatar';
// import FollowButton from '../../widgets/FollowButton';
// import './User.less';
//
// const User = ({ user }) => (
//   <div key={user.name} className="User">
//     <div className="User__top">
//       <div className="User__links">
//         <Link to={`/@${user.name}`}>
//           <Avatar username={user.name} size={34} />
//         </Link>
//         <Link to={`/@${user.name}`} title={user.name} className="User__name">
//           <span className="username">{user.name}</span>
//         </Link>
//       </div>
//       <div className="User__follow">
//         <FollowButton username={user.name} secondary />
//       </div>
//     </div>
//     <div className="User__divider" />
//   </div>
// );
//
// User.propTypes = {
//   user: PropTypes.shape().isRequired,
// };
//
// export default User;


import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import FollowButton from '../../widgets/FollowButton';
import './User.less';
import { getAccount } from '../../helpers/apiHelpers';
// const User = ({ user }) => (
//   <div key={user.name} className="User">
//     <div className="User__top">
//       <div className="User__links">
//         <Link to={`/@${user.name}`}>
//           <Avatar username={user.name} size={34} />
//         </Link>
//         <Link to={`/@${user.name}`} title={user.name} className="User__name">
//           <span className="username">{user.name}</span>
//         </Link>
//       </div>
//       <div className="User__follow">
//         <FollowButton username={user.name} secondary />
//       </div>
//     </div>
//     <div className="User__divider" />
//   </div>
// );
//
// User.propTypes = {
//   user: PropTypes.shape().isRequired,
// };
//
// export default User;

export default class User extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    authenticated: PropTypes.bool
  };


  constructor(props) {
    super(props);

    this.state = {
      profileImage: ''
    }
  }

  componentWillMount(){
    // console.log("Card this.props: ", this.props);
    // console.log("Card username: ", this.props.username);
    const username = this.props.user.name;
    getAccount(username).then((resp)=>{
      let user = resp;
      let profileImage =
        user.json_metadata
        && user.json_metadata.profile
        && user.json_metadata.profile.profile_image ? user.json_metadata.profile.profile_image : '';
      this.setState({profileImage})
    });
  }

  render() {
    const user = this.props.user;
    return (
        <div key={user.name} className="User">
          <div className="User__top">
            <div className="User__links">
              <Link to={`/@${user.name}`}>
                <Avatar username={user.name} size={34} profileImage={this.state.profileImage} />
              </Link>
              <Link to={`/@${user.name}`} title={user.name} className="User__name">
                <span className="username">{user.name}</span>
              </Link>
            </div>
            {this.props.authenticated ?
            <div className="User__follow">
              <FollowButton username={user.name} secondary />
            </div> : null
          }
          </div>
          <div className="User__divider" />
        </div>
    );
  }
}

