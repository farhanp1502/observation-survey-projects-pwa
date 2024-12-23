import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';
import { NavItem } from './interfaces/main.interface';
import  NavConfig  from './config/nav.config.json';
import { TranslateService } from '@ngx-translate/core';
import { NavBarService } from './services/nav-bar/nav-bar.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: [
    trigger('sideNavAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('400ms ease-out', style({
          opacity: 1,
          transform: 'translateX(0)'
        }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }))
      ])
    ])
  ]
})
export class AppComponent {
  isNavigationVisible$ = this.navBarService.isNavigationVisible$;


  constructor(private swUpdate: SwUpdate, private router:Router, private translate :TranslateService,private navBarService: NavBarService) {}

  ngOnInit(){
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then((data) => {
        if(data){
          this.swUpdate.activateUpdate().then((data)=>{
            window.location.reload()
          })
        }
      });
    }

    this.navBarService.initialize();

  }

}
