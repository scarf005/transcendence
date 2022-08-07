import { IconButtonWrap } from './IconButtonWrap'
import {
  Block,
  LocalPostOffice,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material'

interface onClickProps {
  onClick: (...args: unknown[]) => void
}

export const AddFriendButton = ({ onClick }: onClickProps) => (
  <IconButtonWrap
    title="add to friend"
    icon={<PersonAdd />}
    onClick={onClick}
  />
)

export const RemoveFriendButton = ({ onClick }: onClickProps) => {
  return (
    <IconButtonWrap
      title="remove from friend"
      icon={<PersonRemove />}
      onClick={onClick}
    />
  )
}

export const BlockButton = ({ onClick }: onClickProps) => {
  return <IconButtonWrap title="Block" icon={<Block />} onClick={onClick} />
}

export const UnblockButton = ({ onClick }: onClickProps) => {
  return <IconButtonWrap title="Unblock" icon={<Block />} onClick={onClick} />
}

export const MessageButton = ({ onClick }: onClickProps) => {
  return (
    <IconButtonWrap
      title="Send Direct Message"
      icon={<LocalPostOffice />}
      onClick={onClick}
    />
  )
}
