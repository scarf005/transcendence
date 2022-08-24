import { Grid, Paper, Skeleton } from '@mui/material'
import { ReactNode } from 'react'

interface MainProps {
  left?: ReactNode
  middle?: ReactNode
  right?: ReactNode
}
export const MainGrid = ({ left, middle, right }: MainProps) => {
  return (
    <Grid container spacing={3} sx={{ marginTop: '7%', Height: '80%' }}>
      <Grid item sx={{ height: '100vh' }} xs>
        {left || <Skeleton variant="rectangular" />}
      </Grid>
      <Grid item sx={{ height: '100vh' }} xs={6}>
        {middle || <Skeleton variant="rectangular" />}
      </Grid>
      <Grid item sx={{ height: '100vh' }} xs>
        {right || <Skeleton variant="rectangular" />}
      </Grid>
    </Grid>
  )
}
