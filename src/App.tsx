import { useState } from 'react'
import { VideoUploader } from './components/VideoUploader'
import type { VideoFile } from './types'

function App() {
  const [video, setVideo] = useState<VideoFile | null>(null)

  const handleVideoLoaded = (loaded: VideoFile) => {
    console.log(loaded)
    setVideo(loaded)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="p-6">
        <h1 className="text-2xl font-bold">👻 GhostReel</h1>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <VideoUploader onVideoLoaded={handleVideoLoaded} />
        {video && (
          <p className="mt-6 text-center text-sm text-zinc-500">
            Video cargado: {video.name}
          </p>
        )}
      </main>
    </div>
  )
}

export default App
