import { InstanceSettings } from 'n8n-core';
import Container, { Service } from 'typedi';

import config from '@/config';
import type { PubSubCommandMap } from '@/events/maps/pub-sub.event-map';
import { Logger } from '@/logging/logger.service';
import type { Publisher } from '@/scaling/pubsub/publisher.service';
import type { Subscriber } from '@/scaling/pubsub/subscriber.service';

import { MultiMainSetup } from './orchestration/main/multi-main-setup.ee';

@Service()
export class OrchestrationService {
	constructor(
		private readonly logger: Logger,
		readonly instanceSettings: InstanceSettings,
		readonly multiMainSetup: MultiMainSetup,
	) {}

	private publisher: Publisher;

	private subscriber: Subscriber;

	protected isInitialized = false;

	private isMultiMainSetupLicensed = false;

	setMultiMainSetupLicensed(newState: boolean) {
		this.isMultiMainSetupLicensed = newState;
	}

	get isMultiMainSetupEnabled() {
		return (
			config.getEnv('executions.mode') === 'queue' &&
			config.getEnv('multiMainSetup.enabled') &&
			this.instanceSettings.instanceType === 'main' &&
			this.isMultiMainSetupLicensed
		);
	}

	get isSingleMainSetup() {
		return !this.isMultiMainSetupEnabled;
	}

	sanityCheck() {
		return this.isInitialized && config.get('executions.mode') === 'queue';
	}

	async init() {
		if (this.isInitialized) return;

		if (config.get('executions.mode') === 'queue') {
			const { Publisher } = await import('@/scaling/pubsub/publisher.service');
			this.publisher = Container.get(Publisher);

			const { Subscriber } = await import('@/scaling/pubsub/subscriber.service');
			this.subscriber = Container.get(Subscriber);
		}

		if (this.isMultiMainSetupEnabled) {
			await this.multiMainSetup.init();
		} else {
			this.instanceSettings.markAsLeader();
		}

		this.isInitialized = true;
	}

	// @TODO: Use `@OnShutdown()` decorator
	async shutdown() {
		if (!this.isInitialized) return;

		if (this.isMultiMainSetupEnabled) await this.multiMainSetup.shutdown();

		this.publisher.shutdown();
		this.subscriber.shutdown();

		this.isInitialized = false;
	}

	// ----------------------------------
	//            pubsub
	// ----------------------------------

	async publish<CommandKey extends keyof PubSubCommandMap>(
		commandKey: CommandKey,
		payload?: PubSubCommandMap[CommandKey],
	) {
		if (!this.sanityCheck()) return;

		this.logger.debug(
			`[Instance ID ${this.instanceSettings.hostId}] Publishing command "${commandKey}"`,
			payload,
		);

		await this.publisher.publishCommand({ command: commandKey, payload });
	}

	// ----------------------------------
	//         workers status
	// ----------------------------------

	async getWorkerStatus(id?: string) {
		if (!this.sanityCheck()) return;

		const command = 'get-worker-status';

		this.logger.debug(`Sending "${command}" to command channel`);

		await this.publisher.publishCommand({
			command,
			targets: id ? [id] : undefined,
		});
	}
}
