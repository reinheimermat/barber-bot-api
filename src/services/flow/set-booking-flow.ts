import { prisma } from '@/lib/prisma'

interface SetBookingFlowRequest {
  phoneId: string
}

export abstract class SetBookingFlowService {
  static async execute({ phoneId }: SetBookingFlowRequest) {
    const barbershop = await prisma.barbershop.findUnique({
      where: {
        wabaPhoneId: phoneId
      }
    })

    if (!barbershop) {
      return {
        message: 'Barbershop not found'
      }
    }

    const barbers = await prisma.barber.findMany({
      where: {
        barbershopId: barbershop.id
      }
    })

    const services = await prisma.service.findMany({
      where: {
        barbershopId: barbershop.id
      }
    })

    return {
      barbers,
      services
    }
  }
}
