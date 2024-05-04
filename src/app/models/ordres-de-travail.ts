export class OrdresDeTravail {
  public id?: number;
  public titre!: string;
  public description!: string;
  public urgent!: boolean;
  public statut?: string;
  public utilisateur_id?: string;
  public equipement_id?: string;
  public message?: string;
}
