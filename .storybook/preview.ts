import type { Preview } from '@storybook/react-vite'
// @ts-ignore
import '../src/tokens/index.scss'

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
// @ts-ignore
export default preview;