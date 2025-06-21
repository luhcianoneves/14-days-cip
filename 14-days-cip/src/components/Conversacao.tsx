import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ArrowLeft, Send, Mic, Volume2, Users, MessageCircle, Star } from 'lucide-react'

interface Personagem {
  id: string
  nome: string
  descricao: string
  personalidade: string
  voz: 'masculina' | 'feminina'
  avatar: string
}

interface Mensagem {
  id: string
  remetente: 'user' | string
  tipo: 'texto' | 'audio'
  conteudo: string
  traducao?: string
  audio?: string
  timestamp: number
}

interface Cenario {
  id: string
  titulo: string
  nivel: string
  descricao: string
  personagem_sugerido: string
  mensagens_iniciais: any[]
  respostas_sugeridas: any[]
}

interface DialogosData {
  personagens: Personagem[]
  cenarios: Cenario[]
  feedback_tipos: any[]
}

export default function Conversacao() {
  const navigate = useNavigate()
  const { state } = useAppContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [dialogosData, setDialogosData] = useState<DialogosData | null>(null)
  const [personagemSelecionado, setPersonagemSelecionado] = useState<Personagem | null>(null)
  const [cenarioSelecionado, setCenarioSelecionado] = useState<Cenario | null>(null)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [mensagemAtual, setMensagemAtual] = useState('')
  const [loading, setLoading] = useState(true)
  const [conversaAtiva, setConversaAtiva] = useState(false)
  const [gravandoAudio, setGravandoAudio] = useState(false)
  const [mostrarFeedback, setMostrarFeedback] = useState(false)
  const [feedbackConversa, setFeedbackConversa] = useState<any>(null)

  useEffect(() => {
    fetch('/data/dialogos.json')
      .then(res => res.json())
      .then(data => {
        setDialogosData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erro ao carregar diálogos:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const iniciarConversa = (personagem: Personagem, cenario: Cenario) => {
    setPersonagemSelecionado(personagem)
    setCenarioSelecionado(cenario)
    setConversaAtiva(true)
    
    // Adicionar mensagens iniciais do cenário
    const mensagensIniciais: Mensagem[] = cenario.mensagens_iniciais.map((msg, index) => ({
      id: `inicial_${index}`,
      remetente: msg.remetente,
      tipo: msg.tipo,
      conteudo: msg.conteudo,
      traducao: msg.traducao,
      audio: msg.audio,
      timestamp: Date.now() + index * 1000
    }))
    
    setMensagens(mensagensIniciais)
  }

  const enviarMensagem = (conteudo: string, tipo: 'texto' | 'audio' = 'texto') => {
    if (!conteudo.trim()) return

    const novaMensagem: Mensagem = {
      id: `user_${Date.now()}`,
      remetente: 'user',
      tipo,
      conteudo,
      timestamp: Date.now()
    }

    setMensagens(prev => [...prev, novaMensagem])
    setMensagemAtual('')

    // Simular resposta do personagem após 2-3 segundos
    setTimeout(() => {
      gerarRespostaPersonagem(conteudo)
    }, 2000 + Math.random() * 1000)
  }

  const gerarRespostaPersonagem = (mensagemUser: string) => {
    if (!personagemSelecionado || !cenarioSelecionado) return

    // Simular diferentes tipos de resposta baseado no contexto
    const respostas = [
      {
        conteudo: "Perfetto! Continua così, stai parlando molto bene!",
        traducao: "Perfeito! Continue assim, você está falando muito bem!"
      },
      {
        conteudo: "Interessante! Dimmi di più su questo argomento.",
        traducao: "Interessante! Me fale mais sobre este assunto."
      },
      {
        conteudo: "Bene! Ho capito. E tu, cosa ne pensi?",
        traducao: "Bem! Entendi. E você, o que acha?"
      },
      {
        conteudo: "Non è male! Piccolo errore di grammatica, ma il messaggio è chiaro.",
        traducao: "Não está mal! Pequeno erro de gramática, mas a mensagem está clara."
      }
    ]

    const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)]

    const novaRespostaPersonagem: Mensagem = {
      id: `${personagemSelecionado.id}_${Date.now()}`,
      remetente: personagemSelecionado.id,
      tipo: 'texto',
      conteudo: respostaAleatoria.conteudo,
      traducao: respostaAleatoria.traducao,
      audio: 'resposta_audio.mp3',
      timestamp: Date.now()
    }

    setMensagens(prev => [...prev, novaRespostaPersonagem])
  }

  const reproduzirAudio = (audioFile?: string) => {
    if (!audioFile) return
    // Simular reprodução de áudio
    console.log(`Reproduzindo: ${audioFile}`)
  }

  const simularGravacaoAudio = () => {
    setGravandoAudio(true)
    
    setTimeout(() => {
      setGravandoAudio(false)
      enviarMensagem('*Mensagem de áudio*', 'audio')
    }, 3000)
  }

  const encerrarConversa = () => {
    // Gerar feedback da conversa
    const feedback = {
      pontuacao: Math.floor(Math.random() * 40) + 60, // 60-100
      mensagensEnviadas: mensagens.filter(m => m.remetente === 'user').length,
      duracaoMinutos: Math.floor(Math.random() * 10) + 5,
      pontosFortes: ['Vocabulário', 'Fluência', 'Gramática'],
      melhorias: ['Pronúncia', 'Conectivos']
    }
    
    setFeedbackConversa(feedback)
    setMostrarFeedback(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conversação...</p>
        </div>
      </div>
    )
  }

  if (!dialogosData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar conversação. Tente novamente.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  if (mostrarFeedback && feedbackConversa) {
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
            <h1 className="text-2xl font-bold text-gray-900">Feedback da Conversação</h1>
          </div>

          {/* Feedback Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Conversação Concluída!
              </h2>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {feedbackConversa.pontuacao}%
                </div>
                <p className="text-gray-600">
                  {feedbackConversa.mensagensEnviadas} mensagens em {feedbackConversa.duracaoMinutos} minutos
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {feedbackConversa.mensagensEnviadas}
                </div>
                <div className="text-sm text-gray-600">Mensagens Enviadas</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {feedbackConversa.duracaoMinutos}min
                </div>
                <div className="text-sm text-gray-600">Duração</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {Math.floor(feedbackConversa.pontuacao / 20)}
                </div>
                <div className="text-sm text-gray-600">Estrelas</div>
              </div>
            </div>

            {/* Feedback do Personagem */}
            <div className="bg-gradient-to-r from-green-50 to-red-50 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-4">
                <img 
                  src={personagemSelecionado?.avatar || '/images/giulia.png'} 
                  alt={personagemSelecionado?.nome} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Feedback de {personagemSelecionado?.nome}:
                  </h4>
                  <p className="text-gray-700 mb-3">
                    "Complimenti! La tua conversazione è stata molto naturale. Continua a praticare e migliorerai ancora di più!"
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    "Parabéns! Sua conversação foi muito natural. Continue praticando e melhorará ainda mais!"
                  </p>
                  <button
                    onClick={() => reproduzirAudio('feedback_conversation.mp3')}
                    className="mt-2 flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Ouvir feedback em italiano
                  </button>
                </div>
              </div>
            </div>

            {/* Pontos Fortes e Melhorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {feedbackConversa.pontosFortes.map((ponto: string, index: number) => (
                    <li key={index} className="flex items-center text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-3">
                  Áreas para Melhorar
                </h4>
                <ul className="space-y-2">
                  {feedbackConversa.melhorias.map((melhoria: string, index: number) => (
                    <li key={index} className="flex items-center text-orange-800">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      {melhoria}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setMostrarFeedback(false)
                  setConversaAtiva(false)
                  setMensagens([])
                  setPersonagemSelecionado(null)
                  setCenarioSelecionado(null)
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
              >
                Nova Conversação
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

  if (conversaAtiva && personagemSelecionado && cenarioSelecionado) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header estilo WhatsApp */}
        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setConversaAtiva(false)
                setMensagens([])
              }}
              className="p-1 rounded-full hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img 
              src={personagemSelecionado.avatar} 
              alt={personagemSelecionado.nome}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{personagemSelecionado.nome}</h3>
              <p className="text-sm text-green-100">Online</p>
            </div>
          </div>
          <button
            onClick={encerrarConversa}
            className="bg-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-800 transition-colors"
          >
            Encerrar
          </button>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mensagens.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`flex ${mensagem.remetente === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                mensagem.remetente === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-900 border'
              }`}>
                <p className="mb-1">{mensagem.conteudo}</p>
                {mensagem.traducao && mensagem.remetente !== 'user' && (
                  <p className="text-xs text-gray-500 italic mt-1">
                    {mensagem.traducao}
                  </p>
                )}
                {mensagem.audio && mensagem.remetente !== 'user' && (
                  <button
                    onClick={() => reproduzirAudio(mensagem.audio)}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-700 mt-1"
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    Ouvir
                  </button>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {new Date(mensagem.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Mensagem */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={mensagemAtual}
              onChange={(e) => setMensagemAtual(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensagem(mensagemAtual)}
              placeholder="Digite sua mensagem em italiano..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={simularGravacaoAudio}
              disabled={gravandoAudio}
              className={`p-2 rounded-lg transition-colors ${
                gravandoAudio 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className={`w-5 h-5 ${gravandoAudio ? 'animate-pulse' : ''}`} />
            </button>
            <button
              onClick={() => enviarMensagem(mensagemAtual)}
              disabled={!mensagemAtual.trim()}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Respostas Sugeridas */}
          {cenarioSelecionado.respostas_sugeridas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {cenarioSelecionado.respostas_sugeridas.map((resposta, index) => (
                <button
                  key={index}
                  onClick={() => enviarMensagem(resposta.texto)}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  {resposta.texto}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Treinar Conversação</h1>
            <p className="text-gray-600">Pratique italiano conversando com nativos virtuais</p>
          </div>
        </div>

        {/* Personagens */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Escolha seu Parceiro de Conversação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dialogosData.personagens.map((personagem) => (
              <div
                key={personagem.id}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={personagem.avatar} 
                    alt={personagem.nome}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{personagem.nome}</h3>
                    <p className="text-sm text-gray-600">{personagem.descricao}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">{personagem.personalidade}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Voz {personagem.voz}
                  </span>
                  <button
                    onClick={() => setPersonagemSelecionado(personagem)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Selecionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cenários */}
        {personagemSelecionado && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Escolha um Cenário para Conversar com {personagemSelecionado.nome}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dialogosData.cenarios.map((cenario) => (
                <div
                  key={cenario.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{cenario.titulo}</h3>
                      <p className="text-sm text-gray-600 mb-3">{cenario.descricao}</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {cenario.nivel}
                    </span>
                  </div>
                  <button
                    onClick={() => iniciarConversa(personagemSelecionado, cenario)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                  >
                    Iniciar Conversa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
