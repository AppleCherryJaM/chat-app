import { useModal } from '../modal/ModalContext';

const NewChatBtn = () => {
  const { openModal } = useModal();

  return <>
    <div className="add-chat-btn" onClick={() => openModal('add')}>
      <div className="avatar">+</div>
      <div className="chat-info">Add New Chat</div>
    </div>
  </>;
};
export { NewChatBtn };