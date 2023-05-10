import type { Cloud, IRestApiContext } from '@/Interface';
import { get } from '@/utils';

export async function getCurrentPlan(
	context: IRestApiContext,
	cloudUserId: string,
): Promise<Cloud.PlanData> {
	return get(context.baseUrl, `/user/${cloudUserId}/plan`);
}
