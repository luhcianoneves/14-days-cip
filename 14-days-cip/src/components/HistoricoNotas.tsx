import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ArrowLeft, TrendingUp, Calendar, Trophy, Clock, Target, BarChart3, BookOpen, MessageCircle, Headphones, Edit } from 'lucide-react'

export default function HistoricoNotas() {
  const navigate = useNavigate()
  const { state } = useAppContext()
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'leitura' | 'escrita' | 'compreensao' | 'fala'>('todos')

  // Dados simulados para demonstração se não houver histórico real
  const historicoDemo = state.historico.length === 0 ? [
    {
      data: '2025-06-20',
      dia: 1,
      pontuacao: 85,
      nivel: 'A1',
      exerciciosCorretos: 17,
      totalExercicios: 20,
      tempoGasto: 25
    },
    {
      data: '2025-06-21',
      dia: 2,
      pontuacao: 92,
      nivel: 'A1',
      exerciciosCorretos: 23,
      totalExercicios: 25,
      tempoGasto: 30
    },
    {
      data: '2025-06-22',
      dia: 3,
      pontuacao: 78,
      nivel: 'A2',
      exerciciosCorretos: 19,
      totalExercicios: 25,
      tempoGasto: 35
    }
  ] : state.historico

  const estatisticasGerais = {
    mediaPontuacao: Math.round(historicoDemo.reduce((acc, h) => acc + h.pontuacao, 0) / historicoDemo.length),
    totalExercicios: historicoDemo.reduce((acc, h) => acc + h.totalExercicios, 0),
    totalCorretos: historicoDemo.reduce((acc, h) => acc + h.exerciciosCorretos, 0),
    tempoTotal: historicoDemo.reduce((acc, h) => acc + h.tempoGasto, 0),
    melhorPontuacao: Math.max(...historicoDemo.map(h => h.pontuacao)),
    diasConsecutivos: state.userProgress.streakAtual
  }

  const evolucaoPorCategoria = {
    leitura: [75, 80, 85, 88, 92],
    escrita: [70, 75, 82, 85, 89],
    compreensao: [80, 83, 87, 90, 94],
    fala: [65, 70, 75, 80, 85]
  }

  const nivelProgresso = {
    A1: { completo: 100, atual: 'A2' },
    A2: { completo: 75, atual: 'B1' },
    B1: { completo: 0, atual: 'B1' }
  }

  const estatisticasCards = [
    {
      titulo: 'Média Geral',
      valor: `${estatisticasGerais.mediaPontuacao}%`,
      subtitulo: 'Pontuação média',
      icon: Target,
      cor: 'bg-blue-500',
      trend: '+5%'
    },
    {
      titulo: 'Exercícios',
      valor: estatisticasGerais.totalCorretos,
      subtitulo: `de ${estatisticasGerais.totalExercicios} corretos`,
      icon: BookOpen,
      cor: 'bg-green-500',
      trend: `${Math.round((estatisticasGerais.totalCorretos / estatisticasGerais.totalExercicios) * 100)}%`
    },
    {
      titulo: 'Tempo Total',
      valor: `${Math.floor(estatisticasGerais.tempoTotal / 60)}h ${estatisticasGerais.tempoTotal % 60}min`,
      subtitulo: 'Tempo estudado',
      icon: Clock,
      cor: 'bg-purple-500',
      trend: 'Ótimo!'
    },
    {
      titulo: 'Melhor Nota',
      valor: `${estatisticasGerais.melhorPontuacao}%`,
      subtitulo: 'Sua melhor pontuação',
      icon: Trophy,
      cor: 'bg-orange-500',
      trend: 'Recorde!'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
              <h1 className="text-2xl font-bold text-gray-900">Histórico de Notas</h1>
              <p className="text-gray-600">Acompanhe sua evolução no aprendizado de italiano</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Nível Atual</div>
            <div className="text-2xl font-bold text-blue-600">{state.userProgress.nivel}</div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estatisticasCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.cor} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-medium">{card.trend}</div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{card.valor}</div>
                <div className="text-sm text-gray-600">{card.subtitulo}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progresso de Nível */}
        <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Progressão de Níveis
          </h3>
          <div className="space-y-4">
            {Object.entries(nivelProgresso).map(([nivel, dados]) => (
              <div key={nivel} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-700">{nivel}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{dados.completo}% completo</span>
                    <span>Próximo: {dados.atual}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        dados.completo === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${dados.completo}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evolução por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-6 border mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Evolução por Habilidade
            </h3>
            <div className="flex space-x-2">
              {[
                { key: 'todos', label: 'Todos', icon: Target },
                { key: 'leitura', label: 'Leitura', icon: BookOpen },
                { key: 'escrita', label: 'Escrita', icon: Edit },
                { key: 'compreensao', label: 'Compreensão', icon: Headphones },
                { key: 'fala', label: 'Fala', icon: MessageCircle }
              ].map((filtro) => (
                <button
                  key={filtro.key}
                  onClick={() => setFiltroAtivo(filtro.key as any)}
                  className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors ${
                    filtroAtivo === filtro.key
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <filtro.icon className="w-4 h-4 mr-1" />
                  {filtro.label}
                </button>
              ))}
            </div>
          </div>

          {filtroAtivo === 'todos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(evolucaoPorCategoria).map(([categoria, pontuacoes]) => (
                <div key={categoria} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">{categoria}</h4>
                  <div className="space-y-2">
                    {pontuacoes.map((pontuacao, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Dia {index + 1}</span>
                        <span className="font-medium text-gray-900">{pontuacao}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Média:</span>
                      <span className="font-medium text-blue-600">
                        {Math.round(pontuacoes.reduce((a, b) => a + b, 0) / pontuacoes.length)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4 capitalize">{filtroAtivo}</h4>
              <div className="grid grid-cols-5 gap-4">
                {evolucaoPorCategoria[filtroAtivo as keyof typeof evolucaoPorCategoria]?.map((pontuacao, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white rounded-lg p-3 mb-2">
                      <div className="text-2xl font-bold text-blue-600">{pontuacao}%</div>
                      <div className="text-xs text-gray-600">Dia {index + 1}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${pontuacao}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Histórico Detalhado */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Histórico Detalhado
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pontuação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nível
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acertos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tempo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historicoDemo.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Dia {item.dia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          item.pontuacao >= 80 ? 'text-green-600' :
                          item.pontuacao >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {item.pontuacao}%
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              item.pontuacao >= 80 ? 'bg-green-500' :
                              item.pontuacao >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.pontuacao}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.nivel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.exerciciosCorretos}/{item.totalExercicios}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.tempoGasto}min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo da Evolução */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-red-50 rounded-lg p-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            Resumo da sua Evolução
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-blue-600 mb-1">Leitura</div>
              <div className="text-gray-900">Excelente compreensão de textos</div>
              <div className="text-gray-600">Continue com artigos complexos</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-green-600 mb-1">Escrita</div>
              <div className="text-gray-900">Boa estruturação de frases</div>
              <div className="text-gray-600">Pratique mais conectivos</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-purple-600 mb-1">Fala</div>
              <div className="text-gray-900">Progresso constante</div>
              <div className="text-gray-600">Foque na pronúncia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
