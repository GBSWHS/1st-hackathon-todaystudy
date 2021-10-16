import { useRouter } from 'next/dist/client/router'
import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import Container from '../components/Container'
import Link from 'next/link'
import TopBar from '../components/TopBar'

export default function LoginPage () {
  const router = useRouter()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [passwd, setPasswd] = useState('')
  const [isTeacher, setIsTeacher] = useState(false)
  const [roomcode, setRoomcode] = useState('')
  const [passwdCheck, setPasswdCheck] = useState('')

  async function onSubmit (event: FormEvent) {
    event.preventDefault()

    if (passwd !== passwdCheck) return toast.error('비밀번호가 서로 일치하지 않습니다')

    const data = await fetch('/api/regist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id, passwd, name, roomcode, isTeacher
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
          <form onSubmit={onSubmit} className="shadow p-5 max-w-sm">
            <h1 className="w-full text-center text-xl mb-3 font-bold">투데이 스터디 회원가입</h1>

            <select onChange={(event) => setIsTeacher(!!event.target.value)} className="w-full border-2 border-green-500 p-2 rounded">
              <option value="">학생</option>
              <option value="true">선생님</option>
            </select>

            <input minLength={3} maxLength={12} required className="w-full border-2 mt-1 border-green-500 p-2 rounded" type="text" placeholder="아이디" onChange={(event) => setId(event.target.value)} />
            <input required className="w-full border-2 border-green-500 mt-1 p-2 rounded" type="text" placeholder="실명" onChange={(event) => setName(event.target.value)} />
            <input minLength={8} required className="w-full border-2 border-green-500 mt-1 rounded p-2" type="password" placeholder="비밀번호" onChange={(event) => setPasswd(event.target.value)} />
            <input required className="w-full border-2 border-green-500 mt-1 rounded p-2" type="password" placeholder="비밀번호 확인" onChange={(event) => setPasswdCheck(event.target.value)} />

            {!isTeacher && <input required maxLength={10} minLength={10} className="w-full border-2 border-green-500 mt-5 p-2 rounded" type="text" placeholder="초대코드" onChange={(event) => setRoomcode(event.target.value)} />}

            <button type="submit" className="bg-green-500 text-white hover:bg-green-600 font-bold mt-5 p-3 rounded block w-full">회원 가입</button>
            <Link href="/login"><button className="border-2 border-green-500 text-green-500 hover:bg-green-600 hover:text-white font-bold mt-1 p-3 rounded block w-full">로그인으로...</button></Link>
          </form>
        </div>
      </Container>
    </div>
  )
}
