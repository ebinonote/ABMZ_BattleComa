// =============================================================================
// ABMZ_BattleComa.js
// Version: 0.05
// -----------------------------------------------------------------------------
// Copyright (c) 2019 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @plugindesc v1.00 バトルコマを表示するようにします。
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
 * <ComaName:キャラ名>
 *
 * img/picturesには、
 * 
 * Coma.pngのほか、
 * 
 * ComaBattleキャラ名Attack.png
 * ComaBattleキャラ名Magic.png
 * ComaBattleキャラ名Damage.png
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
 * 色相0、原点左上、X350、Y100、サイズ2倍の位置にSlime.pngのコマを表示
 *
 * 名前のところにはスペースが入っていても平気です。（今のところは）
 * 
 * 
 * 
 * ============================================================================
 * 更新履歴
 * ============================================================================
 * 
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
 * @command ShowEnemyComa
 * @text 敵キャラの漫画コマ表示
 * @desc 敵キャラの漫画コマをピクチャで表示します。
 * 
 * @arg picId
 * @text ピクチャ番号
 * @desc 敵キャラのコマを表示するピクチャのＩＤです。
 * @type number
 * @decimals 0
 * @min 1
 * @max 100
 * @default 3
 * 
 * @arg enemyImage
 * @text 敵キャラの画像
 * @desc 敵キャラの画像ファイルです。
 * @type file
 * @dir img/enemies
 * 
 * @arg scale
 * @text 大きさ
 * @desc 敵キャラの大きさを何倍にしますか？
 * @type number
 * @decimals 1
 * @min 0.1
 * @default 1
 * 
 * @arg hue
 * @text 色相
 * @desc 敵キャラの色相です。
 * @type number
 * @decimals 0
 * @min 0
 * @max 360
 * @default 0
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
 * @default -50
 * 
 * 
 * @arg y
 * @text Y座標
 * @desc Y座標の位置です。
 * @type number
 * @decimals 0
 * @default 287
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
//	ComaY += 87;
	var ActorRight = eval(parameters['ActorRight']);

	const comaScale = 75;

//=============================================================================
// PluginManager
//=============================================================================


    const pluginName = "ABMZ_BattleComa";
	
    PluginManager.registerCommand(pluginName, "ShowEnemyComa", args => {
			const picId = args.picId;
			const enemyName = args.enemyImage;
			const scale = Number(args.scale) || 1;
			const hue = Number(args.hue) || 0;
			const center = Number(args.center) || 1;
			const x = args.x === undefined ? -50 : eval(args.x);
			const y = args.y === undefined ? ComaY : eval(args.y);
			$gameScreen.showPicture(picId, "ComaBattleEnemyProgramAttack"+enemyName+"Hue"+hue+"Scale"+scale, center, x, y, comaScale,comaScale, 255, 0);
			const tone = $gameScreen.tone();
			$gameScreen.tintPicture(picId, tone, 0);
    });
	
    PluginManager.registerCommand(pluginName, "ShowActorComa", args => {
			const picId = args.picId;
			const pictureName = args.pictureName;
			const center = Number(args.center) || 1;
			const x = args.x === undefined ? 800 : eval(args.x);
			const y = args.y === undefined ? 100 : eval(args.y);
		/*
			const comaName = actor.actor().meta["ComaName"];
			const string = actor.comaNumberString();
			if (!comaName) return;
			this.commandActor = actor;
			if (this.actionActor && actor.name() == this.actionActor.name()) {
				return;
			}
			const x = 800;
			const y = 100;*/
			$gameScreen.showPicture(picId,"ComaBattleActorProgramAttack"+pictureName,  1, x, y, comaScale,comaScale, 255, 0);
			var tone = $gameScreen.tone();
			$gameScreen.tintPicture(picId, tone, 0);
    });

//=============================================================================
// Game_System
//=============================================================================

	var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		Game_Interpreter_pluginCommand.call(this, command, args);
		if (command === 'ShowEnemyComa') {
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
			$gameScreen.showPicture(picId, "ComaBattleEnemyProgramAttack"+enemyName+"Hue"+hue+"Scale"+scale, center, x, y, comaScale,comaScale, 255, 0);
			var tone = $gameScreen.tone();
			$gameScreen.tintPicture(picId, tone, 0);
			//if (hue != 0) $gameScreen.tintPicture(picId, hue, 1);
		//	$gameScreen.showPicture(picId, "ComaBattleEnemyProgramAttack"+args[1], 0, -150, ComaY, comaScale,comaScale, 255, 0);
		}
	};
	

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
	Game_Actor.prototype.battleStatusWindowRefresh = function() {
		if (!$gameParty.inBattle()) return;
		if (!$gameParty.battleMembers().contains(this)) return;
		BattleManager.refreshStatus();
	};
*/

	Game_Actor.prototype.setStatusPanel = function(panel) {
		this._statusPanel = panel;
	};

/* ルークは、ガードフレア状態でイラストが変わる
Game_Actor.prototype.comaNumberString = function() {
	var vId = 0;
	switch (this.name()) {
	case "ルーク": vId = 72; break;
	//case "ダイアナ": vId = 73; break;
	//case "エイゼル": vId = 74; break;
	default: return "";
	}
	//if (!$gameSwitches.value(vId)) return "2";
	if (this.name() == "ルーク" && this.isStateAffected(73)) return "3";
	return "";
};

*/
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
		const comaName = this.actor().meta["ComaName"];
		const string = this.comaNumberString();
		if (comaName && action) {
			if (ActorRight) {
				var picId = DamagePictureNumber;
				//var x = 370;
				//var x = 670;
				var x = 770;
			} else {
				var picId = AttackPictureNumber;
				//var x = -150;
				//var x = 150;
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
		
		const comaName = actor.actor().meta["ComaName"];
		const string = actor.comaNumberString();
		if (!comaName) return;
		this.commandActor = actor;
		if (this.actionActor && actor.name() == this.actionActor.name()) {
			return;
		}
		const x = 800;
		const y = 100;
		$gameScreen.showPicture(10,"ComaBattleActorProgramAttack"+"ComaBattle"+comaName+ motion + string,  1, x, y, comaScale,comaScale, 255, 0);
		var tone = $gameScreen.tone();
		$gameScreen.tintPicture(10, tone, 0);
		
	}
	Game_Screen.prototype.showActorBattleComaAction = function(actor, motion) {
		
		const comaName = actor.actor().meta["ComaName"];
		const string = actor.comaNumberString();
		if (!comaName) return;
		this.actionActor = actor;
		if (this.commandActor && actor.name() == this.commandActor.name()) {
			this.erasePicture(10);
		}
		if (ActorRight) {
			var picId = DamagePictureNumber;
			//var x = 370;
			//var x = 670;
			var x = 770;
		} else {
			var picId = AttackPictureNumber;
			//var x = -150;
			var x = 150;
			var x = -150;
		}
	
		this.showPicture(picId,"ComaBattleActorProgramAttack"+"ComaBattle"+comaName+motion + string, 1, x, ComaY, comaScale,comaScale, 255, 0);
		var tone = $gameScreen.tone();
		this.tintPicture(picId, tone, 0);
		
	}
	Game_Screen.prototype.showActorBattleComa = function(actor, motion) {
		if (motion == "Command") {
			this.showActorBattleComaCommand(actor, motion);
			return;
		}
		this.showActorBattleComaAction(actor, motion);
	};
	Game_Screen.prototype.showEnemyBattleComa = function(enemy, motion) {
		
		if (!ActorRight) {
			var vId = DamagePictureNumber;
			//var x = 370;
			var x = 670;
			var x = 770;
		} else {
			var vId = AttackPictureNumber;
			//var x = -150;
			var x = 150;
			var x = -50;
		}
//		var scale = enemy.enemy().meta.scale  || "1";
		var scale = enemy.ABScale || "1";
		var hue = enemy.battlerHue();
		$gameScreen.showPicture(vId,"ComaBattleEnemyProgram"+motion+enemy.battlerName()+"Hue"+hue+"Scale"+scale, 1, x, ComaY, comaScale,comaScale, 255, 0);
			var tone = $gameScreen.tone();
			$gameScreen.tintPicture(vId, tone, 0);
		
	};

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

/*
var _Game_Battler_prototype_performActionEnd = Game_Battler.prototype.performActionEnd;
Game_Battler.prototype.performActionEnd = function() {
		_Game_Battler_prototype_performActionEnd.call(this);
		$gameScreen.erasePicture(AttackPictureNumber);
		$gameScreen.erasePicture(DamagePictureNumber);
};
*/
Game_Battler.prototype.performActionEnd = function() {
    this.setActionState('done');
};
/*
	Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            var sprite = new Sprite_Damage();
                sprite.x   = this._actor ?670:150;
                sprite.y   = ComaY+80;
						
            sprite.setup(this._battler);
            this._damages.push(sprite);
            SceneManager._scene._spriteset.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
	};
*/
// ==============================
// YEP_X_VisualHpGauge.js
// ==============================
/*
var _Window_VisualHPGauge_prototype_updateWindowPosition = Window_VisualHPGauge.prototype.updateWindowPosition;
Window_VisualHPGauge.prototype.updateWindowPosition = function() {
		if (BattleManager.isInputting() ) {
			//_Window_VisualHPGauge_prototype_updateWindowPosition.call(this);
			return;
		}
	  this.x = 0;
  	this.y = ComaY+40;
};
*/

Sprite_Battler.prototype.createVisualHpGaugeWindow = function() {
		if (!SceneManager._scene._spriteset) return;
		if (this._createdVisualHpGaugeWindow) return;
		if (!this._battler) return;
		if (this.checkVisualATBGauge()) {
			if (!this._visualATBWindow) return;
			if (!this.parent.parent.children.contains(this._visualATBWindow)) return;
		}/*
		this._createdVisualHpGaugeWindow = true;
    this._visualHpGauge = new Window_VisualHPGauge();*/
    this._visualHpGauge.setBattler(this._battler);
    SceneManager._scene._spriteset.addChild(this._visualHpGauge);
};

// ==============================
// YEP_X_VisualHpGauge.jsここまで
// ==============================

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
// Game_Enemy
//=============================================================================

/*
	var _Game_Enemy_prototype_performActionStart
		 = Game_Enemy.prototype.performActionStart;
	Game_Enemy.prototype.performActionStart = function(action) {
		$gameScreen.showEnemyBattleComa(this, "Attack");
		
		_Game_Enemy_prototype_performActionStart.call(this, action);
	};
	
	var _Game_Enemy_prototype_performDamage = Game_Enemy.prototype.performDamage;
	Game_Enemy.prototype.performDamage = function(action) {
		_Game_Enemy_prototype_performDamage.call(this, action);
		$gameScreen.showEnemyBattleComa(this, "Attack");

	};
	
	var _Game_Enemy_prototype_performMiss = Game_Enemy.prototype.performMiss;
	Game_Enemy.prototype.performMiss = function(action) {
		_Game_Enemy_prototype_performMiss.call(this, action);
		$gameScreen.showEnemyBattleComa(this, "Attack");
	};

	var _Game_Enemy_prototype_performMagicEvasion = Game_Enemy.prototype.performMagicEvasion;
	Game_Enemy.prototype.performMagicEvasion = function(action) {
		_Game_Enemy_prototype_performMagicEvasion.call(this, action);
		$gameScreen.showEnemyBattleComa(this, "Attack");


	};
*/

//=============================================================================
// Sprite_Picture
//=============================================================================

	var _Sprite_Picture_prototype_updateBitmap = Sprite_Picture.prototype.updateBitmap;

	Sprite_Picture.prototype.updateBitmap = function() {
		var picture = this.picture();
		if (picture) {
			var pictureName = picture.name();
			if (this._pictureName !== pictureName && (pictureName.match(/ComaBattleEnemyProgramAttack(.+)/)|| pictureName.match(/ComaBattleActorProgramAttack(.+)/))) {
				this._pictureName = pictureName;
				//var sprite = PIXI.Sprite.fromImage('../../img/pictures/'+RegExp.$1+'.png');
				//sprite.mask = PIXI.Sprite.fromImage('../../img/pictures/ComaBattleAzelAttack.png');
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
	Sprite_Picture.prototype.loadBitmapComa = function() {
		var picture = this.picture();
		if (!picture) return;
		var pictureName = picture.name();
		if (pictureName.match(/ComaBattleEnemyProgramAttack(.+)Hue(\d+)Scale([\d\.]+)/)) {
			var bitmap1 = ImageManager.loadPicture('Coma');
			var bitmap2 = ImageManager.loadEnemy(RegExp.$1, Number(RegExp.$2));
			var bitmap3 = ImageManager.loadBattleback2(this.battleback2Name());
			var bitmap4 = ImageManager.loadBattleback1(this.battleback1Name());
			var bitmap5 = ImageManager.loadPicture('ComaWaku');
			var scale = Number(RegExp.$3);
			let filter = new PIXI.filters.ColorMatrixFilter();
			filter.hue(Number(RegExp.$2), false);
			var self = this;
			if (bitmap1.width == 0) {
				bitmap1.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			} else if (bitmap2.width == 0) {
				bitmap2.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			} else if (bitmap3.width == 0) {
				bitmap3.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			} else if (bitmap4.width == 0) {
				bitmap4.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			} else if (bitmap5.width == 0) {
				bitmap5.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			}
		//	bitmap
/*
			if (bitmap2) {
				bitmap2.rotateHue(Number(RegExp.$2));
			}
*/
			
			const renderer = Graphics.app.renderer;
	//		bitmap2.resize(bitmap2.width*scale, bitmap2.height*scale);
			//const stage = new PIXI.Container();
			const sprite = new PIXI.Sprite.from(bitmap2.canvas);
			
			

			sprite.filters = [filter];/*
			sprite.scale.x = scale;
			sprite.scale.y = scale;*/
			
			const canvas = renderer.extract.canvas(sprite);// 二回目からちゃんとした色になる
			//const texture = renderer.generateTexture(sprite);
/*
			canvas.width = canvas.width*scale;
			canvas.height = canvas.height*scale;
			
*/
			//this.hue();
			//this.setHue(Number(RegExp.$2));
			this.bitmap = new Bitmap(600, 175);
			//this.bitmap = ImageManager.loadEnemy(RegExp.$1);
			var w = canvas.width;
			var h = canvas.height;
			//var dx = 300-w/2;
			var dx = 400-w/2*scale;
			var dy = 175/2-h/3*scale;
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
			//ImageManager.loadPicture("ComaBattleAzelAttack");
			//this.bitmap.maskedBlt(bitmap1,
			//											bitmap2,
			//											0,0,600,175,dx,dy);
			this.bitmap.context.globalCompositeOperation = 'source-over';
			this.bitmap.context.drawImage(bitmap1.canvas, 0, 0, 600, 175, 0, 0, 600, 175);
			this.bitmap.context.globalCompositeOperation = 'source-atop';
			this.bitmap.context.drawImage(bitmap4.canvas, 400*Math.random(), 175, 600, 175, 0, 0, 600, 175);
			this.bitmap.context.drawImage(bitmap3.canvas, 400*Math.random(), 175, 600, 175, 0, 0, 600, 175);
			this.bitmap.context.drawImage(bitmap5.canvas, 0, 0, 600, 175, 0, 0, 600, 175);
			this.bitmap.context.drawImage(canvas, sx, sy, w, h, dx, dy, w*scale, h*scale);
			//this.bitmap.context.drawImage(bitmap2.canvas, s);
		}
		if (pictureName.match(/ComaBattleActorProgramAttack(.+)/)) {
			var bitmap1 = ImageManager.loadPicture('Coma');
			var bitmap2 = ImageManager.loadPicture(RegExp.$1);
			var bitmap3 = ImageManager.loadBattleback2(this.battleback2Name());
			var bitmap4 = ImageManager.loadBattleback1(this.battleback1Name());
			var self = this;

			if (bitmap1.width == 0) {
				bitmap1.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			} else if (bitmap2.width == 0) {
				bitmap2.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			} else if (bitmap3.width == 0) {
				bitmap3.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			} else if (bitmap4.width == 0) {
				bitmap4.addLoadListener(function() {
					self.loadBitmapComa();
				});
				return;
			}
			
			this.bitmap = new Bitmap(600, 600);
			//this.bitmap = ImageManager.loadEnemy(RegExp.$1);
			var w = bitmap2.width;
			var h = bitmap2.height;
			//var dx = 300-w/2;
			var dx = 500-w;
			var dy = 175/2-h/2;
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
			//ImageManager.loadPicture("ComaBattleAzelAttack");
			//this.bitmap.maskedBlt(bitmap1,
			//											bitmap2,
			//											0,0,600,175,dx,dy);
			
			this.bitmap.context.globalCompositeOperation = 'source-over';
			this.bitmap.context.drawImage(bitmap1.canvas, 0, 0, 600, 175, 12, 233, 600, 175);
			this.bitmap.context.globalCompositeOperation = 'source-atop';
			this.bitmap.context.drawImage(bitmap4.canvas, 450*Math.random(), 175, 600, 175, 12, 233, 600, 175);
			this.bitmap.context.drawImage(bitmap3.canvas, 400*Math.random(), 175, 600, 175, 12, 233, 600, 175);

			this.bitmap.context.globalCompositeOperation = 'source-over';
			//var imageData = bitmap2.rotateHue(Number(RegExp.$2));
			this.bitmap.context.drawImage(bitmap2.canvas, 0, 0, 600, 600, 0, 0, 600, 600);
			//this.bitmap.context.drawImage(bitmap2.canvas, s);
		}
	};	
	

})();