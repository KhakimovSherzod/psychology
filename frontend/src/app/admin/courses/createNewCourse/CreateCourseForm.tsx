'use client'
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'

type Category = {
  id: string
  name: string
  description: string
}

type Playlist = {
  id: string
  title: string
  description: string
  playlistThumbnailUrl: string
  createdAt: Date
  updatedAt: Date
}

interface CreateCourseFormProps {
  categories: Category[]
  playlists: Playlist[]
}

const CreateCourseForm = ({ categories, playlists }: CreateCourseFormProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  // SELECT FILE
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    setFile(selectedFile || null)
    console.log('Selected file:', selectedFile)
  }

  // FETCH VIDEO ID FROM BACKEND
  async function getVideoId() {
    try {
      const { data } = await axios.get(`${backendUrl}/api/videos/upload-url`, {
        withCredentials: true,
      })
      console.log('Video ID:', data)
      return data.uploadUrl.videoId
    } catch (error) {
      console.error('Error fetching video ID:', error)
      return null
    }
  }

  // UPLOAD VIDEO TO BUNNY
  async function uploadVideo(videoId: string, file: File) {
    try {
      const response = await axios.put(
        `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
        file,
        {
          headers: {
            AccessKey: apiKey,
            'Content-Type': 'application/octet-stream',
          },
        }
      )

      console.log('Video uploaded successfully:', response.data)
    } catch (error) {
      console.error('Error uploading video:', error)
    }
  }

  // MAIN HANDLE UPLOAD
  async function handleUploadVideo() {
    if (!file) {
      return alert('Please select a file first!')
    }

    const videoId = await getVideoId()
    if (!videoId) return
    setVideoId(videoId)
    await uploadVideo(videoId, file)
  }

  return (
    <div>
      {/* FILE SELECT */}
      <input type='file' accept='video/*' onChange={handleFileSelect} />

      {/* UPLOAD BUTTON */}
      <button onClick={handleUploadVideo}>Upload Video</button>
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`}
        loading='lazy'
        allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
        allowFullScreen={true}
      ></iframe>
      <div>
        <h2>thumbnails</h2>
        <Image
          src={`https://vz-645cd866-41b.b-cdn.net/e6e19d12-570d-4380-af7b-c3d145e979bb/thumbnail.jpg`}
          alt='thumbnail'
          loading='lazy'
          width={320}
          height={180}
        />
      </div>
    </div>
  )
}

export default CreateCourseForm
