// =============================================================================
// ABMZ_BattleComa.js
// Version: 0.08
// -----------------------------------------------------------------------------
// Copyright (c) 2025 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @plugindesc v0.08 アクターのカットインを表示するようにします。
 * @author ヱビ
 * @target MZ
 *
 * @param AttackPictureNumber
 * @type number
 * @desc 攻撃しているキャラクターに使われるピクチャの番号です。
 * @default 21
 *
 * @param CommandPictureNumber
 * @type number
 * @desc 防御しているキャラクターに使われるピクチャの番号です。
 * @default 22
 * 
 * @param ComaY
 * @type number
 * @desc コマが表示されるＹ軸です。
 * @default 287
 * 
 * @param ComaY2
 * @type number
 * @desc コマ2が表示されるＹ軸です。（Attackなど、Command以外）
 * @default 300
 * 
 * @param ComaX
 * @type number
 * @desc コマが表示されるX軸です。（Command）
 * @default 770
 * 
 * 
 * @param ComaX2
 * @type number
 * @desc コマが表示されるX軸です。（Attackなど、Command以外）
 * @default 770
 * 
 * @help
 * ============================================================================
 * 注意点
 * ============================================================================
 * 
 * 
 * Trb様のmaskedBltプラグインを参考にしました。
 * 配布サイト：
 * ピクチャのマスク化（親子関係） - ツクマテ
 * https://tm.lucky-duet.com/viewtopic.php?t=2771
 * 
 * バトルコマのファイルをimg/picturesのフォルダに入れてください。
 * 
 * キャラクターにつけるタグ：
 * <BCComaName:キャラ名>
 *
 * img/picturesには、
 * 
 * Coma.pngのほか、
 * 
 * BCキャラ名Attack.png
 * BCキャラ名Magic.png
 * BCキャラ名Damage.png
 * 
 * を用意してください
 * 
 * プラグインコマンド
 * ShowEnemyComa ピクチャ番号 エネミーの画像の名前 (スケール 色相 原点 X Y)
 * 
 * 原点は0で左上、1で真ん中です。
 * エネミーコマを表示します。エネミー画像はimg/enemiesフォルダに入っている必要が
 * あり、アクターとは違い、エネミー画像は
 * 
 * Ｘ，Ｙ，原点は指定しなければエネミーのデフォルトの位置に表示されます。
 * 
 * X,Yはv[1]と言う形にすると、変数の内容を見ます。
 * 
 * 例：
 * ShowEnemyComa 3 Slime
 * デフォルトの位置にSlime.pngのコマを表示
 * 
 * ShowEnemyComa 3 Slime 2 0 0 350 100
 * 色相0、原点左上、X350、Y100、サイズ2倍の位置に
 * Slime.pngのコマを表示
 *
 * 名前のところにはスペースが入っていても平気です。（今のところは）
 * 
 * （1.00以降、機能停止中。コマの中ではなくピクチャで表示でいいかと思った。）
 * 
 * 武器のメモ：
 * <BCWeapon:Lance>
 * 
 * 
 * ============================================================================
 * 更新履歴
 * ============================================================================
 * 
 * Version 0.08
 *   作成途中。武器画像などを読み込む準備
 * 
 * Version 0.07
 *   作成途中。武器画像などを読み込む準備
 * 
 * Version 2.00
 *   画像サイズを75%に変更。エネミーコマ削除
 * 
 * Version 1.00
 *   公開
 * Version 0.05
 *   アニメーションとダメージポップアップをピクチャよりも正面に移動し、
 *   アニメーションの再生位置をピクチャの位置に。
 * 
 * Version 0.04
 *   味方が回避する時のズレを修正。
 * 
 * Version 0.03
 *   バトルシーン以外での競合回避
 * 
 * Version 0.02
 *   エネミーの色相に対応。
 * 
 * Version 0.01
 *   
 * 
 * ============================================================================
 * 利用規約
 * ============================================================================
 * 
 * ・クレジット表記は不要
 * ・営利目的で使用可
 * ・改変可
 *     ただし、ソースコードのヘッダのライセンス表示は残してください。
 * ・素材だけの再配布も可
 * ・アダルトゲーム、残酷なゲームでの使用も可
 * 
 * 
 * 
 * @command ShowActorComa
 * @text アクターの漫画コマ表示
 * @desc アクターの漫画コマをピクチャで表示します。
 * 
 * @arg picId
 * @text ピクチャ番号
 * @desc アクターのコマを表示するピクチャのＩＤです。
 * @type number
 * @decimals 0
 * @min 1
 * @max 100
 * @default 4
 * 
 * @arg actorId
 * @text アクターのID
 * @desc 表示するアクターのIDです。
 * @type actor
 * 
 * 
 * @arg motion
 * @text モーション
 * @desc 左端を0とし、何フレーム目かを、セットしてください。
 * 0:Command, 1:Attack, 2:Magic, 3:Guard
 * @type number
 * @default 0
 * 
 * 
 * @arg x
 * @text X座標
 * @desc X座標の位置です。
 * @type number
 * @decimals 0
 * @default 770
 * 
 * 
 * @arg y
 * @text Y座標
 * @desc Y座標の位置です。
 * @type number
 * @decimals 0
 * @default 287
 * 
 */

(function() {

	var parameters = PluginManager.parameters('ABMZ_BattleComa');
	var AttackPictureNumber = Number(parameters['AttackPictureNumber']);
	var CommandPictureNumber = Number(parameters['CommandPictureNumber']);
	var ComaY = Number(parameters['ComaY']);
	var ComaY2 = Number(parameters['ComaY2']);
	var ComaX = Number(parameters['ComaX']);
	var ComaX2 = Number(parameters['ComaX2']);

	// Ver 1.1
	const comaScale = 100;
	

//=============================================================================
// PluginManager
//=============================================================================


    const pluginName = "ABMZ_BattleComa";
	
PluginManager.registerCommand(pluginName, "ShowActorComa", args => {
	const actor = $gameActors.actor(args.actorId);
	if (!actor) return;
	const motion = args.motion;
	const x = args.x;
	const y = args.y;
	
	$gameScreen.showBCPicture(actor, motion, x, y);

});
//=============================================================================
// Game_Troop
//=============================================================================

var _Game_Troop_prototype_setup = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function(troopId) {
	_Game_Troop_prototype_setup.call(this, troopId);
	ImageManager.loadPicture('Coma');
};


//=============================================================================
// Game_Actor
//=============================================================================

/*
	Game_Actor.prototype.setStatusPanel = function(panel) {
		this._statusPanel = panel;
	};
*/


	Game_Actor.prototype.getComaWeaponName = function() {
		let comaWeapon = this.weapons()[0].meta.ComaWeapon;
		if (comaWeapon && comaWeapon != "") return comaWeapon;
		return "";
	};

Game_Actor.prototype.comaNumberString = function() {
	var vId = 0;
	switch (this.name()) {
	case "ルーク": vId = 72; break;
	case "ダイアナ": vId = 29; break;
	//case "エイゼル": vId = 74; break;
	default: return "";
	}
	//if (!$gameSwitches.value(vId)) return "2";
	if (this.name() == "ルーク" && this.isStateAffected(73)) return "3";
	// スイッチ29番はダイアナ変装。ONのとき、王国兵士姿になる。
	if (this.name() == "ダイアナ" && $gameSwitches.value(29)) return "2";
	
	return "";
};


var _Window_ActorCommand_prototype_setup = Window_ActorCommand.prototype.setup;

Window_ActorCommand.prototype.setup = function(actor) {
		_Window_ActorCommand_prototype_setup.call(this, actor);
		if (!this._actor) return;
		$gameScreen.showBCPicture(actor, 0);
};

	var _Scene_Battle_prototype_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
	Scene_Battle.prototype.endCommandSelection = function(){
		_Scene_Battle_prototype_endCommandSelection.call(this);
		$gameScreen.hideActorBattleComaCommand();
	};


	var _Game_Actor_prototype_performActionStart
		 = Game_Actor.prototype.performActionStart;
	Game_Actor.prototype.performActionStart = function(action) {
		const actor = this;
		const BCComaName = this.actor().meta["BCComaName"];
		const string = this.comaNumberString();
		if (BCComaName && action) {
/*			if (ActorRight) {
				var picId = CommandPictureNumber;
				var x = 770;
			} else {
				var picId = AttackPictureNumber;
				var x = -50;
			}
*/			if (action.isAttack()) {
				$gameScreen.showBCPicture(actor, 1);
			} else if (action.isMagicSkill()) {
				$gameScreen.showBCPicture(actor, 2);
			} else if (action.isSkill()) {
				$gameScreen.showBCPicture(actor, 1);
			} else {
				$gameScreen.showBCPicture(actor, 1);
			}
		}
		_Game_Actor_prototype_performActionStart.call(this, action);
	};

//=============================================================================
// Game_Screen
//=============================================================================


	Game_Screen.prototype.hideActorBattleComaCommand = function() {
		this.commandActor = null;
		this.erasePicture(CommandPictureNumber);
	}

	Game_Screen.prototype.hideActorBattleComaAction = function() {
		if (this.actionActor && this.commandActor
			 && this.actionActor.name() == this.commandActor.name()) {
			this.actionActor = null;
		// frameX... 0:Command, 1:Attack, 2:Magic, 3:Guard
		//	this.showBCPicture(this.commandActor, 0);
		}
		this.erasePicture(AttackPictureNumber);
		this.erasePicture(CommandPictureNumber);
	}

	Game_Screen.prototype.getBCPicId = function (frameX) {
		if (frameX == 0) {// frameX... 0:Command, 1:Attack, 2:Magic, 3:Guard
			return CommandPictureNumber;
		} 
		return AttackPictureNumber;
	}
	Game_Screen.prototype.getBCX = function (frameX) {
		if (frameX == 0) {// 0:Command, 1:Attack, 2:Magic, 3:Guard
			return ComaX2;
		}
		return ComaX;
	}
	Game_Screen.prototype.getBCY = function (frameX) {
		if (frameX == 0) {// 0:Command, 1:Attack, 2:Magic, 3:Guard
			return ComaY2;
		}
		return ComaY;
	}

	Game_Screen.prototype.showBCPicture = function(actor, frameX, x, y) {
		// BC_1_4など、BC_アクターID_frameXの形にする
		const picId = this.getBCPicId(frameX);
		if (!x) x = this.getBCX(frameX);
		if (!y) y = this.getBCY(frameX);
		const origin = new Point();
		const scaleX = 100;
		const scaleY = 100;
		const opacity = 255;
		const blendMode = PIXI.BLEND_MODES.NORMAL;
		this.showPicture(picId,("BC_" +  actor.actorId() + "_" + frameX), origin, 
			 x, y, scaleX,scaleY, opacity, blendMode);
		const tone = $gameScreen.tone();
		this.tintPicture(picId, tone, 0);
	}

//=============================================================================
// BattleManager
//=============================================================================

	var _BattleManager_getNextSubject = BattleManager.getNextSubject;


	BattleManager.getNextSubject = function() {
		$gameScreen.hideActorBattleComaAction();
		return _BattleManager_getNextSubject.call(this);
	};

	var _BattleManager_processVictory = BattleManager.processVictory;
	BattleManager.processVictory = function() {
		_BattleManager_processVictory.call(this);
		$gameScreen.hideActorBattleComaAction();
		$gameScreen.hideActorBattleComaCommand();
		
	};

Game_Battler.prototype.performActionEnd = function() {
    this.setActionState('done');
};


// ==============================
// YEP_X_VisualHpGauge.jsここまで
// ==============================

//=============================================================================
// Game_Actor 
//=============================================================================

	var _Game_Actor_prototype_performDamage = Game_Actor.prototype.performDamage;
	Game_Actor.prototype.performDamage = function(action) {
		_Game_Actor_prototype_performDamage.call(this, action);
		// frameX... 0:Command, 1:Attack, 2:Magic, 3:Guard
		$gameScreen.showBCPicture(this, 3);
		
	};
	var _Game_Actor_prototype_performMiss = Game_Actor.prototype.performMiss;
	Game_Actor.prototype.performMiss = function() {
		_Game_Actor_prototype_performMiss.call(this);
		// frameX... 0:Command, 1:Attack, 2:Magic, 3:Guard
		$gameScreen.showBCPicture(this, 1);
	};
	var _Game_Actor_prototype_performEvasion = Game_Actor.prototype.performEvasion;
	Game_Actor.prototype.performEvasion = function() {
		_Game_Actor_prototype_performEvasion.call(this);
		// frameX... 0:Command, 1:Attack, 2:Magic, 3:Guard
		$gameScreen.showBCPicture(this, 1);
	};
	var _Game_Actor_prototype_performMagicEvasion = Game_Actor.prototype.performMagicEvasion;
	Game_Actor.prototype.performMagicEvasion = function() {
		_Game_Actor_prototype_performMagicEvasion.call(this);
		// frameX... 0:Command, 1:Attack, 2:Magic, 3:Guard
		$gameScreen.showBCPicture(this, 1);
	};



	Game_Actor.prototype.loadBCActorImageFileName = function() {
		return "BCBase";
	}

	
/*
	Game_Actor.prototype.loadBCMotionsAndImage = function() {
		let BCItems = [];
		BCItems[0] = [];
		BCItems[0][0] = {id:"Weapon",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCIceLance",w:480,h:480};
		BCItems[0][1] = {id:"HandR",frameX:0,x:60,y:280,z:10,rotate:320,image:"BCBrownHandR",w:50,h:50};
		BCItems[0][2] = {id:"HandL",frameX:0,x:150,y:230,z:10,rotate:320,image:"BCBrownHandL",w:50,h:50};
		return BCItems;

	}
*/
	Game_Actor.prototype.loadBCMotionsAndImage = function() {
		let BCItems = {};
		BCItems["Actor"] = [
			{id:"Actor",frameX:0,x:0,y:0,z:200,rotate:240,image:"BCAzel",w:480,h:480}
			,{id:"Actor",frameX:1,x:0,y:0,z:200,rotate:240,image:"BCAzel",w:480,h:480}
			,{id:"Actor",frameX:2,x:0,y:0,z:200,rotate:240,image:"BCAzel",w:480,h:480}
			,{id:"Actor",frameX:3,x:0,y:0,z:200,rotate:240,image:"BCAzel",w:480,h:480}
		];
		BCItems["Weapon"] = [
			{id:"Weapon",frameX:0,x:60,y:280,z:300,rotate:240,image:"BCWIceLance",w:480,h:480}
			,{id:"Weapon",frameX:0,x:60,y:280,z:300,rotate:240,image:"BCWIceLance",w:480,h:480}
			,{id:"Weapon",frameX:0,x:60,y:280,z:300,rotate:240,image:"BCWIceLance",w:480,h:480}
			,{id:"Weapon",frameX:0,x:60,y:280,z:300,rotate:240,image:"BCWIceLance",w:480,h:480}
		];
		BCItems["HandR"] = [
			{id:"HandR",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandR",w:480,h:480}
			,{id:"HandR",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandR",w:480,h:480}
			,{id:"HandR",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandR",w:480,h:480}
			,{id:"HandR",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandR",w:480,h:480}
		];
		BCItems["HandL"] = [
			{id:"HandL",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandL",w:480,h:480}
			,{id:"HandL",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandL",w:480,h:480}
			,{id:"HandL",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandL",w:480,h:480}
			,{id:"HandL",frameX:0,x:60,y:280,z:10,rotate:240,image:"BCBrownHandL",w:480,h:480}
		];
		return BCItems;
	}
//=============================================================================
// Sprite_Picture
//=============================================================================

	var _Sprite_Picture_prototype_updateBitmap = Sprite_Picture.prototype.updateBitmap;

	Sprite_Picture.prototype.updateBitmap = function() {
		var picture = this.picture();
		if (picture) {
			var pictureName = picture.name();
			if (this._pictureName !== pictureName && 
					 pictureName.match(/BC(.+)_(.+)/)) {
				this._pictureName = pictureName;
				this.loadBitmapComa();
        		this.visible = true;
				return;
			}
		}
		_Sprite_Picture_prototype_updateBitmap.call(this);
	};
Sprite_Picture.prototype.battleback2Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name()) {
        return $gameMap.battleback2Name();
    } else {
        return '';
    }
};
Sprite_Picture.prototype.battleback1Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name()) {
        return $gameMap.battleback1Name();
    } else {
        return '';
    }
};

	Sprite_Picture.prototype.loadBitmapComa = function(loadingNo) {
		let picture = this.picture();
		if (!picture) return;
		let pictureName = picture.name();

		if (!loadingNo) {
			loadingNo = 0;
		}

		// アクターのコマ（通常）
		// BC_1_1（BC_actor1ルーク_モーション1攻撃）
		if (pictureName.match(/BC_(.+)_(.+)/)) {
			console.log("BCProgram");// ここは来てる
			let actorId = Number(RegExp.$1);
			let motion = Number(RegExp.$2);// 後で使用★
			let i;
			let actor = $gameActors.actor(actorId);
			if (!actor) return;
			//console.log(actorBitmapName);//undefined 来てる
			const obj = $gameActors.actor(actorId).loadBCMotionsAndImage();
			obj[motion] = {};
			obj[motion].CanvasWidth = 480;
			obj[motion].CanvasHeight = 480;
			obj[motion].rotates = [0,0,0,0,240,320,320];
			obj[motion].wes = [480,1000,1000,480,400,100,100];
			obj[motion].hes = [480,740,740,480,400,100,100];
			obj[motion].dxes = [0,0,0,0,60,60,150];
			obj[motion].dyes = [0,0,0,0,250,250,250];
			obj[motion].fileNames = ["","","","BCBase","BCWIceLance","BCBrownHandR","BCBrownHandL"];
			obj[motion].frameXes = [0,0,0,0,0,0,0];
			obj[motion].frameYes = [0,0,0,0,0,0,0];
			obj[motion].sxes = [];
			obj[motion].syes = [];

			const renderer = Graphics.app.renderer;
			const sprites = [];
			let canvases = [];

			this.bitmap = new Bitmap(480, 480);

			bitmaps = [];
			bitmaps[0] = ImageManager.loadPicture('Coma');
			bitmaps[1]  = ImageManager.loadBattleback2(this.battleback2Name());
			bitmaps[2]  = ImageManager.loadBattleback1(this.battleback1Name());
			bitmaps[3]  = ImageManager.loadPicture("BCBase");
		//	bitmaps[0]  = ImageManager.loadPicture(actorBitmapName);
			// ハードコーディング
			bitmaps[4]  = ImageManager.loadPicture("BCWIceLance");
			bitmaps[5]  = ImageManager.loadPicture("BCBrownHandR");
			bitmaps[6]  = ImageManager.loadPicture("BCBrownHandL");
			
			//let weaponPIXISp = PIXI.Sprite.from('../../img/picture/' + "BCIceLance" + ".png");
			
			const self = this;

			// ピクチャがロード中だと、もう一度読んで関数終了する
			for (i = loadingNo; i < bitmaps.length; i ++) {
				if (bitmaps[i].width == 0) {
					bitmaps[i].addLoadListener(function() {
						self.loadBitmapComa(i);
					});
					return;
				}
			}

			// ロード完了後

			// コマ背景
			this.bitmap.context.globalCompositeOperation = 'source-over';
			this.bitmap.context.drawImage(bitmaps[0].canvas, 0, 0, 480, 480, 0, 0, 480, 480);
			// source-atop：透明のところは塗らない
			this.bitmap.context.globalCompositeOperation = 'source-atop';
			// battlebacks背景
			this.bitmap.context.drawImage(bitmaps[1].canvas, 450*Math.random(),132, 480, 132, 0, 0, 480, 480);
			this.bitmap.context.drawImage(bitmaps[2].canvas, 400*Math.random(),132, 480, 132, 0, 0, 480, 480);

			this.bitmap.context.globalCompositeOperation = 'source-over';
			this.bitmap.context.drawImage(bitmaps[3].canvas, 0,0, 480, 480, 0, 0, 480, 480);

			//this.bitmap = ImageManager.loadEnemy(RegExp.$1);
			// コマ、アクターは幅・高さ480ピクセル、武器・盾は400*x*y
			// 
			for (i = 4; i < bitmaps.length; i ++) {
				console.log("bitmaps[" + i + "]");//　呼ばれてる（4,5,6）
				if (obj[motion].frameXes[i] == 0) {
					obj[motion].frameXes[i] = 0;
				}
				if (obj[motion].frameYes[i] == 0) {
					obj[motion].frameYes[i] = 0;
				}
				const w = obj[motion].wes[i]; const h = obj[motion].hes[i];
				const dx = obj[motion].dxes[i] - w / 2;
				const dy = obj[motion].dyes[i] - h / 2;
				const sx = obj[motion].frameXes[i] * w;
				const sy = obj[motion].frameYes[i] * h;
				const rotate = obj[motion].rotates[i] * Math.PI / 180;
				const bitmap2 = new Bitmap(w, h);
				bitmap2.context.drawImage(bitmaps[i].canvas, 
					sx, sy, w, h, 0, 0, w, h);
				sprites[i] = new PIXI.Sprite.from(bitmap2.canvas);
				sprites[i].anchor.set(0.5);
				sprites[i].rotation = rotate;

//

				console.log("dx:" + dx); // -140、10、100。間違ってない
			
				canvases[i] = renderer.extract.canvas(sprites[i]);
		//	this.bitmap.context.drawImage(bitmaps[3].canvas, 0, 0, 480, 480, 0, 0, 480, 480);
			// 4~最大まで：
				this.bitmap.context.drawImage(canvases[i], 0, 0, w, h, dx, dy, w, h);
				
			
			}
		}

	};	



})();