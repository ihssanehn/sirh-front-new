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
  ADV = 'adv',
  USER = 'user',
  REPORTING = 'reporting',
  ACCOUNTING = 'accounting',
  GP = 'gp',
  BM = 'business_manager',
}

export enum $userProfiles {
  ASSISTANT = 'assistant',
  USER = 'user',
  BUSINESS_MANAGER = 'business_manager'
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
    trigger('c', [
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
            animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
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
    // {
    //   id: 1,
    //   name: 'Trombi',
    //   type: 'link',
    //   icon: null,
    //   link: 'users/trombi',
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    {
      id: 2,
      name: 'Liste',
      type: 'sub',
      icon: null,
      link: 'users/list',
      // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
      opened: false,
      subMenu: [
        {
          id: 2,
          name: 'Liste Général',
          type: 'link',
          icon: null,
          link: 'users/list/general',
          opened: false,
        },
        {
          id: 2,
          name: 'Entrée',
          type: 'link',
          icon: null,
          link: 'users/list/entree',
          opened: false,
        },
        {
          id: 2,
          name: 'Périodes d’essais',
          type: 'link',
          icon: null,
          link: 'users/list/period_essai',
          opened: false,
        },
        {
          id: 2,
          name: 'Entretiens',
          type: 'link',
          icon: null,
          link: 'users/list/entretien',
          opened: false,
        },
        {
          id: 3,
          name: 'Formations',
          type: 'link',
          icon: null,
          link: 'users/list/formation',
          opened: false,
        },
        {
          id: 4,
          name: 'Visites Médicales',
          type: 'link',
          icon: null,
          link: 'users/list/visite_medicale',
          opened: false,
        },
        {
          id: 2,
          name: 'Sortie',
          type: 'link',
          icon: null,
          link: 'users/list/sortie',
          opened: false,
        },
      ]
    },
    {
      id: 3,
      name: 'Création',
      type: 'sub',
      icon: null,
      link: 'users/new',
      // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
      opened: false,
      subMenu: [
        {
          id: 2,
          name: 'Création simple',
          type: 'link',
          icon: null,
          link: 'users/new/simple',
          opened: false,
        },
        {
          id: 2,
          name: 'Création indépendante',
          type: 'link',
          icon: null,
          link: 'users/new/independent',
          opened: false,
        },
        {
          id: 2,
          name: 'Création groupe',
          type: 'link',
          icon: null,
          link: 'users/new/group',
          opened: false,
        },
        {
          id: 2,
          name: 'Création avancée',
          type: 'link',
          icon: null,
          link: 'users/new/avance',
          opened: false,
        },
      ]
    },
    // {
    //   id: 4,
    //   name: 'Registre personnel',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 5,
    //   name: '',
    //   type: 'empty',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 6,
    //   name: 'Périodes d\'essais',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 7,
    //   name: 'Entretiens',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 8,
    //   name: 'Visites médicales',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 9,
    //   name: 'Formations',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 10,
    //   name: 'Habiliations',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 11,
    //   name: '',
    //   type: 'empty',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 12,
    //   name: 'Synthèse',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
    // {
    //   id: 13,
    //   name: 'Salaires',
    //   type: 'link',
    //   icon: null,
    //   link: null,
    //   // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    //   opened: false,
    // },
];

export const $sidebarItems_activity: Array<SidebarItem> = [
    {
      id: 1,
      name: 'Activité',
      type: 'sub',
      icon: null,
      link: 'activites',
      // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
      opened: false,
      subMenu: [
        {
          id: 1,
          name: 'Saisir mon activité',
          type: 'link',
          icon: null,
          link: 'activites/mes_activites',
          opened: false,
          onlyFor: [
            $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
          ],
        },
        {
          id: 2,
          name: 'Liste',
          type: 'link',
          icon: null,
          link: 'activites/list',
          opened: false,
          onlyFor: [
            $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
          ],
        },
        {
          id: 3,
          name: 'Historique',
          type: 'link',
          icon: null,
          link: 'activites/history',
          opened: false,
          onlyFor: [
            $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
          ],
        },
        {
          id: 4,
          name: 'Annulation diffusion',
          type: 'link',
          icon: null,
          link: 'activites/annulation_diffusion',
          opened: false,
          onlyFor: [
            $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP
          ],
        },
        {
          id: 5,
          name: 'Impression',
          type: 'link',
          icon: null,
          link: 'activites/impression',
          opened: false,
          onlyFor: [
            $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
          ],
        },
      ]
    },
    {
      id: 2,
      name: 'Frais',
      type: 'sub',
      icon: null,
      link: 'activites/frais',
      onlyFor: [
        $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
      ],
      opened: false,
      subMenu: [
        {
          id: 2,
          name: 'Liste',
          type: 'link',
          icon: null,
          link: 'activites/frais/list',
          opened: false,
        },
        {
          id: 3,
          name: 'Tickets Restaurant',
          type: 'link',
          icon: null,
          link: 'activites/frais/ticket_restaurant',
          opened: false,
        }
      ]
    },
    {
      id: 3,
      name: 'Absences',
      type: 'sub',
      icon: null,
      link: 'activites/absence',
      onlyFor: [
        $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
      ],
      opened: false,
      subMenu: [
        {
          id: 2,
          name: 'Création',
          type: 'link',
          icon: null,
          link: 'activites/absence/creation',
          opened: false,
        },
        {
          id: 3,
          name: 'Liste visualisation',
          type: 'link',
          icon: null,
          link: 'activites/absence/list_visualisation',
          opened: false,
        },
        // {
        //   id: 3,
        //   name: 'Liste validation',
        //   type: 'link',
        //   icon: null,
        //   link: 'activites/absence/List_validation',
        //   opened: false,
        // },
        {
          id: 3,
          name: 'Import soldes abs.',
          type: 'link',
          icon: null,
          link: 'activites/absence/import_soldes_abs',
          opened: false,
        },
        {
          id: 3,
          name: 'Admin. soldes abs.',
          type: 'link',
          icon: null,
          link: 'activites/absence/admin_soldes_abs',
          opened: false,
        },
        {
          id: 3,
          name: 'Import absences',
          type: 'link',
          icon: null,
          link: 'activites/absence/import_absences',
          opened: false,
        },
      ]
    },
    {
      id: 4,
      name: 'Clôture',
      type: 'sub',
      icon: null,
      link: 'activites/cloture',
      onlyFor: [
        $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP
      ],
      opened: false,
      subMenu: [
        {
          id: 2,
          name: 'Mois en cours',
          type: 'link',
          icon: null,
          link: 'activites/cloture/courant',
          opened: false,
        }
      ]
    },
    {
      id: 5,
      name: 'Délégation',
      type: 'sub',
      icon: null,
      link: 'activites/delegation',
      opened: false,
      subMenu: [
        {
          id: 2,
          name: 'Création',
          type: 'link',
          icon: null,
          link: 'activites/delegation/creation',
          opened: false,
        },
        {
          id: 2,
          name: 'List',
          type: 'link',
          icon: null,
          link: 'activites/delegation/list',
          opened: false,
        },
      ]
    },
    {
      id: 5,
      name: 'Avance de frais',
      type: 'sub',
      icon: null,
      link: 'activites/avance',
      onlyFor: [
        $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
      ],
      opened: false,
      subMenu: [
        {
          id: 3,
          name: 'Liste',
          type: 'link',
          icon: null,
          link: 'activites/avance/list',
          opened: false,
        },
        {
          id: 2,
          name: 'Création',
          type: 'link',
          icon: null,
          link: 'activites/avance/creation',
          opened: false,
        },
      ]
    },
    {
    id: 6,
    name: 'Mes congés',
    type: 'sub',
    icon: null,
    link: 'activites/conge',
    onlyFor: [
      $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
    ],
    opened: false,
    subMenu: [
      {
        id: 3,
        name: 'Historique',
        type: 'link',
        icon: null,
        link: 'activites/conge/history',
        opened: false,
      },
      {
        id: 2,
        name: 'Faire une demande',
        type: 'link',
        icon: null,
        link: 'activites/conge/demande',
        opened: false,
      },
    ]
  },
    {
    id: 7,
    name: 'Mes frais',
    type: 'sub',
    icon: null,
    link: 'activites/mes_frais',
    onlyFor: [
      $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
    ],
    opened: false,
    subMenu: [
      {
        id: 3,
        name: 'Historique',
        type: 'link',
        icon: null,
        link: 'activites/mes_frais/history',
        opened: false,
      },
      {
        id: 2,
        name: 'Saisie',
        type: 'link',
        icon: null,
        link: 'activites/mes_frais/saisie',
        opened: false,
      }
    ]
  },
];

export const $sidebarItems_project: Array<SidebarItem> = [
  {
    id: 1,
    name: 'Missions / Projets',
    type: 'sub',
    icon: null,
    link: 'projets',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    subMenu: [
      {
        id: 1,
        name: 'Création',
        type: 'link',
        icon: null,
        link: 'projets/creation',
        opened: false,
        onlyFor: [
          $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
        ],
      },
      {
        id: 2,
        name: 'Liste',
        type: 'link',
        icon: null,
        link: 'projets/liste',
        opened: false,
        onlyFor: [
          $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
        ],
      },
      {
        id: 3,
        name: 'Fins de mission',
        type: 'link',
        icon: null,
        link: 'projets/fin_mission',
        opened: false,
        onlyFor: [
          $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
        ],
      },
      {
        id: 4,
        name: 'Régularisation',
        type: 'link',
        icon: null,
        link: 'projets/regularisation',
        opened: false,
        onlyFor: [
          // $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP,
          $userRoles.USER, $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
        ],
      }
    ]
  },
  {
    id: 2,
    name: 'Ordres de mission',
    type: 'sub',
    icon: null,
    link: 'missions/ordre_mission',
    onlyFor: [
      $userRoles.ADV, $userRoles.REPORTING, $userRoles.ACCOUNTING, $userRoles.GP, $userRoles.BM
    ],
    opened: false,
    subMenu: [
      {
        id: 2,
        name: 'Liste',
        type: 'link',
        icon: null,
        link: 'missions/ordre_mission/list',
        opened: false,
      }
    ]
  }
];

export const $headerSectionsMetaData = {
  acceuil: {
    name: 'acceuil',
    multipleEntity: false,
    isFullScreen: true
  },
  client: {
    name: 'client',
    multipleEntity: false
  },
  projet: {
    name: 'projet',
    multipleEntity: false
  },
  activity: {
    name: 'activity',
    multipleEntity: true
  },
  conge: {
    name: 'conge',
    multipleEntity: false
  },
  frais: {
    name: 'frais',
    multipleEntity: true
  },
  utilisateur: {
    name: 'utilisateur',
    multipleEntity: false
  },
  document: {
    name: 'document',
    multipleEntity: false
  },
  materiel: {
    name: 'materiel',
    multipleEntity: false
  },
  evenement: {
    name: 'evenement',
    multipleEntity: false
  },
  qhse: {
    name: 'qhse',
    multipleEntity: false
  },
}
export const $headerItems = [
  {
    id: 1,
    name: 'Acceuil',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
  {
    id: 1,
    name: 'Client',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
  {
    id: 1,
    name: 'Projets',
    link: '/projets',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: true
  },
  {
    id: 1,
    name: 'Relevé d\'activité',
    link: '/activites',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: true
  },
  {
    id: 1,
    name: 'Congés/Absences',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
  {
    id: 1,
    name: 'Frais',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
  {
    id: 1,
    name: 'Utilisateurs',
    link: '/users',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: true
  },
  {
    id: 1,
    name: 'Documents',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
  {
    id: 1,
    name: 'Matériel',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
  {
    id: 1,
    name: 'Evénement',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
  {
    id: 1,
    name: 'QHSE',
    link: '/users/info',
    // onlyFor: [$userRoles.SUPERADMIN, $userRoles.MANAGER, $userRoles.USER],
    opened: false,
    display: false
  },
]
