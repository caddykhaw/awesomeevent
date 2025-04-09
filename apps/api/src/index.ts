import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import events from './routes/events'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

// Middleware
app.use('*', cors())

// Error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      message: err.message,
      status: err.status,
    }, err.status)
  }

  console.error(err)
  return c.json({
    message: 'Internal Server Error',
    status: 500,
  }, 500)
})

// Routes
app.route('/api/events', events)

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Start server
const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
}) 