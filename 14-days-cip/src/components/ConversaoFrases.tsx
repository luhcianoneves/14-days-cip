import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ArrowLeft, Languages, Volume2, Copy, Save, Lightbulb, CheckCircle } from 'lucide-react'

interface Traducao {
  frase_pt: string
  frase_it: string
  explicacao: string
  dificuldade: 'Fácil' | 'Médio' | 'Difícil'
  categoria: string
  dicas_gramaticais: string[]
  exemplo_uso: string
}

export default function ConversaoFrases() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  
  const [frasePortugues, setFrasePortugues] = useState('')
  const [traducaoAtual, setTraducaoAtual] = useState<Traducao | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [fraseSalva, setFraseSalva] = useState(false)
  const [historicoBusca, setHistoricoBusca] = useState<Traducao[]>([])

  // Simulador de IA para tradução
  const simularTraducaoIA = async (frase: string): Promise<Traducao> => {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Base de traduções pré-definidas para demonstração
    const traducoesPredefinidas: { [key: string]: Traducao } = {
      'como você está': {
        frase_pt: 'Como você está?',
        frase_it: 'Come stai?',
        explicacao: 'Pergunta informal comum. "Come" significa "como", "stai" é a segunda pessoa singular do verbo "stare" (estar).',
        dificuldade: 'Fácil',
        categoria: 'Cumprimentos',
        dicas_gramaticais: [
          'Use "come sta?" para formal',
          '"Stare" vs "essere": stare para estados temporários',
          'Pronúncia: /ko-me STAI/'
        ],
        exemplo_uso: 'Ciao Marco, come stai oggi? (Oi Marco, como você está hoje?)'
      },
      'eu quero comer pizza': {
        frase_pt: 'Eu quero comer pizza',
        frase_it: 'Voglio mangiare la pizza',
        explicacao: '"Voglio" é primeira pessoa do verbo "volere" (querer). "Mangiare" é infinitivo de "comer". Note o artigo "la" antes de "pizza".',
        dificuldade: 'Médio',
        categoria: 'Alimentação',
        dicas_gramaticais: [
          'Voglio + infinitivo para expressar desejos',
          'Pizza em italiano leva artigo definido',
          'Ordem: sujeito + verbo + objeto'
        ],
        exemplo_uso: 'Stasera voglio mangiare la pizza napoletana. (Hoje à noite quero comer pizza napolitana.)'
      },
      'onde fica a estação': {
        frase_pt: 'Onde fica a estação?',
        frase_it: 'Dove si trova la stazione?',
        explicacao: '"Dove" significa "onde". "Si trova" é forma reflexiva de "trovare" para localização. "La stazione" é "a estação".',
        dificuldade: 'Médio',
        categoria: 'Direções',
        dicas_gramaticais: [
          '"Dove si trova" para perguntar localização',
          'Alternativa: "Dov\'è la stazione?"',
          'Stazione é feminino: la stazione'
        ],
        exemplo_uso: 'Scusi, dove si trova la stazione centrale? (Com licença, onde fica a estação central?)'
      }
    }

    const fraseNormalizada = frase.toLowerCase().trim()
    
    // Buscar tradução pré-definida ou gerar uma genérica
    if (traducoesPredefinidas[fraseNormalizada]) {
      return traducoesPredefinidas[fraseNormalizada]
    }

    // Tradução genérica para frases não pré-definidas
    return {
      frase_pt: frase,
      frase_it: `[Tradução de: "${frase}"]`,
      explicacao: `Esta é uma tradução automática da frase "${frase}". Para uma tradução mais precisa, tente usar frases mais simples ou específicas.`,
      dificuldade: 'Médio',
      categoria: 'Geral',
      dicas_gramaticais: [
        'Considere o contexto da situação',
        'Verifique a concordância de gênero e número',
        'Preste atenção à ordem das palavras'
      ],
      exemplo_uso: 'Pratique esta frase em diferentes contextos para melhor compreensão.'
    }
  }

  const traduzirFrase = async () => {
    if (!frasePortugues.trim()) return

    setCarregando(true)
    setFraseSalva(false)
    
    try {
      const traducao = await simularTraducaoIA(frasePortugues)
      setTraducaoAtual(traducao)
      
      // Adicionar ao histórico
      setHistoricoBusca(prev => [traducao, ...prev.slice(0, 4)])
    } catch (error) {
      console.error('Erro na tradução:', error)
    } finally {
      setCarregando(false)
    }
  }

  const salvarFrase = () => {
    if (!traducaoAtual) return

    const novaFrase = {
      id: Date.now().toString(),
      pt: traducaoAtual.frase_pt,
      it: traducaoAtual.frase_it,
      explicacao: traducaoAtual.explicacao,
      categoria: traducaoAtual.categoria,
      dataSalva: new Date().toISOString()
    }

    dispatch({ type: 'ADD_FRASE_SALVA', payload: novaFrase })
    setFraseSalva(true)
  }

  const reproduzirAudio = (texto: string) => {
    // Simular reprodução de áudio
    console.log(`Reproduzindo: ${texto}`)
  }

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto)
  }

  const frasesExemplo = [
    'Como você está?',
    'Eu quero comer pizza',
    'Onde fica a estação?',
    'Quanto custa isso?',
    'Posso ter a conta, por favor?',
    'Que horas são?',
    'Eu gosto muito de música italiana',
    'Vamos ao cinema hoje à noite'
  ]

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Languages className="w-8 h-8 mr-3 text-blue-600" />
              Conversão de Frases
            </h1>
            <p className="text-gray-600">Traduza frases do português para italiano com explicações detalhadas</p>
          </div>
        </div>

        {/* Input Principal */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Digite sua frase em português:
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={frasePortugues}
              onChange={(e) => setFrasePortugues(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && traduzirFrase()}
              placeholder="Ex: Como você está?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={traduzirFrase}
              disabled={carregando || !frasePortugues.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 min-w-[120px]"
            >
              {carregando ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                'Traduzir'
              )}
            </button>
          </div>
        </div>

        {/* Frases de Exemplo */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frases de Exemplo:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {frasesExemplo.map((frase, index) => (
              <button
                key={index}
                onClick={() => setFrasePortugues(frase)}
                className="text-left p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm"
              >
                {frase}
              </button>
            ))}
          </div>
        </div>

        {/* Resultado da Tradução */}
        {traducaoAtual && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Resultado da Tradução</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  traducaoAtual.dificuldade === 'Fácil' ? 'bg-green-100 text-green-800' :
                  traducaoAtual.dificuldade === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {traducaoAtual.dificuldade}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {traducaoAtual.categoria}
                </span>
              </div>
            </div>

            {/* Frases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Português:</h4>
                <p className="text-lg text-gray-800 mb-3">{traducaoAtual.frase_pt}</p>
                <button
                  onClick={() => copiarTexto(traducaoAtual.frase_pt)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar
                </button>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Italiano:</h4>
                <p className="text-lg font-semibold text-gray-800 mb-3">{traducaoAtual.frase_it}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => reproduzirAudio(traducaoAtual.frase_it)}
                    className="flex items-center text-sm text-green-600 hover:text-green-700"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Ouvir
                  </button>
                  <button
                    onClick={() => copiarTexto(traducaoAtual.frase_it)}
                    className="flex items-center text-sm text-green-600 hover:text-green-700"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            {/* Explicação */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Explicação Detalhada:
              </h4>
              <p className="text-gray-700 leading-relaxed">{traducaoAtual.explicacao}</p>
            </div>

            {/* Dicas Gramaticais */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Dicas Gramaticais:</h4>
              <ul className="space-y-2">
                {traducaoAtual.dicas_gramaticais.map((dica, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    {dica}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exemplo de Uso */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Exemplo de Uso:</h4>
              <p className="text-gray-700 italic">{traducaoAtual.exemplo_uso}</p>
            </div>

            {/* Ações */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={salvarFrase}
                disabled={fraseSalva}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  fraseSalva
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                }`}
              >
                {fraseSalva ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Salva no Caderno
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar no Caderno
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/caderno')}
                className="bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Ver Caderno
              </button>
            </div>
          </div>
        )}

        {/* Histórico de Buscas */}
        {historicoBusca.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Recente:</h3>
            <div className="space-y-3">
              {historicoBusca.map((traducao, index) => (
                <button
                  key={index}
                  onClick={() => setTraducaoAtual(traducao)}
                  className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{traducao.frase_pt}</p>
                      <p className="text-sm text-gray-600">{traducao.frase_it}</p>
                    </div>
                    <span className="text-xs text-gray-500">{traducao.categoria}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
