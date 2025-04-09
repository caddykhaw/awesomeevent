import { Context } from 'hono'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
import { HTTPException } from 'hono/http-exception'

export const auth = async (c: Context, next: () => Promise<void>) => {
  try {
    const authMiddleware = ClerkExpressWithAuth({
      secretKey: process.env.CLERK_SECRET_KEY as string,
    })

    // Convert Hono request to Express-like request
    const req = {
      headers: Object.fromEntries(c.req.raw.headers.entries()),
    }

    await new Promise((resolve, reject) => {
      authMiddleware(req, {}, (err: any) => {
        if (err) reject(err)
        resolve(req)
      })
    })

    // @ts-ignore - Clerk types
    c.set('user', req.auth)
    await next()
  } catch (error) {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
} 