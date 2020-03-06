import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace CreateUserErrors {
    export class AccountAlreadyExists extends Result<UseCaseError> {
        constructor(email: string) {
            super(false, [{
                errorMessage: `The email ${email} associated for this account already exists`,
                errorType: 'AccountAlreadyExists'
            }])
        }
    }   
}