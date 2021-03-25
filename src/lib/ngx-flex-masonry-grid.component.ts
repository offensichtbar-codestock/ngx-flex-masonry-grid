import {
    Component, 
    OnInit,
    OnDestroy,
    ElementRef, 
    ContentChildren, 
    QueryList, 
    HostListener, 
    AfterContentInit,
    Output,
    EventEmitter
} from '@angular/core';
import { NgxFlexMasonryGridItemComponent } from './ngx-flex-masonry-grid-item.component';
import {NgxFlexMasonryGridLoadingParams} from './ngx-flex-masonry-grid-options';
import { NgxFlexMasonryGridService } from "./ngx-flex-masonry-grid.service";
import {CIRCULAR_IMPORT_PARENT, CircularImportsParent} from './circular-imports';
import { takeWhile } from 'rxjs/operators';

@Component({ 
    selector: 'osb-ngx-flexmasonry-grid',
     template: '<ng-content></ng-content> ', 
     styles: [`
        :host { 
            display: block; width: 100%;
            transform-style: preserve-3d;
            perspective: 1300px;
        }

        :host::ng-deep  > * {        
            visibility: hidden;
            box-sizing: border-box;
            backface-visibility:hidden;
        }
    `],
     providers: [
        NgxFlexMasonryGridService,
        {
          provide: CIRCULAR_IMPORT_PARENT,
          useExisting: NgxFlexMasonryGridComponent
        }
      ]

}) 
     
export class NgxFlexMasonryGridComponent implements OnInit, OnDestroy, AfterContentInit, CircularImportsParent  {

    // Outputs
    @Output() layoutComplete: EventEmitter<any> = new EventEmitter<any>();
    @Output() itemRemoved: EventEmitter<NgxFlexMasonryGridItemComponent> = new EventEmitter<NgxFlexMasonryGridItemComponent>();
    @Output() itemLoaded: EventEmitter<NgxFlexMasonryGridItemComponent> = new EventEmitter<NgxFlexMasonryGridItemComponent>();
    @Output() itemsLoaded: EventEmitter<number> = new EventEmitter<number>();

    // Inputs
    @ContentChildren(NgxFlexMasonryGridItemComponent)  items!: QueryList<NgxFlexMasonryGridItemComponent>;
    @HostListener('window:resize', ['$event'])
    onResize(event:any) {

        clearTimeout(this._timeoutID);
        this._timeoutID = setTimeout(() => {
            this.layout();
        },40);
        
    }

    private _timeoutID: any = 0;
    private  _cols: number = 0;
    private  _rows: number = 0;
    private _item_heights: Array<number> = [];
    private _row_heights: Array<number> = [];
    private isAlive : boolean = true;


    constructor(private _element: ElementRef, public service: NgxFlexMasonryGridService) {

        this.service.layoutshouldbeupdated.pipe(takeWhile(() => this.isAlive)).subscribe((item:NgxFlexMasonryGridItemComponent) => {
            this.itemLoaded.emit(item)
            item.playAnimation();           
            item.isready = true;
            this.layout();
          
        });
        
        this.service.imageobserved.pipe(takeWhile(() => this.isAlive)).subscribe((param: NgxFlexMasonryGridLoadingParams) => {
            this.add(param);
        });

       this.service.itemremoved.pipe(takeWhile(() => this.isAlive)).subscribe((item:NgxFlexMasonryGridItemComponent) => {
            this.itemRemoved.emit(item)
            this.layout();
           
        });

        this.service.allitemsloaded.pipe(takeWhile(() => this.isAlive)).subscribe(() => {
            this.itemsLoaded.emit(this.items.length);
            this.layout();
            
        });
    }

    ngOnInit() {}

    public forceUpdateLayout() {
        if(this.items?.length && this.items?.length !== 0) {
            let items:Array<NgxFlexMasonryGridItemComponent> = this.items.toArray().filter((item: NgxFlexMasonryGridItemComponent) => {
             
                return item.isready;
            });

            if(this.service.loadeditems.length === items.length) {
                this.layout();
            }
        }
    }

    private layout() {
        
        this._cols = Math.round(this._element.nativeElement.offsetWidth / this.items.toArray()[0].width ); 
        this._rows = Math.ceil(this.items.length / this._cols);
        this._item_heights = this.items.map(el => el.height);      
        
        this._row_heights = this.getRowHeights();

        const offsets = this.getElementOffsets();
        this.translateElements(offsets);   

        
        if(this.service.loadeditems.length === this.items.length) {
            this.layoutComplete.emit();
        }
    }

    public add(params: NgxFlexMasonryGridLoadingParams) {
        this.service.addItem(params.item, this.items.length);
    }

    private getRowHeights(): Array<number> {

        let rowheights = [];
        for(let row = 0; row < this._rows; row++) {
            const heightgroup = this._item_heights.slice(row * this._cols, (row + 1) * this._cols); // heightgroup caches slice (slice length === cols length) of _el_heights array
            const rowHeights = Math.max(...heightgroup);
            rowheights.push(rowHeights);
        }

        return rowheights;
    }

    private getElementOffsets(): Array<number> {

        const el_heightgap:any[] = [...Array(this._cols)].map(e => []);
        this._item_heights.forEach((height, index) => {
            const current_gap:number  = this._row_heights[Math.floor(index / this._cols)] - height;
            el_heightgap[index % this._cols].push(current_gap);
        });

        
        const el_offsets:any[] = [...Array(this._cols)].map(e => []);
        
        /**
         *  Accumulates element offsets (final translation values) from el_heightgap array
         *  Resets translation for first row by unshifting value zero to each subarray
         */
        for(let gap = 0; gap < el_heightgap.length; gap++) {

            let accumulation = 0; // Cache for accumulated height differences for each col
            el_offsets[gap] = el_heightgap[gap].map((val:number) => accumulation += val); // Maps accumulated height difference values to offset array
            el_offsets[gap].pop(); // Removes last value, because the last element needs to be translated by the value of its predecessor
            el_offsets[gap].unshift(0); // Adds zero offsets for first item per col, because first item doesn't need to be translated
        }

        
        let elementoffsets:any[] = [];
        for(let i = 0; i < this.items.length; i++) {
            const iterator = i % el_offsets.length;
            const counter = Math.floor(i / el_offsets.length);
            elementoffsets.push(el_offsets[iterator][counter]);
        }

        this.setContainerHeight();

        return elementoffsets;
       
    }

    private setContainerHeight() {
        if(this.items.length <= 0)
            return;

        let containerHeight:any[] = [];
        for(let col:number = 0; col < this._cols; col++) {
            containerHeight.push([0]);
            let i = 0;
            while(col + this._cols * i < this.items.length){
                let currVal:any = containerHeight[col % this._cols];
                let newVal:any = this.items.toArray()[col + i * this._cols]?.height;
                containerHeight[col % this._cols] = parseInt(currVal) + newVal;
                i++;
            }
        }

        this._element.nativeElement.style.height = `${Math.max(...containerHeight)}px`;
    }

    private translateElements(heights: Array<any>) {
        this.items.forEach((child, index) => {
            child.translateY = heights[index]; 
        });
    }

    ngAfterContentInit() {}
    

    ngOnDestroy() {
        this.isAlive = false;
        this.service.clearStack();
    }
    

}
