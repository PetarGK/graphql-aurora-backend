import { CreateUserUseCase, CreateUserDTO } from "./useCase";
import { userRepo } from "../../repos";
import { cognitoService } from "../../../../shared/cognito/services";

 let useCase: CreateUserUseCase = new CreateUserUseCase(userRepo, cognitoService);

describe('Create User', () => {
  beforeEach(() => {

  })

  it ('All params are passed correctlly',async () => {
    const request = {
      firstName: 'Petar',
      lastName: 'Korudzhiev',
      email: 'petar.korudzhiev@gmail.com'
    } as CreateUserDTO

    const result = await useCase.execute(request)
    
    expect(result).not.toBeNull()
    expect(result.isSuccess()).toBeTruthy()

    const userResult = result.value.getValue().data

    expect(userResult.firstName === request.firstName).toBeTruthy()
  })
})