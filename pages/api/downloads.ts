// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { JwtPayload, verify } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import knex from 'knex'

import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import { copyFileSync } from 'fs'

const db = knex({
  client: 'mysql',
  connection: {
    user: 'byte',
    host: 'localhost',
    port: 3306,
    database: 'byte'
  }
})

const handler = nextConnect()
handler.use(middleware)

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')?.[1]
  if (!token) return res.send({ success: false, message: '세션이 잘못되었습니다. 다시 로그인하세요.' })

  try {
    const data = verify(token, process.env.JWT_SECRET!) as JwtPayload
    const [user] = await db.select('*').from('users').where({ id: data.id! })
    if (!user) return res.send({ success: false, message: '사용자를 찾을 수 없습니다. 다시 로그인하세요.' })

    const files = await db.select('*').from('files').where({ roomcode: user.roomcode })
    res.send({ success: true, data: files })
  } catch (e) {
    console.log(e)
    return res.send({ success: false, message: '인증이 잘못되었습니다. 다시 로그인하세요.' })
  }
})

handler.post(async (req: any, res: NextApiResponse) => {
  console.log(req.body)
  console.log(req.files)

  const token = req.body.token[0]

  if (!token) return res.json({ success: false, message: '세션이 잘못되었습니다. 다시 로그인하세요.' })

  try {
    const data = verify(token, process.env.JWT_SECRET!) as JwtPayload
    const [user] = await db.select('*').from('users').where({ id: data.id! })
    if (!user) return res.json({ success: false, message: '사용자를 찾을 수 없습니다. 다시 로그인하세요.' })

    if (!user.isTeacher) return res.send({ success: false, message: '선생님이 아닙니다!' })

    copyFileSync(req.files.file[0].path, `public/upload/${req.files.file[0].originalFilename}`)
    await db.insert({ title: req.body.title[0], content: req.body.content[0], filename: req.files.file[0].originalFilename, roomcode: user.roomcode }).into('files').catch(console.log)

    res.redirect('/')
  } catch (e) {
    return res.json({ success: false, message: '인증이 잘못되었습니다. 다시 로그인하세요.' })
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler
