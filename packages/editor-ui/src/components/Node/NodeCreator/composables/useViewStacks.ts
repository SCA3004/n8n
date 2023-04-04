import { getCurrentInstance, computed, ref, ComputedRef, nextTick, watchEffect, set } from 'vue';
import { CORE_NODES_CATEGORY } from '@/constants';
import { useNodeCreatorStore } from '@/stores/nodeCreator';
import { v4 as uuid } from 'uuid';
import { useNodeTypesStore } from '@/stores/nodeTypes';
import { INodeCreateElement, SubcategorizedNodeTypes } from '@/Interface';
import { INodeTypeDescription } from 'n8n-workflow';
import { useNodesSearch } from './useNodesSearch';
import { transformNodeType, subcategorizeItems } from '../utils';

interface ViewStack {
	title?: string;
	subtitle?: string;
	search?: string;
	subcategory?: string;
	uuid?: string;
	hasHeaderBg?: boolean;
	transitionDirection?: 'in' | 'out';
	hasSearch?: boolean;
	items?: INodeCreateElement[];
	baselineItems?: INodeCreateElement[];
	searchItems?: INodeTypeDescription[];
	forceIncludeNodes?: string[];
	mode?: 'regular' | 'trigger';
	baseFilter?: (item: INodeCreateElement) => boolean;
	itemsMapper?: (item: INodeCreateElement) => INodeCreateElement;
}

export const useViewStacks = () => {
	const nodeCreatorStore = useNodeCreatorStore();
	const { searchNodes } = useNodesSearch();
	const stacks = ref<ViewStack[]>([]);
	const viewStacks = computed<ViewStack[]>(() => stacks.value);

	const isRootView = computed(() => stacks.value.length === 1);

	const activeStackItems = computed<INodeCreateElement[]>(() => {
		const stack = stacks.value[stacks.value.length - 1];

		if (!stack || !stack.baselineItems) return [];

		if (stack.search && searchBaseItems.value) {
			const searchBase =
				searchBaseItems.value.length > 0 ? searchBaseItems.value : stack.baselineItems;

			return searchNodes(stack.search || '', searchBase);
		}
		return stack.baselineItems;
	});

	const activeViewStack = computed<ViewStack>(() => {
		const stack = stacks.value[stacks.value.length - 1];

		return {
			...stack,
			items: activeStackItems.value,
			hasSearch: (stack.baselineItems || []).length > 3 || stack?.hasSearch,
		};
	});

	const searchBaseItems = computed<INodeCreateElement[]>(() => {
		const stack = stacks.value[stacks.value.length - 1];

		if (!stack || !stack.searchItems) return [];

		return stack.searchItems.map((item) => transformNodeType(item, stack.subcategory));
	});

	const globalSearchItemsDiff = computed<INodeCreateElement[]>(() => {
		const stack = stacks.value[stacks.value.length - 1];
		if (!stack || !stack.search) return [];

		const allNodes = nodeCreatorStore.mergedAppNodes.map((item) => transformNodeType(item));
		const globalSearchResult = searchNodes(stack.search || '', allNodes);

		return globalSearchResult.filter((item) => {
			return !activeStackItems.value.find((activeItem) => activeItem.key === item.key);
		});
	});

	function setStackBaselineItems() {
		const stack = stacks.value[stacks.value.length - 1];
		const subcategorizedItems = subcategorizeItems(nodeCreatorStore.mergedAppNodes);
		let stackItems = stack?.items ?? subcategorizedItems[stack?.subcategory ?? '*'] ?? [];

		if (!stack || !activeViewStack.value.uuid) return;

		// Adds the nodes specified in `stack.forceIncludeNodes` to the `stackItems` array.
		// This is done to ensure that the nodes specified in `stack.forceIncludeNodes` are always included,
		// regardless of whether the subcategory is matched
		if ((stack.forceIncludeNodes ?? []).length > 0) {
			const matchedNodes = nodeCreatorStore.mergedAppNodes
				.filter((item) => stack.forceIncludeNodes?.includes(item.name))
				.map((item) => transformNodeType(item, stack.subcategory));

			stackItems.push(...matchedNodes);
		}

		if (stack.baseFilter) {
			stackItems = stackItems.filter(stack.baseFilter);
		}

		if (stack.itemsMapper) {
			stackItems = stackItems.map(stack.itemsMapper);
		}

		// Sort only if non-root view
		if (!isRootView.value) {
			stackItems.sort((a, b) => {
				if (a.type !== 'node' || b.type !== 'node') return -1;
				const displayNameA = a.properties.displayName.toLowerCase();
				const displayNameB = b.properties.displayName.toLowerCase();

				return displayNameA.localeCompare(displayNameB, undefined, { sensitivity: 'base' });
			});
		}

		updateViewStack(activeViewStack.value.uuid, { baselineItems: stackItems });
	}

	function pushViewStack(stack: ViewStack) {
		const newStackUuid = uuid();
		stacks.value.push({
			...stack,
			uuid: newStackUuid,
			transitionDirection: 'in',
		});
		setStackBaselineItems();
	}

	function popViewStack() {
		if (activeViewStack.value.uuid) {
			updateViewStack(activeViewStack.value.uuid, { transitionDirection: 'out' });
			nextTick(() => stacks.value.pop());
		}
	}

	function updateViewStack(uuid: string, stack: ViewStack) {
		const matchedIndex = stacks.value.findIndex((s) => s.uuid === uuid);
		const matchedStack = stacks.value[matchedIndex];

		// For each key in the stack, update the matched stack
		Object.keys(stack).forEach((key) => {
			set(matchedStack, key, stack[key]);
		});
	}

	return {
		viewStacks,
		activeViewStack,
		globalSearchItemsDiff,
		updateViewStack,
		pushViewStack,
		popViewStack,
	};
};
