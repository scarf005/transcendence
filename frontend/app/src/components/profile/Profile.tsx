import { OtherUser, Stat, User } from 'data'
import {
  Grid,
  Button,
  Input,
  Modal,
  Paper,
  TextField,
  Typography,
  Avatar,
  inputAdornmentClasses,
  Tooltip,
  IconButton,
} from '@mui/material'
import { ChangeAvatarButton } from './userActions'
import { ReactNode } from 'react'
import { AvatarWithStatus, IconButtonWrap } from 'components'
import {
  avatarChangeMutation,
  onlineUsersState,
  renameMutation,
  useToggles,
} from 'hook'
import { ButtonGroup, Container } from '@mui/material'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'
import { DriveFileRenameOutline, PhotoCamera } from '@mui/icons-material'
import { useRecoilValue } from 'recoil'

const StatDisplay = ({ stat }: { stat?: Stat }) => {
  if (!stat) {
    return <Typography>정보 없음</Typography>
  }
  return (
    <>
      {Object.entries(stat).map(([key, value]) => (
        <Grid key={key}>
          <Typography align="center" variant="subtitle1">
            {key}
          </Typography>
          <Typography align="center">{value}</Typography>
        </Grid>
      ))}
    </>
  )
}

interface Props {
  user: OtherUser
}
export const Profile = ({ user }: Props) => {
  const { uid, stat, avatar, nickname } = user
  const status = useRecoilValue(onlineUsersState)[uid] ?? 'UNKNOWN'

  return (
    <>
      <Grid container justifyContent="center">
        <AvatarWithStatus avatar={avatar} status={status} radius={120} />
      </Grid>
      <Grid container justifyContent="center" alignItems="flex-end" gap={1}>
        <Typography variant="h5">{nickname}</Typography>
        <Typography>{`#${uid}`}</Typography>
      </Grid>
      <Grid container justifyContent="center" gap={3}>
        <StatDisplay stat={stat} />
      </Grid>
    </>
  )
}

interface ActionsProps {
  actions: ReactNode
}
export const ProfileActions = ({ actions }: ActionsProps) => {
  return (
    <Grid container justifyContent="right">
      {actions}
    </Grid>
  )
}
export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  height: '50%',
  padding: '2em',
  transform: 'translate(-50%, -50%)',
}

interface FormProps {
  off: () => void
}
const RenameForm = ({ off }: FormProps) => {
  const formContext = useForm<{ nickname?: string; images?: FileList }>()
  const { register, watch } = formContext

  const rename = renameMutation()
  const changeAvatar = avatarChangeMutation()
  const watchImages = watch('images')
  const preview =
    watchImages && watchImages[0] ? URL.createObjectURL(watchImages[0]) : ''

  return (
    <FormContainer
      formContext={formContext}
      onSuccess={(data) => {
        console.log(data)
        if (data.nickname) {
          rename.mutate(data.nickname)
        }
        if (data.images && data.images[0]) {
          changeAvatar.mutate(data.images[0])
        }
        off()
      }}
    >
      <Avatar alt="preview" src={preview} sx={{ width: 100, height: 100 }} />
      <Button variant="outlined" component="label" endIcon={<PhotoCamera />}>
        Upload Avatar
        <input {...register('images')} hidden accept="image/*" type="file" />
      </Button>
      <br />
      <TextFieldElement
        name="nickname"
        label="nickname"
        validation={{ pattern: /^[A-Za-z]+$/i, minLength: 1, maxLength: 30 }}
      />
      <br />
      <ButtonGroup variant="contained">
        <Button type={'submit'} color={'primary'}>
          Update Profile
        </Button>
      </ButtonGroup>
    </FormContainer>
  )
}

export const MyProfile = ({ user }: Props) => {
  const [open, { on, off }] = useToggles(false)

  return (
    <>
      <Modal open={open} onClose={off}>
        <Paper sx={modalStyle}>
          <Typography variant="h2">Update Profile</Typography>
          <RenameForm off={off} />
        </Paper>
      </Modal>
      <Profile user={user} />
      <ProfileActions
        actions={
          <ButtonGroup>
            <IconButtonWrap
              title="프로필 변경"
              icon={<DriveFileRenameOutline />}
              onClick={on}
            />
          </ButtonGroup>
        }
      />
    </>
  )
}
