import 'reflect-metadata';

import { Container } from 'inversify';
import TYPES from './types';
import CardRepository from './domain/card-repository';
import ClientRepository from './domain/client-repository';
import MongooseCardRepository from './infrastructure/mongoose-card-repository';
import MockedClientRepository from './infrastructure/mocked-client-repository';
import TokenGenerator from './infrastructure/token-generator';
import Validator from './shared/application/validator';
import GetCardRequestGeneralValidator from './application/use-cases/get-card-request-general-validator';
import TokenizeRequestCardValidator from './application/use-cases/tokenize-request-card-validator';
import TokenizeRequestGeneralValidator from './application/use-cases/tokenize-request-general-validator';
import GetCard from './application/use-cases/get-card';
import TokenizeCard from './application/use-cases/tokenize-card';
import GetCardRequestDto from './application/dto/get-card-request-dto';
import TokenizeCardRequestDto from './application/dto/tokenize-card-request-dto';
import GetCardResponseDto from './application/dto/get-card-response-dto';
import UseCase from './shared/application/use-case';
import TokenizeCardResponseDto from './application/dto/tokenize-card-response-dto';

const container: Container = new Container();

container
    .bind<string>(TYPES.connectionString)
    .toConstantValue(
        'mongodb+srv://challengetk:apopb6dQP1EBYcHb@cluster0.7sztk.mongodb.net/?retryWrites=true&w=majority',
    );
container.bind<CardRepository>(TYPES.MongooseClientRepository).to(MongooseCardRepository);
container.bind<ClientRepository>(TYPES.MockedClientRepository).to(MockedClientRepository);
container.bind<TokenGenerator>(TYPES.TokenGenerator).to(TokenGenerator);
container.bind<Validator<GetCardRequestDto>>(TYPES.GetCardRequestGeneralValidator).to(GetCardRequestGeneralValidator);
container.bind<Validator<TokenizeCardRequestDto>>(TYPES.TokenizeRequestValidator).to(TokenizeRequestGeneralValidator);
container.bind<Validator<TokenizeCardRequestDto>>(TYPES.TokenizeRequestValidator).to(TokenizeRequestCardValidator);
container.bind<UseCase<GetCardRequestDto, GetCardResponseDto>>(TYPES.GetCard).to(GetCard);
container.bind<UseCase<TokenizeCardRequestDto, TokenizeCardResponseDto>>(TYPES.TokenizeCard).to(TokenizeCard);

export default container;
