export class PaginadoDTO<D> {
    content: D[]
    totalElements: number
    totalPages: number
    size: number
    number: number
    numberOfElements: number
}