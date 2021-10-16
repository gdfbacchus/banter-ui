import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import Scroll from 'react-scroll';
import withEditor from '../Editor/withEditor';
import EditorInput from '../Editor/EditorInput';
import { remarkable } from '../Story/Body';
import BodyContainer from '../../containers/Story/BodyContainer';
import Avatar from '../Avatar';
import './CommentForm.less';

const Element = Scroll.Element;

@withEditor
class CommentForm extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    top: PropTypes.bool,
    isSmall: PropTypes.bool,
    isLoading: PropTypes.bool,
    submitted: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    top: false,
    isSmall: false,
    isLoading: false,
    submitted: false,
    inputValue: '',
    onImageUpload: () => {},
    onImageInvalid: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      bodyHTML: '',
      isDisabledSubmit: false,
    };
    this._isMounted_ = false;

    this.setInput = this.setInput.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.handleBodyUpdate = this.handleBodyUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this._isMounted_ = true;
    if (this.input && !this.props.top) {
      this.input.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!nextProps.isLoading && nextProps.inputValue !== '') || nextProps.submitted) {
      this.setBodyAndRender(nextProps.inputValue);
    }
  }

  componentWillUnmount() {
    this._isMounted_ = false;
    this.props.postCommentResetStatus();
  }

  setInput(input) {
    this.input = input;
  }

  setBodyAndRender(body) {
    if (!this._isMounted_){
      return;
    }
    this.setState(
      {
        body,
        bodyHTML: remarkable.render(body),
      },
      () => {
        if (this.input) {
          this.input.value = body;
        }
      },
    );
  }

  handleBodyUpdate(body) {
    this.setBodyAndRender(body);
  }

  handleSubmit(e) {
    if (!this._isMounted_){
      return;
    }
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });
    if (this.state.body) {
      this.props.onSubmit(this.props.parentPost, this.state.body).then(response => {
        if (!_.get(response, 'error', false)) {
          this.setBodyAndRender('');
        }
      });
    }
  }

  redirectAfterSuccess() {
    return <Redirect to={`/@${this.props.parentPost.author}/${this.props.parentPost.root_permlink}`}/>
  }

  render() {
    const { username, isSmall, isLoading } = this.props;
    const { body, bodyHTML } = this.state;

    const buttonClass = isLoading ? 'CommentForm__button_disabled' : 'CommentForm__button_primary';

    let status = this.props.getStausSendingPostOrComment;
    // console.log("CommentForm saving status: ", status);
    // console.log("CommentForm this.props.parentPost: ", this.props.parentPost);
    if(status==='success') {
      return this.redirectAfterSuccess()
      //return <Redirect to={`/@${user.name}/${this.props.parentPost.root_permlink}`}/>
    }

    return (
      <div className="CommentForm">
        <Avatar username={username} size={!isSmall ? 40 : 32} />
        <div className="CommentForm__text">
          <Element name="commentFormInputScrollerElement">
            <EditorInput
              rows={3}
              inputRef={this.setInput}
              value={body}
              onChange={this.handleBodyUpdate}
              onImageUpload={this.props.onImageUpload}
              onImageInvalid={this.props.onImageInvalid}
              inputId={`${this.props.parentPost.id}-comment-inputfile`}
            />
          </Element>
          <button
            onClick={this.handleSubmit}
            disabled={isLoading}
            className={`CommentForm__button ${buttonClass}`}
          >
            {isLoading && <Icon type="loading" />}
            {isLoading ? (
              <FormattedMessage id="comment_send_progress" defaultMessage="Commenting" />
            ) : (
              <FormattedMessage id="comment_send" defaultMessage="Comment" />
            )}
          </button>
          {bodyHTML && (
            <div className="CommentForm__preview">
              <span className="Editor__label">
                <FormattedMessage id="preview" defaultMessage="Preview" />
              </span>
              <BodyContainer body={bodyHTML} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CommentForm;
