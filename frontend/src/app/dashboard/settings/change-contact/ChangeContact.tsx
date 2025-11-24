'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ChangeContact = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const newContact = formData.get('contact') as string

      // Basic validation
      if (!newContact.trim()) {
        setError('Iltimos, telefon raqam kiriting')
        return
      }

      // Phone number validation (Uzbekistan format)
      const phoneRegex = /^\+998[0-9]{9}$/
      if (!phoneRegex.test(newContact)) {
        setError("Iltimos, to'g'ri telefon raqam kiriting (+998901234567)")
        return
      }

      console.log('Yangi kontakt:', newContact)

      // Make API request
      const response = await fetch('http://localhost:3001/api/users/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // send cookies
        body: JSON.stringify({ phone: newContact }),
      })

      const data = await response.json()

      if (response.ok) {
        // HTTP 2xx → success
        setSuccess(data.message || 'Yangilandi')
        setTimeout(() => {
          router.back()
          setTimeout(() => router.refresh(), 500)
        }, 2000)
      } else {
        // HTTP error status (400, 500, etc.)
        setError(data.message || "Noma'lum xatolik yuz berdi")
      }
    } catch (err) {
      // Network or unexpected error
      setError("Tarmoq xatosi yuz berdi. Iltimos, qaytadan urinib ko'ring.")
      console.error('Error changing contact:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = () => {
    // Clear errors when user starts typing
    if (error) setError(null)
  }

  return (
    <div className='min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='max-w-md mx-auto'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full'>
            <svg
              className='w-8 h-8 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
            </svg>
          </div>
          <h1 className='mb-2 text-2xl font-bold text-gray-800 md:text-3xl'>
            Telefon Raqamni Yangilash
          </h1>
          <p className='text-gray-600'>Yangi telefon raqamingizni kiriting</p>
        </div>

        {/* Main Form Card */}
        <div className='p-6 bg-white border border-gray-200 shadow-lg rounded-2xl md:p-8'>
          {/* Success Message */}
          {success && (
            <div className='flex items-start p-4 mb-6 border border-green-200 rounded-lg bg-green-50'>
              <div className='mr-3 text-lg text-green-500'>✅</div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-green-800'>{success}</p>
                <p className='mt-1 text-xs text-green-600'>Sahifa yangilanmoqda...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='flex items-start p-4 mb-6 border border-red-200 rounded-lg bg-red-50'>
              <div className='mr-3 text-lg text-red-500'>⚠️</div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-red-800'>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className='text-lg text-red-500 hover:text-red-700'
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Phone Input */}
            <div>
              <label htmlFor='contact' className='block mb-2 text-sm font-semibold text-gray-700'>
                Yangi Telefon Raqami *
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <span className='text-gray-500'>+998</span>
                </div>
                <input
                  type='tel'
                  id='contact'
                  name='contact'
                  required
                  pattern='\+998[0-9]{9}'
                  placeholder='901234567'
                  maxLength={13}
                  onChange={handleInputChange}
                  className='w-full py-3 pl-16 pr-4 placeholder-gray-400 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  disabled={isLoading}
                />
              </div>
              <p className='mt-2 text-xs text-gray-500'>Format: +998901234567</p>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <div className='w-5 h-5 mr-3 border-2 border-white rounded-full border-t-transparent animate-spin'></div>
                  Yangilanmoqda...
                </>
              ) : (
                <>
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Raqamni Yangilash
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              type='button'
              onClick={() => router.back()}
              disabled={isLoading}
              className='w-full px-4 py-3 font-semibold text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50'
            >
              Bekor Qilish
            </button>
          </form>
        </div>

        {/* Help Information */}
        <div className='p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50'>
          <h3 className='flex items-center mb-2 text-sm font-semibold text-blue-800'>
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            Ma&apos;lumot
          </h3>
          <ul className='space-y-1 text-xs text-blue-700'>
            <li>• Yangi raqam O&apos;zbekiston formatida bo&apos;lishi kerak</li>
            <li>• Raqam +998 bilan boshlanadi</li>
            <li>• Yangilangan raqam orqali tizimga kirishingiz mumkin</li>
          </ul>
        </div>

        {/* Features */}
        <div className='grid grid-cols-3 gap-4 mt-6 text-center'>
          <div className='p-3 border border-gray-200 rounded-lg bg-white/80'>
            <div className='mb-1 text-lg text-blue-500'>🔒</div>
            <p className='text-xs text-gray-600'>Xavfsiz</p>
          </div>
          <div className='p-3 border border-gray-200 rounded-lg bg-white/80'>
            <div className='mb-1 text-lg text-blue-500'>⚡</div>
            <p className='text-xs text-gray-600'>Tezkor</p>
          </div>
          <div className='p-3 border border-gray-200 rounded-lg bg-white/80'>
            <div className='mb-1 text-lg text-blue-500'>📱</div>
            <p className='text-xs text-gray-600'>Mobil</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangeContact
