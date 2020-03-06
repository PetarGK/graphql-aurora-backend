import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Result } from "../../../core/logic/Result";
import { ValidationException } from "../../../core/logic/ValidationException";
const Joi = require('@hapi/joi');

export interface UserProps {
    firstName: string;
    lastName: string;
    email: string;
}

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

export class User extends AggregateRoot<UserProps> {
    private constructor (props: UserProps, id?: UniqueEntityID) {
        super(props, id);
    }    

    get email (): string {
        return this.props.email;
    }

    public static create (props: UserProps, id?: UniqueEntityID): User {
        const { error } = schema.validate(props)
        if (error) {
            throw new ValidationException(error)
        }

        const user = new User(props, id)

        return user;
    }
}