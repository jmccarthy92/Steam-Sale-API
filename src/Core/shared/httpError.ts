export class HttpError extends Error {
    public message: string;
    public status: number;

    /**
     *
     * @param {number} status - http status code
     * @param {string} message - any additional messages
     */
    public constructor(status: number, message: string = '') {
        super();
        this.message = message;
        this.status = status;
    }
}