import { sleep } from "@Core/shared/utils";
import { chunk, flatten } from "lodash";

export type ChunkPromiseFunction<T> = (...args: any[]) => Promise<T>

export default class ChunkedPromise<T> {
    private asyncCallback: ChunkPromiseFunction<T>;
    private callbackArgs: any[];

    public constructor(asyncCallback: ChunkPromiseFunction<T>, callbackArgs: any[]) {
        this.asyncCallback = asyncCallback;
        this.callbackArgs = callbackArgs;
    }

    public async chunk<T>(operationsPerSecond: number, delay: number): Promise<T[]> {
        const chunks = chunk(this.callbackArgs, operationsPerSecond);
        const results: any[] = [];
        for (let ndx = 0; ndx < chunks.length; ndx++) {
            if (ndx > 0) await sleep(delay);
            const result = await Promise.all(chunks[ndx].map(this.asyncCallback));
            results.push(...result);
        }
        return flatten(results);
    }
    
}