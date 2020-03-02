import { UserService } from "./userService";
import { userRepo } from "../repos";
import { cognitoService } from "../../../shared/cognito/services";

const userService = new UserService(userRepo, cognitoService)

export {
    userService
}