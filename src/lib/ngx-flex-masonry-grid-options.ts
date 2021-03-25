import { AnimationReferenceMetadata } from '@angular/animations';
import {NgxFlexMasonryGridItemComponent} from './ngx-flex-masonry-grid-item.component';

export interface NgxFlexMasonryGridAnimations {
    show: AnimationReferenceMetadata;
    hide: AnimationReferenceMetadata;
}

export interface NgxFlexMasonryGridLoadingParams {
    item: NgxFlexMasonryGridItemComponent;
    height: number;
}