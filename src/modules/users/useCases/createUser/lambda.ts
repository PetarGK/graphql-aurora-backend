import { useCase } from "."

export async function handler(event: any): Promise<any> {
    const result = await useCase.execute(event.input)
    return result.isSuccess() ? result.value.getValue() : result.value.errorValue()
}