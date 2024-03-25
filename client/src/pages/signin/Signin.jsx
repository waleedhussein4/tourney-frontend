import './App.css';
import '/src/styles/index.css';
import { AuthContextProvider } from '../../context/authContext';
import { useRef, useState, useEffect } from 'react';
import { useLogin } from './useLogin';

function Signin() {
  return (
    <AuthContextProvider>
      <Login />
    </AuthContextProvider>
  );
}

function Login(props) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [login, error, isLoading] = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, pass);
  };

  const handleRememberPasswordChange = () => {
    setRememberPassword(!rememberPassword);
    if (!rememberPassword) {
      localStorage.setItem('rememberedPassword', pass);
    } else {
      localStorage.removeItem('rememberedPassword');
    }
  };

  useEffect(() => {
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedPassword) {
      setPass(rememberedPassword);
      setRememberPassword(true);
    }
  }, []);

  return (
    <div id="Signin">
      <div className="container">
        <div className="container-center">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label htmlFor="username">Username or email</label>
            <input type="text" id="username" placeholder="Enter a username or an email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter a password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <div id="rememberPassword">
              <input type="checkbox" checked={rememberPassword} onChange={handleRememberPasswordChange} />
              <label htmlFor="rememberPassword">Remember password</label>
            </div>
            <input type="submit" value="Login" disabled={isLoading} className="submit" />
            {error && <div className="error">{error}</div>}
          </form>
          <span id="account">Don't have an account? <a href="/signup/">Sign up</a></span>
        </div>
      </div>
    </div>
  );
}

export default Signin;