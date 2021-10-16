import React, {PropTypes} from 'react';

const LinksRightNav = () => {
  return (
    <div className="right" style={{background: '#fff',marginBottom: '10px', paddingBottom: '10px', borderRadius: '3px'}}>
      {/*<div style={{fontSize:'1.2em'}}>Useful Links</div>*/}
      <h4 className="SidebarContentBlock__title"><span>Useful Links</span></h4>
      <div className="SidebarContentBlock__content">
        <div><a style={{color: '#992499'}} href="https://banter.gg" target="_blank">Web Page</a></div>
        <div className="User__divider"></div>
        <div><a style={{color: '#992499'}} href="https://banter.gg" target="_blank">Discord</a></div>
        <div className="User__divider"></div>
        <div><a style={{color: '#992499'}} href="https://banter.gg" target="_blank">Telegram</a></div>
        <div className="User__divider"></div>
        <div><a style={{color: '#992499'}} href="https://banter.gg" target="_blank">EasyDex</a></div>
        <div className="User__divider"></div>
      </div>
    </div>
  );
}

// LinksRightNav.PropTypes = {
//   myProp: PropTypes.string.isRequired
// };

export default LinksRightNav;
