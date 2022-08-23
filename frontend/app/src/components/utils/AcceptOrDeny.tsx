import { Button, ButtonGroup } from '@mui/material'

interface Props {
  onAccept?: () => void
  onDeny?: () => void
}
export const AcceptOrDeny = ({
  onAccept = () => null,
  onDeny = () => null,
}: Props) => {
  if (!open) {
    return null
  }

  return (
    <ButtonGroup variant="contained">
      <Button color="success" onClick={onAccept}>
        수락
      </Button>
      <Button color="error" onClick={onDeny}>
        거절
      </Button>
    </ButtonGroup>
  )
}
