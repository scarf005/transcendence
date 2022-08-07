import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { blockedUser, friendUser, mockUser } from 'mock/mockUser'
import { OtherProfile } from './OtherProfile'

export default {
  title: 'Profile/OtherProfile',
  component: OtherProfile,
} as ComponentMeta<typeof OtherProfile>

const Template: ComponentStory<typeof OtherProfile> = (args) => (
  <OtherProfile {...args} />
)

export const Default = Template.bind({})
Default.args = { user: mockUser, refUser: mockUser }

export const Friend = Template.bind({})
Friend.args = { ...Default.args, user: friendUser }

export const Blocked = Template.bind({})
Blocked.args = { ...Default.args, user: blockedUser }
