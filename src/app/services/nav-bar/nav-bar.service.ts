import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import NavConfig from '../../config/nav.config.json';

@Injectable({
  providedIn: 'root',
})
export class NavBarService {
  private selectedIndexSubject = new BehaviorSubject<number>(0);
  selectedIndex$ = this.selectedIndexSubject.asObservable();

  private isNavigationVisibleSubject = new BehaviorSubject<boolean>(true);
  isNavigationVisible$ = this.isNavigationVisibleSubject.asObservable();

  private routerSubscription!: Subscription;
  navItems: any[] = NavConfig;

  constructor(private router: Router) {}

  initialize() {
    this.updateSelectedIndex(this.router.url);

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSelectedIndex(event.url);
        this.updateNavigationVisibility(event.url);
      }
    });
  }

  private updateSelectedIndex(url: string): void {
    const index = this.navItems.findIndex((item) => item.route === url);
    this.selectedIndexSubject.next(index === -1 ? 0 : index);
  }

  private updateNavigationVisibility(url: string): void {
    const matchedNavItem = this.navItems.find((item) => item.route === url);
    const shouldShowNav = matchedNavItem?.keepNavBar ?? false;
    this.isNavigationVisibleSubject.next(shouldShowNav);
  }

  setSelectedIndex(index: number): void {
    this.selectedIndexSubject.next(index);
  }

  hideNavigation(): void {
    console.log("hide");
    this.isNavigationVisibleSubject.next(false);
  }

  showNavigation(): void {
    console.log("show");
    this.isNavigationVisibleSubject.next(true);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
