'use client' // Next 13 app directory

import { useState } from 'react'
import { Upload } from 'tus-js-client'

export default function Page() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setProgress(0)
      setMessage('')
    }
  }

  const startUpload = async () => {
    if (!file) {
      alert('Please select a video file first.')
      return
    }

    setUploading(true)

    try {
      // 1️⃣ Fetch TUS upload data from backend
      const res = await fetch('http://localhost:3001/api/videos/admin/upload-url', {
        method: 'GET', // HTTP method
        credentials: 'include', // send cookies (if needed)
      })

      if (!res.ok) throw new Error('Failed to get TUS data from backend')
 
      const data = await res.json()
       console.log(data)
      const tusData = data.tusUpload

      // 2️⃣ Initialize TUS upload
      const upload = new Upload(file, {
        endpoint: tusData.uploadUrl, // Bunny TUS endpoint
        headers: {
          AuthorizationSignature: tusData.headers.AuthorizationSignature,
          AuthorizationExpire: tusData.headers.AuthorizationExpire,
          LibraryId: tusData.headers.LibraryId,
          VideoId: tusData.headers.VideoId,
        },
        chunkSize: 5 * 1024 * 1024, // 5MB chunks
        onError: err => {
          console.error('Upload failed:', err)
          setMessage('Upload failed: ' + err)
          setUploading(false)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = (bytesUploaded / bytesTotal) * 100
          setProgress(percentage)
        },
        onSuccess: () => {
          setMessage('Upload complete! Video ID: ' + data.videoId)
          setUploading(false)
        },
      })

      // 3️⃣ Start the upload
      upload.start()
    } catch (err) {
      console.error(err)
      setMessage('Error: ' + err)
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Video to Bunny (TUS)</h1>

      <input type='file' accept='video/*' onChange={handleFileChange} disabled={uploading} />

      {file && (
        <div style={{ marginTop: '1rem' }}>
          <p>Selected file: {file.name}</p>
          <button onClick={startUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Start Upload'}
          </button>
        </div>
      )}

      {uploading && (
        <div style={{ marginTop: '1rem' }}>
          <progress value={progress} max={100}></progress>
          <p>{progress.toFixed(2)}%</p>
        </div>
      )}

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      <div ><iframe src="https://player.mediadelivery.net/embed/617185/95c08977-186c-4cc3-9518-cc21e8620375?token=57ce18370cd2224d54dc993962f1fa43fca17724b5a2acb090401056f939c8d4&expires=1773571333&autoplay=true&loop=false&muted=false&preload=true&responsive=true" loading="lazy"  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"></iframe></div>
    </div>
  )
}
