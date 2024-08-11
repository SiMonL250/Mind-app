type DebounceFunction<T extends (...args:any[])=>void> = (
	this: ThisParameterType<T>,
	...args: Parameters<T>
) => void;

export function debounce<T extends (...args:any[])=>void>(
	fn: (...args:any[])=>void,
	delay?: number
): DebounceFunction<T> {
	let timer = null;
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
