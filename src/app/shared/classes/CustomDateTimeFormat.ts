// custom-date-time-adapter.class.ts
import { Injectable } from '@angular/core';
import {OwlDateTimeIntl} from 'ng-pick-datetime';

export const MY_CUSTOM_DATETIME_FORMATS = {
  parseInput: 'DD-MM-YYYY HH:mm',
  fullPickerInput: 'DD-MM-YYYY HH:mm:ss',
  supportedFormats: ['DD-MM-YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'],
  datePickerInput: 'DD-MM-YYYY',
  calendar: 'YYYY-MM-DD',
  backend_format: 'YYYY-MM-DD HH:mm:ss',
  backend_calendar_format: 'YYYY-MM-DD',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Injectable()
export class CustomDateTimeIntl extends OwlDateTimeIntl {
  /** A label for the up second button (used by screen readers).  */
  upSecondLabel = 'Ajouter une seconde';

  /** A label for the down second button (used by screen readers).  */
  downSecondLabel = 'Moins une seconde';

  /** A label for the up minute button (used by screen readers).  */
  upMinuteLabel = 'Ajouter une minute';

  /** A label for the down minute button (used by screen readers).  */
  downMinuteLabel = 'Moins une minute';

  /** A label for the up hour button (used by screen readers).  */
  upHourLabel = 'Ajouter une heure';

  /** A label for the down hour button (used by screen readers).  */
  downHourLabel = 'Moins une heure';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Le mois précédent';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Le mois prochain';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'L\'année précédente';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'l\'année prochaine';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = 'Previous 21 years';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Next 21 years';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Change to month view';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Choose month and year';

  /** A label for the cancel button */
  cancelBtnLabel = 'Annuler';

  /** A label for the set button */
  setBtnLabel = 'Confirmer';

  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'A partie de';

  /** A label for the range 'to' in picker info */
  rangeToLabel = 'Jusqu\'à';

  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'AM';

  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'PM';

}
