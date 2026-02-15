import { Elysia } from 'elysia'
import { availableHoursController } from './controllers/appointments/available-hours-controller'
import { setBookingFlowController } from './controllers/flow/set-booking-flow'

export const app = new Elysia({
  prefix: '/api'
})

app.get('/', () => 'Hello World!')

app.use(availableHoursController)

app.use(setBookingFlowController)

app.listen({
  port: parseInt(process.env.PORT || '3333'),
  hostname: '0.0.0.0'
})

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
