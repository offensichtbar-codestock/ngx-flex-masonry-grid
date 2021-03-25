import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NgxFlexMasonryGridLoadingParams } from './ngx-flex-masonry-grid-options';
import { NgxFlexMasonryGridItemComponent } from './ngx-flex-masonry-grid-item.component';

@Injectable({
  providedIn: 'root'
})
export class NgxFlexMasonryGridService {

    private readonly _imageobserved = new Subject<NgxFlexMasonryGridLoadingParams>();
    imageobserved: Observable<NgxFlexMasonryGridLoadingParams> = this._imageobserved.asObservable();

    private readonly _layoutshouldbeupdated = new Subject<NgxFlexMasonryGridItemComponent>();
    layoutshouldbeupdated: Observable<NgxFlexMasonryGridItemComponent> = this._layoutshouldbeupdated.asObservable();

    private readonly _itemremoved = new Subject<NgxFlexMasonryGridItemComponent>();
    itemremoved: Observable<NgxFlexMasonryGridItemComponent> = this._itemremoved.asObservable();

    private readonly _allitemsloaded = new Subject<any>();
    allitemsloaded: Observable<any> = this._allitemsloaded.asObservable();

    private _loaded_items: Array<NgxFlexMasonryGridItemComponent> = [];

    public get loadeditems(): Array<NgxFlexMasonryGridItemComponent> {
        return  this._loaded_items;
    }


    constructor() { }
  
    observeimage(values: Array<NgxFlexMasonryGridLoadingParams>) {
        const itemwithmaxheight =  values.reduce((max, obj) => (max.height > obj.height) ? max : obj);
        this._imageobserved.next(itemwithmaxheight);
    }


    addItem(item:NgxFlexMasonryGridItemComponent, countallitems:number) {
        this._loaded_items = [...this._loaded_items, item];

        this._layoutshouldbeupdated.next(item);
        
        if(this._loaded_items.length === countallitems) {
            this._allitemsloaded.next();
        }
    }

    removeItem(item:NgxFlexMasonryGridItemComponent) {
        
        const index = this._loaded_items.findIndex(griditem => Object.is(griditem, item));
        this._itemremoved.next(this._loaded_items[index]);
        this._loaded_items = [ 
            ...this._loaded_items.slice(0, index), 
            ...this._loaded_items.slice(index + 1, 
            this._loaded_items.length)
        ];  
    }

    clearStack() {
        this._loaded_items = [];
    }
}
