function breathe(scene, target, alpha, duration = 1100) {
  if (scene.motion) {
    scene.tweens.add({ targets: target, alpha, duration, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
}

function steam(scene, x, y) {
  for (let index = 0; index < 3; index += 1) {
    const puff = scene.add.ellipse(x + index * 2, y, 3, 2, 0xffefdb, 0.55).setDepth(210);
    if (scene.motion) {
      scene.tweens.add({
        targets: puff, x: '+=3', y: '-=9', alpha: 0, duration: 1200,
        repeat: -1, delay: index * 270,
      });
    }
  }
}

export function animateStop(scene, stage) {
  if (stage.room && scene.index === 0) {
    const sunlight = scene.add.graphics();
    sunlight.fillStyle(0xffd881, 0.23);
    sunlight.fillPoints([{ x: 192, y: 32 }, { x: 227, y: 32 }, { x: 149, y: 119 }, { x: 99, y: 119 }], true);
    breathe(scene, sunlight, 0.62, 2200);
    scene.add.ellipse(88, 126, 12, 8, 0xffeacf).setDepth(180);
    scene.add.ellipse(87, 126, 7, 5, 0xac683e).setDepth(181);
    scene.add.circle(88, 125, 1.8, 0xffd373).setDepth(182);
    steam(scene, 75, 128);
    return;
  }
  if (stage.room) {
    scene.background.setTint(stage.sleep ? 0x42466a : 0x9290a9);
    const nightWindow = scene.add.rectangle(208, 24, 25, 19, 0x263b73, 0.6);
    const windowLights = scene.add.graphics();
    windowLights.fillStyle(0xffc574, 0.7);
    for (const [x, y] of [[199, 27], [204, 31], [211, 28], [216, 31]]) windowLights.fillRect(x, y, 1, 2);
    breathe(scene, windowLights, 0.35, 2100);
    nightWindow.setDepth(1);
    windowLights.setDepth(2);
    if (stage.sleep) {
      const dark = scene.add.rectangle(120, 80, 240, 160, 0x131830, 0).setDepth(220);
      if (scene.motion) scene.tweens.add({ targets: dark, alpha: 0.47, duration: 1500 });
      else dark.setAlpha(0.47);
    }
    return;
  }
  if (stage.art === 'dinner') {
    steam(scene, 181, 46);
    breathe(scene, scene.add.ellipse(182, 51, 53, 19, 0xffa74a, 0.14), 0.5);
  } else if (stage.art === 'park-trail') {
    for (let index = 0; index < 38; index += 1) {
      const reflection = scene.add.rectangle(14 + index * 12, 74 + (index % 5) * 4,
        2 + index % 4, 0.8, index % 2 ? 0xfbc47a : 0xb1ccec, 0.48);
      if (scene.motion) {
        scene.tweens.add({
          targets: reflection, x: '+=4', alpha: 0.16, duration: 800 + index * 105,
          yoyo: true, repeat: -1, ease: 'Sine.inOut',
        });
      }
    }
    for (const x of [22, 109, 243, 360, 459]) {
      const light = scene.add.ellipse(x, 101, 18, 19, 0xffb15d, 0.18);
      breathe(scene, light, 0.38, 1450 + x);
    }
  } else {
    const office = stage.art === 'office';
    const device = scene.add.rectangle(office ? 112 : 132, office ? 51 : 56,
      office ? 16 : 5, office ? 9 : 4, 0x9de4f8, 0.31);
    breathe(scene, device, 0.25, office ? 950 : 520);
  }
}

export function makeWenhu(scene) {
  const sky = scene.add.graphics();
  sky.fillStyle(0xa9d2f0).fillRect(0, 0, 240, 160);
  sky.fillStyle(0xd5ebef).fillRect(0, 48, 240, 28);
  sky.fillStyle(0x9da9a3).fillRect(0, 76, 240, 84);
  const views = [
    [19000, (layer, x, index) => {
      const ridge = 52 + index % 3 * 3;
      layer.fillStyle(0x87a9ad).fillTriangle(x - 8, 66, x + 10, ridge, x + 30, 66);
      if (index % 3 === 0) {
        layer.fillStyle(0xf5ebe0).fillRect(x + 4, 37, 15, 2).fillRect(x + 8, 35, 8, 3);
      }
    }],
    [9200, (layer, x, index) => {
      const top = 49 + (index * 7 % 15);
      const frontage = [0x8c99ad, 0xcdb4a4, 0xa5a5b6][index % 3];
      layer.fillStyle(0x667b89).fillRect(x + 3, top - 2, 9, 3);
      layer.fillStyle(frontage).fillRect(x + 1, top, 16, 83 - top);
      layer.fillStyle(0x697d90).fillRect(x + 14, top + 2, 3, 81 - top);
      for (let y = top + 4; y < 78; y += 4) {
        layer.fillStyle(0xe5decb).fillRect(x + 4, y, 2, 2).fillRect(x + 9, y, 2, 2);
      }
    }],
    [3800, (layer, x, index) => {
      layer.fillStyle(0xa0a2a9).fillRect(x, 71, 20, 12);
      layer.fillStyle(0xd6c7b9).fillRect(x, 70, 20, 2);
      layer.fillStyle(0x756e79).fillRect(x, 76, 20, 2);
      if (index % 2 === 0) {
        layer.fillStyle(0x7d808e).fillRect(x + 4, 43, 2, 28);
        layer.fillStyle(0xbfc1c5).fillRect(x + 4, 44, 1, 25);
      }
    }],
  ];
  for (const [duration, draw] of views) {
    const layer = scene.add.graphics();
    for (let index = 0; index < 24; index += 1) draw(layer, index * 20, index % 12);
    if (scene.motion) scene.tweens.add({ targets: layer, x: -240, duration, repeat: -1 });
  }

  const windowView = scene.add.container().setAlpha(0);
  const windowSky = scene.add.graphics();
  windowSky.fillStyle(0xa9d0ec).fillRect(0, 0, 240, 160);
  windowSky.fillStyle(0xa8b5a8).fillRect(0, 120, 240, 40);
  windowView.add(windowSky);
  for (const [foreground, duration] of [[false, 12000], [true, 6500]]) {
    const layer = scene.add.graphics();
    for (let index = 0; index < 12; index += 1) {
      const variant = index % 6;
      const x = index * 40;
      const top = (foreground ? 18 : 53) + variant * 7 % 31;
      if (foreground && variant % 2 === 0) {
        layer.fillStyle(0x6d8c83).fillEllipse(x + 14, 134, 23, 29);
        layer.fillStyle(0x8eaa8a).fillEllipse(x + 9, 127, 17, 19);
        continue;
      }
      const wall = foreground ? 0xc6a895 : 0x95a6b3;
      const pane = foreground ? 0x83adc1 : 0xaebfc7;
      layer.fillStyle(wall).fillRect(x + 3, top, 35, 147 - top);
      layer.fillStyle(0xe3ccaf).fillRect(x + 3, top, 2, 147 - top);
      for (let y = top + 5; y < 140; y += 12) {
        for (let col = x + 7; col < x + 30; col += 10) {
          layer.fillStyle(pane).fillRect(col, y, 7, 8);
          layer.fillStyle(0xd5d9ce).fillRect(col, y, 7, 1);
        }
      }
    }
    windowView.add(layer);
    if (scene.motion) scene.tweens.add({ targets: layer, x: -240, duration, repeat: -1 });
  }

  const cabin = scene.add.image(120, 80, 'weekday-wenhu-val256-aisle').setDisplaySize(242, 162);
  const windowSeat = scene.add.image(120, 80, 'weekday-wenhu-val256-window').setDisplaySize(242, 162).setAlpha(0);
  if (scene.motion) {
    scene.tweens.add({ targets: [cabin, windowSeat], y: 80.42, duration: 620, repeat: -1, yoyo: true, ease: 'Sine.inOut' });
    scene.tweens.add({ targets: cabin, alpha: 0, duration: 360, delay: 1450 });
    scene.tweens.add({ targets: windowView, alpha: 1, duration: 360, delay: 1450 });
    scene.tweens.add({ targets: windowSeat, alpha: 1, duration: 360, delay: 1450 });
  } else {
    cabin.setVisible(false);
    windowView.setAlpha(1);
    windowSeat.setAlpha(1);
  }
}

export function makeBus(scene) {
  const sky = scene.add.graphics();
  sky.fillStyle(0xa6cced).fillRect(0, 0, 240, 160);
  sky.fillStyle(0xc8d5c6).fillRect(0, 75, 240, 48);
  sky.fillStyle(0x85828e).fillRect(0, 93, 240, 67);
  const street = [
    [14000, (layer, x, index) => {
      const roof = 24 + index * 11 % 30;
      const height = 92 - roof;
      layer.fillStyle(index % 2 ? 0xbfc1bd : 0x93a7b7).fillRect(x + 2, roof, 29, height);
      layer.fillStyle(0x798d9b).fillRect(x + 26, roof, 5, height);
      for (let y = roof + 7; y < 85; y += 7) {
        layer.fillStyle(0xe4dec6).fillRect(x + 6, y, 4, 3).fillRect(x + 15, y, 5, 3);
      }
    }],
    [8700, (layer, x, index) => {
      if (index % 3 === 0) {
        layer.fillStyle(0x655950).fillRect(x + 12, 70, 2, 23);
        layer.fillStyle(0x476b5d).fillEllipse(x + 12, 65, 22, 23);
        layer.fillStyle(0x75946d).fillEllipse(x + 9, 62, 14, 17);
      } else {
        layer.fillStyle(0xd0b095).fillRect(x + 1, 62, 27, 32);
        layer.fillStyle(0x627d85).fillRect(x + 4, 76, 19, 15);
        layer.fillStyle(index % 2 ? 0xa58171 : 0x657e73).fillRect(x, 72, 29, 6);
        layer.fillStyle(0xb9c9c4).fillRect(x + 7, 79, 6, 7).fillRect(x + 17, 79, 3, 7);
      }
    }],
    [4800, (layer, x, index) => {
      layer.fillStyle(0xd6ccc0).fillRect(x, 93, 30, 3);
      layer.fillStyle(0xebe0c8).fillRect(x + 6, 106, 13, 1);
      if (index % 4 === 0) {
        layer.fillStyle(0x6a798c).fillRoundedRect(x + 3, 96, 22, 7, 2);
        layer.fillStyle(0xb6c8d0).fillRect(x + 8, 93, 11, 4);
        layer.fillStyle(0x47434b).fillRect(x + 7, 101, 3, 3).fillRect(x + 20, 101, 3, 3);
      }
    }],
  ];
  for (const [duration, draw] of street) {
    const layer = scene.add.graphics();
    for (let index = 0; index < 16; index += 1) draw(layer, index * 30, index % 8);
    if (scene.motion) scene.tweens.add({ targets: layer, x: -240, duration, repeat: -1 });
  }
  const cabin = scene.add.image(120, 80, 'weekday-bus-standing').setDisplaySize(244, 164);
  if (scene.motion) {
    scene.tweens.add({ targets: cabin, x: 120.7, y: 80.55, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
}

export function sipCoffee(scene, complete) {
  scene.player.setVisible(false);
  const seated = scene.add.sprite(60, 132, 'tommy_sprites', 24).setScale(0.275).setDepth(133);
  if (scene.motion) {
    scene.time.delayedCall(260, () => seated.setFrame(25));
    scene.time.delayedCall(820, () => seated.setFrame(24));
  }
  scene.time.delayedCall(scene.motion ? 1090 : 210, () => {
    seated.destroy();
    scene.player.setVisible(true);
    complete();
  });
}

export function typeAtDesk(scene, mode, sound, complete) {
  const image = scene.add.image(120, 80, 'weekday-night-desktop').setDisplaySize(240, 160);
  const keys = scene.add.image(135.5, 98.5, 'weekday-night-desktop-keys').setDisplaySize(49, 25);
  const screen = scene.add.graphics();
  const panel = scene.add.container(0, 0, [image, keys, screen]).setDepth(500).setAlpha(0);
  const typing = mode === 'code';

  function redraw(frame) {
    keys.setVisible(typing && frame % 2 === 1);
    const screenPoint = (u, v) => ({ x: 131.5 + u * 39.5, y: 56 + v * 23 });
    const fill = (color, alpha, left, top, right, bottom) => {
      screen.fillStyle(color, alpha).fillPoints([
        screenPoint(left, top), screenPoint(right, top), screenPoint(right, bottom), screenPoint(left, bottom),
      ], true);
    };
    screen.clear();
    fill(0x27282a, 1, 0, 0, 1, 1);
    if (typing) {
      fill(0x414244, 1, 0, 0, 1, 0.14);
      fill(0x333436, 1, 0, 0.14, 0.17, 1);
      const lines = Math.min(7, frame + 2);
      for (let index = 0; index < lines; index += 1) {
        const indent = index % 3 === 0 ? 0.23 : 0.31;
        const row = 0.24 + index * 0.091;
        fill([0x929b95, 0x9ca8a4, 0xb3aa92][index % 3], 1, indent, row, indent + 0.18 + index % 4 * 0.093, row + 0.03);
      }
      const y = 0.24 + lines * 0.091;
      if (frame % 2 === 0) fill(0xb8bab7, 1, 0.24, y, 0.27, y + 0.06);
    } else {
      fill(0x484c4d, 1, 0.07, 0.1, 0.91, 0.81);
      fill(frame % 3 ? 0x777a6f : 0x727974, 1, 0.13, 0.16, 0.85, 0.73);
      fill(0x94736f, 1, 0.08, 0.88, Math.min(0.88, 0.14 + frame * 0.06), 0.93);
    }
  }

  redraw(0);
  const finish = () => {
    panel.destroy(true);
    complete();
  };
  if (!scene.motion) {
    panel.setAlpha(1);
    scene.time.delayedCall(1100, finish);
    return;
  }
  scene.tweens.add({ targets: panel, alpha: 1, duration: 220 });
  let frame = 0;
  scene.time.addEvent({
    delay: 155,
    repeat: 13,
    callback: () => {
      redraw(++frame);
      if (typing && frame % 3 !== 0) sound.playText();
    },
  });
  scene.time.delayedCall(2400, () => {
    scene.tweens.add({ targets: panel, alpha: 0, duration: 230, onComplete: finish });
  });
}
