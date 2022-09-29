interface ClientRepository {
    exists(token: string): Promise<boolean>;
}

export default ClientRepository;
