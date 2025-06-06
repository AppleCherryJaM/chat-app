import { ChatBody } from "./body/ChatBody";
import { Footer } from "./footer/Footer";
import { ChatHeader } from "./header/ChatHeader";
import { socket } from "../../socket";

const Chat = ({ chat, userId }) => {
  console.log(chat);
  const handleMsg = (messageText) => {
    if (!chat) return;
    socket.emit('message_send', {userId, chatId: chat._id, text: messageText});
  } 
  return <>
    <div className="right-panel">
      {chat && <>
        <ChatHeader chat={chat}/>
        <ChatBody messages={chat.messages} userId={userId}/>
        <Footer onSubmit={handleMsg}/>
      </>
      }
    </div>

  </>;
};

export { Chat };