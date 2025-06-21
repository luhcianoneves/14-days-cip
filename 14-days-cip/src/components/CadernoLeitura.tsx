import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ArrowLeft, Bookmark, Download, Search, Trash2, Volume2, Filter, FileText, Calendar, Tag } from 'lucide-react'

export default function CadernoLeitura() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState<'data' | 'categoria' | 'alfabetica'>('data')

  // Frases demo se não houver frases salvas
  const frasesDemo = state.frasesSalvas.length === 0 ? [
    {
      id: '1',
      pt: 'Como você está?',
      it: 'Come stai?',
      explicacao: '"Come" significa "como", "stai" é a segunda pessoa singular do verbo "stare".',
      categoria: 'Cumprimentos',
      dataSalva: '2025-06-20T10:30:00.000Z'
    },
    {
      id: '2',
      pt: 'Eu quero comer pizza',
      it: 'Voglio mangiare la pizza',
      explicacao: '"Voglio" é primeira pessoa do verbo "volere" (querer). Note o artigo "la" antes de "pizza".',
      categoria: 'Alimentação',
      dataSalva: '2025-06-21T15:45:00.000Z'
    },
    {
      id: '3',
      pt: 'Onde fica a estação?',
      it: 'Dove si trova la stazione?',
      explicacao: '"Dove" significa "onde". "Si trova" é forma reflexiva para localização.',
      categoria: 'Direções',
      dataSalva: '2025-06-22T09:15:00.000Z'
    }
  ] : state.frasesSalvas

  const frasesFiltradas = frasesDemo
    .filter(frase => {
      const matchBusca = frase.pt.toLowerCase().includes(busca.toLowerCase()) ||
                       frase.it.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria = filtroCategoria === 'todos' || frase.categoria === filtroCategoria
      return matchBusca && matchCategoria
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'data':
          return new Date(b.dataSalva).getTime() - new Date(a.dataSalva).getTime()
        case 'categoria':
          return a.categoria.localeCompare(b.categoria)
        case 'alfabetica':
          return a.pt.localeCompare(b.pt)
        default:
          return 0
      }
    })

  const categorias = [...new Set(frasesDemo.map(f => f.categoria))]

  const removerFrase = (id: string) => {
    dispatch({ type: 'REMOVE_FRASE_SALVA', payload: id })
  }

  const reproduzirAudio = (texto: string) => {
    // Simular reprodução de áudio
    console.log(`Reproduzindo: ${texto}`)
  }

  const gerarPDF = () => {
    // Simular geração de PDF
    const conteudoPDF = frasesFiltradas.map(frase => 
      `${frase.pt}\n${frase.it}\n${frase.explicacao}\n\n`
    ).join('')
    
    const blob = new Blob([conteudoPDF], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'caderno-italiano.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const estatisticas = {
    totalFrases: frasesDemo.length,
    categorias: categorias.length,
    ultimaAtualizacao: frasesDemo.length > 0 ? 
      Math.max(...frasesDemo.map(f => new Date(f.dataSalva).getTime())) : 0
  }

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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bookmark className="w-8 h-8 mr-3 text-pink-600" />
                Caderno de Leitura
              </h1>
              <p className="text-gray-600">Suas frases favoritas organizadas para estudo</p>
            </div>
          </div>
          <button
            onClick={gerarPDF}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-medium flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Gerar PDF
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Frases</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalFrases}</p>
              </div>
              <FileText className="w-8 h-8 text-pink-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.categorias}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Última Atualização</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estatisticas.ultimaAtualizacao ? 
                    new Date(estatisticas.ultimaAtualizacao).toLocaleDateString('pt-BR') : 
                    'Hoje'
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar frases..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Categoria */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="todos">Todas as categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="data">Mais recentes</option>
              <option value="categoria">Por categoria</option>
              <option value="alfabetica">Ordem alfabética</option>
            </select>
          </div>
        </div>

        {/* Lista de Frases */}
        {frasesFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma frase encontrada</h3>
            <p className="text-gray-600 mb-6">
              {busca || filtroCategoria !== 'todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece salvando frases do conversor para criar seu caderno personalizado'
              }
            </p>
            <button
              onClick={() => navigate('/conversao-frases')}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              Traduzir Frases
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {frasesFiltradas.map((frase) => (
              <div key={frase.id} className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {frase.categoria}
                      </span>
                      <span className="text-xs text-gray-500">
                        Salva em {new Date(frase.dataSalva).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removerFrase(frase.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Português */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Português:</h4>
                    <p className="text-lg text-gray-800">{frase.pt}</p>
                  </div>

                  {/* Italiano */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Italiano:</h4>
                    <p className="text-lg font-semibold text-gray-800 mb-3">{frase.it}</p>
                    <button
                      onClick={() => reproduzirAudio(frase.it)}
                      className="flex items-center text-sm text-green-600 hover:text-green-700"
                    >
                      <Volume2 className="w-4 h-4 mr-1" />
                      Ouvir pronúncia
                    </button>
                  </div>
                </div>

                {/* Explicação */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Explicação:</h4>
                  <p className="text-gray-700">{frase.explicacao}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo no final */}
        {frasesFiltradas.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-100">
            <h3 className="font-semibold text-gray-900 mb-3">Resumo do seu Caderno:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3">
                <div className="font-medium text-pink-600">Total de Frases</div>
                <div className="text-2xl font-bold text-gray-900">{frasesFiltradas.length}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-medium text-purple-600">Categoria Favorita</div>
                <div className="text-gray-900">
                  {categorias.length > 0 ? categorias[0] : 'Nenhuma'}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-medium text-blue-600">Progresso</div>
                <div className="text-gray-900">Muito bom!</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={gerarPDF}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Baixar Caderno Completo em PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
