import { IDataObject } from "n8n-workflow";

type Data = {
  request_id: string,
}

export interface TextToImageRequest extends IDataObject {
  prompt: string,
  negative_prompt: string | null,
  model: string,
  width: number,
  height: number,
  steps: number,
  seed: number,
  webhook_url: string,
}

export interface ImagePromptBoosterRequest extends IDataObject {
  prompt: string,
  negative_prompt: string | null,
}

export interface GenerationResponse extends IDataObject {
  data: Data,
}

export interface BoosterResponse extends IDataObject {
  prompt: string,
  negative_prompt: string | null,
}
