import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { updateDisplayOptions, wrapData } from '@utils/utilities';
import { theHiveApiRequest } from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName: 'Observable ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the observable',
	},
];

const displayOptions = {
	show: {
		resource: ['observable'],
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = [];

	const observableId = this.getNodeParameter('id', i) as string;

	const qs: IDataObject = {};

	const body = {
		query: [
			{
				_name: 'getObservable',
				idOrName: observableId,
			},
		],
	};

	qs.name = `get-observable-${observableId}`;

	responseData = await theHiveApiRequest.call(this, 'POST', '/v1/query', body, qs);

	const executionData = this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});

	return executionData;
}
