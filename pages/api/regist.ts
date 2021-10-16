// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sha256 from 'sha256'
import type { NextApiRequest, NextApiResponse } from 'next'
import knex from 'knex'

import { sign } from 'jsonwebtoken'
import cryptoRandomString from 'crypto-random-string'

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
  let { id, passwd: rawpass, name, roomcode, isTeacher } = req.body

  const [user] = await db.select('*').from('users').where({ id })
  if (user) return res.send({ success: false, message: '해당 ID의 사용자가 이미 존재합니다.' })

  const salt = cryptoRandomString({ length: 10 })

  if (isTeacher) {
    roomcode = cryptoRandomString({ length: 10, type: 'alphanumeric' }).toUpperCase()
    await db.insert({ code: roomcode }).into('rooms')
  } else {
    const [room] = await db.select('*').from('rooms').where({ code: roomcode })
    if (!room) return res.send({ success: false, message: '초대코드가 잘못되었습니다.' })
  }

  const passwd = sha256(salt + rawpass)
  await db.insert({ id, passwd, salt, name, roomcode, isTeacher: isTeacher ? 1 : 0 }).into('users')

  const token = sign({ id }, process.env.JWT_SECRET!)
  res.send({ success: true, token })
}
