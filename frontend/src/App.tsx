import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import GameInfo from './components/GameInfo';

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={ <Home/> }/>
      <Route path="/games/:id" element={ <GameInfo/> }/>
    </Routes>
  </Router>
}

export default App
