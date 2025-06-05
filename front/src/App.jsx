// import { Chat, Modal, SideBar, useModal } from './components/components';
import { Chat } from './components/chat/chat';
import { Modal } from './components/modal/Modal';
import { useModal } from './components/modal/ModalContext';
import { SideBar } from './components/sideBar/sideBar';
import { useEffect, useState } from 'react';
// import { socket } from './socket';

import { users } from "./assets/data/data";

function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentChat, setCurrentChat] = useState();

  const { isOpen } = useModal();
  const chats = currentUser ? currentUser.chats : [];

  // useEffect(() => {
  //   const onConnect = () => {
  //     console.log('Connected');
  //   };

  //   const onLogin = (user) => {
  //     setCurrentUser(user);
  //   };

  //   function onDisconnect() {
  //     console.log('Disconnect');
  //   }

  //   // socket.on('login', onLogin);
  //   // socket.on('connect', onConnect);
  //   // socket.on('disconnect', onDisconnect);

  //   return () => {
  //     // socket.off('connect', onConnect);
  //     // socket.off('disconnect', onDisconnect);
  //   };
  // }, []);

  useEffect(() => {
    setCurrentUser(users[0]);
  }, []);

  const setChat = (id) => {
    if (!currentUser) {
      return;
    }
    const chat = currentUser.chats.find(chat => chat.id === id);

    if (!chat) {
      return;
    }
    setCurrentChat(chat);
  };

  const login = () => {
    // socket.emit('get_user', '683f5393e29d27db7fcd09b3');
    // socket.on('user_data', (user) => {
    //   console.log('👤 Received user:', user);
    //   setCurrentUser(user);
    // });
    // setCurrentUser(users[0]);

    // socket.on('user_not_found', (data) => {
    //   console.error(data.message);
    // });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  console.log(currentUser);

  return (
    <>
      {currentUser && <><SideBar user={currentUser} chats={chats} changeChat={setChat}
               login={login} logout={logout} /> <Chat userId={currentUser.id} chat={currentChat} /> </>}
      {isOpen && <Modal chat={currentChat} />}
    </>
  );
}

export default App;
