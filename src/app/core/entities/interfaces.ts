
  export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email_professional: string;
    email_personal: string;
    civility: string;
    birthday: Date;
    birth_place: string;
    nationality: string;
    address: string;
    code_postal: string;
    city: string;
    start_date: Date;
    end_date?: any;
    creator_id: number;
    manager_id: number;
    kids_number: number;
    number_security_social: number;
    number_carte_vitale?: any;
    urgency_name_1: string;
    urgency_telephone_1: string;
    family_link_1: string;
    urgency_name_2?: any;
    urgency_telephone_2?: any;
    family_link_2?: any;
    function_id: number;
    telephone_professional: string;
    telephone_personal: string;
    family_situation_id: number;
    registration_number: string;
    validator_absence_id?: any;
    status_id: number;
    cp_id: number;
    profile_id: number;
    is_head_office: number;
    is_part_time: number;
    first_annual_salary: string;
    benefits: string;
    created_at: Date;
    updated_at: Date;
  }


