import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome.jsx';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        {/* Les prochains écrans (Connexion, Créer un compte...) viendront ici */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
