import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { DeleteOutline, PlusOutline, CloseOutline, LogoutOutline } from '@ant-design/icons-angular/icons'; // import only needed icons
import { authInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

bootstrapApplication(AppComponent, {providers: [
  ...appConfig.providers,
  provideRouter(routes),
  provideHttpClient(
    withInterceptors([authInterceptor]),
  ),
  { provide: NZ_ICONS, useValue: [ CloseOutline, PlusOutline, DeleteOutline, LogoutOutline ] },
]})
  .catch((err) => console.error(err));
