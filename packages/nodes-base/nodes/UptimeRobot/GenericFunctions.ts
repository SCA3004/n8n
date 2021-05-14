import { OptionsWithUri } from 'request';
import {
	IExecuteFunctions,
} from 'n8n-core';
import {
	IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export async function uptimeRobotApiRequest(this: IExecuteFunctions, method: string, resource: string, body: IDataObject = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}) {
	const credentials = this.getCredentials('uptimeRobotApi');
	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	let options: OptionsWithUri = {
		method,
		qs,
		form: {
			api_key: credentials.apiKey,
			...body,
		},
		uri: uri || `https://api.uptimerobot.com/v2${resource}`,
		json: true,
	};
	options = Object.assign({}, options, option);
	try {
		const responseData = await this.helpers.request(options);
		if (responseData.stat !== 'ok') {
			throw new NodeOperationError(this.getNode(),responseData);
		}
		return responseData;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
