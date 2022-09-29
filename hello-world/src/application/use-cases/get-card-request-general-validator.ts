import { injectable } from 'inversify';
import GeneralValidator from '../../shared/application/general-validator';
import GetCardRequestDto from '../dto/get-card-request-dto';

@injectable()
class GetCardRequestGeneralValidator extends GeneralValidator<GetCardRequestDto> {
    constructor() {
        super();

        this.Length((request) => request.token, 16, 16, 'card_number');
    }
}

export default GetCardRequestGeneralValidator;
