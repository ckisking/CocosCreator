cc.Class({
    extends: cc.Component,

    properties: {
    },

    // 启动时执行
    onLoad: function () {
        this.registerEvent();
    },
    
    //注册触摸事件
    registerEvent : function(){
        function onTouchDown (event) {
            event.stopPropagation();
            cc.log('触摸开始');
            return false;
        }
        function onTouchUp (event) {
            event.stopPropagation();
            cc.log('触摸结束')
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);  
    },
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
