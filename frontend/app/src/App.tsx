import { Grid, Typography } from '@mui/material'
import { Profile } from './components/Profile'
import { mockUser } from './mock/mockUser'

export function App() {
  return (
    <div>
      <Typography>Hello World!</Typography>
      <Grid>
        <Profile user={mockUser} />
      </Grid>
    </div>
  )
}

export default App
