import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ArrowLeft, Play, Volume2, Check, X, Star, Trophy, Timer } from 'lucide-react'

interface Exercicio {
  id: number
  tipo: string
  pergunta: string
  opcoes?: string[]
  resposta_correta: number
  audio?: string
  frase?: string
  traducao?: string
}

interface DiaData {
  dia: number
  tema: string
  nivel: string
  exercicios: Exercicio[]
}

interface ExerciciosData {
  dias: DiaData[]
  tipos_exercicio: {
    [key: string]: string
  }
}

export default function AprendizadoDiario() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  
  const [exerciciosData, setExerciciosData] = useState<ExerciciosData | null>(null)
  const [diaAtual, setDiaAtual] = useState(1)
  const [exercicioAtual, setExercicioAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false)
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null)
  const [tempoInicio, setTempoInicio] = useState(Date.now())
  const [reproduzindoAudio, setReproduzindoAudio] = useState(false)

  useEffect(() => {
    fetch('/data/exercicios-diarios.json')
      .then(res => res.json())
      .then(data => {
        setExerciciosData(data)
        setLoading(false)
        setTempoInicio(Date.now())
      })
      .catch(error => {
        console.error('Erro ao carregar exercícios:', error)
        setLoading(false)
      })
  }, [])

  const reproduzirAudio = (audioFile?: string) => {
    if (!audioFile) return
    
    setReproduzindoAudio(true)
    // Simular reprodução de áudio
    setTimeout(() => {
      setReproduzindoAudio(false)
    }, 2000)
  }

  const handleResposta = (opcaoIndex: number) => {
    setRespostaSelecionada(opcaoIndex)
    setMostrarExplicacao(true)
    
    // Salva a resposta após 2 segundos
    setTimeout(() => {
      const novasRespostas = [...respostas, opcaoIndex]
      setRespostas(novasRespostas)
      
      if (exercicioAtual < diaData.exercicios.length - 1) {
        setExercicioAtual(exercicioAtual + 1)
        setRespostaSelecionada(null)
        setMostrarExplicacao(false)
      } else {
        calcularResultado(novasRespostas)
      }
    }, 2500)
  }

  const calcularResultado = (respostasFinais: number[]) => {
    const acertos = respostasFinais.filter((resposta, index) => 
      resposta === diaData.exercicios[index].resposta_correta
    ).length
    
    const pontuacao = Math.round((acertos / diaData.exercicios.length) * 100)
    const tempoGasto = Math.round((Date.now() - tempoInicio) / 1000 / 60) // em minutos
    
    dispatch({
      type: 'COMPLETE_DIA',
      payload: {
        dia: diaAtual,
        pontuacao,
        exerciciosCorretos: acertos,
        totalExercicios: diaData.exercicios.length,
        tempoGasto
      }
    })

    setMostrarResultado(true)
  }

  const getFeedbackPoliglota = (pontuacao: number) => {
    if (pontuacao >= 80) {
      return {
        tipo: 'excelente',
        emoji: '🎉',
        titulo: 'Eccellente!',
        mensagem: 'Perfetto! La tua pronuncia è molto buona! Continua così e raggiungerai la fluenza in poco tempo.',
        nivel: 'Excelente'
      }
    } else if (pontuacao >= 60) {
      return {
        tipo: 'bom',
        emoji: '👍',
        titulo: 'Bene!',
        mensagem: 'Buono! Piccoli errori ma il messaggio è chiaro. Prova a prestare più attenzione alla grammatica.',
        nivel: 'Bom'
      }
    } else {
      return {
        tipo: 'precisa_melhorar',
        emoji: '💪',
        titulo: 'Non male!',
        mensagem: 'Ci siamo quasi! Non ti scoraggiare, con più pratica migliorerai sicuramente. Riprova domani!',
        nivel: 'Precisa melhorar'
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando exercícios...</p>
        </div>
      </div>
    )
  }

  if (!exerciciosData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar exercícios. Tente novamente.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  const diaData = exerciciosData.dias.find(d => d.dia === diaAtual) || exerciciosData.dias[0]
  const exercicio = diaData.exercicios[exercicioAtual]
  const progresso = ((exercicioAtual + 1) / diaData.exercicios.length) * 100

  if (mostrarResultado) {
    const acertos = respostas.filter((resposta, index) => 
      resposta === diaData.exercicios[index].resposta_correta
    ).length
    
    const pontuacao = Math.round((acertos / diaData.exercicios.length) * 100)
    const feedback = getFeedbackPoliglota(pontuacao)
    const tempoGasto = Math.round((Date.now() - tempoInicio) / 1000 / 60)

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-lg hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Dia {diaAtual} Completo!</h1>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {feedback.emoji} {feedback.titulo}
              </h2>
              
              <div className="mb-4">
                <div className="text-4xl font-bold text-blue-600 mb-2">{pontuacao}%</div>
                <p className="text-gray-600">
                  {acertos} de {diaData.exercicios.length} exercícios corretos
                </p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{pontuacao}%</div>
                  <div className="text-sm text-gray-600">Pontuação</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">{tempoGasto}min</div>
                  <div className="text-sm text-gray-600">Tempo</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">{state.userProgress.nivel}</div>
                  <div className="text-sm text-gray-600">Nível</div>
                </div>
              </div>
            </div>

            {/* Feedback da Professora */}
            <div className="bg-gradient-to-r from-green-50 to-red-50 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-4">
                <img 
                  src="/images/giulia.png" 
                  alt="Professora Giulia" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Feedback da Professora Giulia:</h4>
                  <p className="text-gray-700 mb-3">{feedback.mensagem}</p>
                  <button
                    onClick={() => reproduzirAudio('feedback_audio.mp3')}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Ouvir em italiano
                  </button>
                </div>
              </div>
            </div>

            {/* Classificação de Nível */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Classificação: {feedback.nivel}
              </h4>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.ceil(pontuacao / 20) 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-gray-600 ml-2">
                  {pontuacao >= 80 ? 'Excelente' : pontuacao >= 60 ? 'Bom' : 'Continue praticando'}
                </span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/historico')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Ver Histórico
              </button>
              <button
                onClick={() => {
                  setDiaAtual(diaAtual + 1)
                  setExercicioAtual(0)
                  setRespostas([])
                  setMostrarResultado(false)
                  setTempoInicio(Date.now())
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                disabled={diaAtual >= exerciciosData.dias.length}
              >
                Próximo Dia
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Menu Principal
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="mr-4 p-2 rounded-lg hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dia {diaData.dia}</h1>
              <p className="text-gray-600">{diaData.tema}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Exercício</div>
            <div className="text-2xl font-bold text-blue-600">
              {exercicioAtual + 1}/{diaData.exercicios.length}
            </div>
          </div>
        </div>

        {/* Seletor de Dia */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {exerciciosData.dias.map((dia) => (
              <button
                key={dia.dia}
                onClick={() => {
                  setDiaAtual(dia.dia)
                  setExercicioAtual(0)
                  setRespostas([])
                  setMostrarResultado(false)
                  setTempoInicio(Date.now())
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  diaAtual === dia.dia
                    ? 'bg-blue-600 text-white'
                    : state.userProgress.diasCompletados.includes(dia.dia)
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>Dia {dia.dia}</span>
                  {state.userProgress.diasCompletados.includes(dia.dia) && (
                    <Check className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso do Dia</span>
            <span>{Math.round(progresso)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        {/* Exercício */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {exerciciosData.tipos_exercicio[exercicio.tipo]}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {exercicio.pergunta}
            </h2>
            
            {/* Botão de Áudio */}
            {exercicio.audio && (
              <button
                onClick={() => reproduzirAudio(exercicio.audio)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg mb-4 ${
                  reproduzindoAudio 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
                disabled={reproduzindoAudio}
              >
                {reproduzindoAudio ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
                <span>{reproduzindoAudio ? 'Reproduzindo...' : 'Ouvir Áudio'}</span>
              </button>
            )}
          </div>

          {/* Opções ou Conteúdo do Exercício */}
          {exercicio.tipo === 'audio' ? (
            <div className="text-center p-8 bg-blue-50 rounded-lg">
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  "{exercicio.frase}"
                </div>
                <div className="text-gray-600">{exercicio.traducao}</div>
              </div>
              <button
                onClick={() => reproduzirAudio(exercicio.audio)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center mx-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                Praticar Pronúncia
              </button>
              <button
                onClick={() => handleResposta(0)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {exercicio.opcoes?.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => !mostrarExplicacao && handleResposta(index)}
                  disabled={mostrarExplicacao}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    mostrarExplicacao
                      ? index === exercicio.resposta_correta
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : index === respostaSelecionada && index !== exercicio.resposta_correta
                        ? 'bg-red-50 border-red-300 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opcao}</span>
                    {mostrarExplicacao && (
                      <div>
                        {index === exercicio.resposta_correta && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                        {index === respostaSelecionada && index !== exercicio.resposta_correta && (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
