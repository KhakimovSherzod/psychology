// 'use client'

// import ImageKit from 'imagekit-javascript'
// import Image from 'next/image'
// import { useRef, useState } from 'react'

// const imagekit = new ImageKit({
//   publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
//   urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
// })

// interface ImageKitAuthParams {
//   signature: string
//   expire: number
//   token: string
// }

// interface ImageKitUploadResult {
//   url: string
//   fileId: string
//   name: string
// }

// interface ImageKitUploadError {
//   message: string
// }

// export default function UpdateProfilePicture() {
//   const [selectedFile, setSelectedFile] = useState<string | null>(null)
//   const [uploading, setUploading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return

//     const file = e.target.files[0]
//     setError(null)
//     setSuccess(null)

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       setError('Faqat rasm fayllari qabul qilinadi')
//       return
//     }

//     // Validate file size (20MB)
//     if (file.size > 20 * 1024 * 1024) {
//       setError('Rasm hajmi 20MB dan oshmasligi kerak')
//       return
//     }

//     const reader = new FileReader()
//     reader.onload = event => {
//       if (event.target?.result) {
//         setSelectedFile(event.target.result as string)
//       }
//     }
//     reader.onerror = () => {
//       setError("Faylni o'qishda xatolik yuz berdi")
//     }
//     reader.readAsDataURL(file)
//   }

//   const uploadToImageKit = async (): Promise<string> => {
//     if (!selectedFile) throw new Error('Rasm tanlanmagan')

//     setUploading(true)
//     setError(null)
//     setSuccess(null)

//     try {
//       // Request auth params from backend
//       const res = await fetch('/api/image')
//       if (!res.ok) {
//         throw new Error('Auth parametrlarini olishda xatolik')
//       }

//       const authParams = (await res.json()) as ImageKitAuthParams

//       const uploadResult = await new Promise<ImageKitUploadResult>((resolve, reject) => {
//         imagekit.upload(
//           {
//             file: selectedFile,
//             fileName: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`,
//             ...authParams,
//           },
//           (err: ImageKitUploadError | null, result: ImageKitUploadResult | null) => {
//             if (err) {
//               reject(new Error(err.message))
//             } else if (result) {
//               resolve(result)
//             } else {
//               reject(new Error('Upload natijasi qaytarilmadi'))
//             }
//           }
//         )
//       })

//       setUploadedUrl(uploadResult.url)
//       return uploadResult.url
//     } catch (err: unknown) {
//       let errorMessage = 'Rasm yuklashda xatolik yuz berdi'
//       if (err instanceof Error) {
//         errorMessage = err.message
//       }
//       setError(errorMessage)
//       throw new Error(errorMessage)
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleSetProfilePicture = async () => {
//     if (!selectedFile) {
//       setError('Iltimos, avval rasm tanlang')
//       return
//     }

//     try {
//       const url = await uploadToImageKit()

//       // Update profile picture in backend
//       const response = await fetch('/api/user/update-image', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ profile_picture: url }),
//       })

//       const result = await response.json()

//       if (!response.ok || result.data?.status === 'error') {
//         const errorMessage = result.data?.message || 'Profil rasmini yangilashda xatolik yuz berdi'
//         throw new Error(errorMessage)
//       }

//       setSuccess('Profil rasmingiz muvaffaqiyatli yangilandi!')
//       setError(null)

//       // Auto-refresh after 2 seconds
//       setTimeout(() => {
//         window.location.reload()
//         window.location.href = '/settings'
//       }, 2000)
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message || 'Profil rasmini yangilashda xatolik yuz berdi')
//       } else {
//         setError("Profil rasmini yangilashda noma'lum xatolik yuz berdi")
//       }
//       setSuccess(null)
//     }
//   }

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()

//     const files = e.dataTransfer.files
//     if (files && files.length > 0) {
//       const file = files[0]
//       // Create a synthetic event for the file input
//       const dataTransfer = new DataTransfer()
//       dataTransfer.items.add(file)
//       if (fileInputRef.current) {
//         fileInputRef.current.files = dataTransfer.files
//         const event = new Event('change', { bubbles: true })
//         fileInputRef.current.dispatchEvent(event)
//       }
//     }
//   }

//   const triggerFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click()
//     }
//   }

//   const removeSelectedFile = () => {
//     setSelectedFile(null)
//     setError(null)
//     setSuccess(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   return (
//     <div className='flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
//       <div className='w-full max-w-md'>
//         {/* Header */}
//         <div className='mb-8 text-center'>
//           <h1 className='mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text'>
//             Profil Rasmini Yangilash
//           </h1>
//           <p className='text-gray-400'>Yangi profil rasmingizni yuklang</p>
//         </div>

//         {/* Main Card */}
//         <div className='p-6 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl border-white/20'>
//           {/* Error Alert */}
//           {error && (
//             <div className='flex items-center p-4 mb-6 border rounded-lg bg-red-500/20 border-red-500/50'>
//               <div className='mr-3 text-lg text-red-400'>⚠️</div>
//               <div className='flex-1'>
//                 <p className='text-sm font-medium text-red-300'>{error}</p>
//               </div>
//               <button
//                 onClick={() => setError(null)}
//                 className='text-lg text-red-400 hover:text-red-300'
//               >
//                 ×
//               </button>
//             </div>
//           )}

//           {/* Success Alert */}
//           {success && (
//             <div className='flex items-center p-4 mb-6 border rounded-lg bg-green-500/20 border-green-500/50'>
//               <div className='mr-3 text-lg text-green-400'>✅</div>
//               <div className='flex-1'>
//                 <p className='text-sm font-medium text-green-300'>{success}</p>
//                 <p className='mt-1 text-xs text-green-400'>Sahifa yangilanmoqda...</p>
//               </div>
//             </div>
//           )}

//           {/* File Upload Area */}
//           <div
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//             className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group ${
//               selectedFile
//                 ? 'border-green-500/50 bg-green-500/10'
//                 : 'border-gray-500/50 hover:border-purple-500/50 hover:bg-purple-500/10'
//             }`}
//             onClick={triggerFileInput}
//           >
//             <input
//               ref={fileInputRef}
//               type='file'
//               accept='image/*'
//               onChange={handleFileChange}
//               className='hidden'
//             />

//             {!selectedFile ? (
//               <>
//                 <div className='mb-4 text-5xl text-gray-400 transition-colors group-hover:text-purple-400'>
//                   📷
//                 </div>
//                 <p className='mb-2 font-medium text-gray-300'>
//                   Rasmni bu yerga torting yoki bosing
//                 </p>
//                 <p className='text-sm text-gray-500'>PNG, JPG, JPEG • Maksimum 20MB</p>
//               </>
//             ) : (
//               <div className='relative'>
//                 <div className='relative w-32 h-32 mx-auto mb-4'>
//                   <Image
//                     src={selectedFile}
//                     alt='Preview'
//                     fill
//                     className='object-cover border-4 rounded-full border-white/20'
//                   />
//                   <div className='absolute inset-0 flex items-center justify-center transition-opacity rounded-full opacity-0 bg-black/40 hover:opacity-100'>
//                     <button
//                       onClick={e => {
//                         e.stopPropagation()
//                         removeSelectedFile()
//                       }}
//                       className='p-2 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600'
//                     >
//                       🗑️
//                     </button>
//                   </div>
//                 </div>
//                 <p className='text-sm font-medium text-green-400'>Rasm tanlandi ✓</p>
//                 <p className='mt-1 text-xs text-gray-400'>Yangi rasm tanlash uchun bosing</p>
//               </div>
//             )}
//           </div>

//           {/* Upload Button */}
//           <button
//             onClick={handleSetProfilePicture}
//             disabled={uploading || !selectedFile}
//             className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center ${
//               uploading || !selectedFile
//                 ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105'
//             }`}
//           >
//             {uploading ? (
//               <>
//                 <div className='w-5 h-5 mr-3 border-2 border-white rounded-full border-t-transparent animate-spin'></div>
//                 Yuklanmoqda...
//               </>
//             ) : (
//               <>
//                 <span className='mr-2'>💾</span>
//                 Profil Rasmini Saqlash
//               </>
//             )}
//           </button>

//           {/* Upload Info */}
//           {uploadedUrl && (
//             <div className='p-3 mt-4 border rounded-lg bg-blue-500/20 border-blue-500/30'>
//               <p className='mb-1 text-xs font-medium text-blue-300'>Yuklangan URL:</p>
//               <p className='text-xs text-blue-400 break-all'>{uploadedUrl}</p>
//             </div>
//           )}

//           {/* Help Text */}
//           <div className='mt-6 text-center'>
//             <p className='text-sm text-gray-400'>
//               👆 Rasmni tortib olib keling yoki yuklash uchun bosing
//             </p>
//           </div>
//         </div>

//         {/* Features */}
//         <div className='grid grid-cols-3 gap-4 mt-6 text-center'>
//           <div className='p-3 rounded-lg bg-white/5'>
//             <div className='mb-1 text-lg'>🖼️</div>
//             <p className='text-xs text-gray-400'>Barcha formatlar</p>
//           </div>
//           <div className='p-3 rounded-lg bg-white/5'>
//             <div className='mb-1 text-lg'>⚡</div>
//             <p className='text-xs text-gray-400'>Tez yuklash</p>
//           </div>
//           <div className='p-3 rounded-lg bg-white/5'>
//             <div className='mb-1 text-lg'>🔒</div>
//             <p className='text-xs text-gray-400'>Xavfsiz</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
