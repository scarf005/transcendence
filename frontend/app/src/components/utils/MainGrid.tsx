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
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Grid item xs={2} >
        {left || <Skeleton variant="rectangular" />}
      </Grid>
      <Grid item xs={6}>
        {middle || <Skeleton variant="rectangular" />}
      </Grid>
      <Grid item xs={2}>
        {right || <Skeleton variant="rectangular" />}
      </Grid>
    </Grid>
  )
}
