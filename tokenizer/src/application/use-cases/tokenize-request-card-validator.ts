import { injectable } from 'inversify';
import Validator from '../../shared/application/validator';
import TokenizeCardRequestDto from '../dto/tokenize-card-request-dto';

interface CardType {
    prefixes: string[];
    lenghts: number[];
    cvvLength: number;
    type: string;
}

@injectable()
class TokenizeRequestCardValidator implements Validator<TokenizeCardRequestDto> {
    private readonly _cardTypes: CardType[];

    constructor() {
        const visa: CardType = {
            type: 'VISA',
            lenghts: [13, 14, 15, 16],
            prefixes: ['4'],
            cvvLength: 3,
        };

        const masterCard: CardType = {
            type: 'MASTERCARD',
            lenghts: [16],
            prefixes: ['51', '52', '53', '54', '55'],
            cvvLength: 3,
        };

        const amex: CardType = {
            type: 'AMEX',
            lenghts: [15],
            prefixes: ['34', '37'],
            cvvLength: 4,
        };

        this._cardTypes = [visa, masterCard, amex];
    }

    validate(input: TokenizeCardRequestDto): string[] {
        if (input.card_number === undefined) {
            return [];
        }

        if (input.cvv === undefined) {
            return [];
        }

        if (input.expirationYear === undefined) {
            return [];
        }

        const cardNumber = input.card_number;

        const cardTypesForCardNumber = this._cardTypes.filter((cardType) => {
            if (!cardType.prefixes.some((prefix) => cardNumber.startsWith(prefix))) {
                return false;
            }

            if (!cardType.lenghts.some((length) => cardNumber.length === length)) {
                return false;
            }

            return true;
        });

        if (!cardTypesForCardNumber.length) {
            return ['card_number does not belong to any valid type'];
        }

        const cvv = input.cvv;

        const hasValidCVV = cardTypesForCardNumber.some((cardType) => cardType.cvvLength === cvv.length);

        if (!hasValidCVV) {
            return ['cvv is not valid'];
        }

        const year = input.expirationYear;

        let yearAsNumber = 0;

        try {
            yearAsNumber = parseInt(year);

            if (yearAsNumber > new Date().getFullYear() + 5) {
                return ['expirationYear is not valid'];
            }
        } catch {
            return ['expirationYear is not valid'];
        }

        return [];
    }
}

export default TokenizeRequestCardValidator;
