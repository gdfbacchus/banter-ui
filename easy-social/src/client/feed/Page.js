import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { getFeedContent } from './feedActions';
import { getIsLoaded, getIsAuthenticated } from '../reducers';
import SubFeed from './SubFeed';
import HeroBannerContainer from './HeroBannerContainer';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import TopicSelector from '../components/TopicSelector';
import TrendingTagsMenu from '../components/TrendingTagsMenu';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import QuickPostEditor from '../components/QuickPostEditor/QuickPostEditor';
import LinksRightNav from '../components/Sidebar/LinksRightNav';
import {Redirect} from "react-router";
import Avatar from "../components/Avatar";
import {Link} from "react-router-dom";
import { Button } from 'antd';

@connect(state => ({
  authenticated: getIsAuthenticated(state),
  loaded: getIsLoaded(state),
}))
class Page extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
  };

  static fetchData({ store, match }) {
    const { sortBy, category } = match.params;
    return store.dispatch(getFeedContent({ sortBy, category, limit: 10 }));
  }

  handleSortChange = key => {
    const { category } = this.props.match.params;
    if (category) {
      this.props.history.push(`/${key}/${category}`);
    } else {
      this.props.history.push(`/${key}`);
    }
  };

  handleTopicClose = () => this.props.history.push('/trending');

  render() {
    const { authenticated, loaded, location, match } = this.props;
    const { category, sortBy } = match.params;

    const shouldDisplaySelector = location.pathname !== '/' || (!authenticated && loaded);
    const displayTopicSelector = location.pathname === '/trending';

    const robots = location.pathname === '/' ? 'index,follow' : 'noindex,follow';

    return (
      <div>
        <Helmet>
          <title>Banter</title>
          <meta name="robots" content={robots} />
        </Helmet>
        <ScrollToTop />
        <ScrollToTopOnMount />
        {/*<HeroBannerContainer />*/}
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <LeftSidebar />
                {/*<a href="https://banternetwork.info" role="button" tabIndex="0"><span>more info</span></a>*/}
                <div>
                  <Button className="left-sidebar-link" href="https://banternetwork.info" target="_blank" type="link">
                    more info
                  </Button>
                </div>
                <div>
                  <Button className="left-sidebar-link" href="https://tokensale.banter.network" target="_blank" type="link">
                    get tokens
                  </Button>
                </div>
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={77}>

              <div className="right">
                <LinksRightNav />
                <RightSidebar />
              </div>
            </Affix>
            <div className="center">
              {displayTopicSelector && <TrendingTagsMenu />}
              {shouldDisplaySelector && (
                <TopicSelector
                  isSingle={false}
                  sort={sortBy}
                  topics={category ? [category] : []}
                  onSortChange={this.handleSortChange}
                  onTopicClose={this.handleTopicClose}
                />
              )}
              {/*{authenticated && <QuickPostEditor />}*/}
              <SubFeed />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
