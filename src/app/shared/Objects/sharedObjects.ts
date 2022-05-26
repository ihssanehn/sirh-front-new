import {trigger, style, animate, transition, stagger, query, keyframes, state} from '@angular/animations';
import {SidebarItem} from '@entities/sidebarItem';

export const AlertOptions = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: true,
    confirmText: 'Yes',
    declineText: 'No'
};


export const $primaryColor = '#1a59a7';
export const $darkPrimaryColor = '#144684';
export const $lightPrimaryColor = '#2684f9';
export const $secondaryColor = '#f4f5f7';
export const $lightSecondaryColor = '#36ccb0';
export const $tertiaryColor = '#5b105d';
export const $lightTertiaryColor = '#bf25c3';

export const $quaternaryColor = '#f9f9f9';
export const $quinaryColor = '#faa142';
export const $senaryColor = '#7be495';
export const $septenaryColor = '#5ccec9';
export const $octonaryColor = '#adbac3';
export const $nonaryColor = '#547ce2';
export const $denaryColor = '#f3533b';

export const $yellow = '#e3bc08';
export const $lightyellow = '#FDF1BA';



export const $dateFormat = 'DD-MM-YYYY';

export enum $screenSize {
    SMALL = 320,
    MEDIUM = 375,
    LARGE = 425,
    TABLET = 768,
    LAPTOP = 1024
}


export enum $userRoles {
    SUPERADMIN = 'superadmin',
    MANAGER = 'manager',
    USER = 'user'
}

export enum $userRolesIds {
    SUPERADMIN = 1,
    MANAGER = 2,
    USER = 3
}


export enum $userRolesLabels {
    SUPERADMIN = 'Super admin',
    MANAGER = 'Manager',
    USER = 'Simple utilisateur'
}


export const appAnimations = [
    trigger('fadeIt', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            animate('.7s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .5, transform: 'translateY(-50%)',  offset: 0.1}),
                style({opacity: .5, transform: 'translateY(-25%)',  offset: 0.2}),
                style({opacity: 1, transform: 'translateY(0%)',   offset: 1.0}),
            ]))
        ]),
        transition(':leave', [style({ opacity: 1})])
    ]),
    trigger('staggerTransition', [
        transition('* => *', [
            query(':enter', style({ opacity: 0 }), {optional: true}),
            query(':enter', stagger('300ms', [
                animate('.6s ease-in', keyframes([
                    style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                    style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
                    style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
                ]))]), {optional: true}),
            query(':leave', stagger('300ms', [
                animate('.6s ease-out', keyframes([
                    style({opacity: 1, transform: 'translateY(0)', offset: 0}),
                    style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
                    style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
                ]))]), {optional: true})
        ])
    ]),
    trigger('slideToTop', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            style({ transform: 'translateY(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
        ])
    ]),
    trigger('slideToRight', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            style({ transform: 'translateX(-100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
        ])
    ]),
    trigger('slideToLeft', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ]),
        transition(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
        ])
    ]),
    trigger('slideToBottom', [
        state('void', style({})),
        state('*', style({})),
        transition(':enter', [
            style({ transform: 'translateY(-100%)', opacity: 0 }),
            animate('0.5s ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0%)', opacity: 1}),
            animate('0.5s ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
        ])
    ]),
    trigger('formNavigation', [
        transition('* => toTop', [
            animate(300, keyframes([
                style({transform: 'translateY(100%)', opacity: 0}),
                style({transform: 'translateY(50%)', opacity: .5}),
                style({transform: 'translateY(0)', opacity: 1})
            ]))
        ]),
        transition('* => toBottom', [
            animate(300, keyframes([
                style({transform: 'translateY(-100%)', opacity: 0}),
                style({transform: 'translateY(-50%)', opacity: .5}),
                style({transform: 'translateY(0)', opacity: 1})
            ]))
        ]),
        transition('* => toRight', [
            animate(300, keyframes([
                style({transform: 'translateX(-100%)', opacity: 0}),
                style({transform: 'translateX(-50%)', opacity: .5}),
                style({transform: 'translateX(0)', opacity: 1})
            ]))
        ]),
        transition('* => toLeft', [
            animate(300, keyframes([
                style({transform: 'translateX(100%)', opacity: 0}),
                style({transform: 'translateX(50%)', opacity: .5}),
                style({transform: 'translateX(0)', opacity: 1})
            ]))
        ])
    ])
];

export const $sidebarItems_users: Array<SidebarItem> = [
    {
      id: 1,
      name: 'Informaion',
      type: 'link',
      icon: 'icon-user-info',
      link: '/users/info',
      // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
      opened: false,
    },
    {
      id: 2,
      name: 'Documents',
      type: 'link',
      icon: 'icon-document',
      link: '/users/dpcuments',
      // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
      opened: false,
    },
    {
      id: 3,
      name: 'Carrière',
      type: 'link',
      icon: 'icon-carreer',
      link: '/users/carriere',
      // onlyFor: [$userRoles.SUPERADMIN],
      opened: false,
    }
];
