import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import TesteNivelamento from './components/TesteNivelamento'
import AprendizadoDiario from './components/AprendizadoDiario'
import Conversacao from './components/Conversacao'
import HistoricoNotas from './components/HistoricoNotas'
import ConversaoFrases from './components/ConversaoFrases'
import CadernoLeitura from './components/CadernoLeitura'
import MateriaisExtras from './components/MateriaisExtras'
import { AppProvider } from './context/AppContext'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teste-nivelamento" element={<TesteNivelamento />} />
            <Route path="/aprendizado-diario" element={<AprendizadoDiario />} />
            <Route path="/conversacao" element={<Conversacao />} />
            <Route path="/historico" element={<HistoricoNotas />} />
            <Route path="/conversao-frases" element={<ConversaoFrases />} />
            <Route path="/caderno" element={<CadernoLeitura />} />
            <Route path="/materiais-extras" element={<MateriaisExtras />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
