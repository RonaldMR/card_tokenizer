import { getCard } from './src/presenter/get-card';
import { tokenizeCard } from './src/presenter/tokenize-card';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

exports.tokenizeCard = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return tokenizeCard(event);
};

exports.getCard = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return getCard(event);
};
