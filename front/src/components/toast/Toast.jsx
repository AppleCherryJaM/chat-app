import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToast = (chatName, message) => {
  toast.info(
    <div>
      <div style={{ fontWeight: 600 }}>{chatName}</div>
      <div>{message}</div>
    </div>,
    {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      className: 'chat-toast',
    }
  );
};

export { showToast };