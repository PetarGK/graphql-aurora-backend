import { CreateUserUseCase } from "./useCase";
import { userRepo } from "../../repos";
import { cognitoService } from "../../../../shared/cognito/services";

const useCase = new CreateUserUseCase(userRepo, cognitoService)

export {
    useCase
}