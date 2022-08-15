import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ChatListItem } from './ChatListItem'
import { mockUser } from 'mock/mockUser'

export default {
  title: 'Chat/ChatListItem',
  component: ChatListItem,
} as ComponentMeta<typeof ChatListItem>

const Template: ComponentStory<typeof ChatListItem> = (args) => (
  <ChatListItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  user: mockUser,
  messages: [
    'hello',
    'hi',
    'this is a very long line of text',
    'also a very long line of text',
    'this is a very long line of text',
    'foo',
    'bar',
    'when life gives you lemons, make lemonade',
  ],
}
