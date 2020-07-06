# Kauppa

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Installing and setting up

Run `npm install` to install the necessary files for the app to work. This app uses a MongoDB database via cloud, so you will need to set up an account and a whitelisted IP address on https://www.mongodb.com/. Replace the three following words inside the angle brackets with your corresponding ones. The line of code is located in backend/app.js.

mongoose
  .connect(
    'mongodb+srv://<username>:<password>@cluster0-fpifk.mongodb.net/<database>?retryWrites=true',
    { useNewUrlParser: true }
  )

## Development server

Run `npm run server` to start Node.JS with Nodemon.
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
