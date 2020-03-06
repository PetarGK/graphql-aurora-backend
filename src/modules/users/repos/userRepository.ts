import { User } from "../domain/user";

export interface IUserRepo {
    exists(email: string): Promise<boolean>;
    create(user: User): Promise<void>;
    update(user: User): Promise<void>;
}

export class UserRepo implements IUserRepo {
    public async exists(email: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    public async create(user: User): Promise<void> {

        return Promise.resolve() 
    }

    public async update(user: User): Promise<void> {

        return Promise.resolve() 
    }    
}