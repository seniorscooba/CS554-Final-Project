import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Ensure to import the CSS file
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signOutUser } from '../firebase/firebase-src';
import Navigation from './Navigation';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const signedIn = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => signedIn();
  }, []);

  const onSignUpOrLogin = () => {
    navigate('/signUpOrLogin');
  }

  const onSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      navigate('/');
    } catch(e) {
      console.error(e);
    }
  }

  // COMMENTED CODE WORKS BUT IS COMMENTED OUT WHILE WE ARE IN 
  // DEVELOPMENT SO YOU DON'T HAVE TO SIGN IN EVERYTIME
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Welcome to Pictogram!</h1>
      {user ?
       <button
         onClick={onSignOut}
         style={{ position: 'fixed', top: 30, right: 10, borderColor: 'black' }}
       >
         Sign Out
       </button> :
      <button
        onClick={onSignUpOrLogin}
        style={{ position: 'fixed', top: 30, right: 10, borderColor: 'black' }}
      >
        Sign Up/Login
      </button>}
      <Navigation/>
      <div className = "imageDisplay">
      <img src='/Pictogram.png' alt='Pictogram Logo' style={{display: 'block', margin: '20px auto', width: '400px', height: 'auto', paddingBottom: 20}}/>
      <img src='/picto1.png' alt='Pictogram Knight' style={{display: 'block', margin: '20px auto', width: '400px', height: 'auto', paddingBottom: 20}}/>
      <img src='/picto2.png' alt='Pictogram Cat' style={{display: 'block', margin: '20px auto', width: '400px', height: 'auto', paddingBottom: 20}}/>
      <img src='/picto3.png' alt='Pictogram HiFive' style={{display: 'block', margin: '20px auto', width: '400px', height: 'auto', paddingBottom: 20}}/>
      </div>
    </div>
  );
}
