export class ProductDto {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public stock: boolean,
    public imgUrl: string,
  ) {}
}
