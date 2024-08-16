class LocalStorage {
	private storage: Storage;

	constructor() {
		this.storage = window.localStorage;
	}
	set<T>(key: string, value: T) {
		try {
			this.storage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error("SessionStorage set error:", error);
		}
	}
	// 获取值，返回可能为 null 的 T 类型
	get<T>(key: string): T | null {
		const value = this.storage.getItem(key);
		if (value) {
			try {
				return JSON.parse(value) as T;
			} catch (error) {
				console.error("SessionStorage parse error:", error);
			}
		}
		return null;
	}

	// 删除单个值，返回 void
	remove(key: string): void {
		this.storage.removeItem(key);
	}

	// 清除所有 SessionStorage 数据，返回 void
	clear(): void {
		this.storage.clear();
	}

	// 检查 SessionStorage 是否有某个 key，返回 boolean
	has(key: string): boolean {
		return this.storage.getItem(key) !== null;
	}

	// 获取 SessionStorage 长度，返回 number
	length(): number {
		return this.storage.length;
	}
}

export const local =  new LocalStorage();

export const mindLocalKey = 'mind-file-store';
//TODO local存文件。session存文件操作