import {
	INodeProperties,
} from 'n8n-workflow';

export const tagOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'tag',
				],
			},
		},
		noDataExpression: true,
		options: [
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Delete',
				value: 'delete',
			},
			{
				name: 'Get All',
				value: 'getAll',
			},
			{
				name: 'Update',
				value: 'update',
			},
		],
		default: 'create',
	},
] as INodeProperties[];

export const tagFields = [
	// ----------------------------------------
	//               tag: create
	// ----------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'tag',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'tag',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Color',
				description: 'Hex color code for the tag',
				placeholder: 'b5b5b0',
				name: 'colour',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------------
	//               tag: delete
	// ----------------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		description: 'Numeric ID of the attribute',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'tag',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------------
	//                 tag: getAll
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
					'tag',
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
					'tag',
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

	// ----------------------------------------
	//               tag: update
	// ----------------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		description: 'ID of the tag to update',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'tag',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'tag',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Color',
				description: 'Hex color code for the tag',
				placeholder: 'b5b5b0',
				name: 'colour',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
		],
	},
] as INodeProperties[];
