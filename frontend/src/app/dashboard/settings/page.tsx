import { getCurrentUser } from '@/lib/auth'
import UserSettings from './UserSettings'

const page = async () => {
  const userData = await getCurrentUser()
  console.log('User Data: inside settings', userData)
  return <UserSettings userData={userData} />
}

export default page
