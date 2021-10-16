import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/dist/client/router'
import moment from 'moment'

import TopBar from '../components/TopBar'

function Home () {
  const [token, setToken] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // eslint-disable-next-line camelcase
  const [finished_at, setFinishedAt] = useState('')
  const [stats, setStats] = useState<any>({})
  const router = useRouter()

  async function onSubmit (event: FormEvent) {
    event.preventDefault()

    const data = await fetch('/api/homeworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` },
      body: JSON.stringify({
        title, content, finished_at: moment(finished_at).format('YYYY-MM-DD hh:mm:ss'), roomcode: stats.roomcode
      })
    }).then((res) => res.json())

    if (!data.success) return toast.error(data.message)

    router.push('/')
  }

  useEffect(() => {
    setToken(window.localStorage.getItem('token')!)

    if (!window.localStorage.getItem('token')) return
    fetch('/api/user', { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } })
      .then((res) => res.json())
      .then((res) => setStats(res.data))
  }, [])

  return (
    <div>
      <TopBar />
      <div className="flex justify-center min-h-screen items-center">
        {token && <form onSubmit={onSubmit}>
            <h1 className="w-full text-center text-xl mb-5 font-bold">과제 추가</h1>

            <input required className="w-full border-2 border-yellow-500 p-2 rounded" type="text" placeholder="과제 이름" onChange={(event) => setTitle(event.target.value)} />
            <input required className="w-full border-2 border-yellow-500 mt-1 rounded p-2" type="text" placeholder="과제 설명" onChange={(event) => setContent(event.target.value)} />
            <input className="w-full border-2 border-yellow-500 mt-1 rounded p-2" type="date" placeholder="과제 마감일" onChange={(event) => setFinishedAt(event.target.value)} />

            <button type="submit" className="bg-yellow-500 text-white hover:bg-yellow-600 font-bold mt-5 p-3 rounded block w-full">추가!</button>
            <Link passHref href="/"><button className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-600 hover:text-white font-bold mt-1 p-3 rounded block w-full">취소</button></Link>
        </form>}
      </div>
    </div>
  )
}

export default Home
