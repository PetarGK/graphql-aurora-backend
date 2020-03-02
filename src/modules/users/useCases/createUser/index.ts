import { CreateUserUseCase } from "./useCase";
import { userService } from "../../services";

const useCase = new CreateUserUseCase(userService)

export {
    useCase
}