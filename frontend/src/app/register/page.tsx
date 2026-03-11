'use client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface RegisterData {
  name: string
  phone: string
  pin: string
  deviceId: string
  deviceName: string
  deviceType: string
  os: string
  browser: string
  ipAddress: string
}

interface DeviceInfo {
  deviceId: string
  deviceName: string
  deviceType: string
  os: string
  browser: string
  ipAddress: string
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    phone: '',
    pin: '',
    deviceId: '',
    deviceName: '',
    deviceType: '',
    os: '',
    browser: '',
    ipAddress: ''
  })
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [deviceInfoLoaded, setDeviceInfoLoaded] = useState(false)
  const router = useRouter()

  // Detect device information
  useEffect(() => {
    const detectDeviceInfo = async () => {
      const info: DeviceInfo = {
        deviceId: uuidv4(),
        deviceName: 'Unknown Device',
        deviceType: 'Unknown',
        os: 'Unknown',
        browser: 'Unknown',
        ipAddress: 'Unknown'
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
    }

    detectDeviceInfo()
  }, [])

  // Initialize form data with device info once loaded
  useEffect(() => {
    if (deviceInfo && deviceInfoLoaded) {
      setFormData(prev => ({
        ...prev,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
        ipAddress: deviceInfo.ipAddress
      }))
    }
  }, [deviceInfo, deviceInfoLoaded])

  // Handle keyboard input for PIN steps
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key

      // Handle Enter key for step 1 form
      if (key === 'Enter' && step === 1) {
        event.preventDefault()
        const form = event.target as HTMLElement
        const formElement = form.closest('form')
        if (formElement) {
          const submitButton = formElement.querySelector(
            'button[type="submit"]'
          ) as HTMLButtonElement
          if (submitButton && !submitButton.disabled) {
            submitButton.click()
          }
        }
        return
      }

      // Handle PIN input for steps 2 and 3
      if (step === 2 || step === 3) {
        // Handle number keys
        if (/^[0-9]$/.test(key)) {
          event.preventDefault()
          if (step === 2 && formData.pin.length < 4) {
            const newPin = formData.pin + key
            setFormData(prev => ({ ...prev, pin: newPin }))
          } else if (step === 3 && confirmPin.length < 4) {
            const newConfirmPin = confirmPin + key
            setConfirmPin(newConfirmPin)
          }
        }
        // Handle backspace and delete
        else if (key === 'Backspace' || key === 'Delete') {
          event.preventDefault()
          if (step === 2 && formData.pin.length > 0) {
            setFormData(prev => ({ ...prev, pin: prev.pin.slice(0, -1) }))
            setHasAutoAdvanced(false)
          } else if (step === 3 && confirmPin.length > 0) {
            setConfirmPin(prev => prev.slice(0, -1))
          }
        }
      }
    },
    [step, formData.pin, confirmPin]
  )

  // Add and remove keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  // Auto advance to step 3 when PIN is complete (only once)
  useEffect(() => {
    if (step === 2 && formData.pin.length === 4 && !hasAutoAdvanced) {
      const timer = setTimeout(() => {
        setStep(3)
        setHasAutoAdvanced(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formData.pin, step, hasAutoAdvanced])

  // Handle step navigation - manual only, no auto actions
  const handleStepClick = (stepNumber: number) => {
    // Only allow going to completed steps or current step
    if (stepNumber > step && !isStepCompleted(stepNumber - 1)) {
      return
    }

    // When manually clicking step buttons, disable auto-advance
    if (stepNumber === 2) {
      setHasAutoAdvanced(true) // Block auto-advance from step 2 to 3
    }

    setStep(stepNumber)
  }

  // Validate phone number
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+998\d{9}$/
    if (!phone) {
      setPhoneError('Telefon raqami kiritilishi shart')
      return false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError("To'g'ri format: +998901234567")
      return false
    } else {
      setPhoneError('')
      return true
    }
  }

  // Handle phone input with formatting
  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '')

    // Format as +998 prefix
    if (digits.startsWith('998')) {
      digits = digits.substring(3)
    }

    // Limit to 9 digits after +998
    if (digits.length > 9) {
      digits = digits.substring(0, 9)
    }

    // Format the phone number
    let formatted = '+998'
    if (digits) {
      formatted += digits
    }

    setFormData(prev => ({ ...prev, phone: formatted }))
    validatePhone(formatted)
  }

  // Handle step 1 form submission
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validatePhone(formData.phone) && formData.name.trim()) {
      setStep(2)
      setHasAutoAdvanced(false) // Allow auto-advance for natural flow
    }
  }

  // Handle PIN input from buttons
  const handlePinInput = (number: string) => {
    if (step === 2 && formData.pin.length < 4) {
      const newPin = formData.pin + number
      setFormData(prev => ({ ...prev, pin: newPin }))
    } else if (step === 3 && confirmPin.length < 4) {
      const newConfirmPin = confirmPin + number
      setConfirmPin(newConfirmPin)
    }
  }

  // Handle PIN deletion
  const handleDeletePin = () => {
    if (step === 2 && formData.pin.length > 0) {
      setFormData(prev => ({ ...prev, pin: prev.pin.slice(0, -1) }))
      setHasAutoAdvanced(false) // Reset auto-advance when user modifies PIN
    } else if (step === 3 && confirmPin.length > 0) {
      setConfirmPin(prev => prev.slice(0, -1))
    }
  }

  // Handle final submission
  const handleFinalSubmit = async () => {
    if (formData.pin !== confirmPin) {
      alert('PIN kodlar mos kelmadi!')
      setConfirmPin('')
      return
    }

    if (confirmPin.length === 4 && !loading) {
      setLoading(true)

      try {
        // Ensure all required fields are present
        const registrationData = {
          name: formData.name,
          phone: formData.phone,
          pin: formData.pin,
          deviceId: formData.deviceId || uuidv4(),
          deviceName: formData.deviceName,
          deviceType: formData.deviceType,
          os: formData.os,
          browser: formData.browser,
          ipAddress: formData.ipAddress
        }

        console.log('Sending registration data:', registrationData)

        const response = await fetch('http://localhost:3001/public/register', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        })

        if (response.ok) {
          alert('Muvaffaqiyatli roʻyxatdan oʻtildi!')
          localStorage.setItem('deviceId', registrationData.deviceId)
          router.push('/dashboard')
        } else {
          const errorData = await response.json()
          console.error('Registration error:', errorData)
          throw new Error(errorData.message || errorData.code || 'Roʻyxatdan oʻtish muvaffaqiyatsiz')
        }
      } catch (error) {
        console.error('Registration error:', error)
        alert(
          error instanceof Error
            ? error.message
            : 'Roʻyxatdan oʻtishda xatolik yuz berdi. Iltimos, qaytadan urinib koʻring.'
        )
      } finally {
        setLoading(false)
      }
    }
  }

  // Manual submit handler for step 3
  const handleManualSubmit = () => {
    if (confirmPin.length === 4 && !loading) {
      handleFinalSubmit()
    }
  }

  // Manual advance handler for step 2
  const handleManualAdvance = () => {
    if (formData.pin.length === 4) {
      setHasAutoAdvanced(true) // Block auto-advance when manually advancing
      setStep(3)
    }
  }

  // Check if step is completed
  const isStepCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.name.trim() !== '' && formData.phone.trim() !== '' && !phoneError
      case 2:
        return formData.pin.length === 4
      case 3:
        return confirmPin.length === 4 && formData.pin === confirmPin
      default:
        return false
    }
  }

  // Progress steps in Uzbek
  const steps = [
    { number: 1, title: 'Maʼlumotlar', icon: '👤' },
    { number: 2, title: 'PIN Yaratish', icon: '🔐' },
    { number: 3, title: 'PIN Tasdiqlash', icon: '✅' },
  ]

  // Get current PIN for display
  const getCurrentPin = () => (step === 2 ? formData.pin : confirmPin)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6'>
        {/* Device Info Banner */}
        {deviceInfoLoaded && (
          <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z' clipRule='evenodd' />
                </svg>
                <span className='text-sm font-medium text-blue-700'>Qurilma aniqlandi</span>
              </div>
              <div className='text-xs text-blue-600'>
                {deviceInfo?.deviceType} • {deviceInfo?.browser}
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className='flex justify-between items-center mb-8'>
          {steps.map((s, index) => (
            <div key={s.number} className='flex flex-col items-center flex-1'>
              <button
                onClick={() => handleStepClick(s.number)}
                disabled={s.number > step && !isStepCompleted(s.number - 1)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold text-lg transition-all
                  ${
                    isStepCompleted(s.number)
                      ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                      : step === s.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : step > s.number
                      ? 'bg-blue-100 border-blue-300 text-blue-600 hover:bg-blue-200'
                      : 'border-gray-300 text-gray-400 bg-white hover:bg-gray-50'
                  } 
                  ${
                    s.number <= step || isStepCompleted(s.number - 1)
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed'
                  }`}
              >
                {isStepCompleted(s.number) ? '✓' : s.icon}
              </button>
              <span
                className={`text-xs mt-2 text-center font-medium ${
                  isStepCompleted(s.number)
                    ? 'text-green-600'
                    : step === s.number
                    ? 'text-blue-600'
                    : step > s.number
                    ? 'text-blue-500'
                    : 'text-gray-400'
                }`}
              >
                {s.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-6 ${
                    isStepCompleted(s.number)
                      ? 'bg-green-500'
                      : step > s.number
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Name and Phone */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className='space-y-6'>
            <h2 className='text-2xl font-bold text-gray-800 text-center mb-2'>Profil Yaratish</h2>
            <p className='text-gray-600 text-center mb-6'>
              Iltimos, oʻzingiz haqingizda maʼlumot kiriting
            </p>

            <div className='space-y-4'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                  Ism Familya *
                </label>
                <input
                  type='text'
                  id='name'
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
                  placeholder='Ismingiz va familyangiz'
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                  Telefon Raqami *
                </label>
                <input
                  type='tel'
                  id='phone'
                  value={formData.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    phoneError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='+998901234567'
                  required
                />
                {phoneError && (
                  <p className='text-red-500 text-sm mt-2 flex items-center'>
                    <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {phoneError}
                  </p>
                )}
                {!phoneError && formData.phone && (
                  <p className='text-green-500 text-sm mt-2 flex items-center'>
                    <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    To&apos;g&apos;ri format
                  </p>
                )}
              </div>

              {/* Device Info Preview */}
              {deviceInfoLoaded && (
                <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <h3 className='text-sm font-medium text-gray-700 mb-2'>Qurilma ma&apos;lumotlari</h3>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div className='space-y-1'>
                      <div className='flex items-center'>
                        <svg className='w-4 h-4 text-gray-500 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z' clipRule='evenodd' />
                        </svg>
                        <span className='text-gray-600'>Qurilma:</span>
                      </div>
                      <div className='pl-5 text-gray-800 font-medium'>{deviceInfo?.deviceName}</div>
                    </div>
                    <div className='space-y-1'>
                      <div className='flex items-center'>
                        <svg className='w-4 h-4 text-gray-500 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z' clipRule='evenodd' />
                        </svg>
                        <span className='text-gray-600'>Operatsion tizim:</span>
                      </div>
                      <div className='pl-5 text-gray-800 font-medium'>{deviceInfo?.os}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type='submit'
              disabled={!formData.name || !formData.phone || !!phoneError || !deviceInfoLoaded}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition duration-200'
            >
              {deviceInfoLoaded ? 'Keyingi Qadam' : 'Qurilma aniqlanmoqda...'}
            </button>
          </form>
        )}

        {/* Step 2 & 3: PIN Entry */}
        {(step === 2 || step === 3) && (
          <div className='space-y-8'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                {step === 2 ? 'PIN Yaratish' : 'PIN Tasdiqlash'}
              </h2>
              <p className='text-gray-600 mb-2'>
                {step === 2 ? 'Xavfsizlik uchun 4 xonali PIN yarating' : 'PIN ni qayta kiriting'}
              </p>
              <p className='text-sm text-gray-500'>
                {step === 2 && formData.pin.length === 4 && !hasAutoAdvanced && (
                  <span className='text-green-500 animate-pulse'>
                    Avtomatik ravishda keyingi qadamga o&apos;tiladi...
                  </span>
                )}
              </p>
            </div>

            {/* PIN Display */}
            <div className='flex justify-center space-x-6 mb-8'>
              {[0, 1, 2, 3].map(index => {
                const currentPin = getCurrentPin()
                const isFilled = index < currentPin.length
                return (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      isFilled ? 'bg-blue-600 border-blue-600 scale-110' : 'border-gray-300'
                    }`}
                  />
                )
              })}
            </div>

            {/* Current PIN Display */}
            <div className='text-center'>
              <div className='text-xl font-mono text-gray-700 bg-gray-50 py-3 px-6 rounded-lg inline-block border-2 border-gray-200'>
                {getCurrentPin().padEnd(4, '•').split('').join(' ')}
              </div>
              <p className='text-sm text-gray-500 mt-2'>{getCurrentPin().length}/4</p>
            </div>

            {/* Number Pad */}
            <div className='grid grid-cols-3 gap-4 max-w-xs mx-auto'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                <button
                  key={number}
                  onClick={() => handlePinInput(number.toString())}
                  disabled={getCurrentPin().length >= 4 || loading}
                  className='aspect-square bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-700 transition-all active:scale-95 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  type='button'
                >
                  {number}
                </button>
              ))}

              {/* Empty cell */}
              <div className='aspect-square' />

              {/* 0 */}
              <button
                onClick={() => handlePinInput('0')}
                disabled={getCurrentPin().length >= 4 || loading}
                className='aspect-square bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed border-2 border-gray-200 rounded-xl text-2xl font-semibold text-gray-700 transition-all active:scale-95 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                type='button'
              >
                0
              </button>

              {/* Delete button */}
              <button
                onClick={handleDeletePin}
                disabled={getCurrentPin().length === 0 || loading}
                className='aspect-square bg-gray-50 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed border-2 border-gray-200 rounded-xl flex items-center justify-center transition-all active:scale-95 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                type='button'
              >
                <svg
                  className='w-7 h-7 text-gray-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z'
                  />
                </svg>
              </button>
            </div>

            {/* Action Buttons */}
            <div className='flex space-x-3'>
              <button
                onClick={() => {
                  setStep(step - 1)
                  if (step === 2) {
                    setHasAutoAdvanced(false)
                  }
                }}
                disabled={loading}
                className='flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 py-3 px-4 rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
              >
                Orqaga
              </button>

              {step === 2 && (
                <button
                  onClick={handleManualAdvance}
                  disabled={formData.pin.length !== 4 || loading}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  Davom Etish
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={handleManualSubmit}
                  disabled={confirmPin.length !== 4 || loading}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  {loading ? 'Yuborilmoqda...' : 'Roʻyxatdan Oʻtish'}
                </button>
              )}
            </div>

            {/* Device Info Summary */}
            {step === 3 && deviceInfoLoaded && (
              <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center'>
                    <svg className='w-5 h-5 text-green-600 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                    <span className='text-sm font-medium text-green-700'>Qurilma ma&apos;lumotlari tayyor</span>
                  </div>
                </div>
                <div className='text-xs text-green-600'>
                  Siz {deviceInfo?.deviceType} qurilmadan {deviceInfo?.browser} brauzeri orqali roʻyxatdan oʻtyapsiz
                </div>
              </div>
            )}

            {loading && (
              <div className='text-center'>
                <div className='inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg'>
                  <div className='w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mr-2' />
                  Ro&apos;yxatdan o&apos;tkazilmoqda...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}