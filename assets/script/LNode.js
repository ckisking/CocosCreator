/**
 * A*寻路算法中每个地图节点
 */

function LNode(_x, _y, _v){
	var self = this;
	self.x = _x;
	self.y = _y;
	self.value = _v?_v:0;
	self.isChecked = false;
	self.value_g = 0;
	self.value_h = 0;
	self.value_f = 0;
	self.nodeparent = null;
	self.index = 0;
	self.open = false;

}
LNode.prototype = {
	init:function(){
		var self = this;
		self.open = false;
		self.isChecked = false;
		self.value_g = 0;
		self.value_h = 0;
		self.value_f = 0;
		self.nodeparent = null;
		self.index = -1;
	}
};
module.exports = LNode;