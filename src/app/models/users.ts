export class Users {
  public id?: number;
  public nom!: string;
  public prenom!: string;
  public email!: string;
  public password?: string;
  public role!: string;
  public isAvailable?: boolean;
  public isAccepted?: boolean;
  public message?: string;
}
