import z from 'zod'

const envSchema = z.object({
  PRIVATE_KEY: z.string().min(1),
  PASSPHRASE: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  PORT: z.string().default('3333')
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  throw new Error(`Invalid environment variables: ${JSON.stringify(_env.error.issues)}`)
}

export const env = _env.data
