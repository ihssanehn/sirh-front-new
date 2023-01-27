
export interface User {
  full_name?: string;
  type_account?: string;
  comment_service_provider?: any;
  vat_rate?: any;
  has_costs_billable_service_provider?: any;
  is_subject_to_vats?: any;
  tjm_service_provider?: any;
  banks: Array<any>;
    tjm_client?: any;
    parameter: any;
    nationality_id?: number;
    permissions?: Array<any>;
    perimeters?: Array<any>;
    id?: number;
    first_name?: string;
    last_name?: string;
    email_professional?: string;
    email_personal?: string;
    email?: string;
    civility?: string;
    birthday?: Date;
    birth_place?: string;
    nationality?: string;
    address?: string;
    code_postal?: string;
    city?: string;
    start_date?: Date;
    end_date?: any;
    creator_id?: number;
    manager_id?: number;
    kids_number?: number;
    number_security_social?: number;
    number_carte_vitale?: any;
    urgency_name_1?: string;
    urgency_telephone_1?: string;
    family_link_1?: string;
    urgency_name_2?: any;
    urgency_telephone_2?: any;
    family_link_2?: any;
    function_id?: number;
    telephone_professional?: string;
    telephone_personal?: string;
    family_situation_id?: number;
    registration_number?: string;
    validator_absence_id?: any;
    status_id?: number;
    cp_id?: number;
    profile_id?: number;
    is_head_office?: any;
    is_part_time?: any;
    first_annual_salary?: string;
    benefits?: string;
    profile_name?: string;
    role_name?: string;
    cp_name?: string;
    photo_profile?: string;
    created_at?: Date;
    updated_at?: Date;
  last_connexion?: Date;

  }

export interface RHDocument {
  id?: number;
  personal_id?: number;
  title?: string;
  original_name?: string;
  system_name?: string;
  size?: number;
  extension?: string;
  path?: string;
  action_to_take?: string;
  has_treated_alert?: boolean;
  user_id?: number;
  document_type?: string;
  alert_time_limit?: any;
  valid_start_date?: any;
  valid_end_date?: any;
  created_at?: any;
  updated_at?: any;
  deleted_at?: any;
}

export interface Activity {
  id?: number;
  first_name?: string;
  last_name?: string;
  photo_profile?: string;
  personal_id?: number;
  is_personal_activity_diffuse?: boolean | number;
  is_personal_costs_diffuse?: boolean | number;
  is_admin_activity_valid?: boolean | number;
  is_admin_costs_valid?: boolean | number;
  month?: string;
  status_id?: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonalAnnex {
  registration_number?: string;
  label?:string;
  civility?:string;
  nom?: string;
  prenom?: any;
  created_at?: Date;
  updated_at?: Date;
  entry_date?:Date;
  id?: number;
  contrat?:object;
  status?:object;
  entity?:object;
  siege?:object;
  manager?:object;
  is_externe?:boolean;
  }
