import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import GetCardRequestDto from '../application/dto/get-card-request-dto';
import GetCardResponseDto from '../application/dto/get-card-response-dto';
import { generalHandler } from '../shared/handlers/general-handler';
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

const getRequest = (event: APIGatewayProxyEvent): GetCardRequestDto => {
    const parameters = event.pathParameters;

    const cardToken = parameters ? parameters['token'] : undefined;

    const requestDto = new GetCardRequestDto();
    requestDto.token = cardToken;

    return requestDto;
};

export const getCard = generalHandler<GetCardRequestDto, GetCardResponseDto>(getRequest, TYPES.GetCard);
