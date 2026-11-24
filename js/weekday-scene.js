import { weekday } from './weekday-data.js?v=3.8';
import { animateStop, makeBus, makeWenhu, sipCoffee, typeAtDesk } from './weekday-visuals.js?v=3.8';
import { walkToDesk } from './weekday-walk.js?v=3.8';
import { OfficeDesk } from './weekday-office.js?v=3.8';

const movementHint = '方向鍵移動 · 點物件或靠近按 A · B 返回';

export function createWeekdayScene(Phaser, Player, Dialogue, Room, sound, transition) {
  return class WeekdayScene extends Phaser.Scene {
    constructor() {
      super('WeekdayScene');
    }

    init() {
      this.index = 0;
      this.done = new Set();
      this.eveningActivities = new Set();
      this.podcast = '';
      this.runProgress = 0;
      this.busy = false;
    }

    preload() {
      for (const key of [
        'metro', 'office', 'dinner', 'park-trail', 'bus-standing', 'wenhu-val256-aisle', 'wenhu-val256-window',
        'night-desktop', 'night-desktop-keys',
      ]) {
        this.load.image(`weekday-${key}`, `assets/weekday/${key}.png`);
      }
    }

    create() {
      this.cameras.main.setZoom(4).centerOn(120, 80);
      this.motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.pill = document.getElementById('discovery-pill');
      this.shell = document.querySelector('.app-shell');
      this.shell.classList.add('weekday-active');
      this.recap = document.getElementById('weekday-recap');
      this.recapHome = document.getElementById('weekday-recap-home');
      this.recapHome.onclick = () => this.leaveRecap();
      this.officeDesk = new OfficeDesk(this.shell.querySelector('.screen-bezel'), sound,
        () => this.next(),
        () => {
          this.player?.unlock();
          this.hint = '';
        });
      this.transferButton = document.createElement('button');
      this.transferButton.type = 'button';
      this.transferButton.className = 'weekday-transfer hidden';
      this.transferButton.textContent = '轉乘公車';
      this.transferButton.addEventListener('click', () => this.activate(this.hotspots[0]));
      this.shell.querySelector('.screen-bezel').appendChild(this.transferButton);
      this.pillWasHidden = this.pill.classList.contains('hidden');
      this.pill.classList.add('hidden');
      this.dialogueManager = new Dialogue(this);
      this.events.once('shutdown', () => {
        this.pill.classList.toggle('hidden', this.pillWasHidden);
        this.shell.classList.remove('weekday-active');
        this.transferButton.remove();
        this.officeDesk.destroy();
        this.recap.classList.add('hidden');
        this.recapHome.onclick = null;
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
      this.cameras.main.centerOn(120, 80);
      this.hasTransferButton = stage.art === 'wenhu';
      window.updateSceneName(`${stage.time} · ${stage.place}`);
      if (this.motion) {
        document.getElementById('scene-badge').animate(
          [{ opacity: 0.35, transform: 'translateY(-3px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 400, easing: 'ease-out' },
        );
      }
      window.updateControlHint(movementHint);

      if (stage.art === 'wenhu') {
        makeWenhu(this);
      } else if (stage.art === 'bus') {
        makeBus(this);
      } else {
        const key = stage.room ? stage.art : `weekday-${stage.art}`;
        const width = stage.width || 240;
        this.background = this.add.image(width / 2, 80, key).setDisplaySize(width, 160);
        animateStop(this, stage);
      }

      if (stage.spawn) {
        this.player = new Player(this, ...stage.spawn);
        if (stage.room) {
          Room.prototype.initPhysicsColliders.call(this);
          this.roomCollider = this.physics.add.collider(this.player, this.obstacles);
          this.add.image(83, 139, 'coffee_table_fg')
            .setDisplaySize(50, 37.5).setDepth(134)
            .setTint(stage.night ? 0x9c91a3 : 0xffffff);
        } else {
          this.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(
            8, stage.floor, (stage.width || 240) - 16, stage.width ? 153 - stage.floor : 49,
          ));
        }
      }

      for (const stop of stage.stops) this.addHotspot(stop);
      this.hovered = null;
      this.hint = '';
      transition.fadeIn(this);
      if (stage.sleep) {
        this.finish();
      }
    }

    createStaticBox(x, y, width, height) {
      Room.prototype.createStaticBox.call(this, x, y, width, height);
    }

    addHotspot(stop) {
      if (this.hasTransferButton) {
        this.hotspots.push(stop);
        return;
      }
      const [x, y, width, height] = stop.target;
      const marker = this.add.graphics().setDepth(300);
      const area = this.add.zone(x, y, width, height).setDepth(301)
        .setInteractive({ useHandCursor: true });
      area.on('pointerdown', () => this.activate(stop));
      area.on('pointerover', () => { this.hovered = stop; });
      area.on('pointerout', () => { if (this.hovered === stop) this.hovered = null; });
      this.hotspots.push({ ...stop, marker, source: stop });
    }

    drawTarget(stop, strong) {
      const [x, y, width, height] = stop.target;
      const radius = Math.min(4, width / 2 - 1);
      const marker = stop.marker;
      marker.clear().lineStyle(strong ? 1.35 : 0.85, 0xffd989, strong ? 0.99 : 0.64);
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          const cornerX = x + sx * width / 2;
          const cornerY = y + sy * height / 2;
          marker.beginPath().moveTo(cornerX - sx * radius, cornerY)
            .lineTo(cornerX, cornerY).lineTo(cornerX, cornerY - sy * radius).strokePath();
        }
      }
    }

    activate(stop) {
      if (!stop || this.busy || this.dialogueManager.isActive || this.officeDesk.active || !this.settingsClosed()) return;
      sound.playConfirm();
      stop.action(this);
    }

    settingsClosed() {
      return ['settings-modal', 'help-modal', 'about-modal'].every(id => document.getElementById(id).classList.contains('hidden'));
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
      const playing = !this.busy && !this.dialogueManager.isActive && !this.officeDesk.active &&
        this.recap.classList.contains('hidden') && this.settingsClosed();
      if (playing) this.player?.update();
      else this.player?.body.setVelocity(0, 0);
      const current = playing ? this.nearbyStop() : null;
      const stage = weekday[this.index];
      if (stage.width) {
        const center = Phaser.Math.Clamp(this.player.x, 120, stage.width - 120);
        this.cameras.main.centerOn(center, 80);
        if (playing && stage.trailFinish && this.done.has('run')) {
          this.runProgress = Math.max(this.player.x, this.runProgress);
        }
      }
      this.transferButton.classList.toggle('hidden', !playing || !this.hasTransferButton);
      if (playing) {
        const selected = this.hotspots.find(stop => stop.source === this.hovered) ?? current;
        const running = stage.trailFinish && this.done.has('run');
        const percent = running ? Phaser.Math.Clamp(
          Math.floor((this.runProgress - stage.trailStart) / (stage.trailFinish - stage.trailStart) * 20) * 5,
          0, 100,
        ) : 0;
        const hint = stage.ride ? `Podcast：${this.podcast} · ${stage.rideHint}`
          : selected && !(running && selected.x < 100) ? `按 A · ${selected.name}`
          : running ? `湖畔夜跑 ${percent}% · Podcast：${this.podcast}` : movementHint;
        if (hint !== this.hint) {
          this.hint = hint;
          window.updateControlHint(hint);
        }
        for (const stop of this.hotspots) {
          if (!stop.marker) continue;
          stop.marker.setVisible(true);
          if (stop.highlighted === (stop === selected)) continue;
          stop.highlighted = stop === selected;
          this.drawTarget(stop, stop.highlighted);
        }
      } else {
        this.hint = '';
        for (const stop of this.hotspots) stop.marker?.setVisible(false);
      }
    }

    handleVirtualA() {
      if (!this.settingsClosed() || this.busy) return;
      if (!this.recap.classList.contains('hidden')) this.leaveRecap();
      else if (this.officeDesk.active) this.officeDesk.confirm();
      else if (this.dialogueManager.isActive) this.dialogueManager.handleAdvance();
      else this.activate(this.nearbyStop());
    }

    handleVirtualB() {
      if (!this.settingsClosed() || this.busy) return;
      if (!this.recap.classList.contains('hidden')) {
        this.leaveRecap();
        return;
      }
      if (this.officeDesk.active) {
        this.officeDesk.back();
        return;
      }
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
      if (this.officeDesk.active) return;
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

    openOfficeDesk() {
      this.player.lock();
      this.officeDesk.open();
      window.updateControlHint('按 A 繼續 · B 返回');
    }

    breakfast() {
      if (this.done.has('breakfast')) {
        this.talk('咖啡喝完了。從下方門口出發吧。');
        return;
      }
      this.busy = true;
      this.player.lock();
      window.updateControlHint('早餐時間');
      sipCoffee(this, () => {
        this.done.add('breakfast');
        this.busy = false;
        this.talk('早安。喝完咖啡，拿了背包就出門。');
      });
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
      this.eveningActivities.add(mode === 'code' ? '用 AI 開發 App' : '看看 YouTube');
      this.busy = true;
      this.afterDialogue(() => {
        this.player.lock();
        window.updateControlHint('走到桌前');
        walkToDesk(this, () => {
          window.updateControlHint(mode === 'code' ? '用 AI 開發 App' : '看 YouTube');
          typeAtDesk(this, mode, sound, () => {
            this.busy = false;
            this.talk(mode === 'code'
              ? '先用 AI 試做一個小功能，跑起來後再慢慢調整。'
              : '睡前看看 YouTube，讓腦袋從白天的工作切換一下。');
          });
        });
      });
    }

    finish() {
      document.getElementById('weekday-recap-run').textContent =
        `在大湖公園跑步，繼續聽「${this.podcast}」`;
      document.getElementById('weekday-recap-evening').textContent =
        [...this.eveningActivities].join('、') || '洗完澡，準備休息';
      this.recap.classList.remove('hidden');
      this.recapHome.focus({ preventScroll: true });
      window.updateControlHint('A · 回到首頁');
    }

    leaveRecap() {
      if (this.busy || !this.settingsClosed()) return;
      sound.playConfirm();
      this.recap.classList.add('hidden');
      this.goHome();
    }

    goHome() {
      this.busy = true;
      transition.toScene(this, 'TitleScene');
    }
  };
}
