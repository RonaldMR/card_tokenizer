class ValidationError extends Error {
    private _errors: string[];

    public get errors(): string[] {
        return this._errors;
    }

    constructor(errors: string[]) {
        super(`Request has ${errors.length} error(s). Please check.`);
        this._errors = errors;
    }
}

export default ValidationError;
