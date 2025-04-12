# CurryupaiFe

CurryupaiFe is an Angular application built using Angular CLI v18.2.4. This project integrates Google OAuth for authentication, leverages Tailwind CSS with SCSS for styling, and uses ng-zorro-antd for UI components and icons

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Styling](#styling)
- [HTTP Interceptor](#http-interceptor)
- [Development](#development)
- [Build & Production](#build--production)
- [Testing](#testing)
- [Further Help](#further-help)

## Overview

CurryupaiFe is a modern single-page application (SPA) that:
- Uses Angular's standalone components and routing with authentication guarding.
- Integrates Google Sign-In to authenticate users and leverages HTTP-only cookies that are set by the backend.
- Uses Tailwind CSS in conjunction with SCSS for fast and responsive styling.
- Selectively imports only the required ng-zorro icons, optimizing bundle size in production.

## Tech Stack

- **Angular 18.2.0** – Framework for building the SPA.
- **TypeScript** – Strongly-typed language enabling safer JavaScript code.
- **Angular CLI** – For project scaffolding, building, and serving the app.
- **Tailwind CSS** – Utility-first CSS framework integrated via PostCSS.
- **SCSS & Less** – Styling languages used in the project.
- **ng-zorro-antd** – Angular UI component library with rich icon support.
- **Google OAuth** – For secure third-party user authentication.
- **HTTP-only Cookies** – For secure storage of authentication information.

## Project Structure

The key files and directories include:

- **src/**
  - **app/**
    - `app.component.ts` – Root component that sets up the `<router-outlet>`.
    - `app.routes.ts` – Angular route definitions. Routes to `/` are protected with an `AuthGuard`.
    - `auth.interceptor.ts` – HTTP interceptor that attaches the bearer token for authenticated requests.
    - Other application-specific components (e.g., login, home) and services.
  - **environments/** – Environment-specific configuration files, using file replacements specified in `angular.json`.
  - `main.ts` – Bootstraps the Angular application, provides global services including the icons and HTTP interceptors.
  - `styles.scss` & `theme.less` – Global styling resources. Tailwind CSS is integrated through PostCSS.
- **public/** – Static assets used by the application.
- **angular.json** – Angular CLI configuration (assets, styles, scripts, environment settings).
- **package.json** – Contains project dependencies and scripts.

For a detailed view of the project structure, please refer to the repository tree.

## Authentication

The application uses Google OAuth for authentication. Here’s how it works:

1. **Login Process:**  
   The [LoginComponent](src/app/login/login.component.ts) initializes the Google Sign-In button using the Google API. Upon successful sign in, it calls a backend API (`/auth/google`) with the Google token.

2. **Backend Integration:**  
   The backend verifies the token using `google-auth-library`, creates (or updates) the user record in the database, and responds with a JSON indicating success. An HTTP-only cookie is set (named `auth`) to securely maintain the login session.

3. **Route Protection:**  
   The [AuthGuard](src/app/guards/auth.guard.ts) calls [`AuthService.getGoogleLoginDetails`](src/app/services/auth.service.ts) to ensure that the cookie exists and is valid. If not, it redirects the user to `/login`.

## Styling

- **Tailwind CSS with SCSS:**  
  Tailwind CSS is integrated into the SCSS workflow via PostCSS. Global styles are located in [`src/styles.scss`](src/styles.scss).  
- **Less for Theme Styling:**  
  Additional theme styles are located in [`src/theme.less`](src/theme.less).

## HTTP Interceptor

The interceptor ([auth.interceptor.ts](src/auth.interceptor.ts)) injects an access token (if available) into every outgoing HTTP request. This ensures that protected endpoints receive the necessary authorization header. HTTP requests are executed using Angular’s HttpClient and are registered in the bootstrap process in [`main.ts`](src/main.ts).

## Development

To run the development server:

```bash
ng serve --configuration development
```

- The default configuration uses the settings specified in `angular.json`, including assets and stylesheets.
- The development build uses local environments (see `/src/environments/environment.ts`).

## Build & Production

To build the project for production:

```bash
ng build --configuration production
```

- The production configuration uses file replacements defined in [`angular.json`](angular.json) to switch from `environment.ts` to `environment.production.ts`.
- Only the necessary ng-zorro icons are included in the production bundle by selectively providing them in [`main.ts`](src/main.ts).
- PostCSS is used with Tailwind CSS directives and Autoprefixer to optimize and bundle the CSS.

## Testing

- **Unit Tests:**  
  Run unit tests using Karma. Execute the unit tests with:

  ```bash
  ng test
  ```

- **End-to-End Tests:**  
  For e2e testing, use the built-in Angular e2e testing support (or additional packages as required).

## Further Help

For more help with Angular CLI:

- [Angular CLI Documentation](https://angular.io/cli)
- [Angular Documentation](https://angular.io/docs)
- [ng-zorro-antd Icon Documentation](https://ng.ant.design/components/icon/en)
- For Tailwind CSS integration, see [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is licensed under the [MIT License](LICENSE).

Happy Coding!