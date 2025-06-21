import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ArrowLeft, Check, X, Trophy, Target, BookOpen } from 'lucide-react'

interface Pergunta {
  id: number
  nivel: string
  tipo: string
  pergunta: string
  opcoes: string[]
  resposta_correta: number
  explicacao: string
}

interface TesteData {
  teste: {
    titulo: string
    descricao: string
    instrucoes: string
    perguntas: Pergunta[]
    niveis: {
      [key: string]: {
        minimo: number
        maximo: number
        descricao: string
      }
    }
  }
}

export default function TesteNivelamento() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  
  const [testeData, setTesteData] = useState<TesteData | null>(null)
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false)
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null)

  useEffect(() => {
    fetch('/data/teste-nivelamento.json')
      .then(res => res.json())
      .then(data => {
        setTesteData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erro ao carregar teste:', error)
        setLoading(false)
      })
  }, [])

  const handleResposta = (opcaoIndex: number) => {
    setRespostaSelecionada(opcaoIndex)
    setMostrarExplicacao(true)
    
    // Salva a resposta após 2 segundos
    setTimeout(() => {
      const novasRespostas = [...respostas, opcaoIndex]
      setRespostas(novasRespostas)
      
      if (perguntaAtual < testeData!.teste.perguntas.length - 1) {
        setPerguntaAtual(perguntaAtual + 1)
        setRespostaSelecionada(null)
        setMostrarExplicacao(false)
      } else {
        calcularResultado(novasRespostas)
      }
    }, 2500)
  }

  const calcularResultado = (respostasFinais: number[]) => {
    let acertos = 0
    testeData!.teste.perguntas.forEach((pergunta, index) => {
      if (respostasFinais[index] === pergunta.resposta_correta) {
        acertos++
      }
    })

    const pontuacao = Math.round((acertos / testeData!.teste.perguntas.length) * 100)
    
    let nivel: 'A1' | 'A2' | 'B1' = 'A1'
    if (acertos >= 16) nivel = 'B1'
    else if (acertos >= 9) nivel = 'A2'
    else nivel = 'A1'

    dispatch({
      type: 'COMPLETE_TESTE_NIVELAMENTO',
      payload: { nivel, pontuacao }
    })

    setMostrarResultado(true)
  }

  const getNivelDescricao = (acertos: number) => {
    if (acertos >= 16) return { nivel: 'B1', desc: 'Intermediário', plano: 'Foque em conversação e gramática avançada' }
    if (acertos >= 9) return { nivel: 'A2', desc: 'Elementar', plano: 'Continue com vocabulário e estruturas do dia a dia' }
    return { nivel: 'A1', desc: 'Iniciante', plano: 'Comece com fundamentos: alfabeto, cumprimentos e verbos básicos' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando teste de nivelamento...</p>
        </div>
      </div>
    )
  }

  if (!testeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar o teste. Tente novamente.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  const pergunta = testeData.teste.perguntas[perguntaAtual]
  const progresso = ((perguntaAtual + 1) / testeData.teste.perguntas.length) * 100

  if (mostrarResultado) {
    const acertos = respostas.filter((resposta, index) => 
      resposta === testeData.teste.perguntas[index].resposta_correta
    ).length
    
    const resultado = getNivelDescricao(acertos)
    const pontuacao = Math.round((acertos / testeData.teste.perguntas.length) * 100)

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
            <h1 className="text-2xl font-bold text-gray-900">Resultado do Teste</h1>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Nível {resultado.nivel} - {resultado.desc}
            </h2>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">{pontuacao}%</div>
              <p className="text-gray-600">
                Você acertou {acertos} de {testeData.teste.perguntas.length} perguntas
              </p>
            </div>

            {/* Plano Personalizado */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-center">
                <Target className="w-5 h-5 mr-2" />
                Seu Plano Personalizado de 14 Dias
              </h3>
              <p className="text-gray-700 mb-4">{resultado.plano}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="font-medium text-blue-600">Foco Principal</div>
                  <div className="text-gray-600">
                    {resultado.nivel === 'A1' ? 'Vocabulário Essencial' : 
                     resultado.nivel === 'A2' ? 'Estruturas do Dia a Dia' : 
                     'Conversação Fluente'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="font-medium text-green-600">Meta Diária</div>
                  <div className="text-gray-600">30-35 exercícios</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="font-medium text-purple-600">Objetivo Final</div>
                  <div className="text-gray-600">
                    {resultado.nivel === 'A1' ? 'Alcançar A2' : 
                     resultado.nivel === 'A2' ? 'Alcançar B1' : 
                     'Aperfeiçoar B1'}
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback do Poliglota */}
            <div className="bg-gradient-to-r from-green-50 to-red-50 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-4">
                <img 
                  src="/images/giulia.png" 
                  alt="Professora Giulia" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-2">Feedback da Professora Giulia:</h4>
                  <p className="text-gray-700">
                    {resultado.nivel === 'A1' && 
                      "Ottimo! Você tem uma base sólida para começar. Foque nos cumprimentos, verbos essere/avere e vocabulário essencial. Com dedicação diária, você alcançará o A2 rapidamente!"
                    }
                    {resultado.nivel === 'A2' && 
                      "Bravo! Você já domina o básico. Agora é hora de expandir seu vocabulário e praticar conversações do dia a dia. O nível B1 está ao seu alcance!"
                    }
                    {resultado.nivel === 'B1' && 
                      "Complimenti! Você tem um nível intermediário excelente. Foque na conversação fluente e estruturas mais complexas. Você está no caminho certo para a fluência!"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/aprendizado-diario')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Começar Lições Diárias
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Voltar ao Menu
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
              <h1 className="text-2xl font-bold text-gray-900">{testeData.teste.titulo}</h1>
              <p className="text-gray-600">{testeData.teste.descricao}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Pergunta</div>
            <div className="text-2xl font-bold text-purple-600">
              {perguntaAtual + 1}/{testeData.teste.perguntas.length}
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso do Teste</span>
            <span>{Math.round(progresso)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        {/* Pergunta */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Nível {pergunta.nivel}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {pergunta.pergunta}
            </h2>
          </div>

          {/* Opções */}
          <div className="space-y-3">
            {pergunta.opcoes.map((opcao, index) => (
              <button
                key={index}
                onClick={() => !mostrarExplicacao && handleResposta(index)}
                disabled={mostrarExplicacao}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  mostrarExplicacao
                    ? index === pergunta.resposta_correta
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : index === respostaSelecionada && index !== pergunta.resposta_correta
                      ? 'bg-red-50 border-red-300 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opcao}</span>
                  {mostrarExplicacao && (
                    <div>
                      {index === pergunta.resposta_correta && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                      {index === respostaSelecionada && index !== pergunta.resposta_correta && (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explicação */}
          {mostrarExplicacao && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Explicação:</h4>
              <p className="text-blue-800">{pergunta.explicacao}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
