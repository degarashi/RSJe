var _Engine_singleton = false;
function RSJE() {
	// 唯一性を保証
	if(_Engine_singleton)
		throw "dullication of singleton";
	_Engine_singleton = true;

	var self = this;
	//! CanvasからWebGLインスタンスを取り出す
	function _InitGL() {
		try {
			var canvas = document.getElementById("my-canvas");
			self.gl = canvas.getContext("experimental-webgl");
			self.width = canvas.width;
			self.height = canvas.height;
		} catch(e) {
			throw "Could not initialize WebGL";
		}
	}
	//! シェーダーを読み込んでコンパイル
	function _CreateShader(id) {
		var gl = self.gl;
		
		var scrElem = document.getElementById(id);
		if(!scrElem)
			throw "id=\"" + id + "\" not found";

		var shID;
		switch(scrElem.type) {
			case "x-shader/x-vertex":
				shID = gl.createShader(gl.VERTEX_SHADER);
				break;
			case "x-shader/x-fragment":
				shID = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			default:
				throw "unknown element type";
		}

		gl.shaderSource(shID, scrElem.text);
		gl.compileShader(shID);
		if(gl.getShaderParameter(shID, gl.COMPILE_STATUS))
			return shID;
		throw gl.getShaderInfoLog(shID);
	}
	//! デフォルトシェーダー(Vertex & Fragment)を読み込んでリンク
	function _InitShaders() {
		var gl = self.gl;
		// プログラムオブジェクト作成
		var pgID = gl.createProgram();
		// 各シェーダーを初期化
		var vsID = _CreateShader("vs");
		var fsID = _CreateShader("fs");

		gl.attachShader(pgID, vsID);
		gl.attachShader(pgID, fsID);
		gl.linkProgram(pgID);
		if(gl.getProgramParameter(pgID, gl.LINK_STATUS)) {
			gl.useProgram(pgID);
			
			self.pgID = pgID;
			self.vsID = vsID;
			self.fsID = fsID;
			return;
		}
		throw gl.getProgramInfoLog(pgID);	
	}
	_InitGL();
	_InitShaders();
	
	// GLの基本的な設定
	gl = this.gl;
	gl.clearColor(0,0,0,1);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);	
	gl.disable(gl.CULL_FACE);

	// シェーダー変数IDをキャッシュ
	var c_param = {
		mTranslate: "uniformMatrix4fv"
	};
	this.param = {};
	for(var name in c_param) {
		var func = gl[c_param[name]];
		this.param[name] = [func, gl.getUniformLocation(this.pgID, name)];
	}
	
	// 組み込み行列スタック
	this.mstack = new Mat44Stack();
	this.mstack.push(Mat44F.PerspectiveFov(TM.Deg2rad(45), this.width/this.height, 0.3, 20));
	this.mstack.push(Mat44F.LookAt(new Vec3(0,0,4.5), new Vec3(0,0,0), new Vec3(0,1,0)));
	
	// (とりあえず) オブジェクトは配列で管理
	this.objects = [];
}

RSJE.prototype = {
	//! オブジェクトを追加
	addObj: function(obj) {
		this.objects.push(obj);
	},
	//! オブジェクトを取り除く
	remObj: function(obj) {
		var ol = this.objects;
		for(var i=0 ; i<ol.length ; i++) {
			if(ol[i] === obj) {
				ol.erase(i);
				break;
			}
		}
	},
	//! アップデート処理
	update: function(dt) {
		var ol = this.objects;
		for(var i=0 ; i<ol.length ; i++)
			ol[i].update(dt);
	},
	//! 描画処理
	draw: function() {
		this.refreshSize();

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		for(var i=0 ; i<this.objects.length ; i++)
			this.objects[i].draw(this.pgID, this.mstack);
		
		gl.flush();
	},
	//! モデル行列を設定
	setWorldMat: function(m) {
		// 行列設定
		var ent = this.param.mTranslate;
		var mat = this.mstack.top();
		ent[0].call(gl, ent[1], false, mat.value);		
	},
	//! WebGLへCanvasサイズを再設定
	refreshSize: function() {
		this.gl.viewport(0, 0, this.width, this.height);
	}
};

var rsj;
function InitRSJ() {
	rsj = new RSJE();
}
