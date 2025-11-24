

export default async function DashboardPage() {
  
  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-800 mb-6'>Xush kelibsiz!</h1>

      {/* Dashboard Content */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm'>
          <h3 className='text-lg font-semibold text-slate-800 mb-2'>Davom etayotgan kurslar</h3>
          <p className='text-slate-600'>3 ta kurs</p>
        </div>
        <div className='bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm'>
          <h3 className='text-lg font-semibold text-slate-800 mb-2'>Tugatilgan kurslar</h3>
          <p className='text-slate-600'>5 ta kurs</p>
        </div>
        <div className='bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm'>
          <h3 className='text-lg font-semibold text-slate-800 mb-2'>Keyingi dars</h3>
          <p className='text-slate-600'>Ertaga, 10:00</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm'>
        <h2 className='text-xl font-semibold text-slate-800 mb-4'>So&apos;nggi faoliyat</h2>
        <div className='space-y-4'>
          <div className='flex items-center gap-4 p-3 bg-slate-50 rounded-xl'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600'>
              📚
            </div>
            <div>
              <p className='font-medium text-slate-800'>Stressni boshqarish kursi</p>
              <p className='text-sm text-slate-500'>2 kun oldin</p>
            </div>
          </div>
          <div className='flex items-center gap-4 p-3 bg-slate-50 rounded-xl'>
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600'>
              🧪
            </div>
            <div>
              <p className='font-medium text-slate-800'>Psixologik test topshirildi</p>
              <p className='text-sm text-slate-500'>5 kun oldin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
