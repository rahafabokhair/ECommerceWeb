import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          return throwError(error.statusText);
        }
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
          return throwError(applicationError);
        }
        const serverErrorGeneral = error.error;
        const serverError = error.error.errors;
        let modalStatusErrors = '';
        if (serverError && typeof serverError === 'object') {
          for (const key in serverError) {
            if (serverError[key]) {
              modalStatusErrors += serverError[key] + '\n';
            }
          }
        }
        if (serverErrorGeneral['type']==='error') {
         return throwError('server error');
        }
         
        
        return throwError(
          modalStatusErrors || serverErrorGeneral || 'Server Error'
        );
      }
      // Always return an observable, even if no condition matches

      return throwError(() => new Error('Unknown error occurred'));
    })
  );
};
