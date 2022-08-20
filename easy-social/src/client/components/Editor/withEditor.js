import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import { injectIntl } from 'react-intl';
import { getAuthenticatedUser } from '../../reducers';
import { MAXIMUM_UPLOAD_SIZE_HUMAN } from '../../helpers/image';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withEditor(WrappedComponent) {
  @connect(state => ({
    user: getAuthenticatedUser(state),
  }))
  @injectIntl
  class EditorBase extends React.Component {
    static displayName = `withEditor(${getDisplayName(WrappedComponent)})`;

    static propTypes = {
      intl: PropTypes.shape().isRequired,
      user: PropTypes.shape().isRequired,
    };

    handleImageUpload = (blob, callback, errorCallback, username='') => {
      //CURRENTLY DISABLED
      /*
      console.log('call handleImageUpload, THIS METHOD IS DISABLED');
      errorCallback();
      message.error(
        "Couldn't upload image"
      );
      return;
      */

      const { intl: { formatMessage } } = this.props;
      message.info(
        formatMessage({ id: 'notify_uploading_image', defaultMessage: 'Uploading image' }),
      );
      const formData = new FormData();
      formData.append('file', blob);
      // if(username){
      //   formData.append('username',username);
      // }
      console.log("[BANTER] withEditor -> handleImageUpload -> formData: ",formData)
      console.log("[BANTER] withEditor -> handleImageUpload -> callback: ",callback)



      // fetch(`https://ipfs.busy.org/upload`, {
      //   method: 'POST',
      //   body: formData,
      // })
      // const uploadEndpoint = 'http://localhost:3000/es-api/v0/upload';
      const uploadEndpoint = 'https://banter.network/es-api/v0/upload';

      fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(res => {
          console.log("[BANTER] withEditor -> handleImageUpload ->  upload response: ", res);
          console.log("[BANTER] withEditor -> handleImageUpload ->  upload response url: ", res.url);
          // const serverName = 'http://localhost:3000/';
          // const serverName = process.env.STEEMJS_URL;
          // const addressStr = res.url.substr(res.url.indexOf('uploads'));
          // console.log("[BANTER] withEditor -> handleImageUpload -> response img link: ", `${serverName}${addressStr}`);
          // return;
          callback(res.url, blob.name);
        })
        .catch(err => {
          console.error('[BANTER] err', err);
          errorCallback();
          message.error(
            formatMessage({
              id: 'notify_uploading_iamge_error',
              defaultMessage: "Couldn't upload image",
            }),
          );
        });
    };

    handleImageInvalid = () => {
      const { formatMessage } = this.props.intl;
      message.error(
        formatMessage(
          {
            id: 'notify_uploading_image_invalid',
            defaultMessage:
              'This file is invalid. Only image files with maximum size of {size} are supported',
          },
          { size: MAXIMUM_UPLOAD_SIZE_HUMAN },
        ),
      );
    };

    render() {
      return (
        <WrappedComponent
          onImageUpload={this.handleImageUpload}
          onImageInvalid={this.handleImageInvalid}
          {...this.props}
        />
      );
    }
  }

  return EditorBase;
}
