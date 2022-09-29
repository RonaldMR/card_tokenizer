import { injectable } from 'inversify';
import Validator from './validator';

interface GeneralValidation<T> {
    field: <U>(value: T) => U | string | number | undefined;
    validation: (request: T) => boolean;
    message: string;
    fieldName: string;
}

@injectable()
abstract class GeneralValidator<T> implements Validator<T> {
    protected readonly _validations: GeneralValidation<T>[];

    protected readonly _emailRegEx: RegExp;

    protected readonly _emailDomains: string[];

    constructor() {
        this._validations = [];
        this._emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this._emailDomains = ['gmail.com', 'hotmail.com', 'yahoo.es'];
    }

    private performLuhnCheck(creditCard: string) {
        let timesTwoSum = 0;
        let otherNumbersSum = 0;

        for (let i = creditCard.length - 1; i >= 0; i -= 2) {
            const number = creditCard[i];
            const otherNumber = creditCard[i - 1];

            if (number !== undefined) {
                otherNumbersSum += parseInt(number);
            }

            if (otherNumber !== undefined) {
                const timesTwo = parseInt(otherNumber) * 2;

                const stringTimesTwo: string = timesTwo.toString();

                for (let j = 0; j < stringTimesTwo.length; j++) {
                    timesTwoSum += parseInt(stringTimesTwo[j]);
                }
            }
        }

        const sum = timesTwoSum + otherNumbersSum;

        return sum % 10 === 0;
    }

    protected LuhnCheck(field: (value: T) => string | undefined, fieldName: string): void {
        const validation = (request: T) => {
            const value = field(request);

            if (!value) return true;

            if (isNaN(parseInt(value))) return true;

            return this.performLuhnCheck(value);
        };

        const message = `${fieldName} did not pass Luhn check`;

        this._validations.push({
            field,
            validation,
            fieldName,
            message,
        });
    }

    protected Email(field: (value: T) => string | undefined, fieldName: string): void {
        const validation = (request: T) => {
            const value = field(request);

            if (!value) return true;

            if (!value.match(this._emailRegEx)) {
                return false;
            }

            const domain = value.split('@')[1];

            return this._emailDomains.some((emailDomain) => domain.toLowerCase() === emailDomain);
        };

        const message = `${fieldName} has no email format`;

        this._validations.push({
            field,
            validation,
            fieldName,
            message,
        });
    }

    protected Required(field: (value: T) => string | undefined, fieldName: string): void {
        const validation = (request: T) => !!field(request);

        const message = `${fieldName} is required`;

        this._validations.push({
            field,
            validation,
            fieldName,
            message,
        });
    }

    protected IsNumber(field: (value: T) => string | undefined, fieldName: string): void {
        const validation = (request: T) => {
            const value = field(request);

            if (!value) return true;

            return !isNaN(parseInt(value));
        };

        const message = `${fieldName} is not a number`;

        this._validations.push({
            field,
            validation,
            fieldName,
            message,
        });
    }

    protected Length(field: (value: T) => string | undefined, from: number, to: number, fieldName: string): void {
        const validation = (request: T) => {
            const value = field(request);

            if (!value) return true;

            const length = value.length;

            return length >= from && length <= to;
        };

        const message = `${fieldName} is out of length range: {${from}, ${to}}`;

        this._validations.push({
            field,
            validation,
            fieldName,
            message,
        });
    }

    protected Range(field: (value: T) => string | undefined, from: number, to: number, fieldName: string): void {
        const validation = (request: T) => {
            const value = field(request);

            if (!value) return true;

            const numericMonth = parseInt(value);

            if (isNaN(numericMonth)) return true;

            return numericMonth >= from && numericMonth < to;
        };

        const message = `${fieldName} is out of range: {${from}, ${to}}`;

        this._validations.push({
            field,
            validation,
            fieldName,
            message,
        });
    }

    validate(input: T): string[] {
        return this._validations
            .map((validation) => {
                const isValid = validation.validation(input);
                return isValid ? '' : validation.message;
            })
            .filter((detail) => detail);
    }
}

export default GeneralValidator;
