import GetCardRequestDto from '../../../../src/application/dto/get-card-request-dto';
import GetCardRequestGeneralValidator from '../../../../src/application/use-cases/get-card-request-general-validator';

describe('GetCardRequestGeneralValidator', function () {
    it('Should return errors when token has no 16 characters', () => {
        const requestMock = new GetCardRequestDto();
        requestMock.token = '125';

        const validator = new GetCardRequestGeneralValidator();

        const results = validator.validate(requestMock);

        expect(results.length).toEqual(1);
        expect(results).toEqual(expect.arrayContaining(['card_number is out of length range: {16, 16}']));
    });

    it('Should return no erros when token has 16 characters', () => {
        const requestMock = new GetCardRequestDto();
        requestMock.token = '1251251251251251';

        const validator = new GetCardRequestGeneralValidator();

        const results = validator.validate(requestMock);

        expect(results.length).toEqual(0);
    });
});
