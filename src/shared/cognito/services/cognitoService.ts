import { CognitoUser } from "../entities/cognitoUser";

export interface ICognitoService {
    exists(email: string): Promise<boolean>
    create(user: CognitoUser): Promise<void>
}

export class CognitoService implements ICognitoService {

    async exists(email: string): Promise<boolean> {
        
        return Promise.resolve(false)
    }
    async create(user: CognitoUser): Promise<void> {
        
        return Promise.resolve()
    }
    
} 