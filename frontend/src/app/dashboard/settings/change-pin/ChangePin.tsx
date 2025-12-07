'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ChangePin() {
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  type Step = 'old' | 'set' | 'confirm'
  const [step, setStep] = useState<Step>('old')

  const [oldPin, setOldPin] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const currentValue = step === 'old' ? oldPin : step === 'set' ? pin : confirmPin

  const setCurrentValue = step === 'old' ? setOldPin : step === 'set' ? setPin : setConfirmPin

  const handleKeypad = (num: string) => {
    if (currentValue.length < 4) {
      setCurrentValue(currentValue + num)
      setLocalError(null)
    }
  }

  const handleBackspace = () => {
    setCurrentValue(currentValue.slice(0, -1))
    setLocalError(null)
  }

  // 🔥🔥🔥 ADD KEYBOARD INPUT SUPPORT
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isLoading) return

      // Number keys 0–9
      if (/^[0-9]$/.test(e.key)) {
        handleKeypad(e.key)
      }

      // Backspace
      if (e.key === 'Backspace') {
        handleBackspace()
      }

      // Enter → submit form
      if (e.key === 'Enter' && currentValue.length === 4) {
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent
        handleSubmit(fakeEvent)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentValue, isLoading, step, oldPin, pin, confirmPin])


  // BACKEND LOGIC (unchanged)
  const parseError = (err: unknown) => (err instanceof Error ? err.message : 'Xatolik yuz berdi')

  const verifyOldPin = async (pin: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:3001/api/auth/pin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pin }),
      })

      const result = await res.json()

      if (!res.ok || result.status === 'error' || result.isValid === false) {
        throw new Error(result.message || 'Eski PIN noto‘g‘ri')
      }

      setStep('set')
    } catch (err) {
      setError(parseError(err))
      setOldPin('')
    } finally {
      setIsLoading(false)
    }
  }

  const saveNewPin = async (pin: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:3001/api/auth/pin/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPin: pin }),
      })

      const result = await res.json()

      if (!res.ok || result.status === 'error') {
        throw new Error(result.message || 'Yangi PIN saqlanmadi')
      }

      router.push('/')
    } catch (err) {
      setError(parseError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 'old') {
      if (oldPin.length !== 4) {
        setLocalError("PIN 4 xonali bo'lishi kerak")
        return
      }
      verifyOldPin(oldPin)
      return
    }

    if (step === 'set') {
      if (pin.length !== 4) {
        setLocalError("PIN 4 xonali bo'lishi kerak")
        return
      }
      setStep('confirm')
      return
    }

    if (step === 'confirm') {
      if (confirmPin !== pin) {
        setLocalError('PINlar mos emas')
        setConfirmPin('')
        return
      }
      saveNewPin(pin)
    }
  }

  // UI renders (unchanged)
  const renderDots = (value: string) => (
    <div className='flex justify-center gap-4 my-6'>
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 ${
            value.length > i ? 'bg-electric border-electric' : 'bg-transparent border-gray-700'
          }`}
        />
      ))}
    </div>
  )

  const renderKeypad = () => (
    <div className='grid w-64 grid-cols-3 gap-4 mx-auto mt-8'>
      {[...'123456789'].map(n => (
        <button
          key={n}
          type='button'
          className='py-4 text-2xl font-bold text-white transition border rounded-full bg-black/40 border-white/10 active:bg-electric/30'
          onClick={() => handleKeypad(n)}
          disabled={isLoading || currentValue.length >= 4}
        >
          {n}
        </button>
      ))}
      <div></div>
      <button
        type='button'
        className='py-4 text-2xl font-bold text-white transition border rounded-full bg-black/40 border-white/10 active:bg-electric/30'
        onClick={() => handleKeypad('0')}
        disabled={isLoading || currentValue.length >= 4}
      >
        0
      </button>
      <button
        type='button'
        className='py-4 text-2xl font-bold text-white transition border rounded-full bg-black/40 border-white/10 active:bg-plasma/30'
        onClick={handleBackspace}
        disabled={isLoading || currentValue.length === 0}
      >
        ←
      </button>
    </div>
  )

  const stepTitle =
    step === 'old'
      ? 'Eski PIN kodni kiriting'
      : step === 'set'
      ? "Yangi PIN o'rnatish"
      : 'PIN ni qayta kiriting'

  const stepSubtitle =
    step === 'old'
      ? 'Tasdiqlash uchun joriy PIN kodingizni kiriting'
      : step === 'set'
      ? '4 xonali yangi PIN kod o‘rnating'
      : 'PIN kodni tasdiqlash uchun qayta kiriting'

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 font-sans text-white bg-black'>
      <form onSubmit={handleSubmit} className='w-full max-w-xs mx-auto'>
        <h2 className='mb-2 text-2xl font-extrabold tracking-tight text-center text-transparent bg-clip-text bg-linear-to-r from-electric via-plasma to-cosmic'>
          {stepTitle}
        </h2>
        <p className='mb-4 text-center text-gray-400'>{stepSubtitle}</p>

        {renderDots(currentValue)}

        {(localError || error) && (
          <div className='p-2 mb-2 text-center text-red-400 border rounded-md bg-linear-to-r from-red-900/50 to-red-900/30 border-red-500/30'>
            {localError || error}
          </div>
        )}

        {renderKeypad()}

        <button
          type='submit'
          disabled={isLoading || currentValue.length !== 4}
          className='w-full py-3 mt-8 text-lg font-semibold text-white transition-all duration-300 transform bg-linear-to-r from-electric to-plasma rounded-xl hover:from-electric/90 hover:to-plasma/90 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105'
        >
          {isLoading
            ? step === 'old'
              ? 'Tekshirilmoqda...'
              : step === 'confirm'
              ? 'Saqlanmoqda...'
              : 'Yuklanmoqda...'
            : step === 'old'
            ? 'Davom etish'
            : step === 'set'
            ? 'Davom etish'
            : 'PIN ni tasdiqlash'}
        </button>
      </form>
    </div>
  )
}
