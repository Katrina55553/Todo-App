import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createJsonFileAdapter } from './tui/jsonFileAdapter.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/Todo-App/' : '/',
    plugins: [
      vue(),
      ...(mode !== 'production' ? [vueDevTools()] : []),
      {
        name: 'todos-api',
        configureServer(server) {
          const storage = createJsonFileAdapter(path.resolve(process.cwd(), 'todos.json'))

          server.middlewares.use('/api/todos', async (req, res, next) => {
            if (req.method === 'GET') {
              const todos = await storage.load()
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(todos))
              return
            }

            if (req.method === 'POST') {
              let body = ''
              req.on('data', chunk => {
                body += chunk
              })
              req.on('end', async () => {
                try {
                  const todos = JSON.parse(body)
                  await storage.save(todos)
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ ok: true }))
                } catch (err) {
                  res.statusCode = 500
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
              return
            }

            next()
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
