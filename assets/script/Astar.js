var Astar_Coord_Info = cc.Class(
    {
       ctor () {
        this.pointOrg = cc.p(0,0);
        this.point =  cc.p(0,0);
        this.nCost = 0;
        this.nType = 1;
        },
    });
const ShortestPathStep = require('ShortestPathStep');

var Astar = cc.Class({
    name : 'Astar',
    extends: cc.Component,
    properties: {
        openArray        : [],                //open列表
        closeArray       : [],                //close列表
        m_AstarCoordInfo : [],                //保存地图数据
        m_shortestPaths  : [],                //保存最短路径
        m_nBlockSize     : 32,                //地图块大小
    },

    // use this for initialization
    onLoad: function () {
    },
    
    //寻路开始
    MoveToFoward : function(fromPos, toPos){
        var self = this;
        if(self.m_shortestPaths.length === 0){
           self.m_shortestPaths.length = 0; 
        }
        var fromAStarCoord = self.AStarCoordForPosition(fromPos);
        var toAStarCoord = self.AStarCoordForPosition(toPos);
        cc.log('起点'+fromAStarCoord+'   重点'+toAStarCoord);
        //检查起点终点是否为同一个点
        if(cc.pSameAs(fromAStarCoord,toAStarCoord)){
            return;
        }
        //终点是否为有效点
        if(!self.IsValidPos(toAStarCoord)){
            cc.log('无效'+toAStarCoord);
            return;
        }
        
        var step = new ShortestPathStep();
        step.initWithPosition(fromAStarCoord);
        self.InsertInOpenArray(step);  
        
        do{
            var curStep = self.openArray[0];
            self.closeArray.push(curStep);
            self.openArray.splice(0,1);
            
            if(cc.pSameAs(curStep.position, toAStarCoord)){
               cc.log("寻路完成");
               self.ConstructShortPath(curStep);
                cc.log(curStep);
               cc.log(self.m_shortestPaths);
               break;
            }
            
            var pointVec = new Array();
            self.walkableForTileCoord(curStep.position, pointVec);
            for(let i = 0; i < pointVec.length; i++){
                var st = new ShortestPathStep();
                st.initWithPosition(pointVec[i]);
                
                if(self.ContainObject(self.closeArray, st)){
                    continue;
                }
                
                var moveCost = self.costToMoveFromStep(curStep, st);
                var index = self.indexOfObject(self.openArray, st);
                
                if(index === false ){
                    st.parent = curStep;
                    st.gScore = st.gScore + moveCost;
                    st.hScore = self.computeHScoreFromCoord(st.position, toAStarCoord)*10;
                    self.InsertInOpenArray(st);
                }
                else{
                    st = self.openArray[index];
                    if((curStep.gScore + moveCost) < st.gScore){
                        st.gScore = curStep.gScore + moveCost;
                        self.openArray.splice(index, 0);
                        self.InsertInOpenArray(st);
                    }
                }
            }
            
        }while(self.openArray.length > 0)
        self.EndAStar();    
    },
    
    //插入open列表,并且小到大排序
    InsertInOpenArray : function(step){
       var stepFScore = step.getFScore();
       var count = this.openArray.length;
       if(count === 0){
           this.openArray.push(step);
       }
       var i = 0;
       for(; i<count ; i++){
           if(stepFScore <= this.openArray[i].getFScore()){
               this.openArray.splice(i, 0, step);
               break;
           }
       }
      cc.log(this.openArray);
    },
    
    //通过坐标点返回 地图方块坐标
    AStarCoordForPosition : function(point){
        return cc.p(Math.floor(point.x/this.m_nBlockSize), Math.floor(point.y/this.m_nBlockSize));
    },
    
    //判断是否为有效坐标（障碍物为无效）
    IsValidPos : function(point){
        for(let i=0; i<this.m_AstarCoordInfo.length; i++){
            if(cc.pSameAs(this.m_AstarCoordInfo[i].point, point)){
                cc.log('nType' + this.m_AstarCoordInfo[i].nType)
                return this.m_AstarCoordInfo[i].nType === 0;
            }
        }
    },
    
    //结束寻路后
    EndAStar : function(){
      this.openArray.length = 0;  
      this.closeArray.length = 0;
    },
    
    //获取移动所消耗的行动值(平移10，对角线14)
    costToMoveFromStep : function(fromStep, toStep){
        return ((fromStep.position.x != toStep.position.x) && (fromStep.position.y != toStep.position.y)) ? 14 : 10;
    },
    
    //实现上下左右、对角线的移动(相对瓦片)
    walkableForTileCoord : function(point, tmp){
      var t = false; 
      var l = false; 
      var b = false; 
      var r = false;  
      
      //Top
      var p = cc.p(point.x, point.y - 1);
      if(this.IsValidPos(p)){
          tmp.push(p);
          t = true;
      }
      //Left
      p = cc.p(point.x - 1, point.y);
      if(this.IsValidPos(p)){
          tmp.push(p);
          l = true;
      }
      //Buttom
      p = cc.p(point.x, point.y + 1);
      if(this.IsValidPos(p)){
          tmp.push(p);
          b = true;
      }
      //Right
      p = cc.p(point.x + 1, point.y);
      if(this.IsValidPos(p)){
          tmp.push(p);
          r = true;
      }
      cc.log("tmp"+tmp);
    },
    
    //获取A*算法中的 到目的地的估算消耗
    computeHScoreFromCoord : function(fromCoord, toCoor){
        return Math.abs(toCoor.x - fromCoord.x) + Math.abs(toCoor.y - fromCoord.y);
    },
    
    //检查ShortestPathStep是否存在数组里，存在则返回位置，不存在返回false；
    indexOfObject : function(array, st){
      if(array.length == 0){
          return false;
      }  
      for(let i = 0; i < array.length; i++){
          if(array[i].isEqual(st)){
              return i;
          }
      }
      return false;
    },
    
    //检查array里面是否包含ShortestPathStep类型指定对象，存在返回true，否则返回false
    ContainObject : function(array, st){
         if(array.length == 0){
          return false;
      }  
      for(let i = 0; i < array.length; i++){
          if(array[i].isEqual(st)){
              return true;
          }
      }
      return false;
    },
    
    //获取最短路径
    ConstructShortPath : function(step){
      do{
          if(step.parent !== null){
              this.m_shortestPaths.splice(0, 0, step);
          }
          step = step.parent;
      }while(step != null)
    },
    
    //瓦片地图初始化到内存
    InitAStarCoordWith : function(tiledmap){
        var layer = tiledmap.getLayer('block');
        var AStarWidth = tiledmap.getMapSize().width;
        var AStarHeight = tiledmap.getMapSize().height;
        var self = this;
        
        for(let w = 0; w < AStarWidth; w++){
             for(let h = 0; h < AStarHeight; h++){
                 var coordInfo = new Astar_Coord_Info();
                 coordInfo.point = cc.p(w, h);
                 coordInfo.pointOrg = cc.p(self.m_nBlockSize / 2 + w * self.m_nBlockSize, self.m_nBlockSize / 2 + self.m_nBlockSize * h);
                 var tileGid = layer.getTileGIDAt(cc.p(w, AStarHeight - 1 - h));
                 //判断这个图层中存在该瓦片
                 if(tileGid > 0){
                     var prop = tiledmap.getPropertiesForGID(tileGid);
                     cc.log(prop.block);  //输出地图块属性
                     if(prop.block === true){
                         coordInfo.nType = 1;
                     }
                 }
                 else{
                      coordInfo.nType = 0;
                 }
                 this.m_AstarCoordInfo.push(coordInfo);
             }
        }
        cc.log(this.m_AstarCoordInfo);
    },
    
    //自定义地图初始化
    InitAStarCoord : function(){
        var size = cc.director.getWinSize();
        var self = this;
        var AStarWidth = size.width/self.m_nBlockSize ;
        var AStarHeight = size.height/self.m_nBlockSize;
        for (let w=-1; w <AStarWidth; w++)
        {
             for (let h=-1; h<AStarHeight; h++)
            {
                var coordInfo = new Astar_Coord_Info();
                coordInfo.point =  cc.p(w,h);
                coordInfo.pointOrg =  cc.p(self.m_nBlockSize/2 + w*self.m_nBlockSize, self.m_nBlockSize/2 + self.m_nBlockSize*h);
                
                if (w == -1 || h==-1 || w == AStarWidth-1 || h == AStarHeight-1)
                {
                    coordInfo.nType = 1;
                }
                else if ((w>3 && w <= 8) && h == 4)
                {
                    coordInfo.nType = 1;
                }
                else if ((w>3 && w <= 6) && h == 2)
                {
                    coordInfo.nType = 1;
                }
                else if ((h>4 && h <= 8) && w == 8)
                {
                    coordInfo.nType = 1;
                }else
                {
                    coordInfo.nType = 0;
                }
            
                self.m_AstarCoordInfo.push(coordInfo);
        }
    }
        
    }
});
module.exports = Astar;