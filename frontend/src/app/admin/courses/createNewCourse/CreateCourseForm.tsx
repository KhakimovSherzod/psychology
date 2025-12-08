'use client'

import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import * as tus from 'tus-js-client'

const FIXED_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
const FIXED_VIDEO_ID_FOR_THUMBNAIL = 'b4f2ecb1-3bef-4143-af59-a4a7ddc95f6e' // only for thumbnails
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

const CreateCourseForm = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadingVideo, setUploadingVideo] = useState<boolean>(false)

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploadingThumbnail, setUploadingThumbnail] = useState<boolean>(false)
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string | null>(null)

  // --- Select video ---
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setVideoFile(file)
  }

  // --- Select thumbnail ---
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setThumbnailFile(file)
  }

  // --- Get presigned URL from backend ---
  const getPresignedUploadInfo = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/videos/upload-url`, {
        withCredentials: true,
      })
      return data.tusUpload
    } catch (err) {
      console.error('Failed to get presigned upload info:', err)
      return null
    }
  }

  // --- Upload video via TUS ---
  const uploadVideo = async (file: File) => {
    const uploadInfo = await getPresignedUploadInfo()
    if (!uploadInfo) return

    setUploadingVideo(true)
    setUploadProgress(0)

    const upload = new tus.Upload(file, {
      endpoint: uploadInfo.uploadUrl,
      headers: uploadInfo.headers,
      metadata: { filetype: file.type, title: file.name },
      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 1000, 3000, 5000],
      onError(err) {
        console.error('Video upload failed:', err)
        setUploadingVideo(false)
      },
      onProgress(bytesUploaded, bytesTotal) {
        setUploadProgress(Math.floor((bytesUploaded / bytesTotal) * 100))
      },
      onSuccess() {
        console.log('Video upload finished!')
        setUploadingVideo(false)
      },
    })

    upload.findPreviousUploads().then(previous => {
      if (previous.length) upload.resumeFromPreviousUpload(previous[0])
      upload.start()
    })
  }

  const handleUploadVideo = async () => {
    if (!videoFile) return alert('Please select a video first!')
    await uploadVideo(videoFile)
  }

  // --- Upload thumbnail ---
  const handleUploadThumbnail = async () => {
    if (!thumbnailFile) return alert('Select a thumbnail file!')

    setUploadingThumbnail(true)
    const formData = new FormData()
    formData.append('thumbnail', thumbnailFile)
    formData.append('libraryId', FIXED_LIBRARY_ID!)
    formData.append('videoId', FIXED_VIDEO_ID_FOR_THUMBNAIL)

    try {
      const { data } = await axios.post(`${backendUrl}/api/videos/upload-thumbnail`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      console.log('Thumbnail uploaded:', data)
      setUploadedThumbnailUrl(
        `https://vz-${FIXED_LIBRARY_ID}.b-cdn.net/${FIXED_VIDEO_ID_FOR_THUMBNAIL}/thumbnail.jpg`
      )
    } catch (err) {
      console.error('Thumbnail upload error:', err)
      alert('Failed to upload thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  return (
    <div className='p-4'>
      <h1>Upload Video & Thumbnail</h1>

      {/* Video Upload */}
      <input type='file' accept='video/*' onChange={handleVideoSelect} />
      <button
        onClick={handleUploadVideo}
        disabled={!videoFile || uploadingVideo}
        className='mt-2 p-2 bg-blue-500 text-white rounded disabled:opacity-50'
      >
        {uploadingVideo ? `Uploading Video ${uploadProgress}%` : 'Upload Video'}
      </button>

      <hr className='my-4' />

      {/* Thumbnail Upload */}
      <h2>Upload Thumbnail (fixed video)</h2>
      <input type='file' accept='image/*' onChange={handleThumbnailSelect} />
      <button
        onClick={handleUploadThumbnail}
        disabled={!thumbnailFile || uploadingThumbnail}
        className='mt-2 p-2 bg-purple-500 text-white rounded disabled:opacity-50'
      >
        {uploadingThumbnail ? 'Uploading Thumbnail...' : 'Upload Thumbnail'}
      </button>

      {/* Preview Selected Thumbnail */}
      {thumbnailFile && (
        <div className='mt-3'>
          <h3>Preview:</h3>
          <Image
            src={URL.createObjectURL(thumbnailFile)}
            alt='Thumbnail preview'
            width={320}
            height={180}
            className='border rounded'
          />
        </div>
      )}

      {/* Uploaded Thumbnail from Bunny */}
      {uploadedThumbnailUrl && (
        <div className='mt-4'>
          <h3>Uploaded Thumbnail:</h3>
          <Image
            src={uploadedThumbnailUrl}
            alt='Bunny thumbnail'
            width={320}
            height={180}
            className='border rounded'
            unoptimized
          />
        </div>
      )}
    </div>
  )
}

export default CreateCourseForm
