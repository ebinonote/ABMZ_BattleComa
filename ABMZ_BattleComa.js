// =============================================================================
// ABMZ_BattleComa.js
// Version: 0.06
// -----------------------------------------------------------------------------
// Copyright (c) 2019 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @plugindesc v0.06 アクターのカットインを表示するようにします。
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
 * CBキャラ名Attack.png
 * CBキャラ名Magic.png
 * CBキャラ名Damage.png
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
 * <CBWeapon:Lance>
 * 
 * 
 * ============================================================================
 * 更新履歴
 * ============================================================================
 * 
 * Version 0.06
 *   途中保存（武器合成用に改造中）
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
			$gameScreen.showPicture(picId,"CBProgram"+pictureName,  1, x, y, comaScale,comaScale, 255, 0);
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
		$gameScreen.showPicture(10,"CBProgram"+"CB"+BCComaName + string + motion,  1, x, y, comaScale,comaScale, 255, 0);
		
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
	
		this.showPicture(picId,"CBProgram"+"CB"+BCComaName+motion + string, 1, x, ComaY, comaScale,comaScale, 255, 0);
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
		let shield = "BCBuckler";

		this.showPicture(picId,("CBProgram" + "CB" + BCComaName + string + 
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
				 pictureName.match(/CBProgram(.+)/)||
				 pictureName.match(/AB_Enemy(.+)/)) {
				this._pictureName = pictureName;
				//var sprite = PIXI.Sprite.fromImage('../../img/pictures/'+RegExp.$1+'.png');
				//sprite.mask = PIXI.Sprite.fromImage('../../img/pictures/CBAzelAttack.png');
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
		if (pictureName.match(/CBProgram(.+)_(.+)_(.+)_(.+)/)) {
			console.log("CBProgram");// ここは来てる
			let actorBitmapName = RegExp.$1 + RegExp.$2;
			let motion = RegExp.$2;
			let weapon = RegExp.$3;
			let shield = RegExp.$4;
			let i;
			console.log(actorBitmapName);//CBAzelCommand 来てる

			bitmaps = [];
			bitmaps[0] = ImageManager.loadPicture('Coma');
			bitmaps[1]  = ImageManager.loadBattleback2(this.battleback2Name());
			bitmaps[2]  = ImageManager.loadBattleback1(this.battleback1Name());
			bitmaps[3]  = ImageManager.loadPicture(actorBitmapName);
		//	bitmaps[0]  = ImageManager.loadPicture(actorBitmapName);
			// ハードコーディング
			bitmaps[4]  = ImageManager.loadPicture("CBIceLance");
			bitmaps[5]  = ImageManager.loadPicture("CBBrownHandR");
			bitmaps[6]  = ImageManager.loadPicture("CBBrownHandL");
			
			//let weaponPIXISp = PIXI.Sprite.from('../../img/picture/' + "CBIceLance" + ".png");
			
			let self = this;

			//loadingNo = loadingNo + 1;
/*			if (bitmaps[2].width == 0) {
				bitmaps[2].addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			}
			if (bitmaps[3].width == 0) {
				bitmaps[3].addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			}
*/
			for (i = loadingNo; i < bitmaps.length; i ++) {
				if (bitmaps[i].width == 0) {
					bitmaps[i].addLoadListener(function() {
						self.loadBitmapComa(i);
					});
					return;
				}
			}

			// 左上から・右手
			//let b5X = 60;
			//let b5Y = 250;
			// 240度角度これでOK
			let b5R = 240 / 180 * Math.PI;
			let b5W = bitmaps[4].width;
			let b5H = bitmaps[4].height;
			// 真ん中から
			// 480:コマ画像サイズ
			let b5X = 60 - 480 / 2 ;
			let b5Y = 250 -  480 / 2;
			let b6X = 60 - 50 / 2 ;
			let b6Y = 250 -  50 / 2;

			// うまくいかない。
			//
			//bitmap5.anchor.set(0.5);
			//bitmap5.rotation = b5R;

			/*
			weaponPIXISp.anchor.set(0.5);
			weaponPIXISp.rotation = b5R;
*/
			//
			this.bitmap = new Bitmap(480, 480);
			//this.bitmap = ImageManager.loadEnemy(RegExp.$1);
			// コマ、アクター、武器は幅・高さ480ピクセル
			var w = 480;
			var h = 480;
			var dx = 300-w/2;
			//var dx = 500-w/2;
			var dy = 175-h/2;
			var sx = 0;
			var sy = 0;
			if (dx < 0) {
				sx = -dx;
				dx = 0;
			}
			if (dy < 0) {
				sy = -dy;
				dy = 0;
			}

			if (dx < 160) {
				dx = 160;
			}

			const renderer = Graphics.app.renderer;
			let sprites = [];
			let canvases = [];
			let rotates = [0,0,0,0,240/180*Math.PI,320/180*Math.PI,320/180*Math.PI];
			let wes = [];
			let hes = [];
			let xes = [0,0,0,0,60-480/2,60-50/2,150-50/2];
			let yes = [0,0,0,0,280-480/2,280-50/2,230-50/2];

			for (i = 0; i < bitmaps.length; i ++) {
				sprites[i] = new PIXI.Sprite.from(bitmaps[i].canvas);
				sprites[i].anchor.set(0.5);
				sprites[i].rotation = rotates[i];
				canvases[i] = renderer.extract.canvas(sprites[i]);
			}
			if (canvases[i] && canvases[i].width == 0) {
				canvases[i].addLoadListener(function() {
					self.loadBitmapComa(i);
				});
				return;
			}
			for (i = 4; i < bitmaps.length; i ++) {
				wes[i] = bitmaps[i].width;
				hes[i] = bitmaps[i].height;
			}

/*
			const sprite = new PIXI.Sprite.from(bitmaps[4].canvas);
			const sprite2 = new PIXI.Sprite.from(bitmaps[5].canvas);
			sprite.anchor.set(0.5);
			sprite.rotation = b5R;
			sprite2.anchor.set(0.5);
			sprite2.rotation = b5R;

			const canvas = renderer.extract.canvas(sprite);
			const canvas2 = renderer.extract.canvas(sprite2);
*/			// GitHubにあげてある、最初のほうのレンダラーとスプライトとフィルター
			// に使われている

			//ImageManager.loadPicture("CBAzelAttack");
			//this.bitmap.maskedBlt(bitmap1,
			//											bitmap2,
			//											0,0,600,175,dx,dy);
			// 参考：this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			// 
			// コマ背景
			this.bitmap.context.globalCompositeOperation = 'source-over';
			this.bitmap.context.drawImage(bitmaps[0].canvas, 0, 0, 480, 480, 0, 0, 480, 480);
			// 実験でコメントアウト
			this.bitmap.context.globalCompositeOperation = 'source-atop';
			// battlebacks背景。
			this.bitmap.context.drawImage(bitmaps[1].canvas, 450*Math.random(),132, 480, 132, 0, 0, 480, 480);
			this.bitmap.context.drawImage(bitmaps[2].canvas, 400*Math.random(),132, 480, 132, 0, 0, 480, 480);

			this.bitmap.context.globalCompositeOperation = 'source-over';
			//var imageData = bitmap2.rotateHue(Number(RegExp.$2));
			//var imageData = bitmap5.
			// アクターの画像
			this.bitmap.context.drawImage(bitmaps[3].canvas, 0, 0, 480, 480, 0, 0, 480, 480);
			// 武器の画像
			for (i = 4; i < bitmaps.length; i ++) {
				this.bitmap.context.drawImage(canvases[i], 0, 0, wes[i], hes[i], xes[i], yes[i], wes[i], hes[i]);
			
			}
			
			
		}

	};	



})();