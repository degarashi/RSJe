//! ------------------- WebGL初期化関数群 ------------------- 

function TestObj() {
 	var verts = [
          -1, -1, 1,
 		 0, -1, -1,
 		 1, -1, 1,
 		 0, 1, 0
 	];

 	var indices = [
 		2,1,0,
 		1,3,0,
 		2,3,1,
 		0,3,2
 	];

 	var colors = [
 		1,1,1,1,
 		1,0,0,1,
 		0,0,1,1,
 		0,1,0,1
 	];	
	this.model = new RSJ.CModel(indices,
			{
				name: "vs_iPos",
				type: gl.FLOAT,
				stride: 3,
				data: verts
			},
			{
				name: "vs_vColor",
				type: gl.FLOAT,
				stride: 4,
				data: colors
			}
		);
	
	this.angle = 0;
	this.angle2 = 0;
}
TestObj.prototype = {
	draw: function(pgID, mstk) {
		// モデルの回転行列をセット
		mstk.mark();
		mstk.push(Mat44F.Rotate([0,1,0], TM.Deg2rad(this.angle)));
		mstk.push(Mat44F.Rotate([1,0,0], TM.Deg2rad(this.angle2)));
		rsj.setWorldMat(mstk.top());
		mstk.pop();

		this.model.draw(pgID, mstk);
	},
	update: function(dt) {
		// モデルを回転させる
		this.angle += dt*100;
		this.angle2 += dt*5;
	}
};

//! テスト用のオブジェクトを定義して追加
function AddTestObject() {
	var obj = new TestObj();
	rsj.addObj(obj);
}

function WebGLStart() {
	try {
		RSJ.Initialize();
		AddTestObject();
		// 更新間隔とか経過時間が適当だけど今は無視
		setInterval(function() {
			rsj.update(0.016);
			rsj.draw();
		}, 16);
	} catch(e) {
		alert(e);
		var canvas = document.getElementById("my-canvas");
		var ctx = canvas.getContext("2d");
		if(ctx) {
			var ox = 20,
				oy = 20;
			// Canvas 2Dはサポートしている
			var txt = "could not initialize WebGL... (2D is ok)";
			ctx.font = "italic bold 17px 'Arial'";
			var tm = ctx.measureText(txt);
			ctx.fillText(txt, ox, oy);
			if(typeof e === "string") {
				ctx.font = "14px 'Arial'";
				ctx.fillText(e, ox, oy*2);
			}

			ctx.beginPath();
				ctx.moveTo(ox, oy+2);
				ctx.lineTo(ox+tm.width, oy+2);
			ctx.closePath();
			ctx.stroke();
		} else {
			// 2Dもサポートしていない
		}
	}
}
