import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { 
  BookOpen, 
  MessageCircle, 
  Trophy, 
  BarChart3, 
  Languages, 
  Bookmark, 
  Headphones,
  Calendar,
  Star,
  Flag,
  Clock,
  Target
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { state } = useAppContext()

  const mainButtons = [
    {
      title: 'Aprendizado Diário',
      description: 'Rounds de ~30 exercícios',
      icon: BookOpen,
      route: '/aprendizado-diario',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      subtext: 'Exercícios baseados em repetição espaçada'
    },
    {
      title: 'Treinar Conversação',
      description: 'Simulação WhatsApp',
      icon: MessageCircle,
      route: '/conversacao',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      subtext: 'Converse com personagens italianos'
    },
    {
      title: 'Teste de Nivelamento',
      description: 'Inicial e refazer',
      icon: Trophy,
      route: '/teste-nivelamento',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      subtext: state.userProgress.testeNivelamentoFeito ? 'Refazer teste' : 'Descobrir seu nível'
    },
    {
      title: 'Histórico de Notas',
      description: 'Evolução dia a dia',
      icon: BarChart3,
      route: '/historico',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      subtext: 'Acompanhe seu progresso'
    },
    {
      title: 'Conversão de Frases',
      description: 'Português → Italiano',
      icon: Languages,
      route: '/conversao-frases',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      subtext: 'Traduza com explicações detalhadas'
    },
    {
      title: 'Caderno de Leitura',
      description: 'Frases salvas',
      icon: Bookmark,
      route: '/caderno',
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      subtext: 'Suas frases favoritas organizadas'
    },
    {
      title: 'Materiais Extras',
      description: 'Podcasts, vídeos',
      icon: Headphones,
      route: '/materiais-extras',
      color: 'bg-gradient-to-r from-teal-500 to-teal-600',
      subtext: 'Conteúdo complementar atualizado'
    }
  ]

  const statsCards = [
    {
      label: 'Nível Atual',
      value: state.userProgress.nivel,
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Dias Completados',
      value: `${state.userProgress.diasCompletados.length}/14`,
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      label: 'Exercícios Feitos',
      value: state.userProgress.exerciciosFeitos,
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      label: 'Streak Atual',
      value: `${state.userProgress.streakAtual} dias`,
      icon: Star,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-white to-red-500 rounded-full flex items-center justify-center">
                <Flag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-gray-800 to-red-600 bg-clip-text text-transparent">
                  14 DAYS - CIP
                </h1>
                <p className="text-gray-600 text-sm">Aprendizado de Italiano Intensivo</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Última atividade: {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <div className="flex items-start space-x-4">
            <img 
              src="/images/giulia.png" 
              alt="Giulia" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Ciao! Bem-vindo ao seu curso de italiano! 🇮🇹
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {!state.userProgress.testeNivelamentoFeito 
                  ? 'Comece fazendo o teste de nivelamento para descobrir seu nível atual e receber um plano personalizado de 14 dias!'
                  : `Você está no nível ${state.userProgress.nivel}! Continue com suas lições diárias para alcançar a fluência em italiano.`
                }
              </p>
              {!state.userProgress.testeNivelamentoFeito && (
                <button
                  onClick={() => navigate('/teste-nivelamento')}
                  className="mt-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Fazer Teste de Nivelamento
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => navigate(button.route)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-left border hover:border-gray-200 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className={`${button.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                  <button.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                    {button.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{button.description}</p>
                  <p className="text-xs text-gray-500">{button.subtext}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-red-50 rounded-xl p-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Dica do Dia
          </h3>
          <p className="text-gray-700">
            <strong>Tecnica Pareto 80/20:</strong> Foque nos 20% do idioma que geram 80% da compreensão. 
            Nosso curso é baseado nas palavras e estruturas mais frequentes do italiano!
          </p>
        </div>
      </div>
    </div>
  )
}
