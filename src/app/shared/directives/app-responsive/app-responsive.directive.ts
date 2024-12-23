import { Directive, Input, TemplateRef, ViewContainerRef, HostListener } from '@angular/core';
import { NavBarService } from 'src/app/services/nav-bar/nav-bar.service';

@Directive({
  selector: '[appResponsive]',
})
export class ResponsiveDirective {
  private currentMode: 'mobile' | 'desktop' | null = null;

  @Input('appResponsive') mode!: 'mobile' | 'desktop';

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef,private navBarService:NavBarService) {}

  ngOnInit(): void {
    this.updateView();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateView();
    if (this.currentMode === 'mobile') {
      this.navBarService.showNavigation();
    }
  }

  private updateView(): void {
    const isMobile = window.innerWidth <= 768;
    const shouldRender = (this.mode === 'mobile' && isMobile) || (this.mode === 'desktop' && !isMobile);

    if (shouldRender && this.currentMode !== this.mode) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tpl);
      this.currentMode = this.mode;
    } else if (!shouldRender && this.currentMode === this.mode) {
      this.vcr.clear();
      this.currentMode = null;
    }
  }
}
