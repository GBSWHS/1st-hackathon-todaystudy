import { useEffect, useState } from 'react'
import Container from '../components/Container'
import TopBar from '../components/TopBar'

export default function Logout () {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const token = window.localStorage.getItem('token')!

    if (!window.localStorage.getItem('token')) return

    fetch('/api/user?all=true', { headers: { authorization: `HANDSOME_PMH ${token}` } })
      .then((res) => res.json())
      .then((res) => setUsers(res.users))
  }, [])

  return (
    <div>
      <TopBar />
      <Container>
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-xl font-bold">도움점수 순위</h1>
          <table className="w-1/2 mt-3">
            <thead>
              <tr>
                <th className="border-4 p-3">순위</th>
                <th className="border-4 p-3">이름</th>
                <th className="border-4 p-3">점수</th>
              </tr>
            </thead>
            <tbody>
              {users.sort((a, b) => b.point - a.point).map((u, i) => (
                <tr key={i}>
                  <td className="border-2 p-3">{i + 1}위</td>
                  <td className="border-2 p-3">{u.name}</td>
                  <td className="border-2 p-3">{u.point} P</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  )
}
