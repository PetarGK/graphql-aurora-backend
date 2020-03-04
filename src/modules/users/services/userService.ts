import { User } from "../entities/user";
import { IUserRepo } from "../repos/userRepository";
import { Either, Result, success, failure } from "../../../core/logic/Result";
import { GenericAppError } from "../../../core/logic/AppError";
import { CreateUserErrors } from "../useCases/createUser/errors";
import { ICognitoService } from "../../../shared/cognito/services/cognitoService";
import { CognitoUser } from "../../../shared/cognito/entities/cognitoUser";
const Joi = require('@hapi/joi');

export interface IUserService {
    save(user: User): Promise<SaveUserResult>;
}

export type SaveUserResult = Either<
    GenericAppError.UnexpectedError |
    GenericAppError.ValidationErrors |
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

        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        })

        const { error } = schema.validate(user)
        if (error) {
            return failure(new GenericAppError.ValidationErrors(error)) as SaveUserResult
        }

        const userAlreadyExists = await this.userRepo.exists(user.email)
        if (userAlreadyExists) {
            return failure(new CreateUserErrors.AccountAlreadyExists(user.email)) as SaveUserResult;
        }

        try {
            const dbUser = await this.userRepo.save(user)

            await this.cognitoService.create({
                email: user.email
            } as CognitoUser)

            return success(Result.ok<User>(dbUser)) as SaveUserResult
        }
        catch(err) {
            return failure(new GenericAppError.UnexpectedError(err)) as SaveUserResult
        }
    }
}