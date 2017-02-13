var swipe   =   (function swipe(element, callback, setting){
    var self    =   this;
    this.config =   {
        "HTH": (typeof setting === 'object' && typeof setting.HTH != "undifine" && typeof setting.HTH == 'number' ) ? setting.HTH : 50 , /* Horizontal threshold to consider as a left or right swipe */
        "VTH": (typeof setting === 'object' && typeof setting.VTH != "undifine" && typeof setting.VTH == 'number' ) ? setting.VTH : 50, /* Vertical threshold to consider as a up or down swipe */
        "startX": 0,
        "startY": 0,
        "distanceX": 0,
        "distanceY": 0,
        "hasTouchMove": false,
        "direction" : "none",
        "touches" : {
            "touchstart": {
                "x":-1, 
                "y":-1
            }, 
            "touchmove" : {
                "x":-1, 
                "y":-1
            }
        },
        "time": {
            "allowedTime": 500, 
            "elapsedTime": 0,
            "startTime": 0
        },
        "touchStartAt": {},
        "touchEndAt": {}
    };
    this.touchFn    =   function(event){
        var touchMove   =   false,
            cfg         =   self.config,
            touch;
        if(typeof event !== 'undefined' && typeof event.touches !== 'undefined'){
            event.preventDefault(); 
            touch = event.touches[0];
            switch (event.type) {
                case 'touchstart':{
                    var touchObj        =   event.changedTouches[0];                    
                    cfg.distanceX       =   0;
                    cfg.distanceY       =   0;
                    cfg.startX          =   touchObj.pageX;
                    cfg.startY          =   touchObj.pageY;
                    cfg.touchStartAt    =   touchObj;
                    cfg.direction       =   "none";
                    cfg.hasTouchMove    =   false;
                    cfg.time.startTime  =   new Date().getTime();
                }
                case 'touchmove':{
                    cfg.hasTouchMove = true;
                    cfg.touches[event.type].x = touch.pageX;
                    cfg.touches[event.type].y = touch.pageY;
                    callback({
                        direction: cfg.direction,
                        touch: {
                            startAt: cfg.touchStartAt,
                            endAt: cfg.touchEndAt
                        },
                        touches: event.touches[0],
                        type: event.type
                    });
                    break;
                }
                case 'touchend':{
                    var touchobj    =   event.changedTouches[0];
                    cfg.touchEndAt  =   touchobj;

                    cfg.distanceX   =   touchobj.pageX - cfg.startX;
                    cfg.distanceY   =   touchobj.pageY - cfg.startY;
                    
                    var horizontal  =   Math.abs(cfg.distanceX),
                        vertical    =   Math.abs(cfg.distanceY);
                                        
                    cfg.time.elapsedTime = new Date().getTime() - cfg.time.startTime;
                    
                    /**
                    * Meet the first condition
                    * Check if the allowed time id meet
                    */
                    if (cfg.time.elapsedTime <= cfg.time.allowedTime){
                        /**
                        *  Second Condition is to check if User's finger is move from the start of touch
                        */
                        if(cfg.hasTouchMove){
                            /**
                            * Third Condition check if horizontal swipe is greaterthan vertical swipe
                            * 
                            * if true, then swipe is iether left or right
                            */
                            if(horizontal >= vertical){
                                /* Check if horizoltal swipe is greaterthan horizontal threshold */
                                if(horizontal >= cfg.HTH){
                                    cfg.direction = cfg.touches.touchstart.x < cfg.touches.touchmove.x ? "right" : "left";
                                }
                            }
                            /**
                            * else condition its for Up and Down swipe 
                            */
                            else{
                                /* Check if vertical swipe is greaterthan vertical threshold */
                                if(vertical >= cfg.VTH){
                                    cfg.direction   =   (cfg.distanceY < 0) ? "up" : "down";
                                }
                            }
                        }
                    }
                    cfg.hasTouchMove = false;
                    callback({
                        direction: cfg.direction,
                        touch: {
                            startAt: cfg.touchStartAt,
                            endAt: cfg.touchEndAt
                        },
                        touches: touchobj,
                        type: event.type
                    });
                }
                default:
                    break;
            }
        }    
    }
    this.init       =   function(element){
        var element =   document.querySelector(element);
        element.addEventListener('touchstart', this.touchFn, false);
        element.addEventListener('touchmove', this.touchFn, false);    
        element.addEventListener('touchend', this.touchFn, false);
    }
    this.init(element);
});