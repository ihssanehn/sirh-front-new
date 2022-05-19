
  export interface Profil {
    id?: number;
    libelle?: string;
    code?: string;
    creator_id?: number;
  }

  export interface Connexion {
    id?: number;
    role_id?: any;
    profil_id?: number;
    profil_custom?: number;
    personnel_id?: number;
    creator_id?: number;
    is_firstConnexion?: number;
    login?: string;
    deleted_at?: any;
    created_at?: string;
    updated_at?: string;
    last_connexion?: string;
    is_blocked?: number;
    profil?: Profil;
  }

  export interface Manager {
    id?: number;
    civilite?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    date_naissance?: string;
    lieu_naissance?: string;
    nationalite?: string;
    num_securite_sociale?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    nom_urgence?: string;
    email_perso?: string;
    telephone_urgence?: string;
    lien_parente_urgence?: string;
    manager_id?: number;
    cp_id?: any;
    creator_id?: any;
    archive?: number;
    date_entree?: string;
    date_sortie?: any;
    profil_conges_id?: number;
    profil_conges_custom?: number;
    profil_conges_customs_id?: number;
    cout_revient?: any;
    cout_vente?: any;
    remember_token?: any;
    is_temps_partiel?: number;
    is_hors_siege?: number;
    categorie_id?: number;
    matricule?: string;
    validite_titre_sejour?: string;
    is_virtual?: number;
    validateur_absence_id?: any;
    nom_urgence_2?: string;
    telephone_urgence_2?: string;
    lien_parente_urgence_2?: string;
    is_fr?: number;
    titre_sejour_id?: any;
    date_fin_periode_essais?: string;
    has_done_periode_essais?: number;
    periode_essais_comment?: string;
    type_titre_sejour?: any;
    num_titre_sejour?: any;
    status_pe_id?: any;
    photo_profil_id?: any;
    duree_mission?: any;
    tel_perso?: string;
    situation_famille_id?: number;
    nombre_enfants?: number;
    fonction_id?: number;
    salaire_brut?: number;
    status_id?: number;
    compte_salarie?: string;
    avantage_nature?: any;
    has_tjm_fixed?: number;
    is_travailleur_handicape?: number;
    cp_cp_id?: number;
  }

  export interface Categorie {
    id?: number;
    libelle?: string;
    code?: string;
    ordre?: number;
    is_active?: number;
    only_admin?: number;
    color?: any;
    categorisable_type?: string;
    creator_id?: number;
    parent_id?: any;
  }

  export interface Manager2 {
    id?: number;
    civilite?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    date_naissance?: string;
    lieu_naissance?: string;
    nationalite?: string;
    num_securite_sociale?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    nom_urgence?: string;
    email_perso?: string;
    telephone_urgence?: string;
    lien_parente_urgence?: string;
    manager_id?: number;
    cp_id?: any;
    creator_id?: any;
    archive?: number;
    date_entree?: string;
    date_sortie?: any;
    profil_conges_id?: number;
    profil_conges_custom?: number;
    profil_conges_customs_id?: number;
    cout_revient?: any;
    cout_vente?: any;
    remember_token?: any;
    is_temps_partiel?: number;
    is_hors_siege?: number;
    categorie_id?: number;
    matricule?: string;
    validite_titre_sejour?: string;
    is_virtual?: number;
    validateur_absence_id?: any;
    nom_urgence_2?: string;
    telephone_urgence_2?: string;
    lien_parente_urgence_2?: string;
    is_fr?: number;
    titre_sejour_id?: any;
    date_fin_periode_essais?: string;
    has_done_periode_essais?: number;
    periode_essais_comment?: string;
    type_titre_sejour?: any;
    num_titre_sejour?: any;
    status_pe_id?: any;
    photo_profil_id?: any;
    duree_mission?: any;
    tel_perso?: string;
    situation_famille_id?: number;
    nombre_enfants?: number;
    fonction_id?: number;
    salaire_brut?: number;
    status_id?: number;
    compte_salarie?: string;
    avantage_nature?: any;
    has_tjm_fixed?: number;
    is_travailleur_handicape?: number;
    cp_cp_id?: number;
  }

  export interface Cdp {
    id?: number;
    libelle?: string;
    parent_id?: number;
    parent_type?: string;
    manager_id?: number;
    pays_id?: number;
    initiales?: string;
    pays?: any;
    manager?: Manager2;
  }

  export interface Pivot {
    personnel_id?: number;
    habilitation_id?: number;
    date_acquisition?: string;
    date_fin_validite?: string;
    formation_id?: number;
    created_at?: string;
    updated_at?: string;
  }

  export interface Habilitation {
    id?: number;
    libelle?: string;
    code?: string;
    type_id?: number;
    creator_id?: number;
    duree_validite?: any;
    pivot?: Pivot;
  }

  export interface SituationFamille {
    id?: number;
    libelle?: string;
    code?: string;
    ordre?: number;
    is_active?: number;
    only_admin?: number;
    type_type?: string;
    color?: any;
    creator_id?: number;
  }

  export interface Fonction {
    id?: number;
    libelle?: string;
    code?: any;
    ordre?: number;
    is_active?: number;
    only_admin?: number;
    type_type?: string;
    color?: any;
    creator_id?: number;
  }

  export interface Status {
    id?: number;
    libelle?: string;
    code?: string;
    color?: string;
    ordre?: number;
    statuable_type?: string;
    creator_id?: any;
    is_active?: number;
    only_admin?: number;
  }

  export interface User {
    id?: number;
    civilite?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    date_naissance?: string;
    lieu_naissance?: string;
    nationalite?: string;
    num_securite_sociale?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    nom_urgence?: string;
    email_perso?: string;
    telephone_urgence?: string;
    lien_parente_urgence?: string;
    manager_id?: number;
    cp_id?: any;
    creator_id?: any;
    archive?: number;
    date_entree?: string;
    date_sortie?: any;
    profil_conges_id?: number;
    profil_conges_custom?: number;
    profil_conges_customs_id?: number;
    cout_revient?: any;
    cout_vente?: any;
    remember_token?: any;
    is_temps_partiel?: number;
    is_hors_siege?: number;
    categorie_id?: number;
    matricule?: string;
    validite_titre_sejour?: string;
    is_virtual?: number;
    validateur_absence_id?: any;
    nom_urgence_2?: string;
    telephone_urgence_2?: string;
    lien_parente_urgence_2?: string;
    is_fr?: number;
    titre_sejour_id?: any;
    date_fin_periode_essais?: string;
    has_done_periode_essais?: number;
    periode_essais_comment?: string;
    type_titre_sejour?: any;
    num_titre_sejour?: any;
    status_pe_id?: any;
    photo_profil_id?: any;
    duree_mission?: any;
    tel_perso?: string;
    situation_famille_id?: number;
    nombre_enfants?: number;
    fonction_id?: number;
    salaire_brut?: number;
    status_id?: number;
    compte_salarie?: string;
    avantage_nature?: any;
    has_tjm_fixed?: number;
    is_travailleur_handicape?: number;
    cp_cp_id?: number;
  }

  export interface Cdp2 {
    id?: number;
    libelle?: string;
    parent_id?: number;
    parent_type?: string;
    manager_id?: number;
    pays_id?: number;
    initiales?: string;
    pays?: any;
    manager?: User;
  }

  export interface CdpPivot {
    id?: number;
    personnel_id?: number;
    cp_id?: number;
    date_entree?: string;
    date_sortie?: any;
    creator_id?: number;
    deleted_at?: any;
    created_at?: string;
    updated_at?: string;
    cdp?: Cdp2;
  }

  export interface RootObject {
    id?: number;
    civilite?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    date_naissance?: string;
    lieu_naissance?: string;
    nationalite?: string;
    num_securite_sociale?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    nom_urgence?: string;
    email_perso?: string;
    telephone_urgence?: string;
    lien_parente_urgence?: string;
    manager_id?: number;
    cp_id?: any;
    creator_id?: any;
    archive?: number;
    date_entree?: string;
    date_sortie?: any;
    profil_conges_id?: number;
    profil_conges_custom?: number;
    profil_conges_customs_id?: number;
    cout_revient?: any;
    cout_vente?: any;
    remember_token?: any;
    is_temps_partiel?: number;
    is_hors_siege?: number;
    categorie_id?: number;
    matricule?: string;
    validite_titre_sejour?: string;
    is_virtual?: number;
    validateur_absence_id?: any;
    nom_urgence_2?: string;
    telephone_urgence_2?: string;
    lien_parente_urgence_2?: string;
    is_fr?: number;
    titre_sejour_id?: any;
    date_fin_periode_essais?: string;
    has_done_periode_essais?: number;
    periode_essais_comment?: string;
    type_titre_sejour?: any;
    num_titre_sejour?: any;
    status_pe_id?: any;
    photo_profil_id?: any;
    duree_mission?: any;
    tel_perso?: string;
    situation_famille_id?: number;
    nombre_enfants?: number;
    fonction_id?: number;
    salaire_brut?: number;
    status_id?: number;
    compte_salarie?: string;
    avantage_nature?: any;
    has_tjm_fixed?: number;
    is_travailleur_handicape?: number;
    coeff?: any;
    cp_cp_id?: number;
    salaire_actuel?: any;
    user?: Connexion;
    manager?: Manager;
    categorie?: Categorie;
    cdp?: Cdp;
    validateur_absence?: any;
    titre_sejour?: any;
    photo_profil?: any;
    habilitations?: Habilitation[];
    status_pe?: any;
    situation_famille?: SituationFamille;
    fonction?: Fonction;
    status?: Status;
    suivi_visites?: any[];
    cdp_pivot?: CdpPivot;
  }



