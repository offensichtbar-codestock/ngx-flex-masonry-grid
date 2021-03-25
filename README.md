# NgxFlexMasonryGrid

![Offensichtbar Logo](https://i.postimg.cc/nz9jhvpZ/osb-header-git.jpg)

Angular Module for displaying items in a flex-based masonry layout without any third party dependencies. The grid layout only uses the css flexbox feature. In contrast to well-known Masonry layouts, doesn't use absolute positioning which makes usable for various css frameworks. The distances are calculated using a simple transform style (translateY).

[![npm version](https://badge.fury.io/js/offensichtbar-codestock%2Fngx-flex-masonry-grid.svg)](https://www.npmjs.com/package/offensichtbar-codestock%2Fngx-flex-masonry-grid)

## Installation

`npm install @offensichtbar-codestock/ngx-flex-masonry-grid --save`

## Usage

Import `NgxFlexMasonryGridModule` into the app's modules:

```typescript
import { NgxFlexMasonryGridModule } from '@offensichtbar-codestock/ngx-flex-masonry-grid';

@NgModule({
    imports: [NgxFlexMasonryGridModule]
})
```


```typescript
@Component({
    selector: 'demo-component',
    template: `
        <osb-ngx-flexmasonry-grid class="grid">
        <osb-ngx-flexmasonry-grid-item class="grid-item" *ngFor="let item of myitems">
            {{item.title}}
        </osb-ngx-flexmasonry-grid-item>
        </osb-ngx-flexmasonry-grid>
        `
})
class DemoComponent {
    myitems = [
        { title: 'item 1', image: '...' },
        { title: 'item 2' },
        { title: 'item 3' },
    ];
}
```

#### Example
```sh
<div class="container-fluid">

  <osb-ngx-flexmasonry-grid class="row">

    <osb-ngx-flexmasonry-grid-item class="col-xl-3 col-lg-4 col-sm-6" *ngFor="let item of myitems">

      <div class="card shadow">
        <img src="https://i.postimg.cc/MHdV6X6K/osb-cs.jpg" class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">{{item.title}}</h5>
          <p class="card-text">{{item.description}} </p>
        </div>
      </div>

    </osb-ngx-flexmasonry-grid-item>

  </osb-ngx-flexmasonry-grid>

</div>
```

> Note: `always use paddings` 
To avoid ugly side effects, always use paddings instead of margins for the spacing between flexboxes.

## Event Callbacks

1. **layoutComplete($event)**
2. **itemRemoved($event)**
3. **itemLoaded($event)**
4. **itemsLoaded($event)**

```typescript
import { NgxFlexMasonryGridItemComponent } from '@offensichtbar-codestock/ngx-flex-masonry-grid';

@Component({
    selector: 'demo-component',
    template: `
        <osb-ngx-flexmasonry-grid class="grid" 
        (layoutComplete)="layoutComplete($event)"
        (itemRemoved)="itemRemoved($event)"
        (itemLoaded)="itemLoaded($event)"
        (itemsLoaded)="itemsLoaded($event)"
        >
            <osb-ngx-flexmasonry-grid-item class="grid-item" *ngFor="let item of myitems">
                {{item.title}}
            </osb-ngx-flexmasonry-grid-item>
        </osb-ngx-flexmasonry-grid>
        `
})
export class DemoComponent {
  ...

    /*
    * @param $event: NgxFlexMasonryGridItemComponent 
    */
    itemLoaded($event:NgxFlexMasonryGridItemComponent) {
        console.log('Item loaded '  +  $event)
    }

    /*
    * @param $event: NgxFlexMasonryGridItemComponent 
    */
    itemRemoved($event:NgxFlexMasonryGridItemComponent) {
        console.log('Item removed '  +  $event)
    }

    /*
    * @param $event: number 
    */
    itemsLoaded($event:number) {
        console.log('Count loaded items'  +  $event)
    }

    /*
    * @param $event: void 
    */
    layoutComplete($event:any) {
        console.log('Layout complete')
    }
}
```

## Public Methods

The **forceUpdateLayout()** method is available to update the layout manually. This only works if all items are loaded and ready.

```typescript
  
    import {NgxFlexMasonryGridComponent} from '@offensichtbar-codestock/ngx-flex-masonry-grid';

    export class DemoComponent {

        @ViewChild(NgxFlexMasonryGridComponent) masonry?: NgxFlexMasonryGridComponent;

        constructor(private service : RootService) {
            this.service.getitems.subscribe((items: Array<any>) => {
                ...
                this.masonry?.forceUpdateLayout();
            });
            
        }
    }
```


## Features

Feel free to use a CSS framework of your choice like Bootstrap. 

## Todos

1. Add more animation options for items :enter and :leave like\
NgxFMG_ANIMATION.**SCALE_IN**\
NgxFMG_ANIMATION.**FLIP_IN_Y**\
NgxFMG_ANIMATION.**FLIP_IN_X**

Maybe provided in a future release

## Demo

View live demo on stackblitz:\
[stackblitz editor](https://stackblitz.com/edit/demo-ngx-flex-masonry-grid?file=src/app/app.component.ts)\
[stackblitz live demo](https://demo-ngx-flex-masonry-grid.stackblitz.io)

## MIT Licence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
