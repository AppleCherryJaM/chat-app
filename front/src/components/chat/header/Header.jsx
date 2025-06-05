import { chooseAvatar } from "../../../utils";

const Header = ({ user, login, logout }) => {
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
               placeholder="Search chats..."/>
      </>}
      {/* {!user &&
        <button className="login-btn" onClick={login}>Log In</button>
      } */}
    </div>
  </>;
};

export { Header };