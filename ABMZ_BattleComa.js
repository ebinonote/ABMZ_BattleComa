// =============================================================================
// ABMZ_BattleComa.js
// Version: 0.07
// -----------------------------------------------------------------------------
// Copyright (c) 2019 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @plugindesc v0.07 アクターのカットインを表示するようにします。
 * @author ヱビ
 * @target MZ
 *
 * @param AttackPictureNumber
 * @type number
 * @desc 攻撃しているキャラクターに使われるピクチャの番号です。
 * @default 21
 *
 * @param DamagePictureNumber
 * @type number
 * @desc 防御しているキャラクターに使われるピクチャの番号です。
 * @default 22
 * 
 * @param ComaY
 * @type number
 * @desc コマが表示されるＹ軸です。
 * @default 287
 * 
 * @param ActorRight
 * @type boolean
 * @desc これをオンにするとアクターが常に右になり、敵は左になります。
 * @default false
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
 * @arg pictureName
 * @text コマの画像
 * @desc アクターのコマの画像ファイルです。
 * @type file
 * @dir img/pictures
 * 
 * 
 * @arg center
 * @text 原点
 * @desc ピクチャの原点を0なら左上、1なら中央にします。
 * @type combo
 * @option 原点
 * @value 1
 * @option 左上
 * @value 0
 * @default 1
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
	var DamagePictureNumber = Number(parameters['DamagePictureNumber']);
	var ComaY = Number(parameters['ComaY']);

	var ActorRight = eval(parameters['ActorRight']);
	// Ver 1.1
	const comaScale = 100;
	

//=============================================================================
// PluginManager
//=============================================================================


    const pluginName = "ABMZ_BattleComa";
	
	
    PluginManager.registerCommand(pluginName, "ShowActorComa", args => {
			const picId = args.picId;
			const pictureName = args.pictureName;
			const center = Number(args.center) || 1;
			const x = args.x === undefined ? 800 : eval(args.x);
			const y = args.y === undefined ? 100 : eval(args.y);
		/*
			const BCComaName = actor.actor().meta["BCComaName"];
			const string = actor.comaNumberString();
			if (!BCComaName) return;
			this.commandActor = actor;
			if (this.actionActor && actor.name() == this.actionActor.name()) {
				return;
			}
			const x = 800;
			const y = 100;*/
			$gameScreen.showPicture(picId,"BCProgram"+pictureName,  1, x, y, comaScale,comaScale, 255, 0);
			var tone = $gameScreen.tone();
			$gameScreen.tintPicture(picId, tone, 0);
    });
//=============================================================================
// Game_System
//=============================================================================
/*
	var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		Game_Interpreter_pluginCommand.call(this, command, args);
		
		if (command === 'ShowOtherFolderPicture') {
			var v = $gameVariables._data;
		//	console.log("showenemycoma : " + args[1]);
			var picId = Number(args[0]);
			var enemyName = args[1];
			for (var i=2,l=args.length; i<l; i++) {
				if (isNaN(Number(args[i]))) {
					enemyName += " " +args[i];
				} else {
					break;
				}
				
			}
			
			var scale = Number(args[i]) || 1;
			i++;
			var hue = Number(args[i]) || 0;
			i++;
			var center = Number(args[i]) || 1;
			if (Number(args[i]) === 0) center = 0;
			i++;
			var x = args[i] === undefined ? -50 : eval(args[i]);
			i++;
			var y = args[i] === undefined ? ComaY : eval(args[i]);
			$gameScreen.showPicture(picId, "AB_Enemy" + enemyName+"Hue"+hue+"Scale"+scale, center, x, y, comaScale,comaScale, 255, 0);
			var tone = $gameScreen.tone();
			$gameScreen.tintPicture(picId, tone, 0);
		}
	};
	
*/
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


	Game_Actor.prototype.setStatusPanel = function(panel) {
		this._statusPanel = panel;
	};



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
		$gameScreen.showActorBattleComa(actor, "Command");
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
			if (ActorRight) {
				var picId = DamagePictureNumber;
				var x = 770;
			} else {
				var picId = AttackPictureNumber;
				var x = -50;
			}
			if (action.isAttack()) {
				$gameScreen.showActorBattleComa(actor, "Attack");
			} else if (action.isMagicSkill()) {
				$gameScreen.showActorBattleComa(actor, "Magic");
			} else if (action.isSkill()) {
				$gameScreen.showActorBattleComa(actor, "Attack");
			} else {
				$gameScreen.showActorBattleComa(actor, "Attack");
				
			}
		}
		_Game_Actor_prototype_performActionStart.call(this, action);
	};

//=============================================================================
// Game_Screen
//=============================================================================


	Game_Screen.prototype.hideActorBattleComaCommand = function() {
		this.commandActor = null;
		this.erasePicture(10);
	}

	Game_Screen.prototype.hideActorBattleComaAction = function() {
		if (this.actionActor && this.commandActor
			 && this.actionActor.name() == this.commandActor.name()) {
			this.actionActor = null;
			this.showActorBattleComa(this.commandActor, "Command");
		}
		this.erasePicture(AttackPictureNumber);
		this.erasePicture(DamagePictureNumber);
	}


	Game_Screen.prototype.showActorBattleComaCommand = function(actor, motion) {
		// 
		if (!actor) return;
		const BCComaName = actor.actor().meta["BCComaName"];
		const string = actor.comaNumberString();
		const comaWeaponName = actor.getComaWeaponName();
		if (!BCComaName) return;
		this.commandActor = actor;
		if (this.actionActor && actor.name() == this.actionActor.name()) {
			return;
		}
		const x = 800;
		const y = 100;
		$gameScreen.showPicture(10,"BCProgram"+"BC"+BCComaName + string + motion,  1, x, y, comaScale,comaScale, 255, 0);
		
		var tone = $gameScreen.tone();
		$gameScreen.tintPicture(10, tone, 0);
		
	}
/*
	Game_Screen.prototype.showActorBattleComaAction = function(actor, motion) {
		
		const BCComaName = actor.actor().meta["BCComaName"];
		const string = actor.comaNumberString();
		if (!BCComaName) return;
		this.actionActor = actor;
		if (this.commandActor && actor.name() == this.commandActor.name()) {
			this.erasePicture(10);
		}
		if (ActorRight) {
			var picId = DamagePictureNumber;
			var x = 770;
		} else {
			var picId = AttackPictureNumber;
			var x = -150;
		}
	
		this.showPicture(picId,"BCProgram"+"BC"+BCComaName+motion + string, 1, x, ComaY, comaScale,comaScale, 255, 0);
		var tone = $gameScreen.tone();
		this.tintPicture(picId, tone, 0);
		
	};*/
	Game_Screen.prototype.showActorBattleComa = function(actor, motion) {
		if (motion == "Command") {
			this.showActorBattleComaCommand(actor, motion);
			return;
		}
		this.showBCPicture(actor, motion);
	};
	
	
	Game_Screen.prototype.showBCPicture = function(actor, motion) {
		
		const BCComaName = actor.actor().meta["BCComaName"];
		let string = actor.comaNumberString();
		if (!BCComaName) return;
		if (string == 0) {
			string = "";
		}
		this.actionActor = actor;
		if (this.commandActor && actor.name() == this.commandActor.name()) {
			this.erasePicture(10);
		}
		// ハードコーディング
		if (ActorRight) {
			var picId = DamagePictureNumber;
			var x = 770;
		} else {
			var picId = AttackPictureNumber;
			var x = -150;
		}
	
		// ハードコーディング
		motion = "Command";
		let weapon = "BCIceLance";
		let shield = "BBCuckler";

		this.showPicture(picId,("BCProgram" + "BC" + BCComaName + string + 
			"_" +motion + "_" + weapon + "_" + shield), 	
			1, x, ComaY, comaScale,comaScale, 255, 0);
		var tone = $gameScreen.tone();
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
		$gameScreen.showActorBattleComa(this, "Damage");
		
	};
	var _Game_Actor_prototype_performMiss = Game_Actor.prototype.performMiss;
	Game_Actor.prototype.performMiss = function() {
		_Game_Actor_prototype_performMiss.call(this);
		$gameScreen.showActorBattleComa(this, "Attack");
	};
	var _Game_Actor_prototype_performEvasion = Game_Actor.prototype.performEvasion;
	Game_Actor.prototype.performEvasion = function() {
		_Game_Actor_prototype_performEvasion.call(this);
		$gameScreen.showActorBattleComa(this, "Attack");
	};
	var _Game_Actor_prototype_performMagicEvasion = Game_Actor.prototype.performMagicEvasion;
	Game_Actor.prototype.performMagicEvasion = function() {
		_Game_Actor_prototype_performMagicEvasion.call(this);
		$gameScreen.showActorBattleComa(this, "Attack");
	};



//=============================================================================
// Sprite_Picture
//=============================================================================

	var _Sprite_Picture_prototype_updateBitmap = Sprite_Picture.prototype.updateBitmap;

	Sprite_Picture.prototype.updateBitmap = function() {
		var picture = this.picture();
		if (picture) {
			var pictureName = picture.name();
			if (this._pictureName !== pictureName && 
				 pictureName.match(/BCProgram(.+)/)||
				 pictureName.match(/AB_Enemy(.+)/)) {
				this._pictureName = pictureName;
				//var sprite = PIXI.Sprite.fromImage('../../img/pictures/'+RegExp.$1+'.png');
				//sprite.mask = PIXI.Sprite.fromImage('../../img/pictures/BCAzelAttack.png');
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
		// アクター１_モーション_武器_盾
		// 例：エイゼル_Command_BCIceLance_Buckler
		if (pictureName.match(/BCProgram(.+)_(.+)_(.+)_(.+)/)) {
			console.log("BCProgram");// ここは来てる
			let actorBitmapName = RegExp.$1 + RegExp.$2;
			let motion = RegExp.$2;
			let weapon = RegExp.$3;
			let shield = RegExp.$4;
			let i;
			console.log(actorBitmapName);//BCAzelCommand 来てる
			const CanvasWidth = 480;
			const CanvasHeight = 480;
			const renderer = Graphics.app.renderer;
			const sprites = [];
			const canvases = [];
			const rotates = [0,0,0,0,240,320,320];
			const wes = [480,1000,1000,480,400,100,100];
			const hes = [480,740,740,480,400,100,100];
			const dxes = [0,0,0,0,60,60,150];
			const dyes = [0,0,0,0,250,250,250];
			const fileNames = ["","","","BCBase","BCWIceLance","BCBrownHandR","BCBrownHandL"];
			const frameXes = [0,0,0,0,0,0,0];
			const frameYes = [0,0,0,0,0,0,0];
			const sxes = [];
			const syes = [];

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
			
			let self = this;


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
			for (i = 3; i < bitmaps.length; i ++) {
				if (wes[i] == "" || wes[i] == 0) {
					wes[i] = bitmaps[i].width;
					hes[i] = bitmaps[i].height;
				}
				if (frameXes[i] == 0) {
					frameXes[i] = 0;
				}
				if (frameYes[i] == 0) {
					frameYes[i] = 0;
				}
				let w = wes[i]; let h = hes[i];
				let dx = dxes[i] - w / 2;
				let dy = dyes[i] - h / 2;
				let sx = frameXes[i] * w;
				let sy = frameYes[i] * h;
				let rotate = rotates[i] * Math.PI / 180;
				let bitmap2 = new Bitmap(w, h);
				bitmap2.context.drawImage(bitmaps[i].canvas, 
					sx, sy, w, h, 0, 0, w, h);
				sprites[i] = new PIXI.Sprite.from(bitmap2.canvas);

				sprites[i].anchor.set(0.5);
				sprites[i].rotation = rotates[i];
				
				canvases[i] = renderer.extract.canvas(sprites[i]);
		//	this.bitmap.context.drawImage(bitmaps[3].canvas, 0, 0, 480, 480, 0, 0, 480, 480);
			// 3~最大まで：
				this.bitmap.context.drawImage(canvases[i], 0, 0, w, h, dx, dy, w, h);
				
			
			}
		}

	};	



})();