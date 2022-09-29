import Card from './card';

interface CardRepository {
    save(card: Card): Promise<void>;
    get(token: string): Promise<Card | undefined>;
}

export default CardRepository;
