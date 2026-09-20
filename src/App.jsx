import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome.jsx';
import Login from './screens/Login.jsx';
import Signup from './screens/Signup.jsx';
import Profile from './screens/Profile.jsx';
import TeamChoice from './screens/TeamChoice.jsx';
import CreateTeam from './screens/CreateTeam.jsx';
import JoinTeam from './screens/JoinTeam.jsx';
import Home from './screens/Home.jsx';
import Settings from './screens/Settings.jsx';
import Questionnaire from './screens/Questionnaire.jsx';
import ResetPassword from './screens/ResetPassword.jsx';
import ExerciceListe from './screens/ExerciceListe.jsx';
import RegleDetail from './screens/RegleDetail.jsx';
import PosteDetail from './screens/PosteDetail.jsx';
import BonnesHabitudes from './screens/BonnesHabitudes.jsx';
import ToutesLesRegles from './screens/ToutesLesRegles.jsx';
import EditProfile from './screens/EditProfile.jsx';
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
        <Route path="/creer-equipe" element={<CreateTeam />} />
        <Route path="/rejoindre-equipe" element={<JoinTeam />} />
        <Route path="/accueil" element={<Home />} />
        <Route path="/parametres" element={<Settings />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
        <Route path="/entrainement/:categorie" element={<ExerciceListe />} />
        <Route path="/regles/:id" element={<RegleDetail />} />
        <Route path="/postes/:id" element={<PosteDetail />} />
        <Route path="/bonnes-habitudes" element={<BonnesHabitudes />} />
        <Route path="/toutes-les-regles" element={<ToutesLesRegles />} />
        <Route path="/modifier-profil" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
