import { ChatBody } from "./body/ChatBody";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";

const Chat = ({ chat, userId }) => {
  return <>
    <div className="right-panel">
      {chat && <>
        <Header chat={chat}/>
        <ChatBody messages={chat.messages} userId={userId}/>
        <Footer/>
      </>
      }
      {!chat && <div>Create chat</div>}
    </div>

  </>;
};

export { Chat };