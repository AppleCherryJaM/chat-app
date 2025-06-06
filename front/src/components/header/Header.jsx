import React, { useRef } from "react";

import { chooseAvatar } from "../../utils";

const Header = ({ user, logout, chat, searchChat }) => {

  const query = useRef();

  const searchBtnHandler = async() => {
    await searchChat(query.current.value);
  }

  return <>
    <div className="header">
      {user && <>
        <div className="header-top">
          <div className="avatar-container">
            <img src={chooseAvatar(user.avatar)} alt="avatar"
                 className="avatar"/>
            <div className="status-bubble"></div>
          </div>
          <div className='name'>{user.firstName} {user.lastName}</div>
          <button className="login-btn" onClick={logout}>Log Out</button>
        </div>
        <input type="text" className="search-bar"
               placeholder="Search chats..." ref={query} onChange={(e) => {
                searchBtnHandler();
              }} />
      </>}
      {/* {!user &&
        <button className="login-btn" onClick={login}>Log In</button>
      } */}
    </div>
  </>;
};

export { Header };