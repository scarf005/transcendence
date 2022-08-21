import { ComponentMeta, ComponentStory } from '@storybook/react'
import { mockUsers } from 'mock/mockUser'
import { MemberList } from './MemberList'

export default {
  title: 'Chat/MemberList',
  component: MemberList,
} as ComponentMeta<typeof MemberList>

const Template: ComponentStory<typeof MemberList> = (args) => (
  <MemberList {...args} />
)

// export const Default = Template.bind({})
// Default.args = { users: mockUsers, refUser: mockUsers[0] }
