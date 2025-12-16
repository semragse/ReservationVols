import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ModuleApp } from './app/module-app';

platformBrowserDynamic().bootstrapModule(ModuleApp)
  .catch(err => console.error(err));
