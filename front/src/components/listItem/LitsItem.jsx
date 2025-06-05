import { formatDate } from "../../utils";
import { chooseAvatar } from "../../utils";

const ListItem = ({ chat, handleChange }) => {
  const { id, messages, createdAt, avatar, firstName, lastName } = chat;
  const lastMessage = messages ? messages[messages.length - 1].content : '';
  const lastMessageTime = messages
    ? messages[messages.length - 1].createdAt
    : createdAt;

  return <div className="chat-item" onClick={() => handleChange(id)}>
    <img src={chooseAvatar(avatar)} alt="img" className="avatar"/>
    <div className="chat-info">
      <div className="chat-name">{firstName} {lastName}</div>
      <div className="last-message">{lastMessage}</div>
    </div>
    <div className="chat-date">{formatDate(lastMessageTime, 'chat')}</div>
  </div>;
};

export { ListItem };