export class Peripheral {
  public id?: number;
  public name?: string;
  public type?: string;
  public description?: string;
  public status?: string;
  public id_reporteduser?: string;
  public user?: {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    disponible?: boolean;
    acceptedByAdmin?: boolean;
  };
}
