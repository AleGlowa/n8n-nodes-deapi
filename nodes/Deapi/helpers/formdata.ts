interface FormdataField {
  name: string;
  value: string;
}

interface FormdataFile {
  name: string;
  filename: string;
  contentType: string;
  content: Buffer;
}

/**
 * Generates a multipart/form-data body as a Buffer.
 * Files must be provided as Buffers (already loaded into memory).
 *
 * @param boundary - The boundary string to use for multipart/form-data
 * @param fields - Array of text fields to include
 * @param files - Array of file fields to include (with Buffer content)
 * @returns A Buffer containing the complete multipart/form-data body
 */
export function generateFormdataBody(
  boundary: string,
  fields: FormdataField[],
  files: FormdataFile[] = [],
): Buffer {
  const parts: Buffer[] = [];

  // Add text fields
  for (const field of fields) {
    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="${field.name}"\r\n\r\n` +
      `${field.value}\r\n`
    ));
  }

  // Add file fields
  for (const file of files) {
    // Add file headers
    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="${file.name}"; filename="${file.filename}"\r\n` +
      `Content-Type: ${file.contentType}\r\n\r\n`
    ));

    // Add file content
    parts.push(file.content);
    parts.push(Buffer.from('\r\n'));
  }

  // Add closing boundary
  parts.push(Buffer.from(`--${boundary}--\r\n`));

  return Buffer.concat(parts);
}
