import { formatDate } from "../../utils";

const Message = ({ messageText, timestamp, edited, option }) => {

  switch (option) {

    case 'sent' :
      return <div className="message sent">
        <div>{messageText}</div>
        <div className="meta-msg">
          {edited && <div className="edited-msg">edited</div>}
          <div className="time-msg">{formatDate(timestamp, 'chat')}</div>
        </div>
      </div>;

    case 'received' :
      return <div className="message received">
        <div>{messageText}</div>
        <div className="meta-msg">
          {edited && <div className="message-edited">edited</div>}
          <div className="time-msg">{formatDate(timestamp, 'chat')}</div>
        </div>
      </div>;

    default:
      return <></>;
  }
};

export { Message };