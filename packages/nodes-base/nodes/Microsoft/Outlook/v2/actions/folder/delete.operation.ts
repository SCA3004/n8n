import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { microsoftApiRequest } from '../../transport';
import { updateDisplayOptions } from '@utils/utilities';
import { folderRLC } from '../../descriptions';

export const properties: INodeProperties[] = [folderRLC];

const displayOptions = {
	show: {
		resource: ['folder'],
		operation: ['delete'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const folderId = this.getNodeParameter('folderId', index, undefined, {
		extractValue: true,
	}) as string;
	const responseData = await microsoftApiRequest.call(this, 'DELETE', `/mailFolders/${folderId}`);

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject),
		{ itemData: { item: index } },
	);

	return executionData;
}
