import moment from 'moment'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import xss from 'xss'
import Container from '../../components/Container'
import TopBar from '../../components/TopBar'

export default function BorderPage () {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [isOwnerOnly, setOwnerOnly] = useState(false)
  const [stats, setStats] = useState<any>({})
  const fetcher = (path: string) => fetch(path, { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } }).then((res) => res.json())

  const { id } = router.query || new URL(window.location.toString()).pathname.split('/')[2] || 1

  async function onSubmit (event: FormEvent) {
    event.preventDefault()

    const data = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `PMHISHANDSOME ${window.localStorage.getItem('token')!}`
      },
      body: JSON.stringify({
        content: comment, boardId: id, isOwnerOnly
      })
    }).then((res) => res.json())

    if (!data.success) return toast.error(data.message)

    router.reload()
  }

  useEffect(() => {
    if (!window.localStorage.getItem('token')) return
    fetch('/api/user', { headers: { authorization: `HANDSOME_PMH ${window.localStorage.getItem('token')!}` } })
      .then((res) => res.json())
      .then((res) => setStats(res.data))
  }, [])

  const { data, error } = useSWR('/api/board?id=' + id, fetcher)

  if (error) return <Container>{error}</Container>
  if (!data) return <Container><p>Loading...</p></Container>
  if (!data.success) return <Container><p>{data.message}</p></Container>

  return (
    <div>
      <TopBar />
      <Container>
        <div>
          <h1 className="text-4xl font-bold">{data.data[0]?.title}</h1>
          <p>작성자: {data.data[0]?.name} (@{data.data[0]?.author}) | {moment(data.data[0]?.created_at).format('MM월 DD일')}</p>
          <br />

          <div dangerouslySetInnerHTML={{ __html: xss(data.data[0]?.content) }}></div>
        </div>
        <hr className="my-5" />
        <form onSubmit={onSubmit}>
          <h1 className="text-2xl font-bold">댓글 작성</h1>
          <textarea onChange={(event) => setComment(event.target.value)} cols={100} className="border-2 p-3 border-green-500 block"></textarea>
          <button type="submit" className="bg-green-500 mt-3 p-3 px-5 rounded text-white">확인</button>
          <input className="ml-2" type="checkbox" id="isOwnerOnly" onChange={() => setOwnerOnly(!isOwnerOnly)} />
          <label htmlFor="isOwnerOnly">작성자만 볼 수 있음</label>
        </form>

        <div className="flex flex-col gap-3 mt-10">
          {data.data[0]?.comments.map((comment: any, i: number) => (
            <div className="bg-white rounded shadow p-10 flex justify-between" key={i}>
              <div>
                <p className="text-sm italic">{comment.name}{comment.isOwnerOnly ? ' | 작성자만' : ''}</p>
                <p>{comment.content}</p>
              </div>
              <div className="text-red-500">
                <p className="font-bold">+ {comment.isPointed ? 5 : 1}P</p>
                {stats.isTeacher && !comment.isPointed && <button onClick={(event) => toast.success('+4 포인트를 추가했습니다')} className="bg-red-400 p-2 rounded text-white">+ 4P 주기</button>}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
