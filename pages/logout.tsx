import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import Container from '../components/Container'
import TopBar from '../components/TopBar'

export default function Logout () {
  const router = useRouter()
  function onSubmit () {
    window.localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div>
      <TopBar />
      <Container>
        <div className="flex justify-center min-h-screen items-center">
          <form onSubmit={onSubmit} className="shadow p-5 max-w-sm">
            <h1>로그아웃 하시겠습니까?</h1>
            <button type="submit" className="bg-red-500 text-white hover:bg-red-600 font-bold mt-5 p-3 rounded block w-full">로그아웃</button>
            <Link passHref href="/"><button type="submit" className="bg-gray-500 text-white hover:bg-gray-600 font-bold mt-5 p-3 rounded block w-full">취소</button></Link>
          </form>
        </div>
      </Container>
    </div>
  )
}
