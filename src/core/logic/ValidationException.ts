import { ErrorType } from "./Result"

export class ValidationException extends Error {
    public readonly errors: ErrorType[]

    public constructor (error: any) {
        super()
        this.errors = error.details.map((i: any) => { 
          return {
            errorMessage: i.message,
            errorType: i.type
        }})
      }    
}