import { UseCase } from "../../../../core/domain/UseCase";
import { CreateUserDTO } from "./dto";
import { IUserService, SaveUserResult } from "../../services/userService";
import { User } from "../../entities/user";

export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<SaveUserResult>> {
    private readonly userService: IUserService

    constructor(userService: IUserService) {
        this.userService = userService
    }

    async execute(req: CreateUserDTO): Promise<SaveUserResult> {

        const user = {
            firstName: req.firstName,
            lastName: req.lastName,
            email: req.email
        } as User

        return await this.userService.save(user)
    }
}