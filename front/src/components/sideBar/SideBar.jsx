import { ChatList } from "../chatList/ChatList";
import { Header } from "../header/Header";

const SideBar = ({ 
  user, 
  chats, 
  changeChat, 
  login, 
  logout, 
  searchQuery, 
  setSearchQuery,
  searchChat
}) => {
  console.log("Chats: ", chats);
  return <div className="left-panel">
    <Header user={user} login={login} logout={logout} 
    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
    searchChat={searchChat}/>
    {user && <ChatList chats={chats} handleChange={changeChat}/>}
  </div>;
};
export { SideBar };