import TokenizeCardRequestDto from '../../../../src/application/dto/tokenize-card-request-dto';
import TokenizeRequestGeneralValidator from '../../../../src/application/use-cases/tokenize-request-general-validator';

describe('TokenizeRequestGeneralValidator', function () {
    const defaultRequestMock = new TokenizeCardRequestDto();

    defaultRequestMock.card_number = '4111111111111111';
    defaultRequestMock.cvv = '123';
    defaultRequestMock.expirationMonth = '02';
    defaultRequestMock.expirationYear = '2026';
    defaultRequestMock.email = 'foo@gmail.com';

    describe('All fields are ok', () => {
        it('Should return no errors when all validations are correct', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate(defaultRequestMock);

            expect(results.length).toEqual(0);
        });
    });

    describe('Credit Card', () => {
        it('Should return error when card_number is empty', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, card_number: '' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['card_number is required']));
        });

        it('Should return error when card_number is not a number', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, card_number: 'aabc' });

            expect(results.length).toEqual(2);
            expect(results).toEqual(
                expect.arrayContaining(['card_number is not a number', 'card_number is out of length range: {13, 16}']),
            );
        });

        it('Should return error when card_number character length is out of range', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, card_number: '1234' });

            expect(results.length).toEqual(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    'card_number is out of length range: {13, 16}',
                    'card_number did not pass Luhn check',
                ]),
            );
        });

        it('Should return error when card_number does not pass luhn check', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, card_number: '9123411115965' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['card_number did not pass Luhn check']));
        });
    });

    describe('CVV', () => {
        it('Should return error when cvv is empty', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, cvv: '' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['cvv is required']));
        });

        it('Should return error when cvv is not a number', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, cvv: 'abc' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['cvv is not a number']));
        });

        it('Should return error when cvv character length is out of range', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, cvv: '123456' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['cvv is out of length range: {3, 5}']));
        });
    });

    describe('Expiration Month', () => {
        it('Should return error when expirationMonth is empty', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, expirationMonth: '' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['expirationMonth is required']));
        });

        it('Should return error when expirationMonth is not a number', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, expirationMonth: 'ab' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['expirationMonth is not a number']));
        });

        it('Should return error when expirationMonth character length is out of range', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, expirationMonth: '123' });

            expect(results.length).toEqual(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    'expirationMonth is out of length range: {2, 2}',
                    'expirationMonth is out of range: {1, 12}',
                ]),
            );
        });

        it('Should return error when expirationMonth is not between 1 and 12', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, expirationMonth: '13' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['expirationMonth is out of range: {1, 12}']));
        });
    });

    describe('Expiration Year', () => {
        it('Should return error when expirationYear is empty', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, expirationYear: '' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['expirationYear is required']));
        });

        it('Should return error when expirationYear is not a number', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, expirationYear: 'abdd' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['expirationYear is not a number']));
        });

        it('Should return error when expirationYear character length is out of range', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, expirationYear: '25222' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['expirationYear is out of length range: {4, 4}']));
        });
    });

    describe('Email', () => {
        it('Should return error when email is empty', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, email: '' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['email is required']));
        });

        it('Should return error when email has invalid format', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, email: 'notanemail' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['email has no email format']));
        });

        it('Should return error when email has invalid format', () => {
            const validator = new TokenizeRequestGeneralValidator();

            const results = validator.validate({ ...defaultRequestMock, email: 'anemail@butwithbaddomain.com' });

            expect(results.length).toEqual(1);
            expect(results).toEqual(expect.arrayContaining(['email has no email format']));
        });
    });
});
