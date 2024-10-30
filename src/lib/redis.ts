// src/lib/redis.ts
// Redis client for caching and real-time features

import { Redis } from 'ioredis'

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }

  throw new Error('REDIS_URL is not defined')
}

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

redis.on('error', (error) => {
  console.error('Redis connection error:', error)
})

redis.on('connect', () => {
  console.log('Redis connected successfully')
})

// Helper functions for common operations
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

export const cacheSet = async (
  key: string,
  value: any,
  expirationSeconds?: number
): Promise<void> => {
  const serialized = JSON.stringify(value)
  if (expirationSeconds) {
    await redis.setex(key, expirationSeconds, serialized)
  } else {
    await redis.set(key, serialized)
  }
}

export const cacheDel = async (key: string): Promise<void> => {
  await redis.del(key)
}

export const cacheFlush = async (): Promise<void> => {
  await redis.flushall()
}
