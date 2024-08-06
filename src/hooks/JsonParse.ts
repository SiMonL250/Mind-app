import fs from "fs";

export function JSON2Obj(path: fs.PathLike) {
	return new Promise((resolve, reject) => {
		const readStream = fs.createReadStream(path, "utf-8");
		const buffers: Buffer[] = [];

		readStream.on("data", (chunk) => buffers.push(chunk as Buffer));
		readStream.on("end", () => {
			const fileContent = Buffer.concat(buffers).toString();
			resolve(fileContent);
		});
		readStream.on("error", (error) => {
			reject(error);
		});
	});
}
