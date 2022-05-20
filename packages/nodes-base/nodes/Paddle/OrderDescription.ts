import {
	INodeProperties,
} from 'n8n-workflow';

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'order',
				],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an order',
			},
		],
		default: 'get',
	},
];

export const orderFields: INodeProperties[] = [

	/* -------------------------------------------------------------------------- */
	/*                                 order:get                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Checkout ID',
		name: 'checkoutId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'order',
				],
				operation: [
					'get',
				],
			},
		},
		description: 'The identifier of the buyer’s checkout',
	},
];
