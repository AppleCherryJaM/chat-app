import { useEffect, useState } from 'react';
import { useModal } from './ModalContext';
// import { socket } from '../../socket';

const Modal = ({ chat }) => {
  const { closeModal, options } = useModal();
  switch (options) {
    case 'add' : {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');

      // useEffect(() => {
      //   socket.on('create_chat_success',
      //     () => console.log('Created Chat Success'));
      //   socket.on('create_chat_error',
      //     () => console.log('Error during creating chat'));
      //   return (() => {
      //     socket.off('create_chat_success');
      //     socket.off('create_chat_error');
      //   });
      // }, []);

      const handleSubmit = () => {
        console.log(firstName, lastName);
        // socket.emit('create_chat', { firstName, lastName });
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

      return <div className="modal-overlay">
        <div className="modal-window">
          <button onClick={closeModal}
                  className="close-button">&times;</button>
          <div className="modal-title">Are you sure?</div>
          <div className="confirm-actions">
            <button className="confirm-btn">Confirm</button>
          </div>
        </div>
        ;
      </div>;

    case 'edit':
      console.log(chat);
      const [firstName, setFirstName] = useState(chat?.firstName);
      const [lastName, setLastName] = useState(chat?.lastName);

      const handleSubmit = () => {
        console.log(firstName, lastName);
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
      </>;

    default:
      return <></>;
  }
};
export { Modal };