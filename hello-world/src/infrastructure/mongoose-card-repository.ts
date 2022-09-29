import { connect } from 'mongoose';
import Card from '../domain/card';
import CardRepository from '../domain/card-repository';
import InternalError from '../shared/internal-error';
import MongooseCard from './mongoose-card';
import { inject, injectable } from 'inversify';
import TYPES from '../types';

@injectable()
class MongooseCardRepository implements CardRepository {
    private readonly _connectionString: string;

    constructor(@inject(TYPES.connectionString) connectionString: string) {
        this._connectionString = connectionString;
    }

    async save(card: Card): Promise<void> {
        try {
            const { cardNumber, cvv, expirationMonth, expirationYear, email, token, tokenExpirationDate } = card;

            const connection = await connect(this._connectionString);

            const newCard = new MongooseCard({
                cardNumber,
                cvv,
                expirationMonth,
                expirationYear,
                email,
                token,
                tokenExpirationDate,
            });

            await newCard.save();

            await connection.disconnect();
        } catch (error) {
            if (error instanceof Error) throw new InternalError(error.message);

            throw new InternalError('An unexpected error ocurred.');
        }
    }

    async get(token: string): Promise<Card | undefined> {
        try {
            const connection = await connect(this._connectionString);

            const foundCards = await MongooseCard.find({ token }).exec();

            if (!foundCards.length) return undefined;

            const { cardNumber, cvv, expirationMonth, expirationYear, email, tokenExpirationDate } = foundCards[0];

            const card = new Card(token, tokenExpirationDate, cvv, cardNumber, expirationMonth, expirationYear, email);

            await connection.disconnect();

            return card;
        } catch (error) {
            if (error instanceof Error) throw new InternalError(error.message);

            throw new InternalError('An unexpected error ocurred.');
        }
    }
}

export default MongooseCardRepository;
