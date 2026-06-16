import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonamos la petición para agregarle withCredentials
  // Esto le indica al navegador que debe incluir las cookies (como JSESSIONID)
  // en la solicitud HTTP hacia el backend de Spring Boot.
  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest);
};
