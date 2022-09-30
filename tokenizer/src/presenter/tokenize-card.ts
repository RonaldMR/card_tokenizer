import { APIGatewayProxyEvent } from 'aws-lambda';
import TokenizeCardRequestDto from '../application/dto/tokenize-card-request-dto';
import TokenizeCardResponseDto from '../application/dto/tokenize-card-response-dto';
import ValidationError from '../shared/application/validation-error';
import { generalHandler } from '../shared/presenter/general-handler';
import TYPES from '../types';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

const getRequest = (event: APIGatewayProxyEvent): TokenizeCardRequestDto => {
    const body = event.body;

    if (!body) {
        throw new ValidationError(['Request body is empty']);
    }

    const requestDto: TokenizeCardRequestDto = JSON.parse(body);
    return requestDto;
};

export const tokenizeCard = generalHandler<TokenizeCardRequestDto, TokenizeCardResponseDto>(
    getRequest,
    TYPES.TokenizeCard,
);
