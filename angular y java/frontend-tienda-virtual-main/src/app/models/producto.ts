export class Producto {
  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public precio: number,
    public imagenes: string,
    public stock: number,
    public categoria: string, // Nombre de la categoría (devuelto por el backend)
    public categoria_id: string | null = null, // ID de la categoría para creación/actualización
    public creado_en?: string
  ) {}
}
