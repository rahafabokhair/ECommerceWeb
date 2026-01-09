// import {
//   Directive,
//   inject,
//   Input,
//   OnInit,
//   TemplateRef,
//   ViewContainerRef,
// } from '@angular/core';
// import { AuthService } from '../../auth/auth.service';

// @Directive({
//   selector: '[appHasRole]',
//   standalone: true,
// })
// export class HasRoleDirective implements OnInit {
//   @Input() appHasRole: string[] = [];
//   authService = inject(AuthService);
//   isVisible = false;
//   constructor(
//     private viewContainerRef: ViewContainerRef,
//     private templateRef: TemplateRef<any>
//   ) {}
//   ngOnInit(): void {
//     debugger;
//     this.authService.decodedToken$.subscribe((token) => {
//       if (token) {
//         this.authService.decodedToken = token;
//       }
//     });

//     if (this.authService.decodedToken) {
//       const userRoles = this.authService.decodedToken.role as Array<string>;

//       if (!userRoles) {
//         this.viewContainerRef.clear();
//       }
//       if (this.authService.roleMatch(this.appHasRole)) {
//         if (!this.isVisible) {
//           this.isVisible = true;
//           this.viewContainerRef.createEmbeddedView(this.templateRef);
//         } else {
//           this.isVisible = false;
//           this.viewContainerRef.clear();
//         }
//       }
//     }
//   }
// }

////////////////////////////////////////
import {
  Directive,
  inject,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnDestroy {
  @Input() appHasRole!: string[];

  private authService = inject(AuthService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  private subscription: Subscription;

  constructor() {

    this.subscription = this.authService.decodedToken$.subscribe((token) => {
      this.updateView(token);
    });

    // if (this.authService.decodedToken) {

    //   this.updateView(this.authService.decodedToken);
    // }
    // Subscribe to changes in the decoded token
  }

  private updateView(token: any): void {
    this.viewContainerRef.clear(); // always clear first

    if (token && this.authService.roleMatch(this.appHasRole)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // prevent memory leaks
  }
}
