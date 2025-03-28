import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpdaterService } from './services/updater.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent {
  updater = inject(UpdaterService);
}
