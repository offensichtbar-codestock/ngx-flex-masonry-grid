import { InjectionToken } from '@angular/core';
import {NgxFlexMasonryGridLoadingParams} from './ngx-flex-masonry-grid-options';

export interface CircularImportsParent {
    add(param: NgxFlexMasonryGridLoadingParams):void
}

export const CIRCULAR_IMPORT_PARENT = new InjectionToken<CircularImportsParent>('CIRCULAR_IMPORT_PARENT');