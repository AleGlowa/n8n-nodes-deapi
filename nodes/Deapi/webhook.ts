import * as crypto from 'crypto';

import type {
	IWebhookFunctions,
	IWebhookResponseData,
	INodeExecutionData,
  IDataObject,
} from 'n8n-workflow';

export async function webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
	// Get response object for sending HTTP responses
	const res = this.getResponseObject();

	// Get webhook credentials for signature verification
	const credentials = await this.getCredentials('deApi');
	const secret = credentials.webhookSecret as string;

	// Get headers for verification
	const headers = this.getHeaderData();
	const signature = headers['x-deapi-signature'] as string;
	const timestamp = headers['x-deapi-timestamp'] as string;

	// Get raw body for signature verification
	const req = this.getRequestObject();
	const rawBody = req.rawBody;

	// Verify timestamp is within 5 minutes
	const now = Math.floor(Date.now() / 1000);
	if (!timestamp || Math.abs(now - parseInt(timestamp)) > 300) {
		res.status(401).send('Invalid signature');
		return {
			noWebhookResponse: true,
		};
	}

	// Calculate expected signature
	const message = `${timestamp}.${rawBody}`;
	const expected = 'sha256=' + crypto
		.createHmac('sha256', secret)
		.update(message)
		.digest('hex');

	// Timing-safe comparison
	if (!signature || !crypto.timingSafeEqual(
		Buffer.from(signature),
		Buffer.from(expected)
	)) {
		res.status(401).send('Invalid signature');
		return {
			noWebhookResponse: true,
		};
	}

	// Signature verified, proceed with webhook processing
	const body = this.getBodyData();
	const event = body.event as string;

	// DeAPI sends three types of events:
	// - job.processing: Job started processing (ignore, keep waiting)
	// - job.completed: Job completed successfully (resume execution)
	// - job.failed: Job failed (resume with error data)

	// If this is just a processing notification, acknowledge but don't resume
	if (event === 'job.processing') {
		res.status(200).send('OK');
		return {
			noWebhookResponse: true, // Don't resume execution, keep waiting
		};
	}

	// For completed jobs, download the binary result
	if (event === 'job.completed') {
		const data = body.data as IDataObject;
		const resultUrl = data.result_url as string;

		// Download the binary file from the result URL
		const binaryData = await this.helpers.httpRequest({
			method: 'GET',
			url: resultUrl,
			encoding: 'arraybuffer',
			returnFullResponse: true,
		});

		// Extract filename from URL
		const urlPath = new URL(resultUrl).pathname;
		const filename = urlPath.split('/').pop() || 'output';

		// Determine mime type from content-type header
		const mimeType = binaryData.headers['content-type'];

		const response: INodeExecutionData = {
			json: {},
			binary: {
				data: await this.helpers.prepareBinaryData(
					binaryData.body as Buffer,
					filename,
					mimeType,
				),
			},
		};

		res.status(200).send('OK');

		return {
			workflowData: [[response]],
		};
	}

	// For failed jobs, return error data as JSON
	const response: INodeExecutionData = {
		json: body,
	};

	res.status(200).send('OK');

	// Return 200 OK and resume execution with the webhook data
	return {
		workflowData: [[response]],
	};
}
