import Elysia, { t } from 'elysia'
import { env } from '@/env'
import { ScheduleFlowService } from '@/services/schedule-flow'
import { decryptRequest } from '@/utils/encryption'

export const flowScheduleWebhook = new Elysia().get(
  'schedule',
  async (ctx) => {
    const { decryptedBody } = decryptRequest(ctx.body, env.PRIVATE_KEY, env.PASSPHRASE)

    const flow = await ScheduleFlowService.execute({ decryptedBody })

    return flow
  },
  {
    body: t.Object({
      encrypted_aes_key: t.String(),
      encrypted_flow_data: t.String(),
      initial_vector: t.String()
    })
  }
)
