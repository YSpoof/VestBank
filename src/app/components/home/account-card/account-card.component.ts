import { Component, input } from '@angular/core';

@Component({
  selector: 'app-account-card',
  imports: [],
  template: `
    <div class="bg-vb-black p-4">
      <img
        [src]="imageSrc()"
        [alt]="imgAlt()"
        class="mb-2 mx-auto rounded-xl"
        width="512"
        height="512"
      />
      <h2 class="text-4xl md:text-6xl text-vb-primary font-bold text-center">
        {{ title() }}
      </h2>
      <p class="text-lg md:text-2xl text-vb-secondary mt-4">
        <ng-content />
      </p>
    </div>
  `,
})
export class AccountCardComponent {
  title = input('Title');
  imageSrc = input.required<string>();
  imgAlt = input('Image alt text');
}
