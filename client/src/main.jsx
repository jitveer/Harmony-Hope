import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { UserTokenVerification } from './Components/UserTokenVerification/UserTokenVerification.jsx';





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

  <UserTokenVerification>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserTokenVerification>

)
