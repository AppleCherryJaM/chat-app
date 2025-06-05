import { useModal } from "../../modal/ModalContext";

const DropdownMenu = () => {
  const { openModal } = useModal();

  const editChatHandler = () => {
    openModal('edit');
  };

  const deleteChatHandler = () => {
    openModal('delete');
  };

  return <div className="menu-dropdown">
    <button className="menu-item" onClick={editChatHandler}>Edit</button>
    <button className="menu-item" onClick={deleteChatHandler}>Delete</button>
    <button className="menu-item">Notifications</button>
  </div>;
};

export { DropdownMenu };