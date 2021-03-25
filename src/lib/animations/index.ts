import { style, animate, animation, AnimationReferenceMetadata, AnimationTriggerMetadata, trigger, state, transition} from '@angular/animations';

const timing:string= '.4s ease-out';

class NgxFMG_ANIMATION {

    public static get UPDATE_POSITION(): AnimationReferenceMetadata { 
        return animation([
            animate(timing, style({transform: 'translateY({{ animatePosY }})'})),
        ])
    }

    public static get FADE_IN(): AnimationReferenceMetadata { 
        return animation([
            style({opacity: 0, visibility: 'visible'}),
            animate(timing, style({opacity: 1})),
         ])
    }
    
    public static get TRIGGER_FADE_OUT():  AnimationTriggerMetadata { 
        return trigger('TRIGGER_FADE_OUT', [
            state(':leave', style({opacity:  1})),
            transition('* => void', animate(timing, style({opacity: 0})))
            
        ])
    }

}

export default NgxFMG_ANIMATION;

