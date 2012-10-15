//! クォータニオンクラス
function Quat() {
	var value = [];
	for(var i=0 ; i<4 ; i++)
		value[i] = arguments[i];
	this.value = value;
}
Quat.prototype = {
	Identity: function() {
		return new Quat(0,0,0,1);
	},
	clone: function() {
		var v = this.value;
		return new Quat(v[0], v[1], v[2], v[3]);
	}
};
var QuatF = new Quat();

//! 3次元ベクトルクラス
function Vec3() {
	for(var i=0 ; i<3 ; i++)
		this[i] = arguments[i];
}
Vec3.prototype = {
	Identity: function() {
		return new Vec3(0,0,0);
	},
	saturate: function(vmin, vmax) {
		for(var i=0 ; i<3; i++) {
			var val = this[i];
			if(val >= vmax)
				this[i] = vmax;
			else if(val <= vmin)
				this[i] = vmin;
		}
	},
	equal: function(v) {
		for(var i=0 ; i<3 ; i++) {
			if(!TM.isEqualNum(this[0], v[0]))
				return false;
		}
		return true;
	},
	lerp: function(v, t) {
		for(var i=0 ; i<3 ; i++)
			this[i] = (v[i]-this[i])*t + this[i];
	},
	add: function(v) {
		for(var i=0 ; i<3 ; i++)
			this[0] += v[0];
	},
	addition: function(v) {
 		return new Vec3(this[0] + v[0],
						this[1] + v[1],
						this[2] + v[2]);
	},
	sub: function(v) {
		for(var i=0 ; i<3 ; i++)
			this[0] -= v[0];
	},
	substract: function(v) {
 		return new Vec3(this[0] - v[0],
						this[1] - v[1],
						this[2] - v[2]);
	},
	mul: function(s) {
		for(var i=0 ; i<3 ; i++)
			this[i] *= s;
	},
	multiply: function(s) {
		return new Vec3(this[0] * s,
						this[1] * s,
						this[2] * s);
	},
	
	div: function(s) {
		s = 1/s;
		for(var i=0 ; i<3 ; i++)
			this[i] *= s;
	},
	division: function(s) {
		return this.multiply(1/s);
	},
	
	dot: function(v) {
		return this[0]*v[0] +
				this[1]*v[1] +
				this[2]*v[2];
	},
	cross: function(v) {
		var x=this[0],
			y=this[1],
			z=this[2];
		var vx=v[0],
			vy=v[1],
			vz=v[2];
		return new Vec3(y*vz - z*vy,
						   z*vx - x*vz,
							x*vy - y*vx);
	},
	len_sq: function() {
		return this.dot(this);
	},
	length: function() {
		return Math.sqrt(this.len_sq());
	},
	normalize: function() {
		var len = 1.0 / this.length();
		for(var i=0 ; i<3 ; i++)
			this[i] *= len;
	},
	normalization: function() {
		var len = 1.0 / this.length();
		return new Vec3(this[0]*len,
						this[1]*len,
						this[2]*len);
	},
	reverse: function() {
		for(var i=0 ; i<3 ; i++)
			this[i] *= -1;
	},
	minus: function() {
		return new Vec3(-this[0], -this[1], -this[2]);
	},
	clone: function() {
		return new Vec3(this[0], this[1], this[2]);
	},
	toString: function() {
		return "Vector3: x=" + this[0] + ", y=" + this[1] + ", z=" + this[2];
	}
};

var Vec3_zero = new Vec3(0,0,0),
	Vec3_one = new Vec3(1,1,1),
	Vec3_x = new Vec3(1,0,0),
	Vec3_y = new Vec3(0,1,0),
	Vec3_z = new Vec3(0,0,1);
var Vec3F = new Vec3();
