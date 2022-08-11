import { IconButtonWrap } from '../utils/IconButtonWrap'
import {
  Block,
  LocalPostOffice,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material'

interface OnClickProps {
  onClick: (...args: unknown[]) => void
}

export const AddFriendButton = ({ onClick }: OnClickProps) => (
  <IconButtonWrap
    title="add to friend"
    icon={<PersonAdd />}
    onClick={onClick}
  />
)

export const RemoveFriendButton = ({ onClick }: OnClickProps) => {
  return (
    <IconButtonWrap
      title="remove from friend"
      icon={<PersonRemove />}
      onClick={onClick}
    />
  )
}

export const BlockButton = ({ onClick }: OnClickProps) => {
  return <IconButtonWrap title="Block" icon={<Block />} onClick={onClick} />
}

export const UnblockButton = ({ onClick }: OnClickProps) => {
  return <IconButtonWrap title="Unblock" icon={<Block />} onClick={onClick} />
}

export const MessageButton = ({ onClick }: OnClickProps) => {
  return (
    <IconButtonWrap
      title="Send Direct Message"
      icon={<LocalPostOffice />}
      onClick={onClick}
    />
  )
}
