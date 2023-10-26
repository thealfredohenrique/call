import { Button, TextInput } from '@ignite-ui/react'
import { Form } from './styles'
import { ArrowRight } from '@phosphor-icons/react'

export function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput
        size="sm"
        prefix="ignite.com/"
        placeholder="your-username"
        crossOrigin="anonymous"
      />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
