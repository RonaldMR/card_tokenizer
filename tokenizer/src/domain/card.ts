import ConstructorParamRequired from '../shared/domain/constructor-param-required';

class Card {
    private _token: string;
    private _tokenExpirationDate: Date;
    private _cvv: string;
    private _cardNumber: string;
    private _expirationMonth: string;
    private _expirationYear: string;
    private _email: string;

    public get token(): string {
        return this._token;
    }

    public get cvv(): string {
        return this._cvv;
    }

    public get tokenExpirationDate(): Date {
        return this._tokenExpirationDate;
    }

    public get cardNumber(): string {
        return this._cardNumber;
    }

    public get expirationMonth(): string {
        return this._expirationMonth;
    }

    public get expirationYear(): string {
        return this._expirationYear;
    }

    public get email(): string {
        return this._email;
    }

    constructor(
        token?: string,
        tokenExpirationDate?: Date,
        cvv?: string,
        cardNumber?: string,
        expirationMonth?: string,
        expirationYear?: string,
        email?: string,
    ) {
        if (!token) {
            throw new ConstructorParamRequired('token');
        }

        if (!tokenExpirationDate) {
            throw new ConstructorParamRequired('tokenExpirationDate');
        }

        if (!cvv) {
            throw new ConstructorParamRequired('cvv');
        }

        if (!cardNumber) {
            throw new ConstructorParamRequired('cardNumber');
        }

        if (!expirationMonth) {
            throw new ConstructorParamRequired('expirationMonth');
        }

        if (!expirationYear) {
            throw new ConstructorParamRequired('expirationYear');
        }

        if (!email) {
            throw new ConstructorParamRequired('email');
        }

        this._token = token;
        this._tokenExpirationDate = tokenExpirationDate;
        this._cvv = cvv;
        this._cardNumber = cardNumber;
        this._expirationMonth = expirationMonth;
        this._expirationYear = expirationYear;
        this._email = email;
    }
}

export default Card;
