import FormData from 'form-data';

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
  updateDisplayOptions,
} from "n8n-workflow";

import { apiRequest } from "../../transport";
import { getBinaryDataFile } from '../../helpers/binary-data';
import { BoosterResponse } from "../../helpers/interfaces";

const properties: INodeProperties[] = [
  {
    displayName: 'Prompt',
    name: 'prompt',
    type: 'string',
    required: true,
    placeholder: 'e.g. A cinematic video sequence',
    description: 'A prompt to boost',
    default: '',
    typeOptions: {
      rows: 1,
    },
  },
  {
    displayName: 'Options',
    name: 'options',
    placeholder: 'Add Option',
    type: 'collection',
    default: {},
    options: [
      {
        displayName: 'Negative Prompt',
        name: 'negative_prompt',
        type: 'string',
        placeholder: 'e.g. blur, darkness, noise',
        description: 'A negative prompt to boost',
        default: '',
        typeOptions: {
          rows: 1,
        },
      },
      {
        displayName: 'Binary Field Name',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        placeholder: 'e.g. data',
        description: 'The name of the binary field containing the image data',
      },
    ],
  },
];

const displayOptions = {
	show: {
		operation: ['videoPromptBooster'],
		resource: ['prompt'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {

  const formData = new FormData();
  const prompt = this.getNodeParameter('prompt', i) as string;
  const options = this.getNodeParameter('options', i);
  const negativePrompt = options.negative_prompt as (string | undefined);
  const refImage = options.binaryPropertyName as (string | undefined);

  if (refImage) {
    const { fileContent, contentType, filename } = await getBinaryDataFile(this, i, refImage);
  
    formData.append('image', fileContent, {
      filename,
      contentType,
    })
  } else {
    formData.append('image', '');
  }

  formData.append('prompt', prompt);

  formData.append('negative_prompt', negativePrompt ?? '');

  const response = await (apiRequest.call(this, 'POST', '/prompt/video', {
    option: { body: formData },
  })) as BoosterResponse;

  return [{
    json: response,
    pairedItem: {
      item: i,
    }
  }];
}