import {
	BINARY_ENCODING,
	IExecuteFunctions,
} from 'n8n-core';

import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

const pdf = require('pdf-parse');

export class ReadPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Read PDF',
		name: 'readPDF',
		icon: 'fa:file-pdf',
		group: ['input'],
		version: 1,
		description: 'Read a PDF and extract its content',
		defaults: {
			name: 'Read PDF',
			color: '#003355',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				description: 'Name of the binary property from which to<br />read the PDF file.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];
		const length = items.length as unknown as number;
		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < length; itemIndex++) {

			item = items[itemIndex];
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;

			if (item.binary === undefined) {
				item.binary = {};
			}

			const binaryData = Buffer.from(item.binary[binaryPropertyName].data, BINARY_ENCODING);
			returnData.push({
				binary: item.binary,
				json: await pdf(binaryData),
			});

		}
		return this.prepareOutputData(returnData);
	}

}
