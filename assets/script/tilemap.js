
const Astar = require('Astar');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },
    
    theMapLoaded: function(err) {
        if (err) return;
        this._tiledMap = this.node.getComponent('cc.TiledMap');
        var astar = new Astar();
        astar.InitAStarCoordWith(this._tiledMap);
        var a = 555;
         cc.log(typeof a);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
