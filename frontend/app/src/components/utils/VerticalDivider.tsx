import { Divider, DividerProps } from '@mui/material'

export const VerticalDivider = (props?: DividerProps) => (
  <Divider
    orientation="vertical"
    flexItem
    style={{ marginRight: '-1px' }}
    {...props}
  />
)
