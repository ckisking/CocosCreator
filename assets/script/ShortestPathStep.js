var ShortestPathStep = cc.Class({
    name: 'ShortestPathStep',
    ctor () {
        this.position = cc.p(0,0);
        this.gScore = 0;
        this.hScore = 0;
        this.parent = null;
    },
    
    initWithPosition : function(pos){
         this.position = pos;
         return true;
    },
    
    getFScore :　function(){
        return this.gScore + this.hScore;
    },
    
    isEqual : function(other){
        return cc.pSameAs(this.position, other.position);
    },
    
    getDescription : function(){
        cc.log( this.position + ',' + this.gScore + ',' + this.hScore + ',' + this.getFScore() );
    },
});

module.exports = ShortestPathStep;