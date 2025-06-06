import { useEffect, useRef } from 'react';
import { useModal } from '../ModalContext';
import { socket } from '../../../socket';

const ModalEdit = ({ chat }) => {
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const { closeModal } = useModal();
  useEffect(() => {
    if (firstName.current && lastName.current) {
      firstName.current.value = chat.firstName;
      lastName.current.value = chat.lastName;
    }
  }, []);

  const handleSubmit = () => {
    if (firstName.current && lastName.current) {
      const firstName = firstName.current.value;
      const lastName = lastName.current.value;
      if (firstName && lastName) {
        socket.emit('edit_chat', {
          chatId: chat.id,
          firstName,
          lastName,
        });
      }
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
          ref={firstName}
          className="modal-input"
        />
        <input
          type="text"
          placeholder="Last name"
          ref={lastName}
          className="modal-input"
        />
        <button onClick={handleSubmit} className="submit-button">Submit
        </button>
      </div>
    </div>
  </>;
};

export { ModalEdit };