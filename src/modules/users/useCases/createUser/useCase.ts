import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, success, failure } from "../../../../core/logic/Result";
import { GenericAppError } from "../../../../core/logic/AppError";
import { CreateUserErrors } from "./errors";
import { IUserRepo } from "../../repos/userRepository";
import { User } from "../../domain/user";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { ICognitoService } from "../../../../shared/cognito/services/cognitoService";
import { ValidationException } from "../../../../core/logic/ValidationException";

interface CreateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type CreateUserResult = Either<
    GenericAppError.UnexpectedError |
    GenericAppError.ValidationErrors |
    CreateUserErrors.AccountAlreadyExists,
    Result<User>
>

export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<CreateUserResult>> {
    private readonly userRepo: IUserRepo
    private readonly cognitoService: ICognitoService

    constructor(userRepo: IUserRepo, cognitoService: ICognitoService) {
        this.userRepo = userRepo
        this.cognitoService = cognitoService
    }

    async execute(req: CreateUserDTO): Promise<CreateUserResult> {
        try {
            const user = User.create(req, new UniqueEntityID())

            const dbAlreadyExists = await this.userRepo.exists(user.email)
            const cognitoAlreadyExists = await this.cognitoService.exists(user.email)
    
            if (dbAlreadyExists || cognitoAlreadyExists) {
                return failure(new CreateUserErrors.AccountAlreadyExists(user.email));
            }        
    
            this.cognitoService.create(req)
            this.userRepo.create(user)
    
            return success(Result.ok<User>(user))
        }      
        catch(err) {
            if (err instanceof ValidationException) {
                return failure(new GenericAppError.ValidationErrors(err.errors))
            } 
            return failure(new GenericAppError.UnexpectedError(err))
        }
    }
}