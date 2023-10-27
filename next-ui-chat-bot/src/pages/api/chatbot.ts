// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = {
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { question, endpoint } = req.body

  try {
    // Make a request using Axios
    const response = await axios({
      method: 'post',
      url: endpoint ?? process.env.NEXT_API,
      headers: {
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ question }),
      responseType: 'stream',
    })

    let data = ''

    response.data.on('data', (chunk: any) => {
      data += chunk
    })

    response.data.on('end', () => {
      res.status(200).send(data as any)
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from external service.' })
  }
}
