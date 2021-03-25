import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxFlexMasonryGridComponent } from './ngx-flex-masonry-grid.component';
import { NgxFlexMasonryGridItemComponent } from './ngx-flex-masonry-grid-item.component';
import { NgxFlexMasonryGridService } from './ngx-flex-masonry-grid.service';

@NgModule({
  declarations: [NgxFlexMasonryGridComponent, NgxFlexMasonryGridItemComponent],
  imports: [
    BrowserAnimationsModule
  ],
  providers: [
      NgxFlexMasonryGridService
  ],
  exports: [NgxFlexMasonryGridComponent, NgxFlexMasonryGridItemComponent]
})
export class NgxFlexMasonryGridModule { }

