import type { AuthenticatedRequest, ListQuery } from '@/requests';

// ----------------------------------
//             /test-definitions
// ----------------------------------

export declare namespace TestDefinitionsRequest {
	namespace RouteParams {
		type TestId = {
			id: string;
		};
	}

	type GetOne = AuthenticatedRequest<RouteParams.TestId>;

	type GetMany = AuthenticatedRequest<{}, {}, {}, ListQuery.Params> & {
		listQueryOptions: ListQuery.Options;
	};

	type Create = AuthenticatedRequest<
		{},
		{},
		{ name: string; workflowId: string; evaluationWorkflowId?: string }
	>;

	type Patch = AuthenticatedRequest<
		RouteParams.TestId,
		{},
		{ name?: string; evaluationWorkflowId?: string; annotationTagId?: string }
	>;

	type Delete = AuthenticatedRequest<RouteParams.TestId>;

	type Run = AuthenticatedRequest<RouteParams.TestId>;
}

// ----------------------------------
// 					 /test-definitions/:testDefinitionId/runs
// ----------------------------------

export declare namespace TestRunsRequest {
	namespace RouteParams {
		type TestId = {
			testDefinitionId: string;
		};

		type TestRunId = {
			id: string;
		};
	}

	type GetMany = AuthenticatedRequest<RouteParams.TestId, {}, {}, ListQuery.Params> & {
		listQueryOptions: ListQuery.Options;
	};

	type GetOne = AuthenticatedRequest<RouteParams.TestId & RouteParams.TestRunId>;

	type Delete = AuthenticatedRequest<RouteParams.TestId & RouteParams.TestRunId>;
}
