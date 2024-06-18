import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../services/loader/loader.service';
import { ApiBaseService } from '../services/base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json';
import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FETCH_SESSION_FORM } from '../core/constants/formConstant';
import { AuthService } from 'authentication_frontend_library';
register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  swiperModules = [IonicSlides];
  jsonData: any;
  baseApiService: any;
  authService:AuthService;
  toastService: any;
  loader: LoaderService;
  listResData: any = [];
  typeTemplateMapping: { [key: string]: TemplateRef<any> } = {};
  @ViewChild('bannerTemplate') bannerTemplate!: TemplateRef<any>;
  @ViewChild('solutionTemplate') solutionTemplate!: TemplateRef<any>;
  @ViewChild('recommendationTemplate') recommendationTemplate!: TemplateRef<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.baseApiService = inject(ApiBaseService);
    this.loader = inject(LoaderService)
    this.authService = inject(AuthService)
    this.toastService = inject(ToastService)
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getHomeListing();
  }

  async getHomeListing() {
   await this.loader.showLoading("Please wait while loading...");
    this.baseApiService
      .post(
        urlConfig['homeListing'].listingUrl, FETCH_SESSION_FORM)
        .pipe(
          finalize(async () => {
           await this.loader.dismissLoading();
          })
        )
      .subscribe((res: any) => {
        if (res?.status === 200) {
          if (res?.result) {
            this.listResData = res?.result?.data;
          }
          this.typeTemplateMapping = {
            "bannerList": this.bannerTemplate,
            "solutionList": this.solutionTemplate,
            "recomendationList": this.recommendationTemplate
          };
        }
      },
        (err: any) => {
          this.toastService.presentToast(err?.error?.message);
        }
      );
  }

  navigateTo(data: any) {
    this.router.navigate([data?.redirectionUrl], { state: data });
  }

logout() {
 this.authService.logout();
}

}