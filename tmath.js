
//! RSJクラス・関数群
var RSJ = {
	CreateVBO: function (dat, type, stride) {
		var ret = RSJ.CreateVI(gl.ARRAY_BUFFER, new Float32Array(dat), type);
		ret.stride = stride;
		return ret;
	},
	CreateIBO: function (dat, type) {
		return RSJ.CreateVI(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(dat), type);
	},
	CreateVI: function (flag, dat, type) {
		var bo = gl.createBuffer();
		gl.bindBuffer(flag, bo);
		gl.bufferData(flag, dat, gl.STATIC_DRAW);
		gl.bindBuffer(flag, null);
		bo.type = type;
		bo.length = dat.length;
		return bo;
	},
	Initialize: InitRSJ,
	CModel: _CModel,
	CPose3D: _CPose3D
};

//! 数学関連のクラス
var TM = {
	EQUAL_THRESHOLD: 1e-5,
	IsEqualNum: function(f0, f1) {
		return math.abs(f0-f1) <= TM.EQUAL_THRESHOLD;
	},
	Deg2rad: function(deg) {
		return (deg/180) * Math.PI;
	},
	Rad2deg: function(rad) {
		return rad/Math.PI * 180;
	},
	Square: function(v) {
		return v*v;
	}
};
