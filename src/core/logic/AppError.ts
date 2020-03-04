
import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";

export namespace GenericAppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor (err: any) {
      super(false, [{
        errorMessage: `An unexpected error occurred.`,
        errorType: 'UnexpectedError'
      }])

      // TODO: Use log service instead direct call to console
      console.log(`[AppError]: An unexpected error occurred`);
      console.error(err);
    }

    public static create (err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }


  export class ValidationErrors extends Result<UseCaseError> {
    public constructor (error: any) {
      const errors = error.details.map((i: any) => { 
        return {
          errorMessage: i.message,
          errorType: i.type
      }})

      super(false, errors)
    }
  } 

}