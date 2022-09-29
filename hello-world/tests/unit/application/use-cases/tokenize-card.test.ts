import TokenizeCardRequestDto from '../../../../src/application/dto/tokenize-card-request-dto';
import TokenizeCard from '../../../../src/application/use-cases/tokenize-card';
import CardRepository from '../../../../src/domain/card-repository';
import ClientRepository from '../../../../src/domain/client-repository';
import TokenGenerator from '../../../../src/infrastructure/token-generator';
import Validator from '../../../../src/shared/application/validator';

describe('TokenizeCard', function () {
    const mockSave = jest.fn();

    const defaultMockedCardRepository: jest.Mocked<CardRepository> = {
        save: mockSave,
        get: jest.fn(),
    };

    const defaultMockedClientRepository: jest.Mocked<ClientRepository> = {
        exists: jest.fn().mockReturnValue(true),
    };

    const defaultMockedValidator: jest.Mocked<Validator<TokenizeCardRequestDto>> = {
        validate: jest.fn().mockReturnValue([]),
    };

    it('Should save new card', async () => {
        const mockClientToken = 'token';

        const mockRequest = new TokenizeCardRequestDto();
        mockRequest.card_number = '4111111111111111';
        mockRequest.cvv = '124';
        mockRequest.email = 'affq@ag.com';
        mockRequest.expirationMonth = '01';
        mockRequest.expirationYear = '2023';

        const mockedUseCase = new TokenizeCard(
            [defaultMockedValidator],
            defaultMockedCardRepository,
            defaultMockedClientRepository,
            new TokenGenerator(),
        );

        await mockedUseCase.execute(mockRequest, mockClientToken);

        expect(mockSave).toHaveBeenCalledTimes(1);
    });
});
