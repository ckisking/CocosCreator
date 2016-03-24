/**
 * 动态加载资源
 */

var TYPE = cc.Enum({
    SPRITE: 0,
    TEXT: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
});

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.type = TYPE.SPRITE;
    },
    
    onloadFrame : function(){
         cc.loader.load("resources://uihj0.plist/new.png", this.loadCallBack.bind(this));
         this.type = TYPE.SPRITE;
         
    },
    
    onloadText : function(){
         cc.loader.load(cc.url.raw("resources://text.txt"), this.loadCallBack.bind(this));
         this.type = TYPE.TEXT;
    },
    
    loadCallBack : function(err, res){
        switch(this.type){
            case TYPE.SPRITE : 
                 cc.find('Canvas/New Sprite').getComponent(cc.Sprite).spriteFrame = res;
                 break;
            case TYPE.TEXT :
                 cc.find('Canvas/New Label').active = true;
                 cc.find('Canvas/New Label').getComponent(cc.Label).string = res;
                 break;
        }
       
       
        cc.log(res);
    }
});
