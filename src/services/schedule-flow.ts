import { prisma } from '@/lib/prisma'

export interface DecryptedBody {
  screen: string
  action: string
  data: {
    action: 'FETCH_HOURS' | 'CONFIRM_BOOKING'
    error?: string
    barberId: string
    date: string
    hour: string
  }
  flow_token: string
  version: string
}

interface ScheduleFlowRequest {
  decryptedBody: DecryptedBody
}

export abstract class ScheduleFlowService {
  static async execute({ decryptedBody }: ScheduleFlowRequest) {
    const { action, data, screen, flow_token } = decryptedBody

    const tokenData = JSON.parse(flow_token)
    const barbershopId = tokenData.barbearia_id
    const customerPhone = tokenData.phone_number

    console.log('barbershopId', barbershopId)
    console.log('customerPhone', customerPhone)
    console.log('Data', data)

    if (action === 'ping') {
      return {
        data: {
          status: 'active'
        }
      }
    }

    if (data?.error) {
      console.warn('Received client error:', data)
      return {
        data: {
          acknowledged: true
        }
      }
    }

    if (action === 'INIT') {
      return {
        screen,
        data: {}
      }
    }

    if (action === 'data_exchange') {
      switch (screen) {
        case 'SCHEDULE': {
          if (data.action === 'FETCH_HOURS') {
            const { barberId, date } = data

            const appointments = await prisma.appointment.findMany({
              where: {
                barberId: barberId,
                startDate: {
                  gte: new Date(date)
                }
              }
            })

            return {
              screen,
              data: {
                appointments
              }
            }
          }

          if (data.action === 'CONFIRM_BOOKING') {
            return {
              screen: 'USER_INFO',
              data: {
                barberId: data.barberId,
                date: data.date,
                hour: data.hour
              }
            }
          }

          return {
            screen,
            data: {
              error: 'Invalid action'
            }
          }
        }
        default:
          break
      }
    }

    if (action === 'complete') {
      const { barberId, date, hour } = data

      const isAvailable = await prisma.appointment.findFirst({
        where: {
          barberId: barberId,
          startDate: {
            gte: new Date(`${date}T${hour}:00`)
          }
        }
      })

      if (!isAvailable) {
        return {
          screen,
          data: {
            error: 'Appointment not available'
          }
        }
      }

      await prisma.appointment.create({
        data: {
          startDate: new Date(`${date}T${hour}:00`),
          endDate: new Date(`${date}T${hour}:30`),
          barberId: barberId,
          barbershopId: 'asdasd',
          googleCalendarEventId: 'asdasd'
        }
      })

      return {
        screen: 'SUCCESS',
        data: {
          extension_message_response: {
            params: {
              flow_token
            }
          }
        }
      }
    }
  }
}
