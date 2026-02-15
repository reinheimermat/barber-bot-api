import Elysia, { t } from 'elysia'
import { fetchAvailableHoursService } from '@/services/appointment/fetch-available-hours'

export const availableHoursController = new Elysia().get(
  '/available-hours/:phoneNumberId/:barberId/',
  async (ctx) => {
    const hours = await fetchAvailableHoursService.execute({
      barberId: ctx.params.barberId,
      phoneId: ctx.params.phoneNumberId
    })

    return hours
  },
  {
    params: t.Object({
      phoneNumberId: t.String(),
      barberId: t.String()
    })
  }
)
