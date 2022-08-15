import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { VerticalDivider } from './VerticalDivider'
import { Grid, Typography } from '@mui/material'

export default {
  title: 'Utils/VerticalDivider',
  component: VerticalDivider,
} as ComponentMeta<typeof VerticalDivider>

export const Example = () => (
  <Grid container justifyContent="space-between">
    <Grid item xs={6} padding="1rem">
      <Typography variant="h1" color="initial">
        Hello
      </Typography>
    </Grid>
    <VerticalDivider />
    <Grid item xs={6} padding="1rem">
      <Typography variant="h1" color="initial">
        World
      </Typography>
    </Grid>
  </Grid>
)
