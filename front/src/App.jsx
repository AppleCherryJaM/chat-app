// import { Chat, Modal, SideBar, useModal } from './components/components';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { Chat } from './components/chat/chat';
import { Modal } from './components/modal/Modal';
import { useModal } from './components/modal/ModalContext';
import { SideBar } from './components/sideBar/sideBar';
import LoginPage from './components/login/LoginPage';

import { socket } from './socket';


const URL = import.meta.env.VITE_BE_URL;

const App = () => {
  const [currentUser, setCurrentUser] = useState(null); 
  const [userChats, setUserChats] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentChat, setCurrentChat] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  // const [chatName, setChatName] = useState('');
  // const [message, setMessage] = useState('');

  const { isOpen, closeModal } = useModal();

  useEffect(() => {
    socket.on('update_chat', (updatedChat) => {
      toast.success('Chat edited');
      setCurrentUser((prevUser) => {
        const updatedChats = prevUser.chats.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat,
        );
        return {
          ...prevUser,
          chats: updatedChats,
        };
      });
      setCurrentChat(
        (prev) => (prev._id === updatedChat._id ? updatedChat : prev));
      closeModal();
    });

    socket.on('error', (message) => {
      toast.error('Error ' + message);
    });

    // socket.on('api_response', (newMessage) => {
    //   if (newMessage.type === "received") {
    //     showToast(`${newMessage.firstName} ${newMessage.lastName}`, newMessage.messageText)
    //     // setChatName(`${newMessage.firstName} ${newMessage.lastName}`);
    //     // setMessage(newMessage.messageText)
    //   }
    // });

  }, []);

  const registration = async ({firstName, lastName, email, password}) => {
    const response = await fetch(`${URL}/user/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({firstName, lastName, email, password})
    });
    const data = await response.json();
    setCurrentUser(data.newUser);
    setUserChats(data.newUser.chats);
    return response;
  }

  const signin = async ({email, password}) => {
    const response = await fetch(`${URL}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password})
    });
    const data = await response.json();
    setCurrentUser(data.result);
    setUserChats(data.result.chats);
    return response;
  }

  const searchChat = async(query) => {
    const userId = currentUser._id;
    const response = await fetch(`${URL}/chat/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userId, searchQuery: query})
    });
    const data = await response.json();
    setUserChats(data.results);
  }

  const createChat = async ({firstName, lastName}) => {
    const userId = currentUser._id;
    await fetch(`${URL}/chat/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userId, firstName, lastName})
    });
    
    const res = await fetch(`${URL}/chat/${userId}`);
    const data = await res.json();
    setUserChats(data.chats);
  }

  const editChat = async ({chatId, firstName, lastName}) => {
    const userId = currentUser._id;
    await fetch(`${URL}/chat/edit/${chatId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({firstName, lastName})
    });
    const res = await fetch(`${URL}/chat/${userId}`);
    const data = await res.json();
    setUserChats(data.chats);
    const chat = data.chats.find(chat => chat._id === chatId);
    setCurrentChat(chat);
  }

  const deleteChat = async({chatId}) => {
    const userId = currentUser._id;
    await fetch(`${URL}/chat/delete/${chatId}`, {
      method: 'DELETE'
    });
    const res = await fetch(`${URL}/chat/${userId}`);
    const data = await res.json();
    setUserChats(data.chats);
    setCurrentChat(null);
  }

  const setChat = (id) => {
    const chat = userChats.find(chat => chat._id === id);
    setCurrentChat(chat);
  };

  const login = () => {

  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <>
      {!isLoggedIn && <LoginPage registration={registration} signin={signin} setIsLoggedIn={setIsLoggedIn}/>}
      {isLoggedIn &&  <>
      {currentUser && <><SideBar user={currentUser} chats={userChats} changeChat={setChat}
               login={login} logout={logout} searchQuery={searchQuery} 
               setSearchQuery={setSearchQuery} searchChat={searchChat}/> 
               <Chat userId={currentUser.id} chat={currentChat} /> </>}
      {isOpen && <Modal chat={currentChat} createChat={createChat} editChat={editChat} deleteChat={deleteChat}/>}
    </>}
    <ToastContainer/>
    </>
  );
}

export default App;
