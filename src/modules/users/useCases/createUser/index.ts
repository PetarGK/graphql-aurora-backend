import { CreateUserUseCase } from "./useCase";
import { userService } from "../../services";

const createUserUseCase = new CreateUserUseCase(userService)

export {
    createUserUseCase
}