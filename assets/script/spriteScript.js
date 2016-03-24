/**
 * 做血条和技能冷却
 */ 

cc.Class({
    extends: cc.Component,

    properties: {
        //根据speed确定冷却时间
        speed : 0.02,
        
        horizontal : {
            default : null,
            type : cc.Sprite
        },
        
        skill : {
            default : null,
            type : cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function () {
        this.init_horizontal_Range = this.horizontal.fillRange ;
        this.isCD = false;
    },

    //增加HP
    onAddHP : function(){
        if(this.horizontal.fillStart >= 1){
                return;
        }
        this.horizontal.fillStart += 0.1;
    },
    
    //减少HP
    onReduceHP : function(){
        if(this.horizontal.fillStart <= 0){
                return;
        }
        this.horizontal.fillStart -= 0.1;
    },
    
    //释放技能
    onSkill : function(){
        if(this.isCD){
            cc.log("冷却中。。。。无法释放技能");
            return;
        }
        this.skill.fillRange = 1;
        this.schedule(this._updateFillRange, 0.1);
        this.isCD = true;
        cc.log("放了一个技能，进入冷却");
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
         //this._updataFillStart(this.horizontal, this.init_horizontal_Range, this.speed, dt);
         //this._updateFillRange(this.skill, 0, this.speed, dt)
    },
    
    
    //放到update函数里面，进度条会从无到有一直增长
    _updataFillStart : function(sprite, range, speed, dt){
        var fillStart = sprite.fillStart;
        cc.log("start:" + fillStart + "range" + range);
        if(fillStart >= range){
            cc.log("start > range");
        }
        fillStart = fillStart < 1 ? fillStart += (dt * speed) : 0;
        sprite.fillStart = fillStart;
    },
    
    //技能冷却,根据speed来修改冷却的时间
    _updateFillRange : function(){
        var fillRange = this.skill.fillRange;
        fillRange = fillRange- this.speed;
         if(fillRange <= 0){
            fillRange = 0;
            cc.log("冷却完毕");
            this.isCD = false;
            this.unschedule(this._updateFillRange);
        }
        this.skill.fillRange = fillRange;
    }
});
