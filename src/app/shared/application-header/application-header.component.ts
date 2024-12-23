import { Component, OnInit ,Input, Output, EventEmitter, ContentChild, TemplateRef} from '@angular/core';
import { Location } from '@angular/common';
import { NavBarService } from 'src/app/services/nav-bar/nav-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-header',
  templateUrl: './application-header.component.html',
  styleUrls: ['./application-header.component.scss'],
})
export class ApplicationHeaderComponent   {
  @ContentChild('search', { static: false })
  search!: TemplateRef<any>;
  @Input() config:any ={
    showBackButton: false,
    title:'',
    customActions: []
  };
  @Output() actionClick = new EventEmitter<string>();
  menuVisible = true;


  constructor(private location: Location,private navBarService:NavBarService,private route:Router) {
   }

    ngOnInit(): void {
      // this.navBarService.isNavigationVisible$.\
    this.navBarService.isNavigationVisible$.subscribe((isVisible) => {
      this.menuVisible = !isVisible; // Hide the menu icon if the sidebar is visible
    });

  }



  onBackClick() {
    this.location.back();
  }

  onActionClick(actionName: string) {
    this.actionClick.emit(actionName);
  }

  openMenu(){
    this.navBarService.showNavigation();
  }

}
