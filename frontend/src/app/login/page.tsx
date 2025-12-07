'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const LoginPage = () => {
  const router = useRouter()
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [step, setStep] = useState<'phone' | 'pin'>('phone')
  const [phone, setPhone] = useState('')
  const [rawPhone, setRawPhone] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if deviceId exists in localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDeviceId = localStorage.getItem('deviceId')

      if (storedDeviceId) {
        setDeviceId(storedDeviceId)
        setStep('pin')
      } else {
        setStep('phone')
      }
    }
  }, [])

  // Simple phone formatting - preserve the + sign
  const formatPhone = useCallback((value: string) => {
    setPhone(value)
    // Keep the + sign and digits for rawPhone
    const cleaned = value.replace(/[^\d+]/g, '')
    setRawPhone(cleaned)
    setError('')
  }, [])

  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      setError('Iltimos, telefon raqamingizni kiriting')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Generate deviceId when user submits phone number
      let currentDeviceId = localStorage.getItem('deviceId')
      if (!currentDeviceId) {
        currentDeviceId = uuidv4()
        localStorage.setItem('deviceId', currentDeviceId)
        setDeviceId(currentDeviceId)
      }

      setStep('pin')
    } catch (err) {
      console.error(err)
      setError('Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  // Enhanced PIN handlers
  const addPinDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4) return
      const newPin = pin + digit
      setPin(newPin)

      if (newPin.length === 4) {
        submitPin(newPin)
      }
    },
    [pin]
  )

  const deleteDigit = useCallback(() => {
    setPin(prev => prev.slice(0, -1))
    setError('')
  }, [])

  const clearPin = useCallback(() => {
    setPin('')
    setError('')
  }, [])

  const submitPin = async (pinCode: string) => {
    if (pinCode.length !== 4) {
      setError("PIN kod 4 raqamdan iborat bo'lishi kerak")
      return
    }

    setLoading(true)
    setError('')

    try {
      const currentDeviceId = localStorage.getItem('deviceId')

      if (!currentDeviceId) {
        setError("Device ID topilmadi. Iltimos, qaytadan urinib ko'ring.")
        setPin('')
        return
      }

      const requestData = {
        phone: rawPhone, 
        deviceId: currentDeviceId,
        pin: pinCode,
      }

      console.log('Sending login request:', requestData)

      const res = await fetch('http://localhost:3001/public/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!res.ok) {
        setError("PIN kod noto'g'ri")
        console.error('Login failed:', await res.text())
        setPin('')
        return
      }


      router.push('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      const message = err instanceof Error ? err.message : 'Login qilishda xatolik yuz berdi'
      setError(message)
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  // Handle keyboard input for PIN
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (step !== 'pin') return

      if (e.key >= '0' && e.key <= '9') {
        addPinDigit(e.key)
      } else if (e.key === 'Backspace') {
        deleteDigit()
      } else if (e.key === 'Escape') {
        clearPin()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [step, addPinDigit, deleteDigit, clearPin])

  // Handle Enter key for phone submission
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (step === 'phone' && e.key === 'Enter' && phone.trim()) {
        handlePhoneSubmit()
      }
    }

    window.addEventListener('keydown', handleEnterKey)
    return () => window.removeEventListener('keydown', handleEnterKey)
  }, [step, phone])

  const renderPhoneStep = () => (
    <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
          <span className='text-2xl text-white'>📱</span>
        </div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Telefon raqam bilan kirish</h1>
        <p className='text-gray-600'>Hisobingizga kirish uchun telefon raqamingizni kiriting</p>
      </div>

      <div className='space-y-6'>
        <div>
          <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
            Telefon raqamingiz
          </label>
          <input
            id='phone'
            type='text'
            value={phone}
            placeholder='+998 99 999 99 99'
            onChange={e => formatPhone(e.target.value)}
            className='w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
            disabled={loading}
            autoComplete='tel'
          />
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <p className='text-red-700 text-sm text-center'>{error}</p>
          </div>
        )}

        <button
          onClick={handlePhoneSubmit}
          disabled={loading || !phone.trim()}
          className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <div className='flex items-center justify-center'>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
              Tekshirilmoqda...
            </div>
          ) : (
            'Davom etish'
          )}
        </button>
      </div>
    </div>
  )

  const renderPinStep = () => (
    <div className='w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 relative'>
      <div className='text-center mb-8'>
        <div className='w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
          <span className='text-2xl text-white'>🔒</span>
        </div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>PIN kodni kiriting</h1>
        <p className='text-gray-600'>
          {deviceId
            ? `${phone || 'Telefon raqamingiz'} uchun PIN kodni kiriting`
            : `${phone || 'Telefon raqamingiz'} uchun PIN kodni kiriting`}
        </p>
      </div>

      {/* PIN Display */}
      <div className='flex justify-center mb-8'>
        <div className='flex gap-4'>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                pin.length > i ? 'bg-blue-600 border-blue-600 scale-110' : 'border-gray-300'
              }`}
            >
              {pin.length > i && <div className='w-2 h-2 bg-white rounded-full'></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-6'>
          <p className='text-red-700 text-sm text-center'>{error}</p>
        </div>
      )}

      {/* Number Keypad */}
      <div className='grid grid-cols-3 gap-3'>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => addPinDigit(String(num))}
            disabled={loading || pin.length >= 4}
            className='aspect-square bg-white border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'
          >
            {num}
          </button>
        ))}

        {/* Clear Button */}
        <button
          onClick={clearPin}
          disabled={loading}
          className='aspect-square bg-gray-100 border-2 border-gray-200 rounded-xl text-lg font-semibold text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          🗑️
        </button>

        {/* Zero Button */}
        <button
          onClick={() => addPinDigit('0')}
          disabled={loading || pin.length >= 4}
          className='aspect-square bg-white border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'
        >
          0
        </button>

        {/* Delete Button */}
        <button
          onClick={deleteDigit}
          disabled={loading || pin.length === 0}
          className='aspect-square bg-gray-100 border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          ⌫
        </button>
      </div>

      {/* Back to Phone - Only show if this is a new login */}
      {!deviceId && (
        <button
          onClick={() => {
            setStep('phone')
            setError('')
            setPin('')
          }}
          className='w-full mt-6 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 py-2'
        >
          ← Telefon raqamni o&apos;zgartirish
        </button>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className='absolute inset-0 bg-white bg-opacity-80 rounded-2xl flex items-center justify-center'>
          <div className='flex items-center space-x-2'>
            <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-gray-700'>Tekshirilmoqda...</span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      {step === 'phone' ? renderPhoneStep() : renderPinStep()}
    </div>
  )
}

export default LoginPage
