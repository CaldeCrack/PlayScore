import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import GameInfo from './components/GameInfo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/games" element={ <Home/> }/>
        <Route path="/games/:id" element={ <GameInfo/> }/>
      </Routes>
    </Router>
  )
}

export default App
