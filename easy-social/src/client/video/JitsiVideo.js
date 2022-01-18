import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getIsReloading } from '../reducers';
import { JITSI_SETTINGS } from '../../common/constants/jitsiSettings';
// import axios from 'axios';

// @requiresLogin
@injectIntl
@connect(
  state => ({
    // feed: getFeed(state),
    // posts: getPosts(state),
    // pendingBookmarks: getPendingBookmarks(state),
    reloading: getIsReloading(state),
  }),
  {  },
)
export default class JitsiVideo extends React.Component {
  static propTypes = {
    // intl: PropTypes.shape().isRequired,
    // feed: PropTypes.shape().isRequired,
    // showPostModal: PropTypes.func.isRequired,
    // reloading: PropTypes.bool,
    // pendingBookmarks: PropTypes.arrayOf(PropTypes.number),
    // getBookmarks: PropTypes.func,
    // reload: PropTypes.func,
  };

  static defaultProps = {

  };

  componentDidMount() {
    // const { accessToken } = this.props;
    // if (accessToken) {
      this.startConference();
    // }
  }

  prepareJitsiApiOptions = ( who) => {
    const interfaceConfig = JITSI_SETTINGS.INTERFACE_CONFIG[who];
    const config = JITSI_SETTINGS.CONFIG[who];

    const options = {
      parentNode: document.querySelector('#meet'),
      // jwt : accessToken,
      // roomName: parsedData.sub + "/" + parsedData.room,
      roomName: 'test room name',
      // userInfo: {
      //   email: parsedData.context.user.email || '',
      //   displayName: parsedData.context.user.name || '',
      // },
      noSSL: false,
      configOverwrite: {
        // brandingRoomAlias: parsedData.room,
        ...config,
      },

      interfaceConfigOverwrite : { ...interfaceConfig }
    };
    return options;
  };

  initializeJitsiApi = () => {

    const domain = JITSI_SETTINGS.DOMAIN;
    const options = this.prepareJitsiApiOptions('MODERATOR');
    console.log('[JIT] Jitsi configuration: ', options)
    console.log('[JIT] Jitsi domain: ', domain)
    const api = new window.JitsiMeetExternalAPI(domain, options);

    // Listen for 'CONNECTION FAILED'
    // api.addListener('log', (data) => {
    //   const hasConnError = data.args.some(el => el === 'CONNECTION FAILED:') && data.args.some(el => el === 'connection.passwordRequired');
    //   if (data.args && data.args.length && hasConnError) {
    //     console.log('[JIT] CONNECTION FAILED: ', data);
    //     this.props.cleanUp();
    //     api.dispose();
    //     this.callFailed(data.args);
    //   }
    // });
    //
    // api.addEventListener('readyToClose', (e) => {
    //   console.log('[JIT] readyToClose: ', e);
    //   this.onCallHangUp();
    //   api.dispose();
    //   const feedback = this.feedbackOk ? 'ok' : 'no';
    //   this.props.history.push(`/end-call/${feedback}`);
    // });
    //
    // api.addEventListener('videoConferenceLeft', (e) => {
    //   const numberOfParticipants = api.getNumberOfParticipants();
    //
    //   this.setState({
    //     showWaitingRoomScreen: false,
    //     videoConferenceJoined: false,
    //     callStarted: false,
    //     startTimer: false,
    //     displaySwitchScreenIcon: false,
    //     showScreenshot: false,
    //   }, () => callEnded());
    //
    // });
    //
    // api.addEventListener('participantLeft', (e) => {
    //   const numberOfParticipants = api.getNumberOfParticipants();
    //   // console.log('[JIT] participantLeft: ', e);
    //
    //   if (numberOfParticipants < 2) {
    //     this.setState({showWaitingRoomScreen: true, displaySwitchScreenIcon: true});
    //   } else if (numberOfParticipants > 1) {
    //     this.setState({displaySwitchScreenIcon: false});
    //   }
    //
    // });
    //
    api.addEventListener('videoConferenceJoined', (e) => {
      const numberOfParticipants = api.getNumberOfParticipants();

      console.log('[JIT] videoConferenceJoined numberOfParticipants: ', numberOfParticipants);
      console.log('[JIT] videoConferenceJoined e: ', e);

      if (e.displayName) {
        api.executeCommand('displayName', e.displayName);
      }

    });
    //
    // api.addEventListener('participantJoined', (e) => {
    //   const { callStarted } = this.state;
    //   if (callStarted) {
    //     this.props.checkSessionIsDuplicated();
    //   }
    //
    //   const numberOfParticipants = api.getNumberOfParticipants();
    //   const { startTimer } = this.state;
    //
    //   let startT = false;
    //   let displaySwitchScreenIcon = false;
    //
    //   if (numberOfParticipants > 1) {
    //     if (!startTimer && who === WHO.PROVIDER) {
    //       startT = true;
    //       this.setState({ startTimer: startT });
    //     }
    //     this.setState({showWaitingRoomScreen: false });
    //   } else if (numberOfParticipants === 1) {
    //     displaySwitchScreenIcon = true;
    //   }
    //   this.setState({displaySwitchScreenIcon});
    // });
    //
    // api.addEventListener('feedbackSubmitted', (e) => {
    //   this.feedbackOk = true;
    // });
    //
    // api.addEventListener('filmstripDisplayChanged', (e) => {
    //   console.log('[JIT] filmstripDisplayChanged visible: ', e);
    //
    //   if (e.visible !== undefined && e.visible === false && this.filmStripVisible === true && !this.screenSharingOn) {
    //     this.jitsiIframeApi.executeCommand('toggleFilmStrip');
    //   } else if (e.visible !== undefined && e.visible === true && this.filmStripVisible === false && this.screenSharingOn) {
    //     this.jitsiIframeApi.executeCommand('toggleFilmStrip');
    //   }
    //   this.filmStripVisible = e.visible;
    // });
    //
    // api.addEventListener('contentSharingParticipantsChanged', (e) => {
    //   console.log('[JIT] contentSharingParticipantsChanged visible: ', e);
    //   const newSharingStatus = !!e.data.length;
    //   if (
    //     newSharingStatus
    //     && this.screenSharingOn === false
    //     && this.filmStripVisible === true
    //   ) {
    //     // Hide filmstrip
    //     this.jitsiIframeApi.executeCommand('toggleFilmStrip');
    //
    //   } else if (
    //     !newSharingStatus
    //     && this.screenSharingOn === true
    //     && this.filmStripVisible === false
    //   ) {
    //     // Show filmstrip
    //     this.jitsiIframeApi.executeCommand('toggleFilmStrip');
    //   }
    //
    //   this.screenSharingOn = newSharingStatus;
    // });
    //
    // api.addEventListener('participantKickedOut', (e) => {
    //   console.log('[JIT] participantKickedOut: ', e);
    //   const { who } = this.props;
    //   if(e.kicked.id === this.jitsiParticipantId && (who === WHO.PATIENT || who === WHO.GUEST)) {
    //     api.executeCommand('hangup');
    //   }
    // });
    //
    // api.addEventListener('participantRoleChanged', (event) => {
    //   console.log('[JIT] participantRoleChanged this.jitsiParticipantId: ', this.jitsiParticipantId);
    //   console.log('[JIT] participantRoleChanged event: ', event);
    //   if(event.role === 'moderator') {
    //     setAppRole(WHO.PROVIDER);
    //   }
    // });
    // api.addEventListener('displayNameChange', (e) => {
    //   console.log('[JIT] displayNameChange: ', e);
    //   console.log('[JIT] displayNameChange this.jitsiParticipantId: ', this.jitsiParticipantId);
    //   const { id, displayname } = e;
    //   if(displayname && id && e.id === this.jitsiParticipantId ) {
    //     this.props.updateJitsiDisplayName(displayname);
    //   }
    // });

    this.jitsiIframeApi = api;
    // this.props.setJitsiApiInstance(api);
  };

  startConference = (accessToken) => {
    try {

      let counter = 0;
      let interval = setInterval(() => {
        counter += 1;
        if (window.JitsiMeetExternalAPI) {
          this.initializeJitsiApi();
          clearInterval(interval);
        } else if (counter >= 10 && !window.JitsiMeetExternalAPI) {
          clearInterval(interval);
          console.error('[JIT] Jitsi API is not available');
        }
      } , 200);

    } catch (e) {
      console.error('JITSI error: ', e)
    }
  };

  render() {
    return (
      <div id="videoWrapper">
        <header>Jitsi Video</header>
        <div id="meet"></div>
      </div>
    );
  }
}
