import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { currentUserFollowersUser } from '../helpers/apiHelpers';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getUser,
  getIsUserFailed,
  getIsUserLoaded,
  getAuthenticatedUserName,
} from '../reducers';
import { openTransfer } from '../wallet/walletActions';
import { getAccount } from './usersActions';
import { getAvatarURL } from '../components/Avatar';
import Error404 from '../statics/Error404';
import UserHero from './UserHero';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import LinksRightNav from '../components/Sidebar/LinksRightNav';

@connect(
  (state, ownProps) => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    user: getUser(state, ownProps.match.params.name),
    loaded: getIsUserLoaded(state, ownProps.match.params.name),
    failed: getIsUserFailed(state, ownProps.match.params.name),
  }),
  {
    getAccount,
    openTransfer,
  },
)
export default class User extends React.Component {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    authenticatedUserName: PropTypes.string,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    loaded: PropTypes.bool,
    failed: PropTypes.bool,
    getAccount: PropTypes.func,
    openTransfer: PropTypes.func,
  };

  static defaultProps = {
    authenticatedUserName: '',
    loaded: false,
    failed: false,
    getAccount: () => {},
    openTransfer: () => {},
  };

  static fetchData({ store, match }) {
    return store.dispatch(getAccount(match.params.name));
  }

  state = {
    isFollowing: false,
  };

  componentDidMount() {
    const { user, authenticated, authenticatedUserName } = this.props;
    if (!user.id && !user.failed) {
      this.props.getAccount(this.props.match.params.name);
    }

    //console.log("USER OBJECT: ",user)
    if (authenticated) {
      currentUserFollowersUser(authenticatedUserName, this.props.match.params.name).then(resp => {
        const result = _.head(resp);
        const followingUsername = _.get(result, 'following', '');
        const isFollowing = this.props.authenticatedUserName === followingUsername;
        this.setState({
          isFollowing,
        });
      }).catch((err)=>{
        console.log("currentUserFollowersUser RESPONSE: ",err);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("NEXT PROPS: ",nextProps);
    // console.log("U this.props.match.params.name: ",this.props.match.params.name);
    // console.log("U nextProps.match.params.name: ",nextProps.match.params.name);
    // console.log("U this.props.authenticatedUserName: ",this.props.authenticatedUserName);
    // console.log("U nextProps.authenticatedUserName: ",nextProps.authenticatedUserName);


    const diffUsername = this.props.match.params.name !== nextProps.match.params.name;
    const diffAuthUsername = this.props.authenticatedUserName !== nextProps.authenticatedUserName;
    // console.log("U diffUsername: ",diffUsername);
    // console.log("U diffAuthUsername: ",diffAuthUsername);
    // console.log("---------------------------------------------------------");
    if (diffUsername || diffAuthUsername) {
      currentUserFollowersUser(nextProps.authenticatedUserName, nextProps.match.params.name).then(
        resp => {
          const result = _.head(resp);
          const followingUsername = _.get(result, 'following', '');
          const isFollowing = nextProps.authenticatedUserName === followingUsername;
          this.setState({
            isFollowing,
          });
        },
      );
    }
  }

  componentDidUpdate(prevProps) {
    // console.log("DID UPDATE prevProps: ",prevProps);
    // console.log("DID UPDATE prevProps.match.params: ",prevProps.match.params);
    // console.log("DID UPDATE this.props.match.params.name: ",this.props.match.params.name);
    // console.log("DID UPDATE this.props: ",this.props);
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.props.getAccount(this.props.match.params.name);
    }
  }

  handleTransferClick = () => {
    this.props.openTransfer(this.props.match.params.name);
  };

  render() {
    const { authenticated, authenticatedUser, loaded, failed } = this.props;
    const { isFollowing } = this.state;
    if (failed) return <Error404 />;

    const username = this.props.match.params.name;
    const { user } = this.props;

    //console.log("User userobj: ",user);
    //console.log("User metadata: ",user.json_metadata);
    // console.log("User metadata cover_image: ",user.json_metadata.cover_image);
    //console.log("User metadata2: ",JSON.parse(user.json_metadata));
    let profile;
    if (user.json_metadata && typeof user.json_metadata === 'string'){

      //console.log("TYPE IS STRING")
      let obj = JSON.parse(user.json_metadata);
      profile = obj.profile && Object.keys(obj.profile).length>0 ? obj.profile : {};

    } else if (user.json_metadata && typeof user.json_metadata === 'object'){

      profile = user.json_metadata.profile || {};
      //console.log("TYPE IS OBJECT")

    } else {
      profile = {}
    }


    const busyHost = 'https://banter.network';
    const desc = profile.about || `Posts by ${username}`;
    const image = getAvatarURL(username) || '/images/logo.png';
    const canonicalUrl = `${busyHost}/@${username}`;
    const url = `${busyHost}/@${username}`;
    const displayedUsername = profile.name || username || '';
    const hasCover = !!profile.cover_image;
    //console.log("User metadata cover_image 2: ",profile.cover_image);
    //console.log("hasCover: ",hasCover);
    const title = `${displayedUsername} - EasySocial`;

    const isSameUser = authenticated && authenticatedUser.name === username;

    const style = hasCover
      ? { backgroundImage: `url("https://steemitimages.com/2048x512/${profile.cover_image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }
      : {};
    return (
      <div className="main-panel" style={style}>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <meta property="description" content={desc} />

          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="EasySocial" />

          {/*<meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />*/}
          {/*<meta property="twitter:title" content={title} />*/}
          {/*<meta property="twitter:description" content={desc} />*/}
          {/*<meta*/}
            {/*property="twitter:image"*/}
            {/*content={image}*/}
          {/*/>*/}
        </Helmet>
        <ScrollToTopOnMount />
        {user && (
          <UserHero
            authenticated={authenticated}
            user={user}
            username={displayedUsername}
            isSameUser={isSameUser}
            coverImage={profile.cover_image}
            profileImage={profile.profile_image}
            isFollowing={isFollowing}
            hasCover={hasCover}
            onFollowClick={this.handleFollowClick}
            onTransferClick={this.handleTransferClick}
          />
        )}
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer leftContainer__user" stickPosition={72} >
              <div className="left">
                <LeftSidebar />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={72}>

              <div className="right">
                <LinksRightNav />
                {loaded && <RightSidebar key={user.name} />}</div>
            </Affix>
            {loaded && <div className="center">{renderRoutes(this.props.route.routes)}</div>}
          </div>
        </div>
      </div>
    );
  }
}
