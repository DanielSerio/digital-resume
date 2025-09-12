import type { Preview } from '@storybook/react-vite'
import '../src/styles.css' // Import Tailwind CSS

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0c0a09' },
      ],
    },
  },
};

export default preview;