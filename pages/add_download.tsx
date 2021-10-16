import { useEffect, useState } from 'react'
import Link from 'next/link'
import TopBar from '../components/TopBar'

function Home () {
  const [token, setToken] = useState('')

  useEffect(() => {
    setToken(window.localStorage.getItem('token')!)
  }, [])

  return (
    <div>
      <TopBar />
      <div className="flex justify-center min-h-screen items-center">
        {token && <form method="post" encType="multipart/form-data" action="/api/downloads">
          <h1 className="w-full text-center text-xl mb-5 font-bold">수업 자료 추가</h1>

          <input name="title" required className="w-full border-2 border-yellow-500 p-2 rounded" type="text" placeholder="자료명" />
          <input name="content" required className="w-full border-2 border-yellow-500 p-2 rounded" type="text" placeholder="자료 설명" />
          <input type="file" name="file" />

          <input type="hidden" name="token" value={token} />

          <button type="submit" className="bg-yellow-500 text-white hover:bg-yellow-600 font-bold mt-5 p-3 rounded block w-full">추가!</button>
          <Link passHref href="/"><button className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-600 hover:text-white font-bold mt-1 p-3 rounded block w-full">취소</button></Link>
        </form>}
      </div>
    </div>
  )
}

export default Home
