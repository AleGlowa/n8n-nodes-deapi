import { AllEntities } from "n8n-workflow";

type NodeMap = {
  image: 'generate';
  prompt: 'imagePromptBooster';
};

export type DeApiType = AllEntities<NodeMap>;