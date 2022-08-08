import { QuestionMark } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'

interface Props {
  title: string
  icon: JSX.Element
  onClick?: () => void
}
export const IconButtonWrap = ({ title, icon, onClick }: Props) => {
  return (
    <IconButton onClick={onClick}>
      <Tooltip title={title ?? ''}>{icon ?? <QuestionMark />}</Tooltip>
    </IconButton>
  )
}
