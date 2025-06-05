import { formatDate } from "../../utils";

const Message = ({ content, createdAt, edited, option }) => {

  switch (option) {

    case 'outgoing' :
      return <div className="message sent">
        <div>{content}</div>
        <div className="meta-msg">
          {edited && <div className="edited-msg">edited</div>}
          <div className="time-msg">{formatDate(createdAt, 'chat')}</div>
        </div>
      </div>;

    case 'incoming' :
      return <div className="message received">
        <div>{content}</div>
        <div className="meta-msg">
          {edited && <div className="message-edited">edited</div>}
          <div className="time-msg">{formatDate(createdAt, 'chat')}</div>
        </div>
      </div>;

    default:
      return <></>;
  }
};

export { Message };