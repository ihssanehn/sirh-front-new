import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-banner',
  templateUrl: './password-banner.component.html',
  styleUrls: ['./password-banner.component.scss']
})
export class PasswordBannerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoChange(){
    this.router.navigate(['/profile/update']);
  }

}
