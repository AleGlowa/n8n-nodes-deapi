import type {
  INodeProperties,
  IExecuteFunctions,
  INodeExecutionData,
} from 'n8n-workflow';
import { updateDisplayOptions } from 'n8n-workflow';

import type {
  TextToImageRequest,
  GenerationResponse,
} from '../../helpers/interfaces';
import { apiRequest } from '../../transport';

const properties: INodeProperties[] = [
  {
    displayName: 'Prompt',
    name: 'prompt',
    type: 'string',
    required: true,
    placeholder: 'e.g. Red Bull F1 car from 2025',
    description: 'A text description of the desired image',
    default: '',
    typeOptions: {
      rows: 2,
    },
  },
  {
    displayName: 'Negative Prompt',
    name: 'negative_prompt',
    type: 'string',
    placeholder: 'e.g. blur, darkness, noise',
    description: 'Elements to avoid in the generated image',
    default: '',
    typeOptions: {
      rows: 1,
    },
  },
  {
    displayName: 'Model',
    name: 'model',
    type: 'options',
    description: 'The model to use for image generation',
    default: 'ZImageTurbo_INT8',
    options: [
      {
        name: 'Z-Image-Turbo INT8',
        value: 'ZImageTurbo_INT8'
      },
      {
        name: 'Flux.1 Schnell',
        value: 'Flux1schnell'
      },
    ],
  },
  {
    displayName: 'Ratio',
    name: 'ratio',
    type: 'options',
    description: 'Aspect ratio of the generated image',
    options: [
      {
        name: 'Square',
        value: 'square',
      },
      {
        name: 'Landscape',
        value: 'landscape',
      },
      {
        name: 'Portrait',
        value: 'portrait',
      },
    ],
    default: 'square',
    noDataExpression: true,
  },
  {
    displayName: 'Options',
    name: 'options',
    placeholder: 'Add Option',
    type: 'collection',
    default: {},
    options: [
      // {
      //   displayName: 'Quality',
      //   name: 'quality',
      //   type: 'options',
      //   description: 'The quality of the image that will be generated',
      //   options: [
      //     {
      //       name: 'High',
      //       value: 'high'
      //     },
      //     {
      //       name: 'Medium',
      //       value: 'medium'
      //     },
      //     {
      //       name: 'Low',
      //       value: 'low'
      //     },
      //   ],
      //   displayOptions: {
      //     show: {
      //       '/model': ['ZImageTurbo_INT8', 'Flux1schnell']
      //     },
      //   },
      //   // TO DECIDE the default quality of generated image.
      //   default: 'medium',
      // },
      {
        displayName: 'Resolution',
        name: 'square_size',
        type: 'options',
        description: 'Width and height of the generated image in pixels',
        options: [
          {
            name: '256x256',
            value: '256x256',
          },
          {
            name: '512x512',
            value: '512x512',
          },
          {
            name: '768x768',
            value: '768x768',
          },
          {
            name: '1024x1024',
            value: '1024x1024',
          },
          {
            name: '2048x2048',
            value: '2048x2048',
          },
        ],
        displayOptions: {
          show: {
            '/model': ['ZImageTurbo_INT8', 'Flux1schnell'],
            '/ratio': ['square'],
          },
        },
        default: '768x768',
      },
      {
        displayName: 'Resolution',
        name: 'ZImageTurbo_INT8_landscape_size',
        type: 'options',
        description: 'Width and height of the generated image in pixels',
        options: [
          {
            name: '2048x1152',
            value: '2048x1152',
          },
        ],
        displayOptions: {
          show: {
            '/model': ['ZImageTurbo_INT8'],
            '/ratio': ['landscape'],
          },
        },
        default: '2048x1152',
      },
      {
        displayName: 'Resolution',
        name: 'Flux1schnell_landscape_size',
        type: 'options',
        description: 'Width and height of the generated image in pixels',
        options: [
          {
            name: '1280x720',
            value: '1280x720',
          },
          {
            name: '2048x1152',
            value: '2048x1152',
          },
        ],
        displayOptions: {
          show: {
            '/model': ['Flux1schnell'],
            '/ratio': ['landscape'],
          },
        },
        default: '1280x720',
      },
      {
        displayName: 'Resolution',
        name: 'ZImageTurbo_INT8_portrait_size',
        type: 'options',
        description: 'Width and height of the generated image in pixels',
        options: [
          {
            name: '1152x2048',
            value: '1152x2048',
          },
        ],
        displayOptions: {
          show: {
            '/model': ['ZImageTurbo_INT8'],
            '/ratio': ['portrait'],
          },
        },
        default: '1152x2048',
      },
      {
        displayName: 'Resolution',
        name: 'Flux1schnell_portrait_size',
        type: 'options',
        description: 'Width and height of the generated image in pixels',
        options: [
          {
            name: '720x1280',
            value: '720x1280',
          },
          {
            name: '1152x2048',
            value: '1152x2048',
          },
        ],
        displayOptions: {
          show: {
            '/model': ['Flux1schnell'],
            '/ratio': ['portrait'],
          },
        },
        default: '720x1280',
      },
      {
        displayName: 'Steps',
        name: 'ZImageTurbo_INT8_steps',
        type: 'number',
        description: 'Number of inference steps',
        typeOptions: {
          maxValue: 50,
          minValue: 1,
          numberPrecision: 0,
        },
        displayOptions: {
          show: {
            '/model': ['ZImageTurbo_INT8']
          },
        },
        default: 8,
      },
      {
        displayName: 'Steps',
        name: 'Flux1schnell_steps',
        type: 'number',
        description: 'Number of inference steps',
        typeOptions: {
          maxValue: 10,
          minValue: 1,
          numberPrecision: 0,
        },
        displayOptions: {
          show: {
            '/model': ['Flux1schnell']
          },
        },
        default: 4,
      },
      {
        displayName: 'Seed',
        name: 'seed',
        type: 'number',
        description: 'Random seed for generation. By default seed is random.',
        typeOptions: {
          // Max 32-bit unsigned number
          maxValue: 4_294_967_295,
          minValue: -1,
          numberPrecision: 0,
        },
        default: -1,
      },
    ]
  }
];

const displayOptions = {
	show: {
		operation: ['generate'],
		resource: ['image'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
  // Combine these types for switch statements, to conclude default values when options aren't provided.
  type Model = 'ZImageTurbo_INT8' | 'Flux1schnell';
  type Ratio = 'square' | 'landscape' | 'portrait';

  const prompt = this.getNodeParameter('prompt', i) as string;
  const negativePrompt = this.getNodeParameter('negative_prompt', i) as string;
  const model = this.getNodeParameter('model', i) as Model;
  const ratio = this.getNodeParameter('ratio', i) as Ratio;
  const options = this.getNodeParameter('options', i);

  const size = (
    options.square_size ??
    options.ZImageTurbo_INT8_landscape_size ??
    options.ZImageTurbo_INT8_portrait_size ??
    options.Flux1schnell_landscape_size ??
    options.Flux1schnell_portrait_size
  ) as string;
  delete options.Flux1schnell_portrait_size;
  delete options.ZImageTurbo_INT8_portrait_size;
  delete options.Flux1schnell_landscape_size;
  delete options.ZImageTurbo_INT8_landscape_size;
  delete options.square_size;

  // Width and height
  let width: number, height: number;
  if (size == null) {
    switch (`${model}-${ratio}`) {
      case 'ZImageTurbo_INT8-square':
      case 'Flux1schnell-square':
        width = 768;
        height = 768;
        break;
      case 'ZImageTurbo_INT8-landscape':
        width = 2048;
        height = 1152;
        break;
      case 'Flux1schnell-landscape':
        width = 1280;
        height = 720;
        break;
      case 'ZImageTurbo_INT8-portrait':
        width = 1152;
        height = 2048;
        break;
      case 'Flux1schnell-portrait':
      default:
        width = 720;
        height = 1280;
        break;
    }
  } else {
    [width, height] = size.split('x').map(Number);
  }

  // Steps
  let steps = (
    options.ZImageTurbo_INT8_steps ??
    options.Flux1schnell_steps
  ) as number;
  if (steps == null) {
    switch (model) {
      case 'ZImageTurbo_INT8':
        steps = 8;
        break;
      case 'Flux1schnell':
        steps = 4;
        break;
    }
  }
  delete options.Flux1schnell_steps;
  delete options.ZImageTurbo_INT8_steps;

  // Seed
  let seed = options.seed as number;
  if (seed == null || seed === -1) {
    seed = Math.floor(Math.random() * 4_294_967_296);
  }
  delete options.seed;

  const body: TextToImageRequest = {
    prompt: prompt,
    negative_prompt: negativePrompt,
    model: model,
    width: width,
    height: height,
    steps: steps,
    seed: seed,
  };

  const response = await (apiRequest.call(this, 'POST', '/txt2img', { body })) as GenerationResponse;

  return [{
    json: response,
    pairedItem: {
      item: i,
    }
  }];
}