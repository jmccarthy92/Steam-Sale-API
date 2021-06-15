import { sleep } from '@Core/shared/utils';

export default class Retry {
    private asyncCallback: Function;
    private retryCounter: number = 0;
    private retryLimit: number;
    private responseHandler: Function;
    private initialRetryDelay: number = 100;
    /**
     * Creates a RetryHelper object.
     *
     * @param {number} retryLimit - Number of retries
     * @param {Function} asyncCallback - Function to be invoked in the class.
     * @param {any[]} asyncParams - Any optional params to pass to the callback. ( you could also bind them to your function instead)
     * @example
     * new RetryHelper(1, asyncRequest.bind(asyncRequest, params));
     */
    public constructor(retryLimit: number, asyncCallback: Function, responseHandler: Function) {
        this.retryLimit = retryLimit;
        this.asyncCallback = asyncCallback;
        this.responseHandler = responseHandler;
    }

    public static run(retryLimit: number, asyncCallback: Function, responseHandler: Function, delay?: number) {
        return new Retry(retryLimit, asyncCallback, responseHandler).retryAsyncRequest(delay);
    }

    /**
     * Used to retry asynchronous requests, the response handler will be used to determine
     * when the response is successful. A successful response should return a truthy value,
     * if it's not truthy the retry algorithm will continue until it fathoms at the retryLimit
     * instance variable.
     *
     * @param {Function} responseHandler - Handles the response, for each retry. Return a truthy
     *  value for a successful response, otherwise you can use can falsey value to continue retrying.
     * @param {number} delay - Optional delay to override the default initial retry delay of 100.
     */
    public async retryAsyncRequest(delay?: number): Promise<any> {
        if (delay) this.initialRetryDelay = delay;
        for await (const response of this.retry()) {
            const handledResponse = this.responseHandler(response);
            if (handledResponse) {
                return handledResponse;
            }
        }
    }

    private async *retry(): AsyncIterableIterator<void> {
        while (this.retryCounter < this.retryLimit) {
            await sleep(this.exponentialBackoff());
            const response = await this.asyncCallback();
            this.retryCounter++;
            yield response;
        }
    }

    /**
     * Using exponential backoff for incremental delay, it's identical to the one used in the AWS General reference
     * @link {https://docs.aws.amazon.com/general/latest/gr/api-retries.html}
     */
    private exponentialBackoff(): number {
        return 2 ** this.retryCounter * this.initialRetryDelay;
    }
}
