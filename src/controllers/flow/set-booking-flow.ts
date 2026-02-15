import Elysia, { t } from 'elysia'
import { SetBookingFlowService } from '@/services/flow/set-booking-flow'

export const availableHoursController = new Elysia().get(
  '/booking-flow/:phoneNumberId',
  async (ctx) => {
    const { phoneNumberId } = ctx.params

    const { barbers, services } = await SetBookingFlowService.execute({ phoneId: phoneNumberId })

    return {
      barbers,
      services
    }
  },
  {
    params: t.Object({
      phoneNumberId: t.String()
    })
  }
)
