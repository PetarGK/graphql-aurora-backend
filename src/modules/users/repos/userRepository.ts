import { User } from "../entities/user";

export interface IUserRepo {
    exists(email: string): Promise<boolean>;
    save(user: User): Promise<User>;
}

export class UserRepo implements IUserRepo {
    public async exists(email: string): Promise<boolean> {
        return false;
    }

    public async save(user: User): Promise<User> {

        return user
    }
}