import { prisma } from '../lib/prisma'

export async function verifyAvailableHour(barberId: string, data: Date): Promise<boolean> {
  // 1. Verifica o dia da semana
  const dayOfWeek = data.getDay()

  // 2. Busca horário de trabalho do barbeiro nesse dia
  const workHour = await prisma.workHour.findFirst({
    where: {
      barberId,
      dayOfWeek,
      isActive: true
    }
  })

  // Se não trabalha nesse dia, retorna false
  if (!workHour) {
    return false
  }

  // 3. Define início e fim do dia
  const inicioDia = new Date(data)
  inicioDia.setHours(0, 0, 0, 0)

  const fimDia = new Date(data)
  fimDia.setHours(23, 59, 59, 999)

  // 4. Busca agendamentos e indisponibilidades do dia
  const [agendamentos, indisponibilidades] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        barberId: barberId,
        startDate: {
          gte: inicioDia,
          lte: fimDia
        }
        // status: {
        //   notIn: ['canceled']
        // }
      },
      select: {
        startDate: true,
        endDate: true
      }
    }),
    prisma.unavailability.findMany({
      where: {
        barberId: barberId,
        isActive: true,
        OR: [
          // Bloqueios pontuais que afetam este dia
          {
            isRecurring: false,
            startDate: { lte: fimDia },
            endDate: { gte: inicioDia }
          },
          // Bloqueios recorrentes
          {
            isRecurring: true,
            OR: [
              { dayOfWeek: null }, // Todos os dias
              { dayOfWeek: dayOfWeek } // Dia específico
            ]
          }
        ]
      }
    })
  ])

  // 5. Gera slots de tempo baseado no horário de trabalho
  const [horaInicio, minInicio] = workHour.startTime.split(':').map(Number)
  const [horaFim, minFim] = workHour.endTime.split(':').map(Number)

  const inicioMinutos = horaInicio * 60 + minInicio
  const fimMinutos = horaFim * 60 + minFim
  const duracaoServico = 30 // Minutos - pode ser parametrizado

  // 6. Percorre os slots e verifica se tem pelo menos 1 disponível
  for (let min = inicioMinutos; min < fimMinutos; min += duracaoServico) {
    const hora = Math.floor(min / 60)
    const minuto = min % 60

    const horarioTeste = new Date(data)
    horarioTeste.setHours(hora, minuto, 0, 0)

    // Pula horários no passado
    const agora = new Date()
    if (horarioTeste < agora) continue

    const horarioFim = new Date(horarioTeste)
    horarioFim.setMinutes(horarioFim.getMinutes() + duracaoServico)

    // Verifica se este slot está disponível
    const disponivel = estaDisponivel(
      horarioTeste,
      horarioFim,
      agendamentos,
      indisponibilidades,
      dayOfWeek
    )

    // Se encontrou pelo menos 1 horário disponível, retorna true
    if (disponivel) {
      return true
    }
  }

  // Nenhum horário disponível neste dia
  return false
}

// Função auxiliar que verifica se um horário específico está livre
function estaDisponivel(
  inicio: Date,
  fim: Date,
  agendamentos: { startDate: Date; endDate: Date }[],
  indisponibilidades: any[],
  dayOfWeek: number
): boolean {
  // 1. Verifica conflito com agendamentos
  const temAgendamento = agendamentos.some((ag) => {
    return inicio < ag.endDate && fim > ag.startDate
  })

  if (temAgendamento) return false

  // 2. Verifica conflito com indisponibilidades
  const temIndisponibilidade = indisponibilidades.some((ind) => {
    if (!ind.isRecurring) {
      // Bloqueio pontual - verifica sobreposição de datas
      return inicio < ind.endDate && fim > ind.startDate
    } else {
      // Bloqueio recorrente
      // Verifica se o dia da semana bate (null = todos os dias)
      if (ind.dayOfWeek !== null && ind.dayOfWeek !== dayOfWeek) {
        return false
      }

      // Compara apenas os horários (HH:MM)
      const horaInicioInd = timeStringToMinutes(ind.startDate)
      const horaFimInd = timeStringToMinutes(ind.endDate)

      const horaInicioTeste = inicio.getHours() * 60 + inicio.getMinutes()
      const horaFimTeste = fim.getHours() * 60 + fim.getMinutes()

      return horaInicioTeste < horaFimInd && horaFimTeste > horaInicioInd
    }
  })

  return !temIndisponibilidade
}

// Função auxiliar para converter string de tempo em minutos
function timeStringToMinutes(datetime: Date | string): number {
  if (typeof datetime === 'string') {
    // Se for string no formato "HH:MM"
    const [h, m] = datetime.split(':').map(Number)
    return h * 60 + m
  }
  // Se for Date
  return datetime.getHours() * 60 + datetime.getMinutes()
}
