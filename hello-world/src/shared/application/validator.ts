interface Validator<T> {
    validate(input: T): string[];
}

export default Validator;
