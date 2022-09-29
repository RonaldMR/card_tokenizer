import ClientRepository from '../../../../src/domain/client-repository';
import AuthorizationError from '../../../../src/shared/application/authorization-error';
import UseCase from '../../../../src/shared/application/use-case';
import ValidationError from '../../../../src/shared/application/validation-error';
import Validator from '../../../../src/shared/application/validator';

interface TestRequestDto {
    sample?: string;
}

interface TestResponseDto {
    sample?: string;
}

class TestUseCase extends UseCase<TestRequestDto, TestResponseDto> {
    constructor(clientRepository: ClientRepository, validators: Validator<TestRequestDto>[]) {
        super(clientRepository, validators);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async executeUseCase(_: TestRequestDto): Promise<TestResponseDto> {
        return { sample: 'ok' };
    }
}

describe('UseCase', function () {
    const defaultMockedValidator: jest.Mocked<Validator<TestRequestDto>> = {
        validate: jest.fn().mockReturnValue([]),
    };

    const defaultMockedClientRepository: jest.Mocked<ClientRepository> = {
        exists: jest.fn().mockReturnValue(true),
    };

    it('Should throw error when client token is empty', async () => {
        const mockRequest: TestRequestDto = { sample: 'foo' };

        const mockedUseCase = new TestUseCase(defaultMockedClientRepository, [defaultMockedValidator]);

        await expect(mockedUseCase.execute(mockRequest, '')).rejects.toThrowError(
            new ValidationError(['Client Token is empty']),
        );
    });

    it('Should throw error when client does not exists', async () => {
        const mockedClientRepository: jest.Mocked<ClientRepository> = {
            exists: jest.fn().mockReturnValue(false),
        };

        const mockRequest: TestRequestDto = { sample: 'foo' };

        const mockedUseCase = new TestUseCase(mockedClientRepository, [defaultMockedValidator]);

        await expect(mockedUseCase.execute(mockRequest, 'foo')).rejects.toThrowError(new AuthorizationError('foo'));
    });

    it('Should throw a validation error when request is not valid', async () => {
        const mockedValidator: jest.Mocked<Validator<TestRequestDto>> = {
            validate: jest.fn().mockReturnValue(['Error']),
        };

        const mockRequest: TestRequestDto = { sample: 'foo' };

        const mockedUseCase = new TestUseCase(defaultMockedClientRepository, [mockedValidator]);

        await expect(mockedUseCase.execute(mockRequest, 'foo')).rejects.toThrowError(new ValidationError(['Error']));
    });
});
