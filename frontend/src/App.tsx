import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Home from './components/Home'
import GameInfo from './components/GameInfo'
import SignUp from './components/SignUp'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/games" element={ <Home/> }/>
        <Route path="/games/:id" element={ <GameInfo/> }/>
        <Route path="/signup" element={ <SignUp/> }/>
      </Routes>
    </Router>
  )
}

export default App
