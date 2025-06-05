import { Message } from "../../message/Message";


const ChatBody = ({ messages }) => {

  return <div className="right-body">
    {messages && messages.map(
      (message) => {
        const option = message.type === 'user' ? 'outgoing' : 'incoming';
        console.log(message.type);
        return <Message {...message} key={message.id} option={option}/>;
      })}
  </div>;
};

export { ChatBody };