import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { UserTokenVerification } from './Components/UserTokenVerification/UserTokenVerification.jsx';
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import { ModalProvider } from './Context/ModalContext.jsx';





// Unregister PWA Service Worker to prevent caching issues
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service Worker unregistered:", registration);
    }
  });
}





createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <ScrollToTop />
    <ModalProvider>
      <UserTokenVerification>
        <App />
      </UserTokenVerification>
    </ModalProvider>
  </BrowserRouter>

)
