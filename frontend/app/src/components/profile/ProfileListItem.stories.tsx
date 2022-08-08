import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ProfileListItem } from './ProfileListItem'
import { mockUser } from 'mock/mockUser'

export default {
  title: 'Profile/ProfileListItem',
  component: ProfileListItem,
} as ComponentMeta<typeof ProfileListItem>

const Template: ComponentStory<typeof ProfileListItem> = (args) => (
  <ProfileListItem {...args} />
)

export const Default = Template.bind({})
Default.args = { user: mockUser }
