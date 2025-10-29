import type { Preview } from '@storybook/react-vite'
import '../src/tokens/index.sass'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;