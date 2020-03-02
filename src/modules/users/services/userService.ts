import { User } from "../entities/user";
import { IUserRepo } from "../repos/userRepository";
import { Either, Result, success } from "../../../core/logic/Result";
import { GenericAppError } from "../../../core/logic/AppError";
import { CreateUserErrors } from "../useCases/createUser/errors";
import { ICognitoService } from "../../../shared/cognito/services/cognitoService";
import { CognitoUser } from "../../../shared/cognito/entities/cognitoUser";

export interface IUserService {
    save(user: User): Promise<SaveUserResult>;
}

export type SaveUserResult = Either<
    GenericAppError.UnexpectedError |
    CreateUserErrors.AccountAlreadyExists,
    Result<User>
>

export class UserService implements IUserService {
    private readonly userRepo: IUserRepo
    private readonly cognitoService: ICognitoService

    constructor(userRepo: IUserRepo, cognitoService: ICognitoService) {
        this.userRepo = userRepo
        this.cognitoService = cognitoService
    }

    public async save(user: User): Promise<SaveUserResult> {
        // validate attributes

        const userAlreadyExists = await this.userRepo.exists(user.email)
        if (userAlreadyExists) {
            return fail(new CreateUserErrors.AccountAlreadyExists(user.email)) as SaveUserResult;
        }

        try {
            const dbUser = await this.userRepo.save(user)

            await this.cognitoService.create({
                email: user.email
            } as CognitoUser)
            
            return success(Result.ok<User>(dbUser)) as SaveUserResult
        }
        catch(err) {
            return fail(new GenericAppError.UnexpectedError(err)) as SaveUserResult
        }
    }
}