import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChatList } from './ChatList'

export default {
  title: 'Chat/ChatList',
  component: ChatList,
} as ComponentMeta<typeof ChatList>

const Template: ComponentStory<typeof ChatList> = (args) => (
  <ChatList {...args} />
)

export const Default = Template.bind({})
Default.args = {
  chats: [
    {
      senderUid: 4,
      msgContent: 'Hello',
      createdAt: new Date(),
    },
    {
      senderUid: 4,
      msgContent: 'Hi',
      createdAt: new Date(),
    },
    {
      senderUid: 4,
      msgContent: 'How are you?',
      createdAt: new Date(),
    },
    {
      senderUid: 2,
      msgContent: 'asdf',
      createdAt: new Date(),
    },
    {
      senderUid: 2,
      msgContent: 'lorem ipsum',
      createdAt: new Date(),
    },
    {
      senderUid: 4,
      msgContent: 'what do you say?',
      createdAt: new Date(),
    },
  ],
}
