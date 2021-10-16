import { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/dist/client/router'
import SunEditorCore from 'suneditor/src/lib/core'
import dynamic from 'next/dynamic'
import TopBar from '../components/TopBar'
import 'suneditor/dist/css/suneditor.min.css'
const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false
})

function Home () {
  const [token, setToken] = useState('')
  const [title, setTitle] = useState('')
  const [stats, setStats] = useState<any>({})
  const router = useRouter()
  const editor = useRef<SunEditorCore>()
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor
  }

  async function onSubmit (event: FormEvent) {
    event.preventDefault()

    const data = await fetch('/api/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` },
      body: JSON.stringify({
        title, content: editor.current?.getContents(false), roomcode: stats.roomcode
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
          <h1 className="w-full text-center text-xl mb-5 font-bold">게시글 추가</h1>

          <input required className="w-full border-2 border-yellow-500 p-2 rounded" type="text" placeholder="게시글명" onChange={(event) => setTitle(event.target.value)} />
          <SunEditor height="300" width="1000" getSunEditorInstance={getSunEditorInstance} />

          <button type="submit" className="bg-yellow-500 text-white hover:bg-yellow-600 font-bold mt-5 p-3 rounded block w-full">추가!</button>
          <Link passHref href="/"><button className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-600 hover:text-white font-bold mt-1 p-3 rounded block w-full">취소</button></Link>
        </form>}
      </div>
    </div>
  )
}

export default Home
