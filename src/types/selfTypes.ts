export type DebounceFunction<T extends (...args:any[])=>void> = (
	this: ThisParameterType<T>,
	...args: Parameters<T>
) => void;