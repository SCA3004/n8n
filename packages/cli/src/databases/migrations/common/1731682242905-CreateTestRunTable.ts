import type { MigrationContext, ReversibleMigration } from '@/databases/types';

const testRunTableName = 'test_run';

export class CreateTestRun1731682242905 implements ReversibleMigration {
	async up({ schemaBuilder: { createTable, column } }: MigrationContext) {
		await createTable(testRunTableName)
			.withColumns(
				column('id').varchar(36).primary.notNull,
				column('testDefinitionId').varchar(36).notNull,
				column('status').varchar().notNull,
				column('runAt').timestamp(),
				column('completedAt').timestamp(),
				column('metrics').json.notNull,
			)
			.withIndexOn('testDefinitionId')
			.withForeignKey('testDefinitionId', {
				tableName: 'test_definition',
				columnName: 'id',
				onDelete: 'CASCADE',
			}).withTimestamps;
	}

	async down({ schemaBuilder: { dropTable } }: MigrationContext) {
		await dropTable(testRunTableName);
	}
}
