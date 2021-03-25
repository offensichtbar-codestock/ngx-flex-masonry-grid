import {Component, OnInit, OnDestroy, AfterViewInit, ElementRef, HostBinding, Inject, HostListener} from '@angular/core';
import { NgxFlexMasonryGridLoadingParams } from './ngx-flex-masonry-grid-options';
import { AnimationBuilder,useAnimation } from '@angular/animations';
import { NgxFlexMasonryGridService } from "./ngx-flex-masonry-grid.service";
import { CircularImportsParent, CIRCULAR_IMPORT_PARENT } from './circular-imports';
import NgxFMG_ANIMATION from './animations';

@Component({ 
    selector: 'osb-ngx-flexmasonry-grid-item',
    template: '<ng-content></ng-content> ', 
    animations: [
        NgxFMG_ANIMATION.TRIGGER_FADE_OUT
    ]
    
}) 

export class NgxFlexMasonryGridItemComponent implements OnInit, OnDestroy, AfterViewInit  {

    
    @HostBinding('style.height') heightprops =  'max-content'; 

    @HostBinding('@TRIGGER_FADE_OUT') get getLeaveDrawer(): boolean {
        return this._remove;
    }

    @HostListener('@TRIGGER_FADE_OUT.done') animationIsDone() {
        if(this._remove)
            this.service.removeItem(this);
    }
 
   
    public images?: Set<HTMLImageElement>;
    private _translateY: number =0;
    private _isready: boolean = false;
    private _remove: boolean = false;
    public get height(): number {
        return this.element.nativeElement.offsetHeight;
    }

    public get isready():boolean {
        return this._isready;
    }


    public set isready(ready:boolean) {
        this._isready = ready;
    }

    public get width():number {
        const  marginLeft:any = window
            .getComputedStyle(this.element.nativeElement,null)
            .getPropertyValue('margin-left')
            .match(/\d+/);
    
        const marginRight:any = window
            .getComputedStyle(this.element.nativeElement,null)
            .getPropertyValue('margin-right')
            .match(/\d+/);

        return this.element.nativeElement.offsetWidth + (parseInt(marginLeft[0]) + parseInt(marginRight[0]));
    }

    public set translateY(value:number) {
        if(this._isready) {
            this.upDatePosition(value);
        } else {
            this.element.nativeElement.style.transform = `translateY(-${value}px)`;
           
        }
        this._translateY = value;
    }

    public get translateY():number {
        return this._translateY;
    }

    constructor(
        private element: ElementRef, 
        private builder: AnimationBuilder,   
        public service: NgxFlexMasonryGridService,
        @Inject(CIRCULAR_IMPORT_PARENT) private parent: CircularImportsParent
    ) { }

    ngOnInit() {}

    upDatePosition(to:number) {
      
        const params = {animatePosY: `-${to}px`};
        const metadata = useAnimation(NgxFMG_ANIMATION.UPDATE_POSITION, {params: params});

        const player = this.builder.build(metadata).create(this.element.nativeElement);
 

        player.play();           
            
    }

    playAnimation() {
        
        const metadata = NgxFMG_ANIMATION.FADE_IN;
        this.element.nativeElement.style.visibility = 'visible';

        const player = this.builder.build(metadata).create(this.element.nativeElement);
        player.play();       
    }

    ngAfterViewInit() {
        this.translateY = 0;
        this.startLoading();
    }

    startLoading() {
        const images = this.element.nativeElement.querySelectorAll('img');     
        this.images = new Set(images);    
        let loaded:Array<NgxFlexMasonryGridLoadingParams> = [];

        if( images.length == 0) {
           setTimeout(() =>{
                this.service.observeimage([...loaded, {
                    item: this,
                    height: this.element.nativeElement.offsetHeight
                }]);
            });
            
            return;
        }

        Array.from(this.images).forEach((image: HTMLImageElement) => {
            
            this.loadImage(image.src).then(props => {
                loaded = this.checkActionLoaded(loaded, images, props)
                this.images?.delete(image);
            }).catch((error) => {                    
                loaded = this.checkActionLoaded(loaded, images)
                this.images?.delete(image);
            })
        });
    }

    checkActionLoaded(loaded: Array<NgxFlexMasonryGridLoadingParams>, images: Array<HTMLImageElement>, props?:NgxFlexMasonryGridLoadingParams) {
        loaded = [...loaded, (props) ? props : {
            item: this,
            height: this.element.nativeElement.offsetHeight
        }];

        if(loaded.length === images.length) {                       
            this.service.observeimage(loaded);
        } 

        return loaded;
    }

    loadImage(src: string): Promise<NgxFlexMasonryGridLoadingParams> {

        return  new Promise((resolve, reject) => {
            let img = new Image()
            img.onload = () => resolve({
                item: this,
                height: this.element.nativeElement.offsetHeight
            })
            img.onerror = reject
            img.src = src
        })
       
    }

    ngOnDestroy() {
        this._remove = true;
       
    }
}
