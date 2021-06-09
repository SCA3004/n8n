import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeApiError,
} from 'n8n-workflow';

import * as uuid from 'uuid/v4';

import {
	snakeCase,
} from 'change-case';

import {
	facebookApiRequest,
} from './GenericFunctions';

import {
	createHmac,
} from 'crypto';

export class FacebookTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Facebook Trigger',
		name: 'facebookTrigger',
		icon: 'file:facebook.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["appId"] +"/"+ $parameter["object"]}}',
		description: 'Start the workflow when Facebook events occur',
		defaults: {
			name: 'Facebook Trigger',
			color: '#3B5998',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'facebookGraphAppApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: 'webhook',
			},
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Object',
				name: 'object',
				type: 'options',
				options: [
					{
						name: 'Ad Account',
						value: 'adAccount',
						description: 'Get updates about Ad Account',
					},
					{
						name: 'Application',
						value: 'application',
						description: 'Get updates about the app',
					},
					{
						name: 'Certificate Transparency',
						value: 'certificateTransparency',
						description: 'Get updates about Certificate Transparency',
					},
					{
						name: 'Group',
						value: 'group',
						description: 'Get updates about activity in groups and events in groups for Workplace',
					},
					{
						name: 'Instagram',
						value: 'instagram',
						description: 'Get updates about comments on your media',
					},
					{
						name: 'Link',
						value: 'link',
						description: 'Get updates about links for rich previews by an external provider',
					},
					{
						name: 'Page',
						value: 'page',
						description: 'Page updates',
					},
					{
						name: 'Permissions',
						value: 'permissions',
						description: 'Updates regarding granting or revoking permissions',
					},
					{
						name: 'User',
						value: 'user',
						description: 'User profile updates',
					},
					{
						name: 'Whatsapp Business Account',
						value: 'whatsappBusinessAccount',
						description: 'Get updates about Whatsapp business account',
					},
					{
						name: 'Workplace Security',
						value: 'workplaceSecurity',
						description: 'Get updates about Workplace Security',
					},
				],
				required: true,
				default: 'user',
				description: 'The object to subscribe to',
			},
			{
				displayName: 'App ID',
				name: 'appId',
				type: 'string',
				required: true,
				default: '',
				description: 'Facebook APP ID',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				default: {},
				placeholder: 'Add option',
				options: [
					{
						displayName: 'Include values',
						name: 'includeValues',
						type: 'boolean',
						default: true,
						description: 'Indicates if change notifications should include the new values.',
					},
				],
			},
		],
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const object = this.getNodeParameter('object') as string;
				const appId = this.getNodeParameter('appId') as string;

				const { data } = await facebookApiRequest.call(this, 'GET', `/${appId}/subscriptions`, {});

				for (const webhook of data) {
					if (webhook.target === webhookUrl && webhook.object === object && webhook.status === true) {
						return true;
					}
				}
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const object = this.getNodeParameter('object') as string;
				const appId = this.getNodeParameter('appId') as string;
				const options = this.getNodeParameter('options') as IDataObject;

				const body = {
					object: snakeCase(object),
					callback_url: webhookUrl,
					verify_token: uuid(),
				} as IDataObject;

				if (options.includeValues !== undefined) {
					body.include_values = options.includeValues;
				}

				const responseData = await facebookApiRequest.call(this, 'POST', `/${appId}/subscriptions`, body);

				webhookData.verifyToken = body.verify_token;

				if (responseData.success !== true) {
					// Facebook did not return success, so something went wrong
					throw new NodeApiError(this.getNode(), responseData, { message: 'Facebook webhook creation response did not contain the expected data.' });
				}
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const appId = this.getNodeParameter('appId') as string;
				const object = this.getNodeParameter('object') as string;

				try {
					await facebookApiRequest.call(this, 'DELETE', `/${appId}/subscriptions`, { object: snakeCase(object) });
				} catch (error) {
					return false;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const query = this.getQueryData() as IDataObject;
		const res = this.getResponseObject();
		const req = this.getRequestObject();
		const headerData = this.getHeaderData() as IDataObject;
		const credentials = this.getCredentials('facebookGraphAppApi') as IDataObject;
		// Check if we're getting facebook's challenge request (https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
		if (this.getWebhookName() === 'setup') {
			if (query['hub.challenge']) {
				//TODO
				//compare hub.verify_token with the saved token
				//const webhookData = this.getWorkflowStaticData('node');
				// if (webhookData.verifyToken !== query['hub.verify_token']) {
				// 	return {};
				// }
				res.status(200).send(query['hub.challenge']).end();
				return {
					noWebhookResponse: true,
				};
			}
		}

		// validate signature if app secret is set
		if (credentials.appSecret !== '') {
			//@ts-ignore
			const computedSignature = createHmac('sha1', credentials.appSecret as string).update(req.rawBody).digest('hex');
			if (headerData['x-hub-signature'] !== `sha1=${computedSignature}`) {
				return {};
			}
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray(bodyData.entry as IDataObject[]),
			],
		};
	}
}
