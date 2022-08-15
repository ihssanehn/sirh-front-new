import { Component, OnInit } from '@angular/core';
import {
  OwlDateTimeComponent,
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeFormats
} from 'ng-pick-datetime';
import {MomentDateTimeAdapter} from "ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class";
import {MY_MOMENT_DATE_TIME_FORMATS} from "@layout/activity/activity-list/activity-list.component";
import {FormControl} from "@angular/forms";

import * as _moment from "moment";
const moment = (_moment as any).default ? (_moment as any).default : _moment;




@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
  styleUrls: ['./activity-update.component.scss'],
  providers: [
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS},
  ],
})
export class ActivityUpdateComponent implements OnInit {

  public date = new FormControl(moment());


  data = {
      type_activity: [
        {
          id: 33,
          label: "Travail Normal",
          code: "travail_normal",
          order: 1,
          is_active: 1,
          only_admin: 1,
          model: "type_activity",
          color: "NULL",
          data: [],
          creator_id: 1,
          created_at: "2022-08-08T13:48:14.000Z",
          updated_at: "2022-08-08T13:48:14.000Z"
        },
        {
          id: 34,
          label: "Autres activités",
          code: "autres_activites",
          order: 2,
          is_active: 1,
          only_admin: 1,
          model: "type_activity",
          color: "NULL",
          data: [
            {
              id: 77,
              label: "Prosq/Qualif/Visite Médicale",
              code: "Prosq/Qualif/Visite Médicale"
            },
            {
              id: 78,
              label: "CE / DP / CHSCT",
              code: "CE / DP / CHSCT"
            },
            {
              id: 79,
              label: "Disponibilité",
              code: "Disponibilité"
            },
            {
              id: 80,
              label: "Présence agence",
              code: "Présence agence"
            }
          ],
          creator_id: 1,
          created_at: "2022-08-08T13:48:14.000Z",
          updated_at: "2022-08-08T13:48:14.000Z"
        },
        {
          id: 35,
          label: "Absences",
          code: "absences",
          order: 3,
          is_active: 1,
          only_admin: 1,
          model: "type_activity",
          color: "NULL",
          data: [
            {
              id: 81,
              label: "Congés payés",
              code: "congés_payés"
            }
          ],
          creator_id: 1,
          created_at: "2022-08-08T13:48:14.000Z",
          updated_at: "2022-08-08T13:48:14.000Z"
        }
      ],
      ratio: [
        {
          id: 82,
          label: "1/8",
          code: "1"
        },
        {
          id: 83,
          label: "2/8",
          code: "0.25"
        },
        {
          id: 84,
          label: "3/8",
          code: "0.375"
        },
        {
          id: 85,
          label: "4/8",
          code: "0.5"
        },
        {
          id: 86,
          label: "5/8",
          code: "0.625"
        },
        {
          id: 87,
          label: "6/8",
          code: "0.75"
        },
        {
          id: 88,
          label: "7/8",
          code: "0.875"
        },
        {
          id: 89,
          label: "8/8",
          code: "1"
        }
      ],
      calendar: [
        {
          date: "2022-08-01",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-02",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-03",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-04",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-05",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-06",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-07",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-08",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-09",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-10",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-11",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-12",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-13",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-14",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-15",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-16",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-17",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-18",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-19",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-20",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-21",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-22",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-23",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-24",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-25",
          is_weekend: 1,
          is_holidays: 0
        },
        {
          date: "2022-08-26",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-27",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-28",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-29",
          is_weekend: 0,
          is_holidays: 0
        },
        {
          date: "2022-08-30",
          is_weekend: 0,
          is_holidays: 0
        }
      ]
    };

  activities = {
        id: 17,
        personal_id: 1,
        month: "2022-07-31T23:00:00.000Z",
        status_id: 8,
        has_been_diffused: 1,
        comment: null,
        activity_details: [
          {
            id: 1,
            activity_id: 17,
            personal_id: 1,
            project_id: null,
            absence_id: null,
            mission_id: null,
            category_id: null,
            type_id: 33,
            date: "2022-07-31T23:00:00.000Z",
            ratio: 1,
            created_at: "2022-08-09T11:55:36.000Z",
            updated_at: "2022-08-09T11:55:36.000Z",
            deleted_at: null
          },
          {
            id: 2,
            activity_id: 17,
            personal_id: 1,
            project_id: null,
            absence_id: null,
            mission_id: null,
            category_id: null,
            type_id: 34,
            date: "2022-08-01T23:00:00.000Z",
            ratio: 0.375,
            created_at: "2022-08-09T11:55:36.000Z",
            updated_at: "2022-08-09T11:55:36.000Z",
            deleted_at: null
          },
          {
            id: 3,
            activity_id: 17,
            personal_id: 1,
            project_id: null,
            absence_id: null,
            mission_id: null,
            category_id: null,
            type_id: 34,
            date: "2022-08-01T23:00:00.000Z",
            ratio: 0.625,
            created_at: "2022-08-09T11:55:36.000Z",
            updated_at: "2022-08-09T11:55:36.000Z",
            deleted_at: null
          }
        ]
      }

  constructor() { }

  ngOnInit(): void {
  }

  chosenYearHandler( normalizedYear ) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth, datepicker) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  clearDateInput(date: any) {
    date.patchValue(null);
  }

  getRightLabels(){
    const labels = [];
    this.data.type_activity.forEach((activity: any) => {
      activity.bg_color = activity.data?.length>0 ? '#F7F7F7': '#EDEDED'
      labels.push(activity);
      if(activity.data?.length>0){
        activity.data.forEach(subactivity => {
          subactivity.bg_color = null;
          labels.push(subactivity);
        })
      }
    });
    return labels;
  }

  getDataInCell(day, code) {
    if(day.is_weekend){
      return moment(day.date).local('fr').format('dd')[0];
    }

    const element = this.activities.activity_details.find(activity => {
      //travail_normal
      //autres_activites
      //absences                                                  absence_id: null,
      //Prosq/Qualif/Visite Médicale  type_id: 33,                    category_id: null,
      //CE / DP / CHSCT  type_id: 33,                   category_id: null, type_id: 33,
      //Présence agence  type_id: 33,                     category_id: null, type_id: 33,
      //Disponibilité   type_id: 33,                     category_id: null, type_id: 33,


      // absence_id: null,
      //   activity_id: 17,
      //
      //
      //   type_id: 33,

      return moment(day.date).isSame(moment(activity.date), 'date');
    });
    if(element) {
      return this.data.ratio.find(ratio => element.ratio == Number(ratio.code))?.label || element.ratio;
    }
  }
}
