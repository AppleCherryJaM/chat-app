import { ListItem } from "../listItem/LitsItem";
import { NewChatBtn } from "../newChat/NewChatBtn";

const ChatList = ({ chats, handleChange }) => {
  return <>
    <div className="chat-label">Chats</div>
    <div className="chat-list">
      {chats && <>{chats.map((chat) => <ListItem chat={chat} key={chat.id}
        handleChange={handleChange}/>)}</>}
      <NewChatBtn/>
    </div>
  </>;
};

export { ChatList };