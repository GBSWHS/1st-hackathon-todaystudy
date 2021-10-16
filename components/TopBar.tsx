import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TopBar () {
  const [token, setToken] = useState('')
  const [stats, setStats] = useState<any>({})
  const [dropdown, setDropdown] = useState(false)

  useEffect(() => {
    setToken(window.localStorage.getItem('token')!)

    if (!window.localStorage.getItem('token')) return
    fetch('/api/user', { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } })
      .then((res) => res.json())
      .then((res) => setStats(res.data))
  }, [])

  return (
    <nav className="flex justify-between items-center bg-a text-white p-3">
      <div className="flex text-2xl">
        <Link href="/">투데이 스터디</Link>
      </div>

      <ul className="flex justify-center gap-3 text-xl">
        <li className="hover:bownloadsg-gray-500 px-5 py-2 rounded"><Link href="/" >메인</Link></li>
        <li className="hover:bg-gray-500 px-5 py-2 rounded"><Link href="/ranking">순위</Link></li>
      </ul>

      <ul className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        {!token && <li><a href="/login">로그인</a></li>}
        {token && !dropdown && <li>{stats.point}p</li>}
        {token && !dropdown && <li className="cursor-pointer hover:bg-gray-400" onClick={() => setDropdown(!dropdown)}>{stats.name}님</li>}
        {token && dropdown && <div className="flex gap-3" onClick={() => setDropdown(!dropdown)}>
          <li>초대코드: {stats.roomcode}</li>
          <li className="hover:underline"><Link href="/logout">로그아웃</Link></li>
        </div>}
      </ul>
    </nav>
  )
}
