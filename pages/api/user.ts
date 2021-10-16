// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import knex from 'knex'

import { JwtPayload, verify } from 'jsonwebtoken'

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
    name: string
    roomcode: string
    point: number
    isTeacher: boolean
  },
  users?: {
    name: string
    point: number
  }[],
  message?: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  const token = req.headers.authorization?.split(' ')?.[1]
  const { all } = req.query

  if (!token) return res.send({ success: false, message: '세션이 잘못되었습니다. 다시 로그인하세요.' })

  try {
    const data = verify(token, process.env.JWT_SECRET!) as JwtPayload
    const [user] = await db.select('*').from('users').where({ id: data.id! })
    if (!user) return res.send({ success: false, message: '사용자를 찾을 수 없습니다. 다시 로그인하세요.' })

    if (all) {
      const users = await db.select('name', 'point').from('users').where({ isTeacher: 0, roomcode: user.roomcode })
      return res.send({ success: true, users })
    }

    res.send({ success: true, data: { name: user.name, point: user.point, roomcode: user.roomcode, isTeacher: !!user.isTeacher } })
  } catch (e) {
    return res.send({ success: false, message: '인증이 잘못되었습니다. 다시 로그인하세요.' })
  }
}
