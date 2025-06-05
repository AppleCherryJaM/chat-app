import { createRoot } from 'react-dom/client'
import './assets/css/index.css';
import App from './App.jsx'
import { ModalProvider } from './components/modal/ModalContext.jsx'

createRoot(document.getElementById('root')).render(
  <ModalProvider>
    <App />
  </ModalProvider>
)
