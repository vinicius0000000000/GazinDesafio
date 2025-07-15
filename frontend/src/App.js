import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Devs from './pages/devs';
import Niveis from './pages/niveis';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <button className="App-button" onClick={() => navigate('/devs')}>Devs</button>
        <br/>
        <button className="App-button" onClick={() => navigate('/niveis')}>Niveis</button>
      </header>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/devs" element={<Devs />} />
      <Route path="/niveis" element={<Niveis />} />
    </Routes>
  );
}

export default App;
