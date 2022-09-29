class AuthorizationError extends Error {
    constructor(wrongToken: string) {
        super(`Token ${wrongToken} does not exists`);
    }
}

export default AuthorizationError;
