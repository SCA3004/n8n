import { useOptions } from '@/composables/useOptions';

export function useI18n() {
	const { options } = useOptions();
	const language = options?.defaultLanguage ?? 'en';

	function t(key: string): string {
		return options?.messages?.[language]?.[key] ?? key;
	}

	function te(key: string): boolean {
		return !!options?.messages?.[language]?.[key];
	}

	return { t, te };
}
