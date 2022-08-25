import { MarginOutlined } from '@mui/icons-material'
import { Grid, Paper, Skeleton } from '@mui/material'
import { ReactNode } from 'react'

interface MainProps {
  left?: ReactNode
  middle?: ReactNode
  right?: ReactNode
}
export const MainGrid = ({ left, middle, right }: MainProps) => {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        marginTop: '5%',
        Height: '80%',
      }}
    >
      <Grid item sx={{ height: '110vh', marginLeft: '1rem' }} xs>
        {left || <Skeleton variant="rectangular" />}
      </Grid>
      <Grid item sx={{ height: '110vh' }} xs={7}>
        {middle || <Skeleton variant="rectangular" />}
      </Grid>
      <Grid item sx={{ height: '110vh', marginRight: '1rem' }} xs>
        {right || <Skeleton variant="rectangular" />}
      </Grid>
    </Grid>
  )
}
