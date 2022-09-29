import { Schema, model } from 'mongoose';

interface IMongooseCard {
    cardNumber: string;
    cvv: string;
    expirationMonth: string;
    expirationYear: string;
    email: string;
    token: string;
    tokenExpirationDate: Date;
}

const mongooseCardSchema = new Schema<IMongooseCard>({
    cardNumber: {
        type: String,
        maxLength: 16,
        required: true,
    },
    cvv: {
        type: String,
        maxLength: 5,
        required: true,
    },
    expirationMonth: {
        type: String,
        maxLength: 2,
        required: true,
    },
    expirationYear: {
        type: String,
        maxLength: 4,
        required: true,
    },
    email: {
        type: String,
        maxLength: 100,
        required: true,
    },
    token: {
        type: String,
        maxLength: 16,
        required: true,
        unique: true,
    },
    tokenExpirationDate: {
        type: Date,
        required: true,
    },
});

const MongooseCard = model<IMongooseCard>('Card', mongooseCardSchema);

export default MongooseCard;
