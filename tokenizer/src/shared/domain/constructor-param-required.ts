class ConstructorParamRequired extends Error {
    constructor(field: string) {
        super(`${field} is required`);
    }
}

export default ConstructorParamRequired;
