import React, {
  createContext,
  useContext,
  useState
} from 'react';


const ModalContext = createContext(undefined);

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState('');

  const openModal = (option) => {
    setOptions(option);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setOptions('');
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, options }}>
      {children}
    </ModalContext.Provider>
  );
};

export { useModal, ModalProvider };