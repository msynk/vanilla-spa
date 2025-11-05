import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 3000

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.ts': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
}

async function serveFile(filePath: string, contentType: string): Promise<Buffer | string> {
  const ext = path.extname(filePath)

  // Transpile .ts files on the fly
  if (ext === '.ts') {
    const result = await build({
      entryPoints: [filePath],
      bundle: false,
      write: false,
      format: 'esm',
      target: 'es2020',
      platform: 'browser'
    })
    return result.outputFiles[0].text
  }

  return fs.readFileSync(filePath)
}

const server = http.createServer(async (req, res) => {
  try {
    const reqPath = req.url === '/' ? '/index.html' : req.url!
    let filePath = path.join(__dirname, reqPath)

    if (!fs.existsSync(filePath)) {
      // SPA fallback to index.html
      filePath = path.join(__dirname, 'index.html')
    }

    const ext = path.extname(filePath)
    const contentType = MIME_TYPES[ext] || 'text/plain'
    const content = await serveFile(filePath, contentType)

    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  } catch (err) {
    console.error(err)
    res.writeHead(500)
    res.end('Server Error')
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Dev server running at http://localhost:${PORT}`)
})
