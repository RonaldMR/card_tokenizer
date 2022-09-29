import { injectable } from 'inversify';
import ClientRepository from '../domain/client-repository';

@injectable()
class MockedClientRepository implements ClientRepository {
    private readonly _clients: string[];

    constructor() {
        this._clients = ['0ae8dW2FpEAZlxlz'];
    }

    async exists(token: string): Promise<boolean> {
        return this._clients.some((memoryToken) => memoryToken === token);
    }
}

export default MockedClientRepository;
