import { injectable } from 'inversify';
import GeneralValidator from '../../shared/application/general-validator';
import TokenizeCardRequestDto from '../dto/tokenize-card-request-dto';

@injectable()
class TokenizeRequestGeneralValidator extends GeneralValidator<TokenizeCardRequestDto> {
    constructor() {
        super();

        this.Required((request) => request.card_number, 'card_number');
        this.IsNumber((request) => request.card_number, 'card_number');
        this.Length((request) => request.card_number, 13, 16, 'card_number');
        this.LuhnCheck((request) => request.card_number, 'card_number');

        this.Required((request) => request.cvv, 'cvv');
        this.IsNumber((request) => request.cvv, 'cvv');
        this.Length((request) => request.cvv, 3, 5, 'cvv');

        this.Required((request) => request.expirationMonth, 'expirationMonth');
        this.IsNumber((request) => request.expirationMonth, 'expirationMonth');
        this.Length((request) => request.expirationMonth, 2, 2, 'expirationMonth');
        this.Range((request) => request.expirationMonth, 1, 12, 'expirationMonth');

        this.Required((request) => request.expirationYear, 'expirationYear');
        this.IsNumber((request) => request.expirationYear, 'expirationYear');
        this.Length((request) => request.expirationYear, 4, 4, 'expirationYear');

        this.Required((request) => request.email, 'email');
        this.Email((request) => request.email, 'email');
    }
}

export default TokenizeRequestGeneralValidator;
