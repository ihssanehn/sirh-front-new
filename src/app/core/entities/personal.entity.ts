export interface Personal {
  id: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: any;
  registration_number?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  civility?: string;
  candidat_id?: any;
  status_id?: any;
  contrat_id?: any;
  manager_id?: any;
  entity_id?: any;
  siege_id?: any;
  entry_date?: Date;
  is_externe?: boolean;
  is_active?: boolean;
  creator_id?: any;
  end_date?: any;
  status?: any;
  contrat?: any;
  entity?: any;
  manager?: any;
  siege?: any;
  label: string;
}
