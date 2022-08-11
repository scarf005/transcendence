import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { mockUser } from 'mock/mockUser'
import { Profile } from './Profile'
import { User } from 'data/User.dto'

export default {
  title: 'Profile/Profile',
  component: Profile,
} as ComponentMeta<typeof Profile>

const Template: ComponentStory<typeof Profile> = (args) => <Profile {...args} />

export const Default = Template.bind({})
Default.args = { user: mockUser }

export const Playing = Template.bind({})
Playing.args = { user: { ...mockUser, status: 'GAME' } as User }

// FIXME: 이름 Profile로 변경
