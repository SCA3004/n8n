import {
	INodeProperties,
 } from 'n8n-workflow';

export const organizationOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'organization',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an organization',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an organization',
			},
			{
				name: 'Count',
				value: 'count',
				description: 'Count organizations',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an organization',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all organizations',
			},
			{
				name: 'Related',
				value: 'related',
				description: 'Show organizations related information',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a organization',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const organizationFields = [

/* -------------------------------------------------------------------------- */
/*                                organization:create                                 */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'organization',
				],
				operation: [
					'create',
				],
			},
		},
		required: true,
		description: `The organization's name`,
	},
/* -------------------------------------------------------------------------- */
/*                                organization:update                         */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Organization ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'organization',
				],
				operation: [
					'update',
				],
			},
		},
		description: 'Organization ID',
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
					'organization',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Details',
				name: 'details',
				type: 'string',
				default: '',
				description: `Any details obout the organization, such as the address`,
			},
			{
				displayName: 'Domain Names',
				name: 'domain_names',
				type: 'string',
				default: [],
				description: `An array of domain names associated with this organization`,
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A unique name for the organization',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: `Any notes you have about the organization`,
			},
			{
				displayName: 'Organization Fields',
				name: 'organizationFieldsUi',
				placeholder: 'Add Organization Field',
				description: `Values of custom fields in the organization's profile.`,
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'organizationFieldValues',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field',
								name: 'field',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getOrganizationFields',
								},
								default: '',
								description: 'Name of the field to sort on.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the field.',
							},
						],
					},
				],
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getTags',
				},
				default: [],
				description: 'The array of tags applied to this organization',
			},
		],
	},
/* -------------------------------------------------------------------------- */
/*                                 organization:get                           */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Organization ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'organization',
				],
				operation: [
					'get',
				],
			},
		},
		description: 'Organization ID',
	},
/* -------------------------------------------------------------------------- */
/*                                   organization:getAll                      */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: [
					'organization',
				],
				operation: [
					'getAll',
				],
			},
		},
		default: false,
		description: 'If all results should be returned or only up to a given limit.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: [
					'organization',
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
			maxValue: 100,
		},
		default: 100,
		description: 'How many results to return.',
	},
/* -------------------------------------------------------------------------- */
/*                                organization:delete                         */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Organization ID',
		name: 'id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'organization',
				],
				operation: [
					'delete',
				],
			},
		},
		description: 'Organization ID',
	},
/* -------------------------------------------------------------------------- */
/*                                organization:count                          */
/* -------------------------------------------------------------------------- */
{
	displayOptions: {
		show: {
			resource: [
				'organization',
			],
			operation: [
				'count',
			],
		},
	},
},
/* -------------------------------------------------------------------------- */
/*                                 organization:related                           */
/* -------------------------------------------------------------------------- */
{
	displayName: 'Organization ID',
	name: 'id',
	type: 'string',
	default: '',
	required: true,
	displayOptions: {
		show: {
			resource: [
				'organization',
			],
			operation: [
				'related',
			],
		},
	},
	description: 'Organization ID',
},
] as INodeProperties[];
