//! ------------------- 行列関連クラス定義 ------------------- 

//! 列優先4x4行列
function Mat44() {
	var value = [];
	this.value = value;
	for(var i=0 ; i<16 ; i++)
		value[i] = arguments[i];
	
	this.__proto__ = Mat44.prototype;
	return this;
}
Mat44.prototype = {
	//! 行優先
	FromRow: function() {
		var arg = [];
		for(var i=0 ; i<4 ; i++)
			for(var j=0 ; j<4 ; j++)
				arg[i*4+j] = arguments[j*4+i];
		var ret = {};
		return Mat44.apply(ret, arg);
	},
	FromVec3s: function(v0, v1, v2) {
		return new Mat44(v0[0], v1[0], v2[0], 0,
						v0[1], v1[1], v2[1], 0,
						v0[2], v1[2], v2[2], 0,
						0,0,0,1);
	},
	FromVec4s: function(v0, v1, v2, v3) {
		return new Mat44(v0[0], v1[0], v2[0], v3[0],
						 v0[1], v1[1], v2[1], v3[1],
						v0[2], v1[2], v2[2], v3[2],
						v0[3], v1[3], v2[3], v3[3]);
	},
	LookAt: function(pos, at, up) {
		var dir = at.substract(pos);
		dir.normalize();
		var rdir = dir.cross(up);
		rdir.normalize();
		up = rdir.cross(dir);
		dir.reverse();
		return Mat44F.FromRow(rdir[0], rdir[1], rdir[2], -rdir.dot(pos),
								up[0], up[1], up[2], -up.dot(pos),
								dir[0], dir[1], dir[2], -dir.dot(pos),
								0,0,0,1);
	},
	Scale: function(x,y,z) {
		return new Mat44(x,0,0,0,
						0,y,0,0,
						0,0,z,0,
						0,0,0,1);
	},
	PerspectiveFov: function(fov, aspect, znear, zfar) {
		var h = 1 / Math.tan(fov/2);
		var w = h / aspect;
		return new Mat44(w, 0, 0, 0,
						0, h, 0, 0,
						0, 0, zfar/(znear-zfar), -1,
						0, 0, znear*zfar/(znear-zfar), 0);
	},
	Translate: function(x,y,z) {
		return new Mat44(1,0,0,0,
						0,1,0,0,
						0,0,1,0,
						x,y,z,1);
	},
	Rotate: function(axis, angle) {
		var C = Math.cos(angle),
			S = Math.sin(angle),
			RC = 1-C;
		var axis0 = axis[0],
			axis1 = axis[1],
			axis2 = axis[2];
		return Mat44F.FromRow(C+TM.Square(axis0)*RC,		axis0*axis1*RC-axis2*S,		axis0*axis2*RC+axis1*S,	0,
								axis0*axis1*RC+axis2*S,	C+TM.Square(axis1)*RC,		axis1*axis2*RC-axis0*S,	0,
								axis0*axis2*RC-axis1*S,	axis1*axis2*RC+axis0*S,		C+TM.Square(axis2)*RC,	0,
								0, 0, 0, 1);
	},
	
	Identity: function() {
		return new Mat44(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
	},
	Iterate: function(f) {
		for(var i=0 ; i<4 ; i++) {
			for(var j=0 ; j<4 ; j++)
				f(j,i);
		}
	},
	get: function(n,m) {
		return this.value[m*4 + n];
	},
	set: function(n,m, val) {
		return this.value[m*4 + n] = val;
	},
	transpose: function() {
		for(var i=0 ; i<4 ; i++) {
			for(var j=i ; j<4 ; j++) {
				var tmp = this.get(i,j);
				this.set(i,j, this.get(j,i));
				this.set(j,i, tmp);
			}
		}
	},
	transform3: function(v) {
		var ret = new Vec3(this.get(0,3), this.get(1,3), this[2][3]);
		for(var i=0 ; i<3 ; i++) {
			for(var j=0 ; j<3 ; j++)
 				ret[i] += this.get(i,j) * v[j];
		}
		return ret;
	},
	//! 引数の行列をコピー
	copy: function(m) {
		for(var i=0 ; i<16 ; i++)
			this.value[i] = m.value[i];
	},
	clone: function() {
		var ret = new Mat44();
		ret.copy(this);
		return ret;
	},
	multiply: function(m) {
		var ret = new Mat44();
		var self = this;
		this.Iterate(function(i,j) {
			var sum = 0;
			for(var k=0 ; k<4 ; k++)
				sum += self.get(i,k) * m.get(k,j);
			ret.set(i,j, sum);
		});
		return ret;
	},
	//! This *= m
	mul: function(m) {
		var tmp = this.multiply(m);
		this.copy(tmp);
	},
	toString: function() {
		var str = "Mat44:\n"
		for(var i=0 ; i<4 ; i++) {
			for(var j=0 ; j<4 ; j++) {
				str += this.get(i,j);
				if(j != 3)
					str += ", ";
			}
			if(i != 3)
				str += "\n";
		}
		return str;
	}
};
Mat44F = new Mat44();

//! 4x4行列スタック
function Mat44Stack() {
	this._stack = [Mat44F.Identity()];
}
Mat44Stack.prototype = {
	//! 次にpopした時用にスタック先頭を複製して積む
	mark: function() {
		var stk = this._stack
		stk.push(stk[stk.length-1].clone());
	},
	//! スタック先頭の行列への積算 (スタックには積まない)
	push: function(m) {
		var stk = this._stack;
		stk[stk.length-1] = stk[stk.length-1].multiply(m);
	},
	//! スタックから行列を1つ取り除く
	pop: function() {
		var stk = this._stack;
		if(stk.length == 0) {
			alert("can't pop matrix from stack");
			return null;
		} else
			return stk.pop();
	},
	size: function() {
		return this._stack.length;
	},
	top: function() {
		var stk = this._stack;
		return stk[stk.length-1];
	}
};
