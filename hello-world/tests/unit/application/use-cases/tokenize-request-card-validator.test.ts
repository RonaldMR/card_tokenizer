import TokenizeCardRequestDto from '../../../../src/application/dto/tokenize-card-request-dto';
import TokenizeRequestCardValidator from '../../../../src/application/use-cases/tokenize-request-card-validator';

describe('TokenizeRequestGeneralValidator', function () {
    const defaultRequestMock = new TokenizeCardRequestDto();

    defaultRequestMock.card_number = '4111111111111111';
    defaultRequestMock.cvv = '123';
    defaultRequestMock.expirationYear = '2026';

    it('Should return no errors when all validations are correct', () => {
        const validator = new TokenizeRequestCardValidator();

        const results = validator.validate(defaultRequestMock);

        expect(results.length).toEqual(0);
    });

    it('Should return error when card_number does not match with any known type', () => {
        const validator = new TokenizeRequestCardValidator();

        const results = validator.validate({ ...defaultRequestMock, card_number: '9999111111111111' });

        expect(results.length).toEqual(1);
        expect(results).toEqual(expect.arrayContaining(['card_number does not belong to any valid type']));
    });

    it('Should return error when card_number length is not valid', () => {
        const validator = new TokenizeRequestCardValidator();

        const results = validator.validate({ ...defaultRequestMock, card_number: '41111111111111111111' });

        expect(results.length).toEqual(1);
        expect(results).toEqual(expect.arrayContaining(['card_number does not belong to any valid type']));
    });

    it('Should return error when cvv is not valid', () => {
        const validator = new TokenizeRequestCardValidator();

        const results = validator.validate({ ...defaultRequestMock, cvv: '467742' });

        expect(results.length).toEqual(1);
        expect(results).toEqual(expect.arrayContaining(['cvv is not valid']));
    });

    it('Should return error when expirationYear is not valid', () => {
        const validator = new TokenizeRequestCardValidator();

        const results = validator.validate({ ...defaultRequestMock, expirationYear: '2050' });

        expect(results.length).toEqual(1);
        expect(results).toEqual(expect.arrayContaining(['expirationYear is not valid']));
    });
});
