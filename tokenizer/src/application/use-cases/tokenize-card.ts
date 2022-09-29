import { inject, injectable, multiInject } from 'inversify';
import Card from '../../domain/card';
import CardRepository from '../../domain/card-repository';
import ClientRepository from '../../domain/client-repository';
import TokenGenerator from '../../infrastructure/token-generator';
import UseCase from '../../shared/application/use-case';
import Validator from '../../shared/application/validator';
import TYPES from '../../types';
import TokenizeCardRequestDto from '../dto/tokenize-card-request-dto';
import TokenizeCardResponseDto from '../dto/tokenize-card-response-dto';

@injectable()
class TokenizeCard extends UseCase<TokenizeCardRequestDto, TokenizeCardResponseDto> {
    private readonly _cardRepository: CardRepository;
    private readonly _tokenLifeSpan: number;
    private readonly _tokenGenerator: TokenGenerator;

    constructor(
        @multiInject(TYPES.TokenizeRequestValidator) validators: Validator<TokenizeCardRequestDto>[],
        @inject(TYPES.MongooseClientRepository) cardRepository: CardRepository,
        @inject(TYPES.MockedClientRepository) clientRepository: ClientRepository,
        @inject(TYPES.TokenGenerator) tokenGenerator: TokenGenerator,
    ) {
        super(clientRepository, validators);
        this._cardRepository = cardRepository;
        this._tokenLifeSpan = 15;
        this._tokenGenerator = tokenGenerator;
    }

    public async executeUseCase(request: TokenizeCardRequestDto): Promise<TokenizeCardResponseDto> {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + this._tokenLifeSpan);

        const generatedToken = this._tokenGenerator.generate();

        const card = new Card(
            generatedToken,
            expirationDate,
            request.cvv,
            request.card_number,
            request.expirationMonth,
            request.expirationYear,
            request.email,
        );

        await this._cardRepository.save(card);

        const response = new TokenizeCardResponseDto();
        response.token = card.token;

        return response;
    }
}

export default TokenizeCard;
