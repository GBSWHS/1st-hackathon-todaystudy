import { useRouter } from 'next/dist/client/router'
import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import Container from '../components/Container'
import Link from 'next/link'
import TopBar from '../components/TopBar'

export default function LoginPage () {
  const router = useRouter()
  const [id, setId] = useState('')
  const [passwd, setPasswd] = useState('')

  async function onSubmit (event: FormEvent) {
    event.preventDefault()

    const data = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id, passwd
      })
    }).then((res) => res.json())

    if (!data.success) return toast.error(data.message)

    window.localStorage.setItem('token', data.token)
    router.push('/')
  }

  return (
    <div>
      <TopBar />
      <Container>
        <div className="flex justify-center min-h-screen items-center">
          <form onSubmit={onSubmit} className="shadow p-16 max-w-sm">
            <h1 className="w-full text-center text-xl mb-5 font-bold">투데이 스터디 로그인</h1>

            <input required className="w-full border-2 border-blue-500 p-2 rounded" type="text" placeholder="아이디" onChange={(event) => setId(event.target.value)} />
            <input required className="w-full border-2 border-blue-500 mt-1 rounded p-2" type="password" placeholder="비밀번호" onChange={(event) => setPasswd(event.target.value)} />

            <button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 font-bold mt-5 p-3 rounded block w-full">로그인!</button>
            <Link href="/regist"><button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white font-bold mt-1 p-3 rounded block w-full">회원가입</button></Link>
          </form>
        </div>
      </Container>
    </div>
  )
}
