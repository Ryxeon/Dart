import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome.jsx';
import Login from './screens/Login.jsx';
import Signup from './screens/Signup.jsx';
import Profile from './screens/Profile.jsx';
import TeamChoice from './screens/TeamChoice.jsx';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/creer-compte" element={<Signup />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/equipe-choix" element={<TeamChoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
