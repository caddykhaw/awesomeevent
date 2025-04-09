import { Hono } from 'hono'
import { eventController } from '../controllers/events'
import { auth } from '../middleware/auth'

const events = new Hono()

// Public routes
events.get('/', eventController.getAll)
events.get('/:id', eventController.getOne)

// Protected routes
events.post('/', auth, eventController.create)
events.put('/:id', auth, eventController.update)
events.delete('/:id', auth, eventController.delete)

export default events 