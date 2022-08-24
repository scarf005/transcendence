import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChatInput } from './ChatInput'

export default {
  title: 'Chat/ChatInput',
  component: ChatInput,
} as ComponentMeta<typeof ChatInput>

const Template: ComponentStory<typeof ChatInput> = (args) => (
  <ChatInput {...args} />
)
// export const Default = Template.bind({})
// Default.args = {
//   sendMsg: () => alert('send'),
// }
