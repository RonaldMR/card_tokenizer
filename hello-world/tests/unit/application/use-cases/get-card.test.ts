import GetCardRequestDto from '../../../../src/application/dto/get-card-request-dto';
import GetCardResponseDto from '../../../../src/application/dto/get-card-response-dto';
import GetCard from '../../../../src/application/use-cases/get-card';
import Card from '../../../../src/domain/card';
import CardRepository from '../../../../src/domain/card-repository';
import ClientRepository from '../../../../src/domain/client-repository';
import ValidationError from '../../../../src/shared/application/validation-error';
import Validator from '../../../../src/shared/application/validator';

describe('GetCard', function () {
    const defaultMockedCard = new Card(
        'tokenfoo',
        new Date(2023, 1, 8),
        '111',
        '4111111111111111',
        '01',
        '2023',
        'mocky@mocky.com',
    );

    const defaultMockedResult = new GetCardResponseDto();

    defaultMockedResult.card_number = '4111111111111111';
    defaultMockedResult.email = 'mocky@mocky.com';
    defaultMockedResult.expirationMonth = '01';
    defaultMockedResult.expirationYear = '2023';

    const defaultMockedCardRepository: jest.Mocked<CardRepository> = {
        save: jest.fn(),
        get: jest.fn().mockResolvedValue(defaultMockedCard),
    };

    const defaultMockedClientRepository: jest.Mocked<ClientRepository> = {
        exists: jest.fn().mockReturnValue(true),
    };

    const defaultMockedValidator: jest.Mocked<Validator<GetCardRequestDto>> = {
        validate: jest.fn().mockReturnValue([]),
    };

    it('Should return result when card is found', async () => {
        const mockClientToken = 'token';

        const mockRequest = new GetCardRequestDto();
        mockRequest.token = 'ok';

        const mockedUseCase = new GetCard(
            [defaultMockedValidator],
            defaultMockedCardRepository,
            defaultMockedClientRepository,
        );

        const result = await mockedUseCase.execute(mockRequest, mockClientToken);

        expect(result).toMatchObject(defaultMockedResult);
    });

    it('Should throw a validation error when token has expired', async () => {
        const mockedCardWithExpiredToken = new Card(
            'tokenfoo',
            new Date(2020, 1, 1),
            '111',
            '4111111111111111',
            '01',
            '2023',
            'mocky@mocky.com',
        );

        const mockedCardRepository: jest.Mocked<CardRepository> = {
            save: jest.fn(),
            get: jest.fn().mockResolvedValue(mockedCardWithExpiredToken),
        };

        const mockClientToken = 'token';

        const mockRequest = new GetCardRequestDto();
        mockRequest.token = 'ok';

        const mockedUseCase = new GetCard(
            [defaultMockedValidator],
            mockedCardRepository,
            defaultMockedClientRepository,
        );

        await expect(mockedUseCase.execute(mockRequest, mockClientToken)).rejects.toThrowError(
            new ValidationError(['Token ok has already expired.']),
        );
    });

    it('Should throw a not found error when token was not found', async () => {
        const mockedCardRepository: jest.Mocked<CardRepository> = {
            save: jest.fn(),
            get: jest.fn().mockResolvedValue(undefined),
        };

        const mockClientToken = 'token';

        const mockRequest = new GetCardRequestDto();
        mockRequest.token = 'ok';

        const mockedUseCase = new GetCard(
            [defaultMockedValidator],
            mockedCardRepository,
            defaultMockedClientRepository,
        );

        await expect(mockedUseCase.execute(mockRequest, mockClientToken)).rejects.toThrowError(
            new ValidationError([`Card for token ok not found.`]),
        );
    });

    it('Should throw a validation error when token is empty', async () => {
        const mockedValidator: jest.Mocked<Validator<GetCardRequestDto>> = {
            validate: jest.fn().mockReturnValue(['Error']),
        };

        const mockClientToken = 'token';

        const mockRequest = new GetCardRequestDto();
        mockRequest.token = '';

        const mockedUseCase = new GetCard(
            [mockedValidator],
            defaultMockedCardRepository,
            defaultMockedClientRepository,
        );

        await expect(mockedUseCase.execute(mockRequest, mockClientToken)).rejects.toThrowError(
            new ValidationError(['Token is required']),
        );
    });
});
