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
    },
    {
      senderUid: 4,
      msgContent: 'Hi',
    },
    {
      senderUid: 4,
      msgContent: 'How are you?',
    },
    {
      senderUid: 2,
      msgContent: 'asdf',
    },
    {
      senderUid: 2,
      msgContent: 'lorem ipsum',
    },
    {
      senderUid: 4,
      msgContent: 'what do you say?',
    },
  ],
}
