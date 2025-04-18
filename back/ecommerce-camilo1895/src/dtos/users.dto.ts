export class UserDto {
  constructor(
    public email: string,
    public name: string,
    public password: string,
    public address: string,
    public phone: string,
    public country?: string | undefined,
    public city?: string | undefined,
  ) {}
}
