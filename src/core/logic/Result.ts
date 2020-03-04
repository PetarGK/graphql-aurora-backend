export interface ErrorType {
  errorMessage: string, 
  errorType: string
} 


export class Result<T> {
    public isSuccess: boolean;
    public isFailure: boolean
    public errors: ErrorType[] | undefined;
    private _value: T | undefined;
  
    public constructor (isSuccess: boolean, errors?: ErrorType[], value?: T) {
      if (isSuccess && errors) {
        throw new Error("InvalidOperation: A result cannot be successful and contain an error");
      }
      if (!isSuccess && !errors) {
        throw new Error("InvalidOperation: A failing result needs to contain an error message");
      }

      this.isSuccess = isSuccess;
      this.isFailure = !isSuccess;
      this.errors = errors;
      this._value = value;
      
      Object.freeze(this);
    }
  
    public getValue () : { data: T | undefined }  {
      if (!this.isSuccess) {
        console.log(this.errors,);
        throw new Error("Can't get the value of an error result. Use 'errorValue' instead.")
      } 
  
      return {
        data: this._value
      } 
    }
  
    public errorValue (): any {
      return {
        errors: this.errors
      } 
    }
  
    public static ok<U> (value?: U) : Result<U> {
      return new Result<U>(true, undefined, value);
    }
  
    public static fail<U> (error: any): Result<U> {
      return new Result<U>(false, error, undefined);
    }
  
    public static combine (results: Result<any>[]) : Result<any> {
      for (let result of results) {
        if (result.isFailure) return result;
      }
      return Result.ok();
    }
  }
  
  export type Either<L, A> = Fail<L, A> | Success<L, A>;
  
  export class Fail<L, A> {
    readonly value: L;
  
    constructor(value: L) {
      this.value = value;
    }
  
    isFail(): this is Fail<L, A> {
      return true;
    }
  
    isSuccess(): this is Success<L, A> {
      return false;
    }
  }
  
  export class Success<L, A> {
    readonly value: A;
  
    constructor(value: A) {
      this.value = value;
    }
  
    isFail(): this is Fail<L, A> {
      return false;
    }
  
    isSuccess(): this is Success<L, A> {
      return true;
    }
  }
  
  export const failure = <L, A>(l: L): Either<L, A> => {
    return new Fail(l);
  };
  
  export const success = <L, A>(a: A): Either<L, A> => {
    return new Success<L, A>(a);
  };