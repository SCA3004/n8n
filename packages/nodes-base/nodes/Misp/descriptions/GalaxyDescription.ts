import {
	INodeProperties,
} from 'n8n-workflow';

export const galaxyOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'galaxy',
				],
			},
		},
		noDataExpression: true,
		options: [
			{
				name: 'Delete',
				value: 'delete',
			},
			{
				name: 'Get',
				value: 'get',
			},
			{
				name: 'Get All',
				value: 'getAll',
			},
		],
		default: 'get',
	},
] as INodeProperties[];

export const galaxyFields = [
	// ----------------------------------------
	//              galaxy: delete
	// ----------------------------------------
	{
		displayName: 'Galaxy ID',
		name: 'galaxyId',
		description: 'UUID or numeric ID of the galaxy',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'galaxy',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------------
	//               galaxy: get
	// ----------------------------------------
	{
		displayName: 'Galaxy ID',
		name: 'galaxyId',
		description: 'UUID or numeric ID of the galaxy',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'galaxy',
				],
				operation: [
					'get',
				],
			},
		},
	},

	// ----------------------------------------
	//              galaxy: getAll
	// ----------------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'galaxy',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'How many results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: [
					'galaxy',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
	},
] as INodeProperties[];
