'use client'

import axios from 'axios'
import { TrendingUp, PlayCircle, ListVideo, BarChart3, Grid3x3, X, ExternalLink, Filter, Search, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import AnalistList from './components/AnalistList'

// ---------- Types ----------
interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'file'
  duration: string
  content?: string
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  price: number
  discountPrice: number | null
  category: string
  status: 'draft' | 'published'
  enrolledStudents: number
  thumbnail: string | null
  promoVideo: string | null
  lastUpdated: string
  modules: Module[]
}

interface Playlist {
  uuid: string
  title: string
  description?: string
  playlistThumbnailUrl: string
  videoCount?: number
}

interface Video {
  uuid: string
  title: string
  playbackUrl: string
  videoThumbnailUrl?: string
  duration?: string
  description?: string
  publishedAt?: string
}

interface CoursesManagementProps {
  playlists: Playlist[]
  initialCourses: Course[]
  categories: string[]
  stats: {
    totalCourses: number
    publishedCourses: number
    draftCourses: number
    totalStudents: number
    totalRevenue: number
  }
}

// ---------- Environment Variable ----------
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

// ---------- Component ----------
export default function CoursesManagement({
  playlists,
  initialCourses,
  categories,
  stats,
}: CoursesManagementProps) {
  const [activeTab, setActiveTab] = useState<'playlists' | 'analytics' | 'videos'>('playlists')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>(playlists)

  // Filter playlists based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlaylists(playlists)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = playlists.filter(playlist =>
      playlist.title.toLowerCase().includes(query) ||
      playlist.description?.toLowerCase().includes(query)
    )
    setFilteredPlaylists(filtered)
  }, [searchQuery, playlists])

  // Fetch videos when user clicks a playlist
  const fetchVideos = useCallback(async (playlistUuid: string) => {
    setLoading(true)
    try {
      const res = await axios.get(`${backendUrl}/api/playlist/${playlistUuid}`)
      setVideos(res.data.videos || res.data) // Handle both formats
      setActiveTab('videos')
    } catch (err) {
      console.error('Error fetching videos:', err)
      alert('Videolarni olishda xatolik yuz berdi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedPlaylist) {
      fetchVideos(selectedPlaylist.uuid)
    }
  }, [selectedPlaylist, fetchVideos])

  // Handle tab change
  const handleTabChange = (tab: 'playlists' | 'analytics' | 'videos') => {
    setActiveTab(tab)
    if (tab !== 'videos') {
      setSelectedPlaylist(null)
      setVideos([])
    }
  }

  // Handle playlist selection
  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setSearchQuery('')
  }

  // Handle video play
  const handlePlayVideo = (video: Video) => {
    setPlayingVideo(video)
    setShowVideoModal(true)
  }

  // Sync YouTube handler
  const handleSyncYouTube = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/videos/sync-youtube-videos`,
        {},
        { withCredentials: true }
      )
      alert(
        `YouTube dan ${res.data.videos} ta video va ${res.data.playlists} ta playlist sinxronlandi.`
      )
      window.location.reload()
    } catch (err) {
      console.error('Sync error:', err)
      alert('YouTube bilan sinxronlashda xatolik yuz berdi.')
    }
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null
  }

  // Render video player
  const renderVideoPlayer = () => {
    if (!playingVideo || !playingVideo.playbackUrl) return null
    
    const videoId = getYouTubeVideoId(playingVideo.playbackUrl)
    
    if (videoId) {
      return (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={playingVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      )
    }
    
    // Fallback to direct video playback
    return (
      <video
        controls
        autoPlay
        className="w-full h-auto max-h-[70vh] rounded-lg"
        src={playingVideo.playbackUrl}
      >
        Your browser does not support the video tag.
      </video>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Kurslar Boshqaruvi</h1>
        <p className="text-gray-600">Playlistlar, videolar va analitikalarni boshqaring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Jami Kurslar</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Grid3x3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.publishedCourses} nashr etilgan</span>
            <span className="mx-2">•</span>
            <span className="text-yellow-600 font-medium">{stats.draftCourses} qoralama</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">O'quvchilar</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ListVideo className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Daromad</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Playlistlar</p>
              <p className="text-2xl font-bold text-gray-800">{playlists.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <PlayCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between px-6 pt-4">
            <div className="flex space-x-1 mb-4 md:mb-0">
              <button
                onClick={() => handleTabChange('playlists')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'playlists'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ListVideo size={18} />
                  Playlistlar ({playlists.length})
                </div>
              </button>
              <button
                onClick={() => handleTabChange('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} />
                  Analitika
                </div>
              </button>
              {selectedPlaylist && (
                <button
                  onClick={() => handleTabChange('videos')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'videos'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle size={18} />
                    Videolar ({videos.length})
                  </div>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              {activeTab === 'playlists' && (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'
                      }`}
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'
                      }`}
                  >
                    <ListVideo size={18} />
                  </button>
                </div>
              )}

              {/* Sync Button */}
              <button
                onClick={handleSyncYouTube}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                <TrendingUp size={18} />
                YouTube bilan Sinxronlash
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {(activeTab === 'playlists' || activeTab === 'videos') && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`${activeTab === 'playlists' ? 'Playlistlarni qidirish...' : 'Videolarni qidirish...'
                    }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6">
          {/* Playlists View */}
          {activeTab === 'playlists' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredPlaylists.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-yellow-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <ListVideo className="w-10 h-10 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {searchQuery ? 'Natija topilmadi' : 'Playlistlar mavjud emas'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery
                        ? '"' + searchQuery + '" bo\'yicha playlist topilmadi'
                        : 'Hozircha hech qanday playlist yaratilmagan.'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={handleSyncYouTube}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <TrendingUp size={18} />
                        YouTube'dan playlist yuklash
                      </button>
                    )}
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPlaylists.map((playlist) => (
                    <div
                      key={playlist.uuid}
                      onClick={() => handlePlaylistSelect(playlist)}
                      className="group cursor-pointer border border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={playlist.playlistThumbnailUrl || '/placeholder-playlist.jpg'}
                          alt={playlist.title}
                          width={400}
                          height={225}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium bg-black/50 px-2 py-1 rounded">
                              {playlist.videoCount || 0} video
                            </span>
                            <ExternalLink size={16} />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {playlist.title}
                        </h3>
                        {playlist.description && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {playlist.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            ID: {playlist.uuid.substring(0, 8)}...
                          </span>
                          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                            Ko'rish →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-3">
                  {filteredPlaylists.map((playlist) => (
                    <div
                      key={playlist.uuid}
                      onClick={() => handlePlaylistSelect(playlist)}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                    >
                      <div className="relative flex-shrink-0">
                        <Image
                          src={playlist.playlistThumbnailUrl || '/placeholder-playlist.jpg'}
                          alt={playlist.title}
                          width={80}
                          height={60}
                          className="w-20 h-16 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded flex items-center justify-center">
                          <ExternalLink size={16} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 group-hover:text-blue-600 truncate">
                          {playlist.title}
                        </h3>
                        {playlist.description && (
                          <p className="text-gray-600 text-sm truncate">
                            {playlist.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {playlist.videoCount || 0} video
                        </span>
                        <span className="text-xs text-gray-400">
                          ID: {playlist.uuid.substring(0, 6)}...
                        </span>
                        <button className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          O'tish →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <AnalistList initialCourses={initialCourses} categories={categories} stats={stats} />
          )}

          {/* Videos View */}
          {activeTab === 'videos' && selectedPlaylist && (
            <div>
              {/* Playlist Header */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => setActiveTab('playlists')}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        ← Orqaga
                      </button>
                      <h2 className="text-xl font-bold text-gray-800">{selectedPlaylist.title}</h2>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {videos.length} ta video
                      </span>
                    </div>
                    {selectedPlaylist.description && (
                      <p className="text-gray-600">{selectedPlaylist.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Playlist ID:</span>
                    <code className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {selectedPlaylist.uuid}
                    </code>
                  </div>
                </div>
              </div>

              {/* Videos Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Videolar yuklanmoqda...</span>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <PlayCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Videolar topilmadi
                    </h3>
                    <p className="text-gray-600">
                      Bu playlistda hozircha videolar mavjud emas.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <div
                      key={video.uuid}
                      className="group border border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={video.videoThumbnailUrl || '/placeholder-video.jpg'}
                          alt={video.title}
                          width={400}
                          height={225}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <button
                          onClick={() => handlePlayVideo(video)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <PlayCircle className="w-8 h-8 text-white" fill="white" />
                          </div>
                        </button>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {video.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            ID: {video.uuid.substring(0, 8)}...
                          </span>
                          <button
                            onClick={() => handlePlayVideo(video)}
                            className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1"
                          >
                            <PlayCircle size={14} />
                            Ko'rish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && playingVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {playingVideo.title}
              </h3>
              <button
                onClick={() => {
                  setShowVideoModal(false)
                  setPlayingVideo(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {renderVideoPlayer()}
              <div className="mt-6">
                {playingVideo.description && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Tavsif</h4>
                    <p className="text-gray-600">{playingVideo.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Video ID:</span>
                    <p className="font-mono text-gray-700 truncate">{playingVideo.uuid}</p>
                  </div>
                  {playingVideo.publishedAt && (
                    <div>
                      <span className="text-gray-500">Chop etilgan:</span>
                      <p className="text-gray-700">
                        {new Date(playingVideo.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <a
                  href={playingVideo.playbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Asl manzilda ochish
                </a>
                <button
                  onClick={() => {
                    setShowVideoModal(false)
                    setPlayingVideo(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}