import { prisma } from '@/lib/prisma'
import { formatDateISO } from '@/utils/format-date-iso'
import { verifyAvailableHour } from '@/utils/verify-available-hour'

interface FetchAvailableHoursService {
  phoneId: string
  barberId: string
}

export abstract class fetchAvailableHoursService {
  static async execute({ barberId, phoneId }: FetchAvailableHoursService) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { wabaPhoneId: phoneId }
    })

    if (!barbershop) throw new Error('Barbershop not found')

    const barber = await prisma.barber.findUnique({
      where: { id: barberId, barbershopId: barbershop.id, isActive: true },
      include: {
        workHours: {
          where: { isActive: true }
        }
      }
    })

    if (!barber) throw new Error('Barber not fond')

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 30)

    const workingDaysMap: Record<number, string> = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat'
    }

    const workingDays = barber.workHours
      .map((wh) => workingDaysMap[wh.dayOfWeek])
      .filter((v, i, a) => a.indexOf(v) === i) // unique

    const unavailableDates: string[] = []
    const nowDate = new Date(today)

    while (nowDate <= maxDate) {
      const diaSemana = nowDate.getDay()

      // Verifica se barbeiro trabalha neste dia
      const isWorkToday = barber.workHours.some((wh) => wh.dayOfWeek === diaSemana)

      if (!isWorkToday) {
        unavailableDates.push(formatDateISO(nowDate))
      } else {
        // Verifica se tem algum horário disponível
        const temHorario = await verifyAvailableHour(barber.id, nowDate)

        if (!temHorario) {
          unavailableDates.push(formatDateISO(nowDate))
        }
      }

      nowDate.setDate(nowDate.getDate() + 1)
    }

    return {
      barberName: barber.name,
      minDate: formatDateISO(today),
      maxDate: formatDateISO(maxDate),
      workingDays,
      unavailableDates
    }
  }
}
