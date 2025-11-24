'use client'

import { User } from '@/types/user'
import { LogOut, Pencil, Save, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const UserSettings = ({ userData }: { userData: User }) => {
  const [username, setUsername] = useState(userData.name)
  const [editingUsername, setEditingUsername] = useState(false)
  const [tempUsername, setTempUsername] = useState(username)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const router = useRouter()
  const handleSaveUsername = async () => {
    setUsername(tempUsername)
    setEditingUsername(false)

    const req = await fetch('http://localhost:3001/api/users/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: tempUsername }),
    })
    const res = await req.json()
    console.log('Saved username:', res)
    if (req.ok) {
      // HTTP 2xx → success
      console.log(res.message, tempUsername)
      alert(res.message)
      setTimeout(() => {
        router.back()
        setTimeout(() => router.refresh(), 500)
      }, 2000)
    } else {
      // HTTP error status (400, 500, etc.)
      console.error(res.message)
      alert(res.message)
    }
  }

  const handleCancelUsername = () => {
    setTempUsername(username)
    setEditingUsername(false)
  }

  // New functions
  const handleDeleteProfile = async () => {
    console.log('Profil o‘chirish bosildi')
    try {
      const response = await fetch('http://localhost:3001/api/users/delete', {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to delete profile')

      window.location.href = '/'
    } catch (err) {
      console.error('Error deleting profile:', err)
      alert('Profilni o‘chirishda xatolik yuz berdi')
    }
  }

  return (
    <div className='px-4 py-6 sm:px-6'>
      <h1 className='mb-4 text-2xl font-bold text-center sm:text-3xl'>Foydalanuvchi Sozlamalari</h1>

      <div className='max-w-3xl p-4 mx-auto bg-white rounded-lg shadow-md sm:p-6'>
        {/* Profile header */}
        <div className='relative flex flex-col items-center p-4 text-white bg-blue-600 rounded-lg sm:flex-row sm:items-center sm:space-x-4'>
          <div className='relative flex flex-col items-center p-4 text-white bg-blue-600 rounded-lg sm:flex-row sm:items-center sm:space-x-4'>
            <div className='relative w-20 h-20 sm:w-24 sm:h-24'>
              {userData.profileImage ? (
                <Image
                  src={userData.profileImage}
                  alt={`${userData.name} profili`}
                  fill
                  className='object-cover rounded-full'
                />
              ) : (
                <div className='flex items-center justify-center w-full h-full text-4xl font-bold bg-blue-400 rounded-full'>
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className='mt-3 text-center sm:mt-0 sm:text-left'>
            <div>
              {editingUsername ? (
                <div>
                  <div className='flex gap-2 mt-2 sm:mt-0'>
                    <button
                      onClick={handleSaveUsername}
                      className='flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700'
                    >
                      <Save size={14} /> Saqlash
                    </button>
                    <button
                      onClick={handleCancelUsername}
                      className='flex items-center gap-1 px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
                    >
                      <X size={14} /> Bekor qilish
                    </button>
                  </div>
                  <input
                    type='text'
                    value={tempUsername}
                    onChange={e => setTempUsername(e.target.value)}
                    className='px-3 py-2 text-sm text-black border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none'
                  />
                </div>
              ) : (
                <h2 className='text-2xl font-semibold'>{userData.name}</h2>
              )}
            </div>
          </div>

          {/* Hover + click-safe Pencil menu */}
          <div
            className='absolute transform -translate-y-1/2 right-4 top-1/2'
            onMouseEnter={() => setShowProfileOptions(true)}
            onMouseLeave={() => setShowProfileOptions(false)}
          >
            <div className='relative'>
              <button
                className='p-2 transition bg-blue-500 rounded-full hover:bg-blue-700'
                type='button'
              >
                <Pencil size={20} />
              </button>

              {showProfileOptions && (
                <div
                  className='absolute right-0 z-10 text-gray-800 bg-white rounded-md shadow-lg p-2text-sm w-44'
                  onMouseEnter={() => setShowProfileOptions(true)} // Keep open
                  onMouseLeave={() => setShowProfileOptions(false)} // Close after leave
                >
                  <button
                    className='w-full px-2 py-1 text-left rounded hover:bg-gray-100'
                    onClick={() => {
                      window.location.href = '/dashboard/settings/update-image'
                    }}
                  >
                    Rasmni o‘zgartirish
                  </button>
                  <button
                    className='w-full px-2 py-1 text-left rounded hover:bg-gray-100'
                    onClick={() => setEditingUsername(true)}
                  >
                    Ismni o‘zgartirish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div>
          <h2 className='mt-6 mb-2 text-xl font-semibold'>Shaxsiy Ma&apos;lumotlar</h2>
          <p>Telefon raqami: {userData.phone}</p>
          <p>Pin: **** </p>
        </div>
      </div>

      {/* Links & Actions */}
      <div className='flex flex-col max-w-3xl p-4 mx-auto mt-4 space-y-2 bg-white rounded-lg shadow-md sm:p-6'>
        <Link
          href='/dashboard/settings/change-contact'
          className='px-4 py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700'
        >
          Kontaktni almashtirish
        </Link>
        <Link
          href='/dashboard/settings/change-pin'
          className='px-4 py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700'
        >
          PIN kodni o‘zgartirish
        </Link>

        <button
          onClick={handleDeleteProfile}
          className='flex items-center justify-center gap-2 px-4 py-2 text-white transition bg-red-600 rounded hover:bg-red-700'
        >
          <Trash2 size={18} /> Profilni o‘chirish
        </button>
        <Link
          href={'/dashboard/settings/logout'}
          className='flex items-center justify-center gap-2 px-4 py-2 text-white transition bg-gray-700 rounded hover:bg-gray-800'
        >
          <LogOut size={18} /> Chiqish
        </Link>
      </div>
    </div>
  )
}

export default UserSettings
