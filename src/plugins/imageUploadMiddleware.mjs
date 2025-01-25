import sharp from 'sharp'
import fetch from 'node-fetch'

export const imageUploadMiddleware = () => ({
  name: 'image-upload-middleware',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!(req.url === '/image-uploader' && req.method === 'POST')) {
        next()
        return
      }

      const chunks = []

      req.on('data', (chunk) => {
        chunks.push(chunk)
      })

      req.on('end', async () => {
        res.setHeader('Content-Type', 'application/json')

        try {
          const webpImageBuffer = await sharp(Buffer.concat(chunks), {
            animated: true,
          })
            .webp()
            .toBuffer()

          const uploadRes = await fetch('https://kaiu.matsu7089.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'image/webp' },
            body: webpImageBuffer,
          })

          res.end(await uploadRes.text())
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message }))
        }
      })

      return
    })
  },
})
