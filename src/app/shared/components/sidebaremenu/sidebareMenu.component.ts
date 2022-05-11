import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {MainStore} from '@store/mainStore.store';
import {SidebarItem} from '@entities/sidebarItem';

@Component({
  selector: 'app-sidebaremenu',
  templateUrl: './sidebaremenu.component.html',
  styleUrls: ['./sidebaremenu.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-10%)'}),
        animate('.4s linear', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('.4s linear', style({transform: 'translateY(-10%)'}))
      ])
    ])
  ]
})
export class SidebareMenuComponent implements OnInit {

  @Input() items: Array<SidebarItem> = [];
  @Output() onItemClick = new EventEmitter();
  constructor(private router: Router,
              private route: ActivatedRoute,
              public mainStore: MainStore,
              ) { }

  ngOnInit(): void {
  }

  toggleExpand(item) {
    item.opened = !item.opened;
  }


  showSubmenu(item){
    item.opened = true;
  }

  navigateSubMenu(link) {
    this.router.navigate([link], {relativeTo: this.route});
  }



  goToSubMenu2(item, subItem_1, subItem_2){
    return item.link+'/'+subItem_1.link+'/'+subItem_2.link;
  }

  goToSubMenu1(item, subItem_1){
    // console.log('goToSubMenu1', item, subItem_1, toJS(this.mainStore.getSelectedSchool.id));
    this.toggleExpand(subItem_1);
    return item.link+'/'+subItem_1.link;
  }

  itemClicked() {
    this.onItemClick.emit();
  }

    hideSubMenuCondition(item: SidebarItem) {
        return true;
    }
}

// export interface SidebarItem {
//   id: number;
//   name: string;
//   link: string;
//   type: string;
//   icon: string;
//   srcIcon?: string;
//   implemented?: boolean;
//   opened?: boolean;
//   onlyFor?: Array<any>;
//   srcIcon_selectedStyle?: string;
//   relative?: boolean;
//   subMenu?: Array<SidebarItem>;
// }
