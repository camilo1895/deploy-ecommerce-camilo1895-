export class CreateOrderDto {
  constructor(
    public userId: string,
    public products: [{ id: string }],
  ) {}
}
