import { inject, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UpdaterService {
  sw = inject(SwUpdate);
  toast = inject(ToastService);

  constructor() {
    this.sw.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          this.toast.showInfo('Baixando nova versão', 'Aguarde...');
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(
            `New app version ready for use: ${evt.latestVersion.hash}`
          );
          this.toast.showSuccess('Atualize a página', 'Nova versão instalada!');
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(
            `Failed to install app version '${evt.version.hash}': ${evt.error}`
          );
          this.toast.showError(
            'Atualize a página',
            'Erro ao instalar a nova versão'
          );
          break;
      }
    });
  }
}
