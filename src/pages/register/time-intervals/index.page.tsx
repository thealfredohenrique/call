import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { ArrowRight } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { api } from '@/src/lib/axios'
import { getWeekDays } from '@/src/utils/get-week-days'
import { convertTimeStringToMinutes } from '@/src/utils/convert-time-string-to-minutes'
import { Container, Header } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana.',
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
      })),
    )
    .refine(
      (intervals) => {
        return intervals.every((interval) => {
          return interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        })
      },
      {
        message:
          'O horário de término deve ser pelo menos uma hora distante do inicio.',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput, unknown, TimeIntervalsFormOutput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '09:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '09:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '09:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '09:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '09:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '09:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '09:00', endTime: '18:00' },
      ],
    },
  })
  const router = useRouter()
  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })
  const weekDays = getWeekDays()
  const intervals = watch('intervals')

  async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
    await api.post('/users/time-intervals', {
      intervals: data.intervals,
    })

    await router.push('/register/update-profile')
  }

  return (
    <>
      <NextSeo
        title="Defina sua disponibilidade | Call"
        description="Defina o intervalo de horários que você está disponível em cada dia
        da semana"
        noindex
      />
      <Container>
        <Header>
          <Heading as="strong">Defina sua disponibilidade</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>
          <MultiStep size={4} currentStep={3} />
        </Header>

        <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
          <IntervalsContainer>
            {fields.map((field, index) => (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true)
                        }}
                        checked={field.value}
                      />
                    )}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>

                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    crossOrigin="anonymous"
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    crossOrigin="anonymous"
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            ))}
          </IntervalsContainer>

          {errors.intervals && (
            <FormError size="sm">{errors.intervals.root?.message}</FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </IntervalBox>
      </Container>
    </>
  )
}
