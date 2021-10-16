import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import Avatar from './Avatar';

export default class AvatarLightbox extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    profileImage: PropTypes.string,
    size: PropTypes.number,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    username: undefined,
    profileImage: undefined,
    size: 100,
    isActive: false,
  };

  state = {
    open: false,
  };

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false });

  render() {
    const { username, size, isActive, profileImage } = this.props;

    return (
      <div>
        <a role="presentation" onClick={this.handleAvatarClick}>
          <Avatar username={username} size={size} profileImage={profileImage} />
          {isActive && <div className="UserHeader__container--active" />}
        </a>
        {this.state.open && (
          <Lightbox
            //{/*mainSrc={`https://steemitimages.com/u/${username}/avatar/large`}*/}
            mainSrc={`https://steemitimages.com/600x800/${this.props.profileImage}`}
            onCloseRequest={this.handleCloseRequest}
          />
        )}
      </div>
    );
  }
}
