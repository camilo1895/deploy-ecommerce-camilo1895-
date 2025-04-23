export class ProductDto {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public imgUrl?: string,
  ) {}
}
