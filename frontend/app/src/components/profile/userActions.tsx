import { IconButtonWrap } from '../utils/IconButtonWrap'
import {
  AddAPhoto,
  Block,
  DriveFileRenameOutline,
  LocalPostOffice,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material'

interface OnClickProps {
  onClick: (...args: unknown[]) => void
}

// TODO: reducer로 변경
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

export const ChangeNickNameButton = ({ onClick }: OnClickProps) => {
  return (
    <IconButtonWrap
      title="Change Nickname"
      icon={<DriveFileRenameOutline />}
      onClick={onClick}
    />
  )
}

export const ChangeAvatarButton = ({ onClick }: OnClickProps) => {
  return (
    <IconButtonWrap
      title="Change Avatar"
      icon={<AddAPhoto />}
      onClick={onClick}
    />
  )
}
