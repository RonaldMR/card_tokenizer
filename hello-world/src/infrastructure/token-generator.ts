import ShortUniqueId from 'short-unique-id';
import { injectable } from 'inversify';

@injectable()
class TokenGenerator {
    private readonly _uid: ShortUniqueId;

    constructor() {
        this._uid = new ShortUniqueId({ length: 16 });
    }

    public generate(): string {
        return this._uid();
    }
}

export default TokenGenerator;
