import '../src/styles/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'beige',
    values: [
      { name: 'beige', value: '#faf8f5' },
      { name: 'dark', value: '#1a2e1a' },
    ],
  },
};

// Global decorators to apply to all stories
export const decorators = [
  (Story) => (
    <div style={{ fontFamily: 'Satoshi, sans-serif', padding: '20px' }}>
      <Story />
    </div>
  ),
];