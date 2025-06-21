import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Tipos
export interface UserProgress {
  nivel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  pontuacao: number
  diasCompletados: number[]
  exerciciosFeitos: number
  streakAtual: number
  melhorStreak: number
  testeNivelamentoFeito: boolean
  ultimoAcesso: string
}

export interface HistoricoNota {
  data: string
  dia: number
  pontuacao: number
  nivel: string
  exerciciosCorretos: number
  totalExercicios: number
  tempoGasto: number
}

export interface FraseSalva {
  id: string
  pt: string
  it: string
  explicacao: string
  categoria: string
  dataSalva: string
}

export interface AppState {
  userProgress: UserProgress
  historico: HistoricoNota[]
  frasesSalvas: FraseSalva[]
  configuracoes: {
    voz: 'masculina' | 'feminina'
    velocidadeAudio: number
    notificacoes: boolean
    temaEscuro: boolean
  }
}

// Estado inicial
const initialState: AppState = {
  userProgress: {
    nivel: 'A1',
    pontuacao: 0,
    diasCompletados: [],
    exerciciosFeitos: 0,
    streakAtual: 0,
    melhorStreak: 0,
    testeNivelamentoFeito: false,
    ultimoAcesso: new Date().toISOString()
  },
  historico: [],
  frasesSalvas: [],
  configuracoes: {
    voz: 'feminina',
    velocidadeAudio: 1.0,
    notificacoes: true,
    temaEscuro: false
  }
}

// Actions
export type AppAction = 
  | { type: 'SET_USER_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'ADD_HISTORICO'; payload: HistoricoNota }
  | { type: 'ADD_FRASE_SALVA'; payload: FraseSalva }
  | { type: 'REMOVE_FRASE_SALVA'; payload: string }
  | { type: 'UPDATE_CONFIGURACOES'; payload: Partial<AppState['configuracoes']> }
  | { type: 'COMPLETE_TESTE_NIVELAMENTO'; payload: { nivel: UserProgress['nivel']; pontuacao: number } }
  | { type: 'COMPLETE_DIA'; payload: { dia: number; pontuacao: number; exerciciosCorretos: number; totalExercicios: number; tempoGasto: number } }
  | { type: 'RESET_PROGRESS' }
  | { type: 'LOAD_SAVED_DATA'; payload: AppState }

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_PROGRESS':
      return {
        ...state,
        userProgress: { ...state.userProgress, ...action.payload }
      }
    
    case 'ADD_HISTORICO':
      return {
        ...state,
        historico: [...state.historico, action.payload]
      }
    
    case 'ADD_FRASE_SALVA':
      return {
        ...state,
        frasesSalvas: [...state.frasesSalvas, action.payload]
      }
    
    case 'REMOVE_FRASE_SALVA':
      return {
        ...state,
        frasesSalvas: state.frasesSalvas.filter(f => f.id !== action.payload)
      }
    
    case 'UPDATE_CONFIGURACOES':
      return {
        ...state,
        configuracoes: { ...state.configuracoes, ...action.payload }
      }
    
    case 'COMPLETE_TESTE_NIVELAMENTO':
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          nivel: action.payload.nivel,
          pontuacao: action.payload.pontuacao,
          testeNivelamentoFeito: true
        }
      }
    
    case 'COMPLETE_DIA':
      const novoHistorico: HistoricoNota = {
        data: new Date().toISOString(),
        dia: action.payload.dia,
        pontuacao: action.payload.pontuacao,
        nivel: state.userProgress.nivel,
        exerciciosCorretos: action.payload.exerciciosCorretos,
        totalExercicios: action.payload.totalExercicios,
        tempoGasto: action.payload.tempoGasto
      }
      
      const diasCompletos = [...state.userProgress.diasCompletados]
      if (!diasCompletos.includes(action.payload.dia)) {
        diasCompletos.push(action.payload.dia)
      }
      
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          diasCompletados: diasCompletos,
          exerciciosFeitos: state.userProgress.exerciciosFeitos + action.payload.totalExercicios,
          pontuacao: state.userProgress.pontuacao + action.payload.pontuacao
        },
        historico: [...state.historico, novoHistorico]
      }
    
    case 'RESET_PROGRESS':
      return initialState
    
    case 'LOAD_SAVED_DATA':
      return action.payload
    
    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | undefined>(undefined)

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('14-days-cip-data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: 'LOAD_SAVED_DATA', payload: parsedData })
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error)
      }
    }
  }, [])

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('14-days-cip-data', JSON.stringify(state))
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook personalizado
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider')
  }
  return context
}
