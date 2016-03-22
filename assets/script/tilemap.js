
const Astar = require('Astar');
var res = require('gobalSet');

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
        astar.MoveToFoward(cc.p(40,40), cc.p(70,100));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
