import { createPersonSignupHelperFields, createPersonSignupHelperObject } from './person';
import { INodeProperties } from 'n8n-workflow';
import { createListOperations, createFilterFields, applyFiltersToURL, applyPaginationToURL, createResourceLink } from '../helpers/fields';
import { IExecuteFunctions } from 'n8n-core/dist/src/Interfaces';
import { actionNetworkApiRequest } from '../helpers/request';
import { IDataObject } from '../../../../workflow/dist/src/Interfaces';

// DOCS: https://actionnetwork.org/docs/v2/attendance
// Scenario: Retrieving a collection of attendance resources (GET)
// Scenario: Retrieving an individual attendance resource (GET)
// Scenario: Creating a new attendance (POST)
// Scenario: Modifying an attendance (PUT)

export const fields = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'GET',
		description: 'Operation to perform',
		options: [
			{
				name: 'Get',
				value: 'GET',
			},
			{
				name: 'Create (POST)',
				value: 'POST',
			},
			{
				name: 'Update (PUT)',
				value: 'PUT',
			},
		],
		displayOptions: {
			show: {
				resource: [ 'attendance' ],
			},
		},
	},
	{
		displayName: 'Event ID',
		name: 'event_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [ 'attendance' ],
			},
		},
	},
	{
		displayName: 'Attendance ID',
		name: 'attendance_id',
		type: 'string',
		required: false,
		default: '',
		displayOptions: {
			show: {
				resource: [ 'attendance' ],
				method: ['GET', 'PUT']
			}
		}
	},
	/**
	 * Adding or updating a resource
	 */
	{
		displayName: 'Additional properties',
		name: 'additional_properties',
		type: 'fixedCollection',
		default: '',
		placeholder: 'Add custom ID for attendance',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: [ 'attendance' ],
				method: [ 'POST', 'PUT' ]
			}
		},
		options: [
			{
				name: 'identifier',
				displayName: 'Custom ID',
				type: 'string',
				default: '',
			},
		]
	},
	{
		name: "osdi:person",
		displayName: "Person URL",
		description: "Link to a person by their URL",
		type: 'string',
		required: false,
		default: '',
		displayOptions: {
			show: {
				resource: [ 'attendance' ],
				method: [ 'POST' ]
			}
		}
	},
	...createPersonSignupHelperFields({
		displayOptions: {
			show: {
				resource: ['attendance'],
				method: [ 'POST' ]
			}
		}
	}),
	/**
	 * Listing and getting resources
	 */
	...createListOperations({
		displayOptions: {
			show: {
				resource: [ 'attendance' ],
				method: [ 'GET' ]
			}
		}
	}),
	...createFilterFields({
		// Valid filter properties documented at https://actionnetwork.org/docs/v2#odata
		properties: [ 'identifier', 'created_date', 'modified_date' ],
		displayOptions: {
			show: {
				resource: [ 'attendance' ],
				method: [ 'GET' ]
			}
		}
	}),
] as INodeProperties[];

export const logic = async (node: IExecuteFunctions) => {
	const event_id = node.getNodeParameter('event_id', 0) as string;
	const attendance_id = node.getNodeParameter('attendance_id', 0) as string;
	const method = node.getNodeParameter('method', 0) as 'GET' | 'PUT' | 'POST';
	let url = `/api/v2/events/${event_id}/attendances`

	if (attendance_id && method === 'GET') {
		return actionNetworkApiRequest.call(node, method, `${url}/${attendance_id}`) as Promise<IDataObject>
	}

	if (attendance_id && method === 'PUT') {
		let body: any = {
			'identifiers': (node.getNodeParameter('additional_properties', 0, { identifiers: [] }) as any)?.identifiers
		}
		return actionNetworkApiRequest.call(node, method, `${url}/${attendance_id}`, body) as Promise<IDataObject>
	}

	if (method === 'POST') {
		let body: any = {
			'identifiers': (node.getNodeParameter('additional_properties', 0, { identifiers: [] }) as any)?.identifiers
		}

		const personRefURL = node.getNodeParameter('osdi:people', 0) as string;
		if (personRefURL) {
			body = { ...body, ...createResourceLink('osdi:people', personRefURL) }
		} else {
			body = { ...body, ...createPersonSignupHelperObject(node) }
		}

		return actionNetworkApiRequest.call(node, method, url, body) as Promise<IDataObject>
	}

	// Otherwise list all
	url = applyPaginationToURL(node, url)
	url = applyFiltersToURL(node, url)
	return actionNetworkApiRequest.call(node, 'GET', url) as Promise<IDataObject[]>
}
