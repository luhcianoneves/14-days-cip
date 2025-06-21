import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Headphones, Play, ExternalLink, Clock, Star, Music, Video, Mic, RefreshCw } from 'lucide-react'

interface Podcast {
  id: string
  titulo: string
  descricao: string
  nivel: string
  url: string
  duracao: string
  categoria: string
  atualizado: string
}

interface VideoCanal {
  id: string
  titulo: string
  descricao: string
  nivel: string
  url: string
  categoria: string
  canal: string
  atualizado: string
}

interface Musica {
  id: string
  artista: string
  titulo: string
  descricao: string
  nivel: string
  genero: string
  url: string
  letra_disponivel: boolean
}

interface MateriaisData {
  podcasts: Podcast[]
  videos: VideoCanal[]
  musicas: Musica[]
  atualizacoes: {
    ultima_atualizacao: string
    proxima_atualizacao: string
    frequencia: string
    novos_conteudos: number
  }
}

export default function MateriaisExtras() {
  const navigate = useNavigate()
  const [materiaisData, setMateriaisData] = useState<MateriaisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoriaAtiva, setCategoriaAtiva] = useState<'podcasts' | 'videos' | 'musicas'>('podcasts')
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')

  useEffect(() => {
    fetch('/data/materiais-extras.json')
      .then(res => res.json())
      .then(data => {
        setMateriaisData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erro ao carregar materiais:', error)
        setLoading(false)
      })
  }, [])

  const simularAtualizacao = () => {
    setLoading(true)
    // Simular busca por novos conteúdos
    setTimeout(() => {
      setLoading(false)
      // Simular que encontrou novos materiais
      alert('3 novos conteúdos adicionados! 🎉')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando materiais extras...</p>
        </div>
      </div>
    )
  }

  if (!materiaisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar materiais. Tente novamente.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'podcasts', label: 'Podcasts', icon: Mic, count: materiaisData.podcasts.length },
    { key: 'videos', label: 'Vídeos', icon: Video, count: materiaisData.videos.length },
    { key: 'musicas', label: 'Músicas', icon: Music, count: materiaisData.musicas.length }
  ]

  const getNivelColor = (nivel: string) => {
    if (nivel.includes('A1')) return 'bg-green-100 text-green-800'
    if (nivel.includes('A2')) return 'bg-blue-100 text-blue-800'
    if (nivel.includes('B1')) return 'bg-purple-100 text-purple-800'
    if (nivel.includes('B2')) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  const filtrarPorNivel = (items: any[]) => {
    if (filtroNivel === 'todos') return items
    return items.filter(item => item.nivel.includes(filtroNivel))
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
                <Headphones className="w-8 h-8 mr-3 text-teal-600" />
                Materiais Extras
              </h1>
              <p className="text-gray-600">Conteúdo complementar para acelerar seu aprendizado</p>
            </div>
          </div>
          <button
            onClick={simularAtualizacao}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-medium flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Atualizar
          </button>
        </div>

        {/* Status de Atualização */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Status de Atualizações</h3>
              <p className="text-sm text-gray-600">
                Última atualização: {new Date(materiaisData.atualizacoes.ultima_atualizacao).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">
                Próxima atualização: {new Date(materiaisData.atualizacoes.proxima_atualizacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">{materiaisData.atualizacoes.novos_conteudos}</div>
              <div className="text-sm text-gray-600">Novos conteúdos</div>
              <div className="text-xs text-gray-500">A cada {materiaisData.atualizacoes.frequencia}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCategoriaAtiva(tab.key as any)}
                className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-colors ${
                  categoriaAtiva === tab.key
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filtro de Nível */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filtrar por nível:</span>
              <div className="flex space-x-2">
                {['todos', 'A1', 'A2', 'B1', 'B2'].map((nivel) => (
                  <button
                    key={nivel}
                    onClick={() => setFiltroNivel(nivel)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filtroNivel === nivel
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {nivel === 'todos' ? 'Todos' : nivel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="p-6">
            {categoriaAtiva === 'podcasts' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Podcasts Recomendados</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filtrarPorNivel(materiaisData.podcasts).map((podcast) => (
                    <div key={podcast.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{podcast.titulo}</h4>
                          <p className="text-sm text-gray-600 mb-3">{podcast.descricao}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelColor(podcast.nivel)}`}>
                          {podcast.nivel}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {podcast.duracao}
                        </div>
                        <div className="flex items-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {podcast.categoria}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.open(podcast.url, '_blank')}
                          className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Ouvir Podcast
                        </button>
                        <button
                          onClick={() => window.open(podcast.url, '_blank')}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {categoriaAtiva === 'videos' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Canais do YouTube</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filtrarPorNivel(materiaisData.videos).map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{video.titulo}</h4>
                          <p className="text-sm text-blue-600 mb-2">Canal: {video.canal}</p>
                          <p className="text-sm text-gray-600 mb-3">{video.descricao}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelColor(video.nivel)}`}>
                          {video.nivel}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {video.categoria}
                        </span>
                        <span className="text-xs text-gray-500">
                          Atualizado em {new Date(video.atualizado).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.open(video.url, '_blank')}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Assistir no YouTube
                        </button>
                        <button
                          onClick={() => window.open(video.url, '_blank')}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {categoriaAtiva === 'musicas' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Músicas Italianas</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filtrarPorNivel(materiaisData.musicas).map((musica) => (
                    <div key={musica.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">"{musica.titulo}"</h4>
                          <p className="text-sm text-purple-600 mb-2">por {musica.artista}</p>
                          <p className="text-sm text-gray-600 mb-3">{musica.descricao}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelColor(musica.nivel)}`}>
                          {musica.nivel}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {musica.genero}
                        </span>
                        {musica.letra_disponivel && (
                          <div className="flex items-center text-green-600">
                            <Star className="w-4 h-4 mr-1" />
                            <span className="text-xs">Letra disponível</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.open(musica.url, '_blank')}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                        >
                          <Music className="w-4 h-4 mr-2" />
                          Ouvir Música
                        </button>
                        <button
                          onClick={() => window.open(musica.url, '_blank')}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dicas de Uso */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Dicas para Aproveitar os Materiais Extras
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-teal-600 mb-2">📡 Podcasts</div>
              <div className="text-gray-700">
                Comece com episódios curtos e aumente gradualmente. Ouça durante atividades rotineiras.
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-red-600 mb-2">📺 Vídeos</div>
              <div className="text-gray-700">
                Use legendas em italiano quando disponível. Anote palavras novas que aparecem.
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-medium text-purple-600 mb-2">🎵 Músicas</div>
              <div className="text-gray-700">
                Leia a letra enquanto ouve. Cante junto para praticar pronúncia e ritmo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
