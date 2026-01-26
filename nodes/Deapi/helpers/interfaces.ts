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

export interface Response extends IDataObject {
  data: Data,
}

export interface StatusResponse {
  status: string,
  preview: string,
  result_url: string,
  result: string,
  progress: number,
}