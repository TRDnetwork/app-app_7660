import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Components/Input',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'number'],
    },
    error: { control: 'text' },
    helpText: { control: 'text' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
  },
};

export const WithError: Story =