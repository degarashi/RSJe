//! ------------------- WebGL初期化関数群 ------------------- 

//! モデル管理
function _CModel(idata) {
	// モデルジオメトリの初期化
	this.vbo = {};
	for(var i=1 ; i<arguments.length ; i++) {
		var arg = arguments[i];		
		this.vbo[arg.name] = RSJ.CreateVBO(arg.data, arg.type, arg.stride);
	}
	this.ibo = RSJ.CreateIBO(idata, gl.UNSIGNED_SHORT);
	
	// 座標など
	this.pos = new Vec3(0,0,0);
	this.rot = new Quat(0,0,0,1);
	
	// throw "invalid arguments";
}
_CModel.prototype = {
	setPos: function(pos) {
		this.pos = pos;
	},
	draw: function(pgID, mstk) {
		for(var idx in this.vbo) {
			var vb = this.vbo[idx];
			gl.bindBuffer(gl.ARRAY_BUFFER, vb);
			var attID = gl.getAttribLocation(pgID, idx);
			gl.enableVertexAttribArray(attID);
			gl.vertexAttribPointer(attID, vb.stride, vb.type, false, 0, 0);
		}
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
		gl.drawElements(gl.TRIANGLES, this.ibo.length, this.ibo.type, null);
	}
};

//! 3D姿勢
function _CPose3D(pos, rot, scale) {
	function _init(data, GCls, x,y,z,w) {
		if(data) {
			if(typeof(data) != "Object")
				throw "invalid arguments";
			return data.clone();
		}
		return new GCls(x,y,z,w);
	}

	this.pos = _init(pos, Vec3, 0,0,0);
	this.rot = _init(pos, Quat, 0,0,0,1);
	this.scale = _init(pos, Vec3, 1,1,1);
}

_CPose3D.prototype = {
	clone: function() {
		return new CPose3D(this.pos, this.rot, this.scale);
	}
};
