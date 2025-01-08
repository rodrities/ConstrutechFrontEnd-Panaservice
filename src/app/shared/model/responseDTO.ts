export class ResponseDTO<D> {
    error: string;
    codigo: number;
    mensaje: string;
    data: D
}