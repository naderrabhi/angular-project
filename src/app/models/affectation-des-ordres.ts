export class AffectationDesOrdres {
  public id?: number;
  public ordre_travail_id!: string;
  public technicien_id!: string;
  public date_resolution!: string;
  public date_confirmation!: string;
  public confirmer!: boolean;
  public reparer!: boolean;
  public message?: string;
}
