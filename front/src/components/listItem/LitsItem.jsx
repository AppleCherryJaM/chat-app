import { formatDate } from "../../utils";
import { chooseAvatar } from "../../utils";

const URL = import.meta.env.VITE_BE_URL;

const ListItem = ({ chat, handleChange }) => {
  const { _id, createdAt, avatar, firstName, lastName } = chat;
  let messages;
  const getMessages = async(chatId) => {
    const response = await fetch(`${URL}/chat/history/${chatId}`);
    const data = await response.json();
    return data.result;
  }

  messages = getMessages(_id);

  const lastMessage = messages.length > 0 ? messages[messages.length - 1].messageText : '';
  const lastMessageTime = messages.length > 0 
    ? messages[messages.length - 1].createdAt
    : createdAt;

  return <div className="chat-item" onClick={() => handleChange(_id)}>
    <img src={chooseAvatar(avatar)} alt="img" className="avatar"/>
    <div className="chat-info">
      <div className="chat-name">{firstName} {lastName}</div>
      <div className="last-message">{lastMessage}</div>
    </div>
    <div className="chat-date">{formatDate(lastMessageTime, 'chat')}</div>
  </div>;
};

export { ListItem };