import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of, combineLatest, map, firstValueFrom } from 'rxjs';
import urlConfig from 'src/app/config/url.config.json';
import { ApiBaseService } from '../base-api/api-base.service';
import { ToastService } from '../toast/toast.service';
import { LoaderService } from '../loader/loader.service';
import { FETCH_Profile_FORM } from 'src/app/core/constants/formConstant';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { Location } from '@angular/common';
import { FETCH_HOME_FORM } from '../../core/constants/formConstant';
import { environment } from 'src/environments/environment';
import { FormsService } from 'formstore-cache';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profilePage = environment.profileRedirectPath || '';
  profileListingUrl = (environment.capabilities.includes('all') || environment.capabilities.includes('project') ?  urlConfig.subUser : urlConfig.subSurvey ) + urlConfig['profileListing'].listingUrl;
  formListingUrl = (environment.capabilities.includes('all') || environment.capabilities.includes('project') ?  urlConfig.subUser : urlConfig.subSurvey ) + urlConfig['formListing'].listingUrl;
  entityConfigUrl = (environment.capabilities.includes('all') || environment.capabilities.includes('project') ?  urlConfig.subProject : urlConfig.subSurvey ) + urlConfig['profileListing'].entityConfigUrl;
  constructor(
    private apiBaseService: ApiBaseService,
    private loader: LoaderService,
    private toastService: ToastService,
    private router: Router,
    private alertService: AlertService,
    private location: Location,
    private projectsApiService: ApiBaseService,
    private formsService:FormsService
  ) { }

  getFormJsonAndData(): Observable<any> {
    return combineLatest([
      this.apiBaseService.post(this.formListingUrl, FETCH_Profile_FORM).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'FORM_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(this.profileListingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'PROFILE_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
    ]).pipe(finalize(async () => await this.loader.dismissLoading()));
  }

  getProfileAndEntityConfigData() {
    return combineLatest([
      this.apiBaseService.get(this.entityConfigUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'FORM_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
      this.apiBaseService.get(this.profileListingUrl).pipe(
        catchError((err) => {
          this.toastService.presentToast(err?.error?.message || 'PROFILE_LOAD_ERROR', 'danger');
          return of({ status: 'error', result: {} });
        })
      ),
    ])
      .pipe(
        map( async ([entityConfigRes, profileFormDataRes]: any) => {
          let profileData = localStorage.getItem("profileData")
          if(profileData){
            let parsedData = JSON.parse(profileData)
            if(parsedData?.state){
              return parsedData
            }else{
              this.presentAlert();
            }
          }
          if (entityConfigRes?.status === 200 && profileFormDataRes?.result) {
            const profileData = entityConfigRes?.result?.meta?.profileKeys;
            const profileDetails = profileFormDataRes?.result;
            // await this.getTheme(profileDetails)
            if (profileDetails?.state) {
              return this.fetchEntitieIds(profileDetails, profileData);
            } else {
              this.presentAlert();
            }
          }
        },(err:any)=>{
          this.toastService.presentToast(err?.error?.message, 'danger');
        }),
        finalize(async () => await this.loader.dismissLoading())
      );
  }

  private fetchEntitieIds(data: any, keys: any) {
    let result: any = {};
    keys.forEach((key: any) => {
      const value = data[key];
      if (key === 'roles' && data.user_roles) {
        result["role"] = data.user_roles.map((role: any) => role.title).join(',');
      } else if (value) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object' && 'value' in value[0]) {
            result[key] = value.map((item: any) => item.value).join(',');
          } else {
            result[key] = value.join(',');
          }
        } else if (typeof value === 'object' && 'value' in value) {
          result[key] = value.value;
        }
      }
    });
    return result;
  }

  async presentAlert() {
    this.alertService.presentAlert(
      'ALERT',
      'PROFILE_UPDATE_MSG',
      [
        {
          text: 'BACK',
          role: 'cancel',
          cssClass: 'secondary-button',
          handler: () => {
            this.location.back()
          }
        },
        {
          text: 'PROFILE_UPDATE',
          cssClass: 'primary-button',
          handler: () => {
            // this.router.navigate([this.profilePage]);
            location.href = environment.profileRedirectPath;
          }
        }
      ]
    );
  }

  async getHomeConfig(listType: any, isReport?: boolean): Promise<any> {
    try {
        let config = {
        url: this.formListingUrl,
        payload: FETCH_HOME_FORM,
      };
      const response: any = await firstValueFrom(this.formsService.getForm(config));

      if ( response.data.result) {
        let data = response.data.result.data;
        let solutionList = data.find((item: any) => item.type === 'solutionList');
        let returnData:any
        if (solutionList) {
          if(isReport){
            let reportList = solutionList.listingData.find((data: any) => data.listType === "report");
            returnData = reportList.list.find((data: any) => data.listType === listType)
          }else{
            returnData = solutionList.listingData.find((data: any) => data.listType === listType);
          }
          return returnData
        }
      }
      return null
    } catch (error: any) {
      this.toastService.presentToast(error?.error?.message, "danger");
      throw error;
    }
  }
}
