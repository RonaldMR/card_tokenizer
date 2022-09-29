import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import container from '../../inversify.config';
import AuthorizationError from '../application/authorization-error';
import UseCase from '../application/use-case';
import ValidationError from '../application/validation-error';
import InternalError from '../internal-error';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const generalHandler =
    <TRequest, TResponse>(getRequest: (event: APIGatewayProxyEvent) => TRequest, useCaseType: symbol) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        try {
            const headers = event.headers;

            const bearerToken = headers ? headers['Authorization'] : undefined;

            const clientToken = bearerToken ? bearerToken.replace('Bearer ', '') : undefined;

            const requestDto = getRequest(event);

            const useCase = container.get<UseCase<TRequest, TResponse>>(useCaseType);

            const responseDto = await useCase.execute(requestDto, clientToken);

            const response: APIGatewayProxyResult = {
                statusCode: 200,
                body: JSON.stringify(responseDto),
            };

            return response;
        } catch (error) {
            if (error instanceof ValidationError) {
                const response: APIGatewayProxyResult = {
                    statusCode: 400,
                    body: JSON.stringify({ message: error.message, errors: error.errors }),
                };

                return response;
            }

            if (error instanceof AuthorizationError) {
                const response: APIGatewayProxyResult = {
                    statusCode: 404,
                    body: JSON.stringify({ message: error.message }),
                };

                return response;
            }

            if (error instanceof InternalError) {
                const response: APIGatewayProxyResult = {
                    statusCode: 500,
                    body: JSON.stringify({ message: error.message }),
                };

                return response;
            }

            const response: APIGatewayProxyResult = {
                statusCode: 500,
                body: JSON.stringify({ error: 'An unexpected error happened. Please check again' }),
            };

            return response;
        }
    };
