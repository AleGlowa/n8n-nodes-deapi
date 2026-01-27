import type { INodeProperties } from 'n8n-workflow';

import * as imagePromptBooster from './imagePromptBooster.operation';

export { imagePromptBooster };

export const description: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
      {
        name: 'Image Prompt Booster',
        value: 'imagePromptBooster',
        action: 'Image prompt booster',
        description: 'Optimizes a prompt for text-to-image generation'
      },
    ],
    default: 'imagePromptBooster',
    displayOptions: {
      show: {
        resource: ['prompt'],
      },
    },
  },
  ...imagePromptBooster.description,
];