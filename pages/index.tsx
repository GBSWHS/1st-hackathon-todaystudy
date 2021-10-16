import { useEffect, useState } from 'react'
import Link from 'next/link'
import TopBar from '../components/TopBar'

function Home () {
  const [stats, setStats] = useState<any>({})
  const [homeworks, setHomeworks] = useState<any[]>([])
  const [downloads, setDownloads] = useState<any[]>([])
  const [board, setBoard] = useState<any[]>([])

  useEffect(() => {
    if (!window.localStorage.getItem('token')) return
    fetch('/api/user', { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } })
      .then((res) => res.json())
      .then((res) => setStats(res.data))

    fetch('/api/homeworks', { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } })
      .then((res) => res.json())
      .then((res) => setHomeworks(res.data))

    fetch('/api/downloads', { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } })
      .then((res) => res.json())
      .then((res) => setDownloads(res.data))

    fetch('/api/board', { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } })
      .then((res) => res.json())
      .then((res) => setBoard(res.data))
  }, [])

  return (
    <div>
      <TopBar/>
      <div className="flex px-3">
        <div className="border-r-2 h-screen pr-5 pt-3 max-w-sm">
          <h1 className="text-2xl font-bold mb-3">오늘의 과제<br /></h1>
          <ul className="flex flex-col gap-2">
            {homeworks && homeworks.map((homework) => Math.floor(new Date(homework.finished_at).getTime() / 1000 / 60 / 60 / 24 - (Date.now() / 1000 / 60 / 60 / 24)) > -1 && (
              <li>
                <div className="p-5 shadow inline-block">
                  <div className="flex gap-3">
                    <div className="text-2xl font-bold text-red-500 break-words w-4/12">
                      D-{Math.floor(new Date(homework.finished_at).getTime() / 1000 / 60 / 60 / 24 - (Date.now() / 1000 / 60 / 60 / 24)) || 'Day'}
                    </div>
                    <div>
                      <h1 className="text-lg font-bold">{homework.title}</h1>
                      <p>{homework.content}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {stats.isTeacher && <Link href="/add_homework"><button className="mt-5 p-3 bg-blue-300 rounded">과제추가</button></Link>}
        </div>
        <div className="pl-3 pt-3 w-9/12 border-r-2 pr-3">
          <h1 className="text-2xl font-bold mb-3">게시글</h1>
            <ul className="flex flex-col gap-3 w-full">
              {board && board.map((b, i) => (
                <li className="w-full" key={i}>
                  <Link href={`/board/${b.id}`}>
                    <div className="p-5 shadow cursor-pointer">
                      <h1 className="text-lg font-bold">{b.title}</h1>
                      <p>{b.content.replace(/(<([^>]+)>)/gi, '').replaceAll('\n', '').substr(0, 30)}...</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          {<Link href="/add_board"><button className="mt-5 p-3 bg-blue-300 rounded">게시글 추가</button></Link>}
        </div>
        <div className="pl-3 pt-3 w-3/12">
          <h1 className="text-2xl font-bold mb-3">수업자료</h1>
            <ul className="flex flex-col gap-3 w-full">
              {downloads && downloads.map((b, i) => (
                <li className="w-full" key={i}>
                  <a target="_blank" download href={`/upload/${b.filename}`} rel="noreferrer">
                    <div className="p-5 shadow">
                      <h1 className="text-lg font-bold">{b.title}</h1>
                      <p>{b.content}</p>
                      <div className="text-sm mt-3 bg-gray-400 rounded font-bold text-white p-10 max-w-xs break-all">
                        {b.filename}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          {stats.isTeacher && <Link href="/add_download"><button className="mt-5 p-3 bg-blue-300 rounded">자료 업로드</button></Link>}
        </div>
      </div>
    </div>
  )
}

export default Home
