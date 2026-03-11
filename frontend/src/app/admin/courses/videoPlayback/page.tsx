'use client'

import { useEffect, useState } from 'react'

type VideoResponse = {
  playbackUrl: string
}

export default function Page() {
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          'http://localhost:3001/api/videos/a3e2027e-f865-4ba3-b41a-2365233170bc/play',
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (!res.ok) {
          throw new Error('Failed to load video')
        }

        const data: VideoResponse = await res.json()
        setPlaybackUrl(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [])

  if (loading) return <p>Loading video…</p>
  if (error) return <p>Error: {error}</p>
  console.log('playbackUrl:', playbackUrl)

  return <iframe src={playbackUrl!} width='600px' height='600px' style={{ border: 'none' }} />
}
