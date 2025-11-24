'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function PsychologyDoctorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Three.js Background Animation
  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Floating psychological shapes
    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.5),
      new THREE.TetrahedronGeometry(1.8),
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.TorusGeometry(1.3, 0.4, 16, 100),
    ]

    const materials = [
      new THREE.MeshPhongMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.1,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.08,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.12,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.09,
        shininess: 100,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: 0.11,
        shininess: 100,
      }),
    ]

    const objects: THREE.Mesh[] = []

    // Create floating objects
    geometries.forEach((geometry, index) => {
      const material = materials[index % materials.length]
      const mesh = new THREE.Mesh(geometry, material)

      // Random positions
      mesh.position.x = (Math.random() - 0.5) * 20
      mesh.position.y = (Math.random() - 0.5) * 20
      mesh.position.z = (Math.random() - 0.5) * 10

      // Random rotations
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI

      scene.add(mesh)
      objects.push(mesh)
    })

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x4f46e5, 0.5, 100)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    camera.position.z = 15

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      objects.forEach((object, index) => {
        object.rotation.x += 0.002
        object.rotation.y += 0.003

        // Gentle floating motion
        const time = Date.now() * 0.001
        object.position.y += Math.sin(time + index) * 0.003
        object.position.x += Math.cos(time + index * 1.5) * 0.002
      })

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  const professionalLinks = [
    {
      name: 'Sessiyani bron qilish',
      href: '/dashboard',
      icon: '📅',
      color: 'from-emerald-500 to-teal-600',
      description: 'Uchrashuvni rejalashtirish',
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
    {
      name: 'Telegram',
      href: 'https://t.me/Gulnoza_Xotambekovna',
      icon: '💬',
      color: 'from-blue-500 to-cyan-500',
      description: 'Tezkor konsultatsiya',
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/Gulnoza_Xotambekovna',
      icon: '📱',
      color: 'from-purple-500 to-pink-500',
      description: 'Ijtimoiy tarmoq',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      name: 'Bog\'lanish',
      href: 'tel:+998901234567',
      icon: '📞',
      color: 'from-green-500 to-emerald-600',
      description: 'Qo\'ng\'iroq qilish',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
    },
  ]

  const specialties = [
    'Pedagogik psixologiya',
    'Bolalar psixologiyasi',
    'Oila maslahati',
    'Shaxsiy rivojlanish',
    'Stressni boshqarish',
    'Psixologik maslahat',
  ]

  const credentials = [
    { title: 'Pedagogika psixologiya mutaxassisi', institution: '9 yillik tajriba' },
    { title: 'Psixologik maslahatchi', institution: 'Davlat litsenziyasi' },
    { title: 'Bolalar psixologiyasi', institution: 'Maxsus sertifikat' },
    { title: 'Oila psixologiyasi', institution: '4 farzand onasi' },
  ]

  const services = [
    {
      title: 'Individual maslahat',
      description: 'Shaxsiy ehtiyojlaringizga moslashtirilgan yakkama-yakka sessiyalar',
      duration: '50 daqiqa',
    },
    {
      title: 'Oila maslahati',
      description: 'Oila munosabatlarini yaxshilash va mustahkamlash',
      duration: '75 daqiqa',
    },
    {
      title: 'Bolalar bilan ishlash',
      description: 'Yosh bolalarning psixologik rivojlanishiga yordam',
      duration: '45 daqiqa',
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 relative overflow-hidden'>
      {/* Three.js Background Canvas */}
      <canvas
        ref={canvasRef}
        className='fixed top-0 left-0 w-full h-full pointer-events-none z-0'
      />

      {/* Background Overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/50 to-purple-50/30 dark:from-slate-900/90 dark:via-blue-900/20 dark:to-purple-900/10 z-10' />

      {/* Main Content */}
      <div className='relative z-20'>
        {/* Header/Navigation */}
        <nav className='relative z-30 py-4 px-4'>
          <div className='max-w-7xl mx-auto flex justify-between items-center'>
            <div className='text-xl font-bold text-slate-800 dark:text-white'>
              Psixolog<span className='text-blue-600'>Markaz</span>
            </div>
            <div className='flex gap-4'>
              <Link
                href='/about'
                className='text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors text-sm'
              >
                Men haqimda
              </Link>
              <Link
                href='/services'
                className='text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors text-sm'
              >
                Xizmatlar
              </Link>
              <Link
                href='/contact'
                className='text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors text-sm'
              >
                Bog'lanish
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className='relative py-12 px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex flex-col lg:flex-row items-center gap-8'>
              {/* Profile Image */}
              <div className='flex-shrink-0 relative w-full max-w-xs mx-auto'>
                <div className='relative'>
                  <div className='w-56 h-56 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2 shadow-2xl mx-auto'>
                    <div className='w-full h-full rounded-2xl bg-white dark:bg-slate-800 p-2'>
                      <Image
                        src='/main_image.png'
                        alt='Tadjibayeva Gulnoza Xotambekovna'
                        width={500}
                        height={500}
                        className='w-full h-full rounded-2xl object-cover border-4 border-white dark:border-slate-800 object-top'
                        priority
                      />
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Bio Section */}
              <div className='flex-1 text-center lg:text-left'>
                <div className='inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-4'>
                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                  Yangi bemorlarni qabul qilaman
                </div>

                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4'>
                  Tadjibayeva{' '}
                  <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
                    Gulnoza
                  </span>
                </h1>

                <p className='text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 font-light'>
                  Pedagogik Psixolog va Ona
                </p>

                <p className='text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mb-6'>
                  9 yillik tajribaga ega pedagogik psixolog sifatida bolalar, ota-onalar va oilalarga 
                  psixologik yordam ko'rsataman. 4 farzand onasi sifatida bolalar psixologiyasini chuqur 
                  tushunaman va har bir bemorga individual yondashaman.
                </p>

                {/* Quick Stats */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center lg:justify-start'>
                  {credentials.map((cred, index) => (
                    <div key={index} className='text-center lg:text-left'>
                      <div className='text-sm font-semibold text-slate-800 dark:text-white'>
                        {cred.title}
                      </div>
                      <div className='text-sm text-slate-500 dark:text-slate-400'>
                        {cred.institution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Buttons */}
        <section className='py-12 px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-white mb-4'>
              Bog'laning
            </h2>
            <p className='text-base text-slate-500 dark:text-slate-400 text-center mb-8 max-w-2xl mx-auto'>
              Sessiyalarni bron qilish, konsultatsiyalar yoki savollar uchun
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {professionalLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative p-6 rounded-2xl ${link.gradient} text-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl backdrop-blur-sm`}
                >
                  <div className='text-center'>
                    <div className='text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300'>
                      {link.icon}
                    </div>
                    <h3 className='text-lg font-semibold mb-1'>{link.name}</h3>
                    <p className='text-white/90 text-sm'>{link.description}</p>
                  </div>
                  <div className='absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className='py-16 px-4 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-white mb-4'>
              Mutaxassislik Sohalari
            </h2>
            <p className='text-base text-slate-500 dark:text-slate-400 text-center mb-8 max-w-2xl mx-auto'>
              Bolalar va oilalar uchun kompleks psixologik yordam
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {specialties.map((specialty, index) => (
                <div
                  key={specialty}
                  className='p-4 bg-white/70 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg backdrop-blur-sm'
                >
                  <div className='text-2xl mb-3 text-blue-600 dark:text-blue-400'>
                    {index === 0 && '👩‍🏫'}
                    {index === 1 && '🧒'}
                    {index === 2 && '👨‍👩‍👧‍👦'}
                    {index === 3 && '🌟'}
                    {index === 4 && '😌'}
                    {index === 5 && '💬'}
                  </div>
                  <h3 className='text-lg font-semibold text-slate-800 dark:text-white mb-2'>
                    {specialty}
                  </h3>
                  <p className='text-slate-600 dark:text-slate-400 text-xs'>
                    Individual yondashuv va samarali terapiya usullari
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className='py-16 px-4'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-white mb-4'>
              Xizmat Turlari
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className='relative p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 group'
                >
                  <div className='text-3xl mb-3 text-blue-600 dark:text-blue-400'>
                    {service.title.includes('Individual') && '👤'}
                    {service.title.includes('Oila') && '👨‍👩‍👧‍👦'}
                    {service.title.includes('Bolalar') && '🧒'}
                  </div>
                  <h3 className='text-xl font-semibold text-slate-800 dark:text-white mb-3'>
                    {service.title}
                  </h3>
                  <p className='text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm'>
                    {service.description}
                  </p>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                      {service.duration}
                    </span>
                    <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 text-sm'>
                      →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-16 px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden'>
              {/* Background pattern */}
              <div className='absolute inset-0 opacity-10'>
                <div className='absolute -top-16 -right-16 w-32 h-32 bg-white rounded-full'></div>
                <div className='absolute -bottom-16 -left-16 w-32 h-32 bg-white rounded-full'></div>
              </div>

              <h2 className='text-2xl sm:text-3xl font-bold mb-4 relative z-10'>
                Sog'lom Ruhiyat Sari Birinchi Qadam
              </h2>
              <p className='text-blue-100 text-lg mb-6 max-w-2xl mx-auto relative z-10'>
                Yaxshiroq ruhiy salomatlik yo'lidagi birinchi qadamni tashlang. Bugun maxfiy konsultatsiyani rejalashtiring.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 justify-center relative z-10'>
                <Link
                  href='/dashboard'
                  className='px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-sm'
                >
                  Sessiyani bron qilish
                </Link>
                <a
                  href='tel:+998901234567'
                  className='px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 text-sm'
                >
                  Qo'ng'iroq qilish
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm'>
          <div className='max-w-6xl mx-auto px-4 py-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='text-slate-600 dark:text-slate-400 mb-4 md:mb-0 text-center md:text-left'>
                <div className='text-xl font-bold text-slate-800 dark:text-white mb-1'>
                  Psixolog<span className='text-blue-600'>Markaz</span>
                </div>
                <p className='text-sm'>Professional psixologik xizmatlar</p>
                <p className='text-xs mt-1'>© 2024 Tadjibayeva Gulnoza. Barcha huquqlar himoyalangan.</p>
              </div>
              <div className='flex flex-wrap gap-4 justify-center'>
                {professionalLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 text-sm'
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}