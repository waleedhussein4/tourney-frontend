import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from '/src/context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>
)
