import { IDataObject } from "n8n-workflow";

type Data = {
  request_id: string,
}

export interface TextToImageRequest extends IDataObject {
  prompt: string,
  negative_prompt: string,
  model: string,
  width: number,
  height: number,
  steps: number,
  seed: number,
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
