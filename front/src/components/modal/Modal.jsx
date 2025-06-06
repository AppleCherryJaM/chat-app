import { useState } from 'react';
import { useModal } from './ModalContext';

const Modal = ({ chat, createChat, editChat, deleteChat }) => {
  const { closeModal, options } = useModal();
  switch (options) {
    case 'add' : {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');

      const handleSubmit = async () => {
        console.log(firstName, lastName);
        await createChat({ firstName, lastName });
        closeModal();
      };

      return <>
        <div className="modal-overlay">
          <div className="modal-window">
            <button onClick={closeModal}
                    className="close-button">&times;</button>
            <h2 className="modal-title">Enter</h2>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="modal-input"
            />
            <button onClick={handleSubmit} className="submit-button">Submit
            </button>
          </div>
        </div>
      </>;
    }
    case 'delete':

      { const handleSubmit = async () => {
        const chatId = chat._id;
        console.log(chatId);
        await deleteChat({chatId});
        closeModal();
      }

      return <div className="modal-overlay">
        <div className="modal-window">
          <button onClick={closeModal}
                  className="close-button">&times;</button>
          <div className="modal-title">Are you sure?</div>
          <div className="confirm-actions">
            <button className="confirm-btn" onClick={handleSubmit}>Confirm</button>
          </div>
        </div>
        ;
      </div>; }

    case 'edit':
      { const [firstName, setFirstName] = useState(chat.firstName);
        const [lastName, setLastName] = useState(chat.lastName);
      
        const handleSubmit = async () => {
          const chatId = chat._id;
          if (firstName && lastName) {
            await editChat({chatId, firstName, lastName});
            closeModal();
          }
        };
      
        return <>
          <div className="modal-overlay">
            <div className="modal-window">
              <button onClick={closeModal}
                      className="close-button">&times;</button>
              <h2 className="modal-title">Edit</h2>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="modal-input"
              />
              <button onClick={handleSubmit} className="submit-button">Submit
              </button>
            </div>
          </div>
        </>; }
    default:
      return <></>;
  }
};
export { Modal };