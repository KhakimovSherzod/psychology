'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface DeviceInfo {
  deviceName: string
  deviceType: string
  os: string
  browser: string
  ipAddress: string
}

interface StoredDeviceInfo {
  deviceId: string
  deviceToken?: string
  lastUsed: number
  deviceName?: string
}

const LoginPage = () => {
  const router = useRouter()
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [deviceToken, setDeviceToken] = useState<string | null>(null)
  const [isNewDevice, setIsNewDevice] = useState(false)
  const [step, setStep] = useState<'phone' | 'pin'>('phone')
  const [phone, setPhone] = useState('')
  const [rawPhone, setRawPhone] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [deviceInfoLoaded, setDeviceInfoLoaded] = useState(false)

  //env variables
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is required but not defined in environment variables!')
  }

  // Detect device information
  useEffect(() => {
    const detectDeviceInfo = async () => {
      const info: DeviceInfo = {
        deviceName: 'Unknown Device',
        deviceType: 'Unknown',
        os: 'Unknown',
        browser: 'Unknown',
        ipAddress: 'Unknown',
      }

      // Detect browser and OS
      const userAgent = navigator.userAgent

      // Browser detection
      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        info.browser = 'Chrome'
      } else if (userAgent.includes('Firefox')) {
        info.browser = 'Firefox'
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        info.browser = 'Safari'
      } else if (userAgent.includes('Edg')) {
        info.browser = 'Edge'
      } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        info.browser = 'Opera'
      }

      // OS detection
      if (userAgent.includes('Windows')) {
        info.os = 'Windows'
      } else if (userAgent.includes('Mac')) {
        info.os = 'macOS'
      } else if (userAgent.includes('Linux')) {
        info.os = 'Linux'
      } else if (userAgent.includes('Android')) {
        info.os = 'Android'
      } else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) {
        info.os = 'iOS'
      }

      // Device type detection
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)

      if (isMobile) {
        info.deviceType = 'Mobile'
      } else if (isTablet) {
        info.deviceType = 'Tablet'
      } else {
        info.deviceType = 'Desktop'
      }

      // Try to get IP address
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        info.ipAddress = data.ip
      } catch (error) {
        console.log('Could not fetch IP address:', error)
        // Use a placeholder for local development
        info.ipAddress = '127.0.0.1'
      }

      // Try to get device name from various sources
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory
        info.deviceName = `${info.deviceType} (${memory}GB RAM)`
      } else {
        info.deviceName = `${info.deviceType} Device`
      }

      // Detect more specific device info if available
      if (navigator.platform) {
        info.deviceName = `${info.deviceType} - ${navigator.platform}`
      }

      setDeviceInfo(info)
      setDeviceInfoLoaded(true)
      console.log('Device info detected:', info)
    }

    detectDeviceInfo()
  }, [])

  // Check if deviceId exists in localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && deviceInfoLoaded) {
      const storedDeviceId = localStorage.getItem('deviceId')
      const storedDeviceToken = localStorage.getItem('deviceToken')
      const storedDeviceInfo = localStorage.getItem('deviceInfo')

      if (storedDeviceId) {
        setDeviceId(storedDeviceId)

        if (storedDeviceToken) {
          setDeviceToken(storedDeviceToken)
        }

        // Check if this is a new device by comparing with stored device info
        if (storedDeviceInfo && deviceInfo) {
          try {
            const parsedInfo: StoredDeviceInfo = JSON.parse(storedDeviceInfo)
            const deviceFingerprint = generateDeviceFingerprint(deviceInfo)
            const storedFingerprint = parsedInfo.deviceName || ''

            // If device info is significantly different, treat as new device
            if (deviceFingerprint !== storedFingerprint) {
              setIsNewDevice(true)
              console.log('New device detected - different fingerprint')
            }
          } catch (error) {
            console.log('Could not parse stored device info:', error)
            setIsNewDevice(true)
          }
        }

        setStep('pin')
      } else {
        setStep('phone')
        setIsNewDevice(true) // No deviceId means definitely a new device
      }
    }
  }, [deviceInfo, deviceInfoLoaded])

  // Generate a simple device fingerprint for comparison
  const generateDeviceFingerprint = (info: DeviceInfo): string => {
    return `${info.deviceType}-${info.os}-${info.browser}`
  }

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

        // Store device info with timestamp
        if (deviceInfo) {
          const deviceInfoToStore: StoredDeviceInfo = {
            deviceId: currentDeviceId,
            lastUsed: Date.now(),
            deviceName: generateDeviceFingerprint(deviceInfo),
          }
          localStorage.setItem('deviceInfo', JSON.stringify(deviceInfoToStore))
        }

        setDeviceId(currentDeviceId)
        setIsNewDevice(true)
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
      const currentDeviceToken = localStorage.getItem('deviceToken')

      // If no deviceId exists in localStorage, generate a new one
      if (!currentDeviceId) {
        setError("Device ID topilmadi. Iltimos, qaytadan urinib ko'ring.")
        setPin('')
        return
      }

      // Prepare request
      const requestData: any = {
        deviceId: currentDeviceId,
        pin: pinCode,
        ...(rawPhone ? { phone: rawPhone } : {}),// only add if non-empty
      }

      // Only send device info if:
      // 1. It's a new device (no deviceToken or different fingerprint)
      // 2. We have device info loaded
      // 3. The user is logging in for the first time on this device
      if (isNewDevice && deviceInfo && deviceInfoLoaded) {
        console.log('Sending device info for new device')
        requestData.deviceName = deviceInfo.deviceName
        requestData.deviceType = deviceInfo.deviceType
        requestData.os = deviceInfo.os
        requestData.browser = deviceInfo.browser
        requestData.ipAddress = deviceInfo.ipAddress

        // Include deviceToken if we have one (for device recognition)
        if (currentDeviceToken) {
          requestData.deviceToken = currentDeviceToken
        }
      } else if (currentDeviceToken) {
        // For existing devices, just send the device token
        requestData.deviceToken = currentDeviceToken
        console.log('Using existing device token for recognition')
      }

      console.log('Sending login request:', requestData)

      const res = await fetch(`${BACKEND_URL}/public/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Login failed:', errorText)

        // Try to parse error message
        try {
          const errorData = JSON.parse(errorText)
          setError(errorData.message || errorData.code || "PIN kod noto'g'ri")
        } catch {
          setError("PIN kod noto'g'ri yoki server xatosi")
        }
        setPin('')
        return
      }

      console.log('Login successful')

      // Check for cookies in response headers
      const cookies = res.headers.get('set-cookie')
      if (cookies) {
        console.log('Cookies received:', cookies)

        // Extract device token from cookies if present
        const deviceTokenMatch = cookies.match(/deviceToken=([^;]+)/)
        if (deviceTokenMatch) {
          const newDeviceToken = deviceTokenMatch[1]
          localStorage.setItem('deviceToken', newDeviceToken)
          setDeviceToken(newDeviceToken)
          console.log('Device token stored:', newDeviceToken)
        }
      }

      // Update stored device info
      if (deviceInfo) {
        const deviceInfoToStore: StoredDeviceInfo = {
          deviceId: currentDeviceId,
          deviceToken: deviceToken || undefined,
          lastUsed: Date.now(),
          deviceName: generateDeviceFingerprint(deviceInfo),
        }
        localStorage.setItem('deviceInfo', JSON.stringify(deviceInfoToStore))
      }

      // Update device token in state if received in response
      const responseData = await res.json().catch(() => ({}))
      if (responseData.deviceToken) {
        localStorage.setItem('deviceToken', responseData.deviceToken)
        setDeviceToken(responseData.deviceToken)
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
            disabled={loading || !deviceInfoLoaded}
            autoComplete='tel'
            autoFocus
          />
          {!deviceInfoLoaded && (
            <div className='mt-2 text-sm text-yellow-600 flex items-center'>
              <svg
                className='w-4 h-4 mr-1 animate-spin'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Qurilma aniqlanmoqda...
            </div>
          )}
        </div>

        {/* Device Info Preview - Only show for new devices */}
        {deviceInfoLoaded && isNewDevice && !deviceId && (
          <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='flex items-center mb-2'>
              <svg className='w-5 h-5 text-blue-600 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-sm font-medium text-blue-700'>Yangi qurilma aniqlandi</span>
            </div>
            <div className='text-xs text-blue-600 space-y-1'>
              <div>{deviceInfo?.deviceName}</div>
              <div>
                {deviceInfo?.deviceType} • {deviceInfo?.os} • {deviceInfo?.browser}
              </div>
            </div>
          </div>
        )}

        {/* Returning device info */}
        {deviceInfoLoaded && deviceId && !isNewDevice && (
          <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
            <div className='flex items-center mb-2'>
              <svg className='w-5 h-5 text-green-600 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-sm font-medium text-green-700'>Tanishtirilgan qurilma</span>
            </div>
            <div className='text-xs text-green-600'>Oldin foydalanilgan qurilmadan kirmoqdasiz</div>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <p className='text-red-700 text-sm text-center'>{error}</p>
          </div>
        )}

        <button
          onClick={handlePhoneSubmit}
          disabled={loading || !phone.trim() || !deviceInfoLoaded}
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

        {/* Device info loading note */}
        {!deviceInfoLoaded && (
          <div className='text-center text-sm text-gray-500'>
            <p>Qurilma ma&apos;lumotlari yuklanmoqda...</p>
          </div>
        )}
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
        <p className='text-gray-600'>{phone || 'Telefon raqamingiz'} uchun PIN kodni kiriting</p>
      </div>

      {/* Device Info Summary */}
      {deviceInfoLoaded && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            isNewDevice ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
          }`}
        >
          <div className='flex items-center mb-1'>
            {isNewDevice ? (
              <>
                <svg
                  className='w-4 h-4 text-yellow-600 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-sm font-medium text-yellow-700'>Yangi qurilmadan kirish</span>
              </>
            ) : (
              <>
                <svg
                  className='w-4 h-4 text-green-600 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-sm font-medium text-green-700'>Tanishtirilgan qurilma</span>
              </>
            )}
          </div>
          <div className={`text-xs ${isNewDevice ? 'text-yellow-600' : 'text-green-600'}`}>
            {deviceInfo?.deviceType} qurilmasidan kirmoqdasiz
            {isNewDevice && ' (bir marta aniqlash kerak)'}
          </div>
        </div>
      )}

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

      {/* PIN Status */}
      <div className='text-center mb-6'>
        <div className='text-xl font-mono text-gray-700 bg-gray-50 py-2 px-4 rounded-lg inline-block border border-gray-200'>
          {pin.padEnd(4, '•').split('').join(' ')}
        </div>
        <p className='text-sm text-gray-500 mt-2'>{pin.length}/4</p>
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
            className='aspect-square bg-white border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            {num}
          </button>
        ))}

        {/* Clear Button */}
        <button
          onClick={clearPin}
          disabled={loading}
          className='aspect-square bg-gray-100 border-2 border-gray-200 rounded-xl text-lg font-semibold text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        >
          🗑️
        </button>

        {/* Zero Button */}
        <button
          onClick={() => addPinDigit('0')}
          disabled={loading || pin.length >= 4}
          className='aspect-square bg-white border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          0
        </button>

        {/* Delete Button */}
        <button
          onClick={deleteDigit}
          disabled={loading || pin.length === 0}
          className='aspect-square bg-gray-100 border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        >
          ⌫
        </button>
      </div>

      {/* Back to Phone */}
      <button
        onClick={() => {
          setStep('phone')
          setError('')
          setPin('')
        }}
        className='w-full mt-6 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded'
      >
        ← Telefon raqamni o&apos;zgartirish
      </button>

      {/* Loading Overlay */}
      {loading && (
        <div className='absolute inset-0 bg-white bg-opacity-80 rounded-2xl flex items-center justify-center'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
              <span className='text-gray-700'>
                {isNewDevice ? 'Yangi qurilma aniqlanmoqda...' : 'Tekshirilmoqda...'}
              </span>
            </div>
            {deviceInfoLoaded && isNewDevice && (
              <div className='text-xs text-gray-500 text-center max-w-xs'>
                <p>Yangi qurilma: {deviceInfo?.deviceName}</p>
                <p>Bu qurilma faqat bir marta aniqlanadi</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      {step === 'phone' ? renderPhoneStep() : renderPinStep()}
    </div>
  )
}

export default LoginPage
