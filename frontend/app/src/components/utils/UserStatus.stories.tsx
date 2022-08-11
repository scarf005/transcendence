import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { UserStatus } from './UserStatus'

export default {
  title: 'Utils/UserStatus',
  component: UserStatus,
} as ComponentMeta<typeof UserStatus>

const Template: ComponentStory<typeof UserStatus> = (args) => (
  <UserStatus {...args} />
)

export const Online = Template.bind({})
Online.args = { status: 'ONLINE' }

export const Offline = Template.bind({})
Offline.args = { status: 'OFFLINE' }

export const InGame = Template.bind({})
InGame.args = { status: 'GAME' }
