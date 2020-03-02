import { CognitoUser } from "../entities/cognitoUser";

export interface ICognitoService {
    create(user: CognitoUser): Promise<void>
}

export class CognitoService implements ICognitoService {

    async create(user: CognitoUser): Promise<void> {
        
        return Promise.resolve()
    }
    
} 