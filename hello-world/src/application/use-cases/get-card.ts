import { inject, injectable, multiInject } from 'inversify';
import CardRepository from '../../domain/card-repository';
import ClientRepository from '../../domain/client-repository';
import UseCase from '../../shared/application/use-case';
import ValidationError from '../../shared/application/validation-error';
import Validator from '../../shared/application/validator';
import TYPES from '../../types';
import GetCardRequestDto from '../dto/get-card-request-dto';
import GetCardResponseDto from '../dto/get-card-response-dto';

@injectable()
class GetCard extends UseCase<GetCardRequestDto, GetCardResponseDto> {
    private readonly _cardRepository: CardRepository;

    constructor(
        @multiInject(TYPES.GetCardRequestGeneralValidator) getCardRequestValidators: Validator<GetCardRequestDto>[],
        @inject(TYPES.MongooseClientRepository) cardRepository: CardRepository,
        @inject(TYPES.MockedClientRepository) clientRepository: ClientRepository,
    ) {
        super(clientRepository, getCardRequestValidators);
        this._cardRepository = cardRepository;
    }

    async executeUseCase(request: GetCardRequestDto): Promise<GetCardResponseDto> {
        if (!request.token) {
            throw new ValidationError([`Token is required`]);
        }

        const card = await this._cardRepository.get(request.token);

        const now = new Date();

        if (!card) {
            throw new ValidationError([`Card for token ${request.token} not found.`]);
        }

        if (card.tokenExpirationDate < now) {
            throw new ValidationError([`Token ${request.token} has already expired.`]);
        }

        const response = new GetCardResponseDto();

        response.card_number = card.cardNumber;
        response.email = card.email;
        response.expirationMonth = card.expirationMonth;
        response.expirationYear = card.expirationYear;

        return response;
    }
}

export default GetCard;
