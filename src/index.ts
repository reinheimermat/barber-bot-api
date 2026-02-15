import { Elysia } from 'elysia'
import { availableHoursController } from './controllers/appointments/available-hours-controller'
import { setBookingFlowController } from './controllers/flow/set-booking-flow'

export const app = new Elysia({
  prefix: '/api'
})

app.use(availableHoursController)

app.use(setBookingFlowController)

app.listen(3333)

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
