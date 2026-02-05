import {
  IBinaryData,
  IExecuteFunctions,
} from "n8n-workflow";

/** Chunk size to use for streaming. 256Kb */
const CHUNK_SIZE = 256 * 1024;

/**
 * Gets the binary data file for the given item index and given property name.
 * Returns the file name, content type and the file content as a Buffer.
 */

export async function getBinaryDataFile(
	ctx: IExecuteFunctions,
	itemIdx: number,
	binaryPropertyData: string | IBinaryData,
) {
  const binaryData = ctx.helpers.assertBinaryData(itemIdx, binaryPropertyData);

  let fileContent: Buffer;

  if (binaryData.id) {
    // File is stored externally, get as stream and convert to buffer
    const stream = await ctx.helpers.getBinaryStream(binaryData.id, CHUNK_SIZE);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    fileContent = Buffer.concat(chunks);
  } else {
    // File is stored in memory, get directly as buffer
    fileContent = await ctx.helpers.getBinaryDataBuffer(itemIdx, binaryPropertyData);
  }

  return {
    filename: binaryData.fileName,
    contentType: binaryData.mimeType,
    fileContent,
  };
}