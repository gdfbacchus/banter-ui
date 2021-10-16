import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.less';

export function getAvatarURL(username, size = 100) {
  return size > 64
    ? `https://steemitimages.com/u/${username}/avatar`
    : `https://steemitimages.com/u/${username}/avatar/small`;
}

const Avatar = ({ username, size, profileImage }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  // const url = getAvatarURL(username, size);
  const url = profileImage ? profileImage : undefined;

  //console.log("AVATAR profileImage: ",profileImage);
  if (username && profileImage) {
    style = {
      ...style,
      backgroundImage: `url("https://steemitimages.com/100x100/${url}")`,
    };
  }

  return <div className="Avatar" style={style} />
};

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  size: 100,
};

export default Avatar;
