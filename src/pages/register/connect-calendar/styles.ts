import { Box, Text, styled } from '@ignite-ui/react'

export const ConnectBox = styled(Box, {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '$6',
})

export const ConnectItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '1px solid $gray600',
  borderRadius: '$md',
  marginBottom: '$4',
  padding: '$4 $6',
})

export const AuthError = styled(Text, {
  color: '#f75a68',
  marginBottom: '$4',
})
