import {
	INodeProperties,
} from 'n8n-workflow';

export const collectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'collection',
				],
			},
		},
		options: [
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all root collections',
			},
		],
		default: 'getAll',
	},
];

export const collectionFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                               collection:getAll                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getProjects',
		},
		displayOptions: {
			show: {
				resource: [
					'collection',
				],
				operation: [
					'getAll',
				],
			},
		},
		description: 'As displayed in firebase console URL',
		required: true,
	},
	{
		displayName: 'Database',
		name: 'database',
		type: 'string',
		default: '(default)',
		displayOptions: {
			show: {
				resource: [
					'collection',
				],
				operation: [
					'getAll',
				],
			},
		},
		description: 'Usually the provided default value will work',
		required: true,
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: [
					'collection',
				],
				operation: [
					'getAll',
				],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
		required: true,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: [
					'collection',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 100,
		description: 'Max number of results to return',
	},
];
