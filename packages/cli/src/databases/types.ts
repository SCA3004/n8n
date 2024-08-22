import type { INodeTypes } from 'n8n-workflow';
import type { QueryRunner, ObjectLiteral } from '@n8n/typeorm';
import type { Logger } from '@/logger';
import type { createSchemaBuilder } from './dsl';

export type DatabaseType = 'mariadb' | 'postgresdb' | 'mysqldb' | 'sqlite';

export interface MigrationContext {
	logger: Logger;
	queryRunner: QueryRunner;
	tablePrefix: string;
	dbType: DatabaseType;
	isMysql: boolean;
	dbName: string;
	migrationName: string;
	nodeTypes: INodeTypes;
	schemaBuilder: ReturnType<typeof createSchemaBuilder>;
	loadSurveyFromDisk(): string | null;
	parseJson<T>(data: string | T): T;
	escape: {
		columnName(name: string): string;
		tableName(name: string): string;
		indexName(name: string): string;
	};
	runQuery<T>(sql: string, namedParameters?: ObjectLiteral): Promise<T>;
	runInBatches<T>(
		query: string,
		operation: (results: T[]) => Promise<void>,
		limit?: number,
	): Promise<void>;
	copyTable(fromTable: string, toTable: string): Promise<void>;
	copyTable(
		fromTable: string,
		toTable: string,
		fromFields?: string[],
		toFields?: string[],
		batchSize?: number,
	): Promise<void>;
}

export type MigrationFn = (ctx: MigrationContext) => Promise<void>;

export interface BaseMigration {
	up: MigrationFn;
	down?: MigrationFn | never;
	transaction?: false;
}

export interface ReversibleMigration extends BaseMigration {
	down: MigrationFn;
}

export interface IrreversibleMigration extends BaseMigration {
	down?: never;
}

export interface Migration extends Function {
	prototype: ReversibleMigration | IrreversibleMigration;
}

export type InsertResult = Array<{ insertId: number }>;

export { QueryFailedError } from '@n8n/typeorm/error/QueryFailedError';
