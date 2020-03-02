import { useCase } from "."

export async function handler(event: any): Promise<any> {
    const result = await useCase.execute(event.input)

    if (result.isFail()) {
        throw new Error(result.value.errorValue())
    }

    return result.value.getValue()
}