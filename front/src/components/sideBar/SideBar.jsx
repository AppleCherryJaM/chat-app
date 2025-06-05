import { ChatList } from "../chatList/ChatList";
import { Header } from "../chat/header/Header";

const SideBar = ({ user, chats, changeChat, login, logout }) => {
  return <div className="left-panel">
    <Header user={user} login={login} logout={logout}/>
    {user && <ChatList chats={chats} handleChange={changeChat}/>}
  </div>;
};
export { SideBar };