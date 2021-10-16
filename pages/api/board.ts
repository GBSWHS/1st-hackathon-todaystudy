/* eslint-disable camelcase */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { JwtPayload, verify } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import knex from 'knex'

const db = knex({
  client: 'mysql',
  connection: {
    user: 'byte',
    host: 'localhost',
    port: 3306,
    database: 'byte'
  }
})

type Data = {
  success: boolean
  data?: {
    title: string
    content: string
    finished_at: string
    created_at: string
    comments?: any[]
  }[],
  message?: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  const token = req.headers.authorization?.split(' ')?.[1]
  const { id } = req.query

  if (!token) return res.send({ success: false, message: '세션이 잘못되었습니다. 다시 로그인하세요.' })

  try {
    const data = verify(token, process.env.JWT_SECRET!) as JwtPayload
    const [user] = await db.select('*').from('users').where({ id: data.id! })
    if (!user) return res.send({ success: false, message: '사용자를 찾을 수 없습니다. 다시 로그인하세요.' })

    const board = await db.select('*').from('board').where({ roomcode: user.roomcode, ...(id ? { id } : {}) })
    const comments = await db.select('*').from('comments').where({ ...(id ? { boardId: id } : {}) })

    if (id) return res.send({ success: true, data: [{ ...board[0], comments }] })
    if (req.method === 'GET') return res.send({ success: true, data: board })

    if (!user.isTeacher) return res.send({ success: false, message: '선생님이 아닙니다!' })
    await db.insert({ ...req.body, author: user.id, name: user.name }).into('board')

    res.send({ success: true })
  } catch (e) {
    return res.send({ success: false, message: '인증이 잘못되었습니다. 다시 로그인하세요.' })
  }
}
