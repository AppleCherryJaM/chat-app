import { Message } from "../../message/Message";


const ChatBody = ({ messages }) => {
  return <div className="right-body">
    {messages && messages.map(
      (message) => {
        console.log(message);
        const option = message.type === "sent" ? 'sent' : 'received';
        return <Message {...message} key={message._id} option={option}/>;
      })}
  </div>;
};

export { ChatBody };