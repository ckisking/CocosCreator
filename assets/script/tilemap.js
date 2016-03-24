
/**
 * tiledmap中应用A*算法
 */

const Astar = require('Astar');
var res = require('gobalSet');
const LStarQuery = require('LStarQuery');
const LNode = require('LNode');

cc.Class({
    extends: cc.Component,

    properties: {
        objectGroupName : 'players',
        
        spirte1 : {
           default : null,
           type : cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.arrPlayer = [];
        self.count = 0;
        self._player = self.node.getChildByName('player');               //获取node的名为player的子节点
        if (! self._isMapLoaded) {
            self._player.active = false;
        }
        
        function onTounchEnd(event){
           self._touchStartPos = event.touch.getLocation();
           cc.log(self._touchStartPos);;                                  //触摸点世界坐标
           cc.log(self.node.position);                                    //父节点node坐标
           cc.log(self._player.getPosition());                            //player坐标
           cc.log(self.node.convertToNodeSpaceAR(self._touchStartPos));   //触摸点世界坐标转换为node内坐标
           cc.log(self.node.convertToNodeSpace(self._touchStartPos));     //触摸点世界坐标转换为node内坐标
           cc.log(self.node.parent);                                      //node的父节点
           cc.log(self._getTilePos(self.node.convertToNodeSpaceAR(self._touchStartPos))); //触摸点所在的方块坐标（A*算法把地图分为A*B的方块）
            
           //清除路径
           for(let i=0; i<self.arrPlayer.length; i++){
                self.arrPlayer[i].destroy();
           }
           self.arrPlayer.length = 0;
           
           //获取起点和终点
           var endpos = self._getTilePos(self.node.convertToNodeSpaceAR(self._touchStartPos));
           var startpos = self._getTilePos(self._player.getPosition());
           
           //开始寻路
           var list =  self.query.queryPath(startpos, endpos);
           //self.moveByShortpath(list);
           //画出路径
          for(let i=0; i<list.length; i++){
                cc.log(list[i].x+','+list[i].y);
                var monster = cc.instantiate(self._player);
                monster.position = cc.p((list[i].x) * 32 + 16, (list[i].y) * 32 + 16);
                self.node.addChild(monster);
                self.arrPlayer.push(monster);
          }
           self._player.position = self.node.convertToNodeSpaceAR(self._touchStartPos);
        }
        
        //触摸移动地图
        function onTouchMove(event){
            var diff = event.getDelta();
            var winSize = cc.director.getWinSize();
            var currentPos = self.node.position;
            var pos = cc.p(currentPos.x + diff.x, currentPos.y + diff.y);
            // 得到此时地图的尺寸
            var bgSpriteCurrSize = cc.size(this.node.getContentSize().width * this.node.scale, this.node.getContentSize().height * this.node.scale);
            cc.log('地图大小'+bgSpriteCurrSize + 'scale:' + this.node.scale);
            //边界控制，约束pos的位置
            pos.x = Math.min(pos.x, bgSpriteCurrSize.width *  self.node.getAnchorPoint().x);
            pos.x = Math.max(pos.x, -bgSpriteCurrSize.width + winSize.width + bgSpriteCurrSize.width *  self.node.getAnchorPoint().x);
            pos.y = Math.min(pos.y, bgSpriteCurrSize.height *  self.node.getAnchorPoint().y);
            pos.y = Math.max(pos.y, -bgSpriteCurrSize.height + winSize.height + bgSpriteCurrSize.height *  self.node.getAnchorPoint().y);
            
            // 重设地图位置
            self.node.position = pos;
            cc.log(diff+','+currentPos+','+pos);
        }
        
        //注册触摸事件
        self.node.on('touchmove', onTouchMove, self);
        self.node.on('touchend', onTounchEnd, self);
    },
    
    //tiledmap加载完成后调用
    theMapLoaded: function(err) {
        if (err) return;
        this._tiledMap = this.node.getComponent('cc.TiledMap');
       //获取对象属性
        this._layerFloor = this._tiledMap.getLayer('floor');
        var objectGroup = this._tiledMap.getObjectGroup(this.objectGroupName);
        if (!objectGroup) return;
        var startObj = objectGroup.getObject('SpawnPoint');
        var startPos = cc.p(startObj.x, startObj.y);
        this._curTile = this._getTilePos(startPos);
        
        this._player.active = true;
        var pos = this._layerFloor.getPositionAt(this._curTile);
        this._player.setPosition(cc.p(0,0));
        
       
        var map = this.initMapWithTiled(this._tiledMap);
        this.node.scale = 0.5;
        //初始化寻路类
	    this.query = new LStarQuery();
        this.query._map = [];
        this.query._w = map[0].length;
        this.query._h = map.length;
	    //初始化寻路类的地图
         for (var y=0; y<this.query._h; y++) {
		    this.query._map.push([]);
	        for (var x=0; x<this.query._w; x++) {
			    this.query._map[y].push(new LNode(x,y,map[y][x]));
	        }
	    }
        
        var returnList = this.query.queryPath(cc.p(2,3), cc.p(3,7)); 
        cc.log("寻路完成");
    },
    
    //初始化tilemap数据到map中
    initMapWithTiled : function(tiledmap){
        var layer = tiledmap.getLayer('block');
        var AStarWidth = tiledmap.getMapSize().width;
        var AStarHeight = tiledmap.getMapSize().height;
        var self = this;
        var type = 0;
        var map = [];
         
        for(let h = 0; h < AStarHeight; h++){
             var childData = [];
             for(let w = 0; w < AStarWidth; w++){
                 var tileGid = layer.getTileGIDAt(cc.p(w, AStarHeight - 1 - h));
                 //判断这个图层中存在该瓦片
                 if(tileGid > 0){
                    //  var prop = tiledmap.getPropertiesForGID(tileGid);
                    //  cc.log(prop.block);  //输出地图块属性
                    //  if(prop.block == 1){
                    //     type = 1;
                    //  }
                    type = 1;
                 }
                 else{
                      type = 0;
                 }
                childData.push(type);
             }
             map.push(childData);
        }
        cc.log(map);
        return map;
    },
    
    //根据屏幕坐标，获取方块坐标
    _getTilePos: function(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this._tiledMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor(posInPixel.y / tileSize.height);

        return cc.p(x, y);
    },
    
    //根据获取的最短路径行走
    moveByShortpath : function(path){
        if(this.count >= path.length){
            return;
            this.count = 0;
        }
        var pos = cc.p((path[this.count].x) * 32 + 16, (path[this.count].y) * 32 + 16);
        var call = cc.sequence(cc.moveTo(0.5, pos), cc.callFunc(this.moveByShortpath, path, true))
        this._player.runAction(call);
        this.count ++;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
