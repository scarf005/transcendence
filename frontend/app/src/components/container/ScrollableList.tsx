import { List } from '@mui/material'
import { ReactElement, ReactNode } from 'react'

interface Props {
  children: ReactNode | ReactElement
}
export const ScrollableList = ({ children }: Props) => {
  return <List style={{ height: '70vh', overflow: 'auto' }}>{children}</List>
}
