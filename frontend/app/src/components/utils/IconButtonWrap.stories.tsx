import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { IconButtonWrap } from './IconButtonWrap'
import { PersonAdd } from '@mui/icons-material'

export default {
  title: 'Utils/IconButtonWrap',
  component: IconButtonWrap,
} as ComponentMeta<typeof IconButtonWrap>

const Template: ComponentStory<typeof IconButtonWrap> = (args) => (
  <IconButtonWrap {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'add to friend',
  icon: <PersonAdd />,
  onClick: () => alert('pressed friend button'),
}

export const Empty = Template.bind({})
Empty.args = {
  onClick: () => alert('pressed button'),
}
