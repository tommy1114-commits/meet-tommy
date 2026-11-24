import { weekday } from './weekday-data.js?v=3.3';
import { animateStop, makeBus, typeAtDesk } from './weekday-visuals.js?v=3.3';

const movementHint = '方向鍵移動 · 靠近標記按 A，或直接點選 · B 返回';

export function createWeekdayScene(Phaser, Player, Dialogue, Room, sound, transition) {
  return class WeekdayScene extends Phaser.Scene {
    constructor() {
      super('WeekdayScene');
    }

    init() {
      this.index = 0;
      this.done = new Set();
      this.lastWork = '';
      this.podcast = '';
      this.busy = false;
    }

    preload() {
      for (const key of ['metro', 'office', 'dinner', 'park']) {
        this.load.image(`weekday-${key}`, `assets/weekday/${key}.png`);
      }
    }

    create() {
      this.cameras.main.setZoom(4).centerOn(120, 80);
      this.motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.pill = document.getElementById('discovery-pill');
      this.pillWasHidden = this.pill.classList.contains('hidden');
      this.pill.classList.add('hidden');
      this.dialogueManager = new Dialogue(this);
      this.events.once('shutdown', () => {
        this.pill.classList.toggle('hidden', this.pillWasHidden);
      });
      window.currentGameScene = this;
      this.showStop();
    }

    showStop() {
      this.tweens.killAll();
      this.roomCollider?.destroy();
      this.roomCollider = null;
      this.children.removeAll(true);
      this.hotspots = [];
      this.player = null;
      this.busy = false;
      const stage = weekday[this.index];
      window.updateSceneName(`${stage.time} · ${stage.place}`);
      window.updateControlHint(movementHint);

      if (stage.ride) {
        makeBus(this);
      } else {
        const key = stage.room ? stage.art : `weekday-${stage.art}`;
        this.background = this.add.image(120, 80, key).setDisplaySize(240, 160);
        animateStop(this, stage);
      }

      if (stage.spawn) {
        this.player = new Player(this, ...stage.spawn);
        if (stage.room) {
          Room.prototype.initPhysicsColliders.call(this);
          this.roomCollider = this.physics.add.collider(this.player, this.obstacles);
          this.add.image(83, 139, 'coffee_table_fg')
            .setDisplaySize(50, 37.5).setDepth(134)
            .setTint(this.index === 6 ? 0x9c91a3 : 0xffffff);
        } else {
          this.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(8, stage.floor, 224, 49));
        }
      }

      for (const stop of stage.stops) this.addHotspot(stop);
      this.prompt = this.add.sprite(0, 0, 'icon_prompt').setDepth(999).setVisible(false);
      this.nearby = null;
      transition.fadeIn(this);
      if (stage.ride) {
        this.talk(`轉上公車了。戴著耳機聽${this.podcast} Podcast，看窗外街景慢慢換過去。`);
      } else if (stage.sleep) {
        this.talk('十一點了。今天就到這裡，晚安。');
      }
    }

    createStaticBox(x, y, width, height) {
      Room.prototype.createStaticBox.call(this, x, y, width, height);
    }

    addHotspot(stop) {
      const marker = this.add.circle(stop.x, stop.y, 3.4, 0xffd269, 0.94)
        .setStrokeStyle(1, 0x6d4232).setDepth(300);
      const area = this.add.zone(stop.x, stop.y, 22, 20).setDepth(301)
        .setInteractive({ useHandCursor: true });
      area.on('pointerdown', () => this.activate(stop));
      if (this.motion) {
        this.tweens.add({ targets: marker, alpha: 0.58, duration: 790, yoyo: true, repeat: -1 });
      }
      this.hotspots.push(stop);
    }

    activate(stop) {
      if (!stop || this.busy || this.dialogueManager.isActive || !this.settingsClosed()) return;
      sound.playConfirm();
      stop.action(this);
    }

    settingsClosed() {
      return document.getElementById('settings-modal').classList.contains('hidden');
    }

    nearbyStop() {
      if (!this.player) return this.hotspots[0];
      let nearest = null;
      let distance = 25;
      for (const stop of this.hotspots) {
        const candidate = Math.hypot(stop.x - this.player.x, stop.y - this.player.y - 13);
        if (candidate < distance) {
          nearest = stop;
          distance = candidate;
        }
      }
      return nearest;
    }

    update() {
      if (!this.prompt) return;
      const playing = !this.busy && !this.dialogueManager.isActive && this.settingsClosed();
      if (playing) this.player?.update();
      else this.player?.body.setVelocity(0, 0);
      const current = playing ? this.nearbyStop() : null;
      this.prompt.setVisible(Boolean(current));
      if (current) this.prompt.setPosition(current.x, current.y - 9);
      if (playing && current !== this.nearby) {
        window.updateControlHint(current ? `按 A · ${current.name}` : movementHint);
      }
      this.nearby = current;
    }

    handleVirtualA() {
      if (!this.settingsClosed() || this.busy) return;
      if (this.dialogueManager.isActive) this.dialogueManager.handleAdvance();
      else this.activate(this.nearbyStop());
    }

    handleVirtualB() {
      if (!this.settingsClosed() || this.busy) return;
      if (this.dialogueManager.isActive) {
        this.dialogueManager.handleCancel();
        return;
      }
      this.talk('要先回到首頁嗎？', [
        { text: '繼續走走', action: () => {} },
        { text: '返回首頁', action: () => this.goHome() },
      ]);
    }

    handleVirtualDpad(direction, pressed) {
      if (this.player) this.player.virtualInput[direction] = pressed;
      if (!pressed || !this.dialogueManager.isActive) return;
      if (direction === 'up') this.dialogueManager.changeOption(-1);
      if (direction === 'down') this.dialogueManager.changeOption(1);
    }

    talk(text, options) {
      this.dialogueManager.startDialogue({ text, options });
      window.updateControlHint('A 繼續／確認 · 方向鍵選擇 · B 關閉');
    }

    afterDialogue(callback) {
      this.time.delayedCall(0, callback);
    }

    next() {
      if (this.busy) return;
      this.busy = true;
      this.player?.lock();
      sound.playDoor();
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.index += 1;
        this.showStop();
      });
      this.cameras.main.fade(280, 20, 24, 30, true);
    }

    computer(mode) {
      this.done.add('evening');
      this.busy = true;
      this.afterDialogue(() => {
        this.player.lock();
        typeAtDesk(this, mode, sound, () => {
          this.busy = false;
          this.talk(mode === 'code'
            ? '晚上我有時會用 AI 做小 App。先試著做出一個能用的小功能，再慢慢改。'
            : '有時就看看 YouTube，讓腦袋從白天的工作切換一下。');
        });
      });
    }

    finish() {
      const evening = this.done.has('evening') ? '，也看了我睡前會做些什麼' : '';
      this.talk(`謝謝妳陪我過了一個平日。從早上的咖啡，到公司裡的${this.lastWork}，再到大湖公園夜跑${evening}。下次見！`, [
        { text: '回到首頁', action: () => this.goHome() },
      ]);
    }

    goHome() {
      this.busy = true;
      transition.toScene(this, 'TitleScene');
    }
  };
}
