import { Container } from 'typedi';
import { ApplicationError } from 'n8n-workflow';
import { type ServiceClass, ShutdownService } from '@/shutdown/Shutdown.service';

export const LOWEST_PRIORITY = 0;
export const DEFAULT_PRIORITY = 100;
export const HIGHEST_PRIORITY = 200;

/**
 * Decorator that registers a method as a shutdown hook. The method will
 * be called when the application is shutting down.
 *
 * Priority is used to determine the order in which the hooks are called.
 *
 * NOTE: Requires also @Service() decorator to be used on the class.
 *
 * @example
 * ```ts
 * @Service()
 * class MyClass {
 *   @OnShutdown()
 *   async shutdown() {
 * 	   // Will be called when the app is shutting down
 *   }
 * }
 * ```
 */
export const OnShutdown =
	(priority = DEFAULT_PRIORITY): MethodDecorator =>
	(prototype, propertyKey, descriptor) => {
		const serviceClass = prototype.constructor as ServiceClass;
		const methodName = String(propertyKey);
		// TODO: assert that serviceClass is decorated with @Service
		if (typeof descriptor?.value === 'function') {
			Container.get(ShutdownService).register(priority, { serviceClass, methodName });
		} else {
			const name = `${serviceClass.name}.${methodName}()`;
			throw new ApplicationError(
				`${name} must be a method on ${serviceClass.name} to use "OnShutdown"`,
			);
		}
	};
