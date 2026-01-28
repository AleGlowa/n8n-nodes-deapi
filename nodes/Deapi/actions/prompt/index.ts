import type { INodeProperties } from 'n8n-workflow';

import * as imagePromptBooster from './imagePromptBooster.operation';
import * as videoPromptBooster from './videoPromptBooster.operation';

export { imagePromptBooster, videoPromptBooster };

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
      {
        name: 'Video Prompt Booster',
        value: 'videoPromptBooster',
        action: 'Video prompt booster',
        description: 'Optimizes a prompt for text-image-to-video generation'
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
  ...videoPromptBooster.description,
];