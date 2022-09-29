import { injectable } from 'inversify';
import ClientRepository from '../../domain/client-repository';
import AuthorizationError from './authorization-error';
import ValidationError from './validation-error';
import Validator from './validator';

@injectable()
abstract class UseCase<TRequest, TResponse> {
    protected readonly _clientRepository: ClientRepository;
    private readonly _validators: Validator<TRequest>[];

    constructor(clientRepository: ClientRepository, validators: Validator<TRequest>[]) {
        this._clientRepository = clientRepository;
        this._validators = validators;
    }

    public async execute(request: TRequest, clientToken: string | undefined): Promise<TResponse> {
        if (!clientToken) {
            throw new ValidationError([`Client Token is empty`]);
        }

        const clientExists = await this._clientRepository.exists(clientToken);

        if (!clientExists) {
            throw new AuthorizationError(clientToken);
        }

        const validationResults = this._validators.map((validator) => validator.validate(request));

        const errors: string[] = [];

        validationResults.forEach((results) => results.forEach((result) => errors.push(result)));

        if (errors.length) {
            throw new ValidationError(errors);
        }

        return await this.executeUseCase(request);
    }

    protected abstract executeUseCase(request: TRequest): Promise<TResponse>;
}

export default UseCase;
