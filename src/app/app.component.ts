import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private swUpdate: SwUpdate) {
    let data = localStorage.getItem('accToken');
    let data2 = localStorage.getItem('name');
  }

  ngOnInit(){
    const localTheme = localStorage.getItem('theme');
    if(localTheme){
      const theme = JSON.parse(localStorage.getItem('theme') || '');
      document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
      document.documentElement.style.setProperty('--ion-color-secondary', theme.secondaryColor);
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
      document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    }
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then((data) => {
        if(data){
          this.swUpdate.activateUpdate().then((data)=>{
            window.location.reload()
          })
        }
      });
    }
  }
}
