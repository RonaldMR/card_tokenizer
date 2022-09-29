class InternalError extends Error {
    private readonly _details: string | undefined;

    public getDetails(): string | undefined {
        return this._details;
    }

    constructor(details: string | undefined) {
        super(`There was an internal error in the application`);

        this._details = details;
    }
}

export default InternalError;
