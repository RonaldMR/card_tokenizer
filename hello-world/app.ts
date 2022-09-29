import { getCard } from './src/handlers/get-card';
import { tokenizeCard } from './src/handlers/tokenize-card';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

exports.tokenizeCard = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return tokenizeCard(event);
};

exports.getCard = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return getCard(event);
};
