import {
	INodeProperties,
} from 'n8n-workflow';

import {
	address,
	currencies,
	makeCustomFieldsFixedCollection,
	makeGetAllFields,
	makeResolve,
} from './SharedFields';

export const vendorOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Create or Update',
				value: 'upsert',
			},
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
			{
				name: 'Update',
				value: 'update',
			},
		],
		default: 'create',
		description: 'Operation to perform',
	},
] as INodeProperties[];

export const vendorFields = [
	// ----------------------------------------
	//            vendor: create
	// ----------------------------------------
	{
		displayName: 'Vendor Name',
		name: 'vendorName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
				operation: [
					'create',
				],
			},
		},
	},

	// ----------------------------------------
	//           vendor: upsert
	// ----------------------------------------
	{
		displayName: 'Vendor Name',
		name: 'vendorName',
		description: 'Name of the vendor. If a record with this vendor name exists it will be updated, otherwise a new one will be created.',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
				operation: [
					'upsert',
				],
			},
		},
	},

	// ----------------------------------------
	//         vendor: create + upsert
	// ----------------------------------------
	makeResolve('vendor', ['create', 'upsert']),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
				operation: [
					'create',
					'upsert',
				],
			},
		},
		options: [
			address,
			{
				displayName: 'Category',
				name: 'Category',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Currency',
				name: 'Currency',
				type: 'options',
				default: 'USD',
				options: currencies,
			},
			makeCustomFieldsFixedCollection('vendor'),
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'Email',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'Phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Website',
				name: 'Website',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------------
	//             vendor: delete
	// ----------------------------------------
	{
		displayName: 'Vendor ID',
		name: 'vendorId',
		description: 'ID of the vendor to delete.',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------------
	//               vendor: get
	// ----------------------------------------
	{
		displayName: 'Vendor ID',
		name: 'vendorId',
		description: 'ID of the vendor to retrieve.',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
				operation: [
					'get',
				],
			},
		},
	},

	// ----------------------------------------
	//             vendor: getAll
	// ----------------------------------------
	...makeGetAllFields('vendor'),

	// ----------------------------------------
	//             vendor: update
	// ----------------------------------------
	{
		displayName: 'Vendor ID',
		name: 'vendorId',
		description: 'ID of the vendor to update.',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
				operation: [
					'update',
				],
			},
		},
	},
	makeResolve('vendor', ['update']),
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'vendor',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			address,
			{
				displayName: 'Category',
				name: 'Category',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Currency',
				name: 'Currency',
				type: 'string',
				default: '',
			},
			makeCustomFieldsFixedCollection('vendor'),
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Email',
				name: 'Email',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'Phone',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Vendor Name',
				name: 'Vendor_Name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Website',
				name: 'Website',
				type: 'string',
				default: '',
			},
		],
	},
] as INodeProperties[];
