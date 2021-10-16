// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sha256 from 'sha256'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sign } from 'jsonwebtoken'
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
  token?: string,
  message?: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id, passwd: rawpass } = req.body

  const [user] = await db.select('*').from('users').where({ id })
  if (!user) return res.send({ success: false, message: '없는 사용자 입니다.' })

  const passwd = sha256(user.salt + rawpass)
  if (passwd !== user.passwd) return res.send({ success: false, message: '비밀번호가 잘못되었습니다.' })

  const token = sign({ id }, process.env.JWT_SECRET!)
  res.send({ success: true, token })
}
