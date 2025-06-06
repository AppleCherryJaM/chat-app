import { useState } from "react";

const Footer = ({ onSubmit }) => {
  const [message, setMessage] = useState('');
  const handleSubmit = () => {
    onSubmit(message);
    setMessage('');
  }
  return <>
    <div className="right-footer">
      <div className="footer-input-wrapper">
        <input type="text" className="footer-input"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Type your message..."/>
        <div className="footer-icon" onClick={handleSubmit}>➤</div>
      </div>
    </div>
  </>;
};

export { Footer };