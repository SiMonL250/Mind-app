import { DebounceFunction } from "../types/selfTypes";

export function debounce<T extends (...args:any[])=>void>(
	fn: (...args:any[])=>void,
	delay?: number
): DebounceFunction<T> {
	let timer: NodeJS.Timeout | null = null;
	let ms = delay?delay:300;
	const _debounce:DebounceFunction<T> = (...args: any[]): void => {
		if (timer !== null) {
			clearTimeout(timer);
		}

		timer = setTimeout(() => {
			fn(...args);
		}, ms);
	};

	return _debounce as DebounceFunction<(...args:any[])=>void>;
}
