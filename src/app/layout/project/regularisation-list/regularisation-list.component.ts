import { Component, OnInit } from '@angular/core';
import {ListsService} from "@services/lists.service";
import * as _moment from 'moment';
import frLocale from 'date-fns/locale/fr';

import {Subscription} from "rxjs";
import {ActivitiesService} from "@services/activities.service";
import {Activity} from "@app/core/entities";
import {MainStore} from "@store/mainStore.store";
import {appAnimations} from "@shared/Objects/sharedObjects";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-regularisation-list',
  templateUrl: './regularisation-list.component.html',
  styleUrls: ['./regularisation-list.component.scss'],
  animations: appAnimations
})
export class RegularisationListComponent implements OnInit {
  showFilters = false;
  dateValue;
  config = {
    format: 'MM/YYYY',
    locale: frLocale,
  }
  memberShips = [];
  profit_centers = [];
  tri_cost = [];
  business_units = [];
  avance_status = [];
  adv_managers = [];
  direction_ops = [];
  clients = [];
  // pagination: any = {
  //   page: 1,
  //   total: 10,
  //   limit: 10
  // };

  list_regularisation = [
    {
      id: 1,
      date: '01/01/2021',
      type: 'Avance',
      original_details: 'Avance sur frais',
      destination_details: {
        type: 'Clientèle',
        client_name: 'RUFFIN Stephane',
        personal_name: 'ENGIE',
        quantity: 'Quantité : 1,00',
        tarif: '990,00 EUR',
        total: '990,00 EUR',
        label1: 'ENGIE - DELORME A (PIM-00001978)',
        label2: 'ENGIE - DELORME A (PIM-00001978)',
      },
      comment: {
        primary: 'Saisie par V.BUTILLON Le 03/08/2022 13:26:04',
        secondary: 'Facturation 1 journée en plus'
      }
    },
    {
      id: 1,
      date: '01/01/2021',
      type: 'Avance',
      original_details: 'Avance sur frais',
      destination_details: {
        type: 'Clientèle',
        client_name: 'RUFFIN Stephane',
        personal_name: 'ENGIE',
        quantity: 'Quantité : 1,00',
        tarif: '990,00 EUR',
        total: '990,00 EUR',
        label1: 'ENGIE - DELORME A (PIM-00001978)',
        label2: 'ENGIE - DELORME A (PIM-00001978)',
      },
      comment: {
        primary: 'Saisie par V.BUTILLON Le 03/08/2022 13:26:04',
        secondary: 'Facturation 1 journée en plus'
      }
    },
    {
      id: 1,
      date: '01/01/2021',
      type: 'Avance',
      original_details: 'Avance sur frais',
      destination_details: {
        type: 'Clientèle',
        client_name: 'RUFFIN Stephane',
        personal_name: 'ENGIE',
        quantity: 'Quantité : 1,00',
        tarif: '990,00 EUR',
        total: '990,00 EUR',
        label1: 'ENGIE - DELORME A (PIM-00001978)',
        label2: 'ENGIE - DELORME A (PIM-00001978)',
      },
      comment: {
        primary: 'Saisie par V.BUTILLON Le 03/08/2022 13:26:04',
        secondary: 'Facturation 1 journée en plus'
      }
    },
    {
      id: 1,
      date: '01/01/2021',
      type: 'Avance',
      original_details: 'Avance sur frais',
      destination_details: {
        type: 'Clientèle',
        client_name: 'RUFFIN Stephane',
        personal_name: 'ENGIE',
        quantity: 'Quantité : 1,00',
        tarif: '990,00 EUR',
        total: '990,00 EUR',
        label1: 'ENGIE - DELORME A (PIM-00001978)',
        label2: 'ENGIE - DELORME A (PIM-00001978)',
      },
      comment: {
        primary: 'Saisie par V.BUTILLON Le 03/08/2022 13:26:04',
        secondary: 'Facturation 1 journée en plus'
      }
    },
    {
      id: 1,
      date: '01/01/2021',
      type: 'Avance',
      original_details: 'Avance sur frais',
      destination_details: {
        type: 'Clientèle',
        client_name: 'RUFFIN Stephane',
        personal_name: 'ENGIE',
        quantity: 'Quantité : 1,00',
        tarif: '990,00 EUR',
        total: '990,00 EUR',
        label1: 'ENGIE - DELORME A (PIM-00001978)',
        label2: 'ENGIE - DELORME A (PIM-00001978)',
      },
      comment: {
        primary: 'Saisie par V.BUTILLON Le 03/08/2022 13:26:04',
        secondary: 'Facturation 1 journée en plus'
      }
    },
    {
      id: 1,
      date: '01/01/2021',
      type: 'Avance',
      original_details: 'Avance sur frais',
      destination_details: {
        type: 'Clientèle',
        client_name: 'RUFFIN Stephane',
        personal_name: 'ENGIE',
        quantity: 'Quantité : 1,00',
        tarif: '990,00 EUR',
        total: '990,00 EUR',
        label1: 'ENGIE - DELORME A (PIM-00001978)',
        label2: 'ENGIE - DELORME A (PIM-00001978)',
      },
      comment: {
        primary: 'Saisie par V.BUTILLON Le 03/08/2022 13:26:04',
        secondary: 'Facturation 1 journée en plus'
      }
    }
  ]
  exportPrint = {
    activity_record: null,
    expense_sheet: null,
  }
  filter = {
    startDate: null,
    endDate: null,
    type_date: null,
    clients: [],
    projects: [],
    personals: [],
    adv_managers: [],
    regularisation_types: [],
  }

  personnalFilters;
  loadingData = false;
  activities: Array<Activity> = [];
  searchSubscription: Subscription;

  submittingPrint = false;
  submittingExport = false;
  submittingDetailedExport = false;
  stats: any;
  loadingSelect = {};
  id_entite;
  triCosts = [];
  personals = [];
  projects = [
    {
      id: 1,
      name: "Project 1",
      start_date: "2020-12-31T23:00:00.000Z",
      end_date: "2022-12-30T23:00:00.000Z",
      client_id: 1,
      client_name: "Client 1",
      missions: [],
      created_at: "2022-10-17T10:00:56.000Z",
      updated_at: "2022-10-17T10:00:56.000Z"
    },
    {
      id: 2,
      name: "Project 2",
      start_date: "2021-12-31T23:00:00.000Z",
      end_date: "2023-12-30T23:00:00.000Z",
      client_id: 1,
      client_name: "Client 1",
      missions: [],
      created_at: "2022-10-17T10:00:56.000Z",
      updated_at: "2022-10-17T10:00:56.000Z"
    },
    {
      id: 5,
      name: "Mission Title 1",
      start_date: "2021-12-31T23:00:00.000Z",
      end_date: "2022-12-30T23:00:00.000Z",
      client_id: 1,
      client_name: "Client 1",
      missions: [
        {
          id: 1,
          project_id: 5,
          personal_id: 1,
          mission_title: "Mission Title 1",
          short_mission_title: "MG1-Mission Title 1",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2022-12-30T23:00:00.000Z",
          end_estimated_date: "2022-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 1,
          cp_id: 1,
          is_active: 1,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 365,
          left_number_of_days: 365,
          client_id: 1,
          in_out_office: 1,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 4,
          city_id: 1,
          postal_code: "23244",
          address: "address 1",
          mission_description: "Description 1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: null,
          is_pj_visible: 1,
          created_at: "2022-10-27T08:11:06.000Z",
          updated_at: "2022-10-27T08:11:06.000Z",
          deleted_at: null
        }
      ],
      created_at: null,
      updated_at: null
    },
    {
      id: 6,
      name: "Mission Title 1",
      start_date: "2021-12-31T23:00:00.000Z",
      end_date: "2024-12-30T23:00:00.000Z",
      client_id: 1,
      client_name: "Client 1",
      missions: [
        {
          id: 2,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 1",
          short_mission_title: "MG1-Mission Title 1",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2022-12-30T23:00:00.000Z",
          end_estimated_date: "2022-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 1,
          cp_id: 1,
          is_active: 1,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 365,
          left_number_of_days: 365,
          client_id: 1,
          in_out_office: 1,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 4,
          city_id: 1,
          postal_code: "23244",
          address: "address 1",
          mission_description: "Description 1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: null,
          is_pj_visible: 1,
          created_at: "2022-10-27T08:13:01.000Z",
          updated_at: "2022-10-27T08:13:01.000Z",
          deleted_at: null
        },
        {
          id: 3,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 1",
          short_mission_title: "MG2-Mission Title 1",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2022-12-30T23:00:00.000Z",
          end_estimated_date: "2022-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 1,
          cp_id: 1,
          is_active: 1,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 365,
          left_number_of_days: 365,
          client_id: 1,
          in_out_office: 0,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 4,
          city_id: 1,
          postal_code: "23244",
          address: "address 1",
          mission_description: "Description 1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: null,
          is_pj_visible: 1,
          created_at: "2022-10-27T08:16:00.000Z",
          updated_at: "2022-10-27T08:16:00.000Z",
          deleted_at: null
        },
        {
          id: 4,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 1",
          short_mission_title: "MG2-Mission Title 1",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2022-12-30T23:00:00.000Z",
          end_estimated_date: "2022-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 1,
          cp_id: 1,
          is_active: 1,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 365,
          left_number_of_days: 365,
          client_id: 1,
          in_out_office: 0,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 4,
          city_id: 1,
          postal_code: "23244",
          address: "address 1",
          mission_description: "Description 1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: null,
          is_pj_visible: 1,
          created_at: "2022-10-27T09:28:15.000Z",
          updated_at: "2022-10-27T09:28:15.000Z",
          deleted_at: null
        },
        {
          id: 5,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 5 Modifi",
          short_mission_title: "MG2-Mission Title Changing ",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2024-12-30T23:00:00.000Z",
          end_estimated_date: "2024-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 2,
          cp_id: 1,
          is_active: 0,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 750,
          left_number_of_days: 800,
          client_id: 2,
          in_out_office: 0,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 5,
          city_id: 1,
          postal_code: "23244",
          address: "address1",
          mission_description: "Description1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: "piman_client_ae_td_inferior_400",
          is_pj_visible: 0,
          created_at: "2022-10-27T09:28:56.000Z",
          updated_at: "2022-10-28T13:24:49.000Z",
          deleted_at: null
        },
        {
          id: 6,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 6",
          short_mission_title: "MG42-Mission Title  ",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2024-12-30T23:00:00.000Z",
          end_estimated_date: "2024-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 2,
          cp_id: 1,
          is_active: 0,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 750,
          left_number_of_days: 800,
          client_id: 2,
          in_out_office: 0,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 5,
          city_id: 1,
          postal_code: "23244",
          address: "address1",
          mission_description: "Description1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: "piman_client_ae_td_inferior_400",
          is_pj_visible: 0,
          created_at: "2022-10-28T15:11:17.000Z",
          updated_at: "2022-10-28T15:11:17.000Z",
          deleted_at: null
        },
        {
          id: 7,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 6",
          short_mission_title: "MG42-Mission Title  ",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2024-12-30T23:00:00.000Z",
          end_estimated_date: "2024-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 2,
          cp_id: 1,
          is_active: 0,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 750,
          left_number_of_days: 800,
          client_id: 2,
          in_out_office: 0,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 5,
          city_id: 1,
          postal_code: "23244",
          address: "address1",
          mission_description: "Description1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: "piman_client_ae_td_inferior_400",
          is_pj_visible: 0,
          created_at: "2022-11-01T08:25:34.000Z",
          updated_at: "2022-11-01T08:25:34.000Z",
          deleted_at: null
        },
        {
          id: 8,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 6",
          short_mission_title: "MG42-Mission Title  ",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2024-12-30T23:00:00.000Z",
          end_estimated_date: "2024-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 2,
          cp_id: 1,
          is_active: 0,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 750,
          left_number_of_days: 800,
          client_id: 2,
          in_out_office: 0,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 5,
          city_id: 1,
          postal_code: "23244",
          address: "address1",
          mission_description: "Description1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: "piman_client_ae_td_inferior_400",
          is_pj_visible: 0,
          created_at: "2022-11-01T08:26:02.000Z",
          updated_at: "2022-11-01T08:26:02.000Z",
          deleted_at: null
        },
        {
          id: 9,
          project_id: 6,
          personal_id: 1,
          mission_title: "Mission Title 6",
          short_mission_title: "MG42-Mission Title  ",
          start_date: "2021-12-31T23:00:00.000Z",
          end_date: "2024-12-30T23:00:00.000Z",
          end_estimated_date: "2024-12-30T23:00:00.000Z",
          tariff: 10.23,
          devise_id: 2,
          cp_id: 1,
          is_active: 0,
          is_validated_by_manager: 0,
          is_validated_by_consultant: 0,
          has_mail_to_manager: 1,
          initial_number_of_days: 750,
          left_number_of_days: 800,
          client_id: 2,
          in_out_office: 0,
          client_email: "m.daoud@gmail.com",
          technical_contact: "093933903",
          purchasing_contact: "3930040+334",
          proposal_reference: "Ref-fsdde",
          country_id: 1,
          calendar_id: 5,
          city_id: 1,
          postal_code: "23244",
          address: "address1",
          mission_description: "Description1",
          pointing_type_id: 23,
          pointing_unity_id: 7,
          pointing_tariff: 12.3,
          information_for_consultant: "dsdsd",
          cost_remarks: "ddsdssd",
          distance_home_customer_site: 23,
          has_exclusion_tr: 1,
          has_cost_ok: 1,
          is_getting_started: 0,
          has_formation: 0,
          is_mission_not_valued: 0,
          is_mission_not_billable: 0,
          is_mission_inter_contract: 0,
          is_remote_mission: 0,
          mission_specific_code: "Code-1223",
          risk_level: "piman_client_ae_td_inferior_400",
          is_pj_visible: 0,
          created_at: "2022-11-01T08:29:46.000Z",
          updated_at: "2022-11-01T08:32:37.000Z",
          deleted_at: null
        }
      ],
      created_at: null,
      updated_at: null
    },
    {
      id: 3,
      name: "Project 3",
      start_date: "2022-10-31T23:00:00.000Z",
      end_date: "2022-11-19T23:00:00.000Z",
      client_id: 2,
      client_name: "Client 2",
      missions: [],
      created_at: "2022-10-17T10:00:56.000Z",
      updated_at: "2022-10-17T10:00:56.000Z"
    },
    {
      id: 4,
      name: "Mission Title 1",
      start_date: "2021-12-31T23:00:00.000Z",
      end_date: "2022-12-30T23:00:00.000Z",
      client_id: 2,
      client_name: "Client 2",
      missions: [],
      created_at: null,
      updated_at: null
    }
  ];
  filterProjects = [];
  expandedFilters = true;
  type_facturations = [];
  departments = [];
  constructor(public listService: ListsService,
              private activitiesService: ActivitiesService,
              private mainStore: MainStore,
              ) { }

  ngOnInit(): void {
    this.id_entite = this.mainStore.selectedEntities?.length === 1 ? this.mainStore.selectedEntities[0].id: null;
    this.getActivities();
    this.getStatsActivity();
  }

  resetFilters() {
    this.filter = {
      startDate: null,
      endDate: null,
      type_date: null,
      clients: [],
      projects: [],
      personals: [],
      adv_managers: [],
      regularisation_types: [],
    }
  }

  async getFilterList(items, list_name, list_param?){
    if(items === 'personals'){
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getPersonalsByCpId({entity_id: this.id_entite}).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }else if(items === 'clients') {
      try{
        this.loadingSelect['clients'] = true;
        // {entity_id: this.id_entite}
        this[items] = await this.listService.getClients().toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect['clients'] = false;
      }
    }else{
      try{
        this.loadingSelect[list_name] = true;
        this[items] = await this.listService.getAll(list_name, list_param).toPromise();
      } catch (e) {
        console.log('error filter', e);
      } finally {
        this.loadingSelect[list_name] = false;
      }
    }
  }


  filterChanged() {
    this.getActivities();
    this.getStatsActivity();
  }



  getActivities(){
    if(this.searchSubscription){ this.searchSubscription.unsubscribe(); }
    const params = {
      // type: this.type
    }
    if(this.showFilters){
      Object.keys(this.filter).forEach(key => {
        if(['has_internal_billing_admin', 'with_inactive_cp'].includes(key) ){ // checkboxes
          if(this.filter[key]){
            params[key] = this.filter[key];
          }
        }else{
          if(this.filter[key] !== null  && this.filter[key] !== []){
            params[key] = this.filter[key];
          }
        }
      })
    }
    this.loadingData = true;
    this.searchSubscription = this.activitiesService.getAll(params).subscribe((res) => {
      this.activities = res.data;
      console.log('this.activities', this.activities);
      // this.pagination = { ...this.pagination, total: result?.data?.total };
    }, err =>{
      console.log('err getActivities', err);
    }, ()=>{
      this.loadingData = false;
    })
  }

  async getStatsActivity(){
    try {
      const personals = [1, 2, 3, 4] //TODO
      const res = await this.activitiesService.getStatsActivity(personals).toPromise();
      this.stats = res.data;
    } catch (e){
      console.log('error getStatsActivity', e)
    } finally {

    }
  }

  ischecked(id) {

  }

  returnfalse(){
    return false;
  }

  clearDateInput(date: any) {
    date.patchValue(null);
  }

  getMonth(activity){
    return moment(activity.month).format('YYYY-MM-DD');
  }

  print(){

  }

  export(){

  }

  detailedExport(){

  }
}
