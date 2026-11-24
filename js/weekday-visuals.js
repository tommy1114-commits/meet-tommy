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
    const lamp = scene.add.graphics();
    lamp.fillStyle(0xffb651, stage.sleep ? 0.12 : 0.27);
    lamp.fillEllipse(152, 58, 66, 39);
    lamp.fillStyle(0xffdc8a, 0.23);
    lamp.fillEllipse(150, 54, 35, 20);
    breathe(scene, lamp, 0.78, 1700);
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
  } else if (stage.art === 'park') {
    for (let index = 0; index < 11; index += 1) {
      const reflection = scene.add.rectangle(60 + index * 13, 59 + (index % 3) * 7,
        2 + index % 4, 1, index % 2 ? 0xfbc47a : 0xb1ccec, 0.55);
      if (scene.motion) {
        scene.tweens.add({
          targets: reflection, x: '+=4', alpha: 0.16, duration: 800 + index * 105,
          yoyo: true, repeat: -1, ease: 'Sine.inOut',
        });
      }
    }
  } else {
    const office = stage.art === 'office';
    const device = scene.add.rectangle(office ? 112 : 132, office ? 51 : 56,
      office ? 16 : 5, office ? 9 : 4, 0x9de4f8, 0.31);
    breathe(scene, device, 0.25, office ? 950 : 520);
  }
}

export function makeBus(scene) {
  const sky = scene.add.graphics();
  sky.fillStyle(0xa4d5eb).fillRect(0, 29, 240, 50);
  sky.fillStyle(0xe8edd1).fillRect(0, 70, 240, 9);
  const drawStreet = (layer, front) => {
    for (let index = 0; index < 24; index += 1) {
      const x = index * 20;
      const height = 10 + ((index % 12) * 13 % 22);
      if (front) {
        layer.fillStyle(0x7780a2).fillRect(x, 76, 20, 8);
        layer.fillStyle(0xf6db99).fillRect(x + 5, 80, 7, 1);
        if (index % 2 === 0) {
          layer.fillStyle(0x65534b).fillRect(x + 9, 63, 2, 14);
          layer.fillStyle(0x629071).fillRect(x + 4, 60, 12, 9);
        }
      } else {
        layer.fillStyle(index % 2 ? 0x809cb3 : 0xdea981).fillRect(x, 73 - height, 16, height);
        for (let row = 75 - height; row < 71; row += 5) {
          layer.fillStyle(0xe9e4b4).fillRect(x + 3, row, 2, 2).fillRect(x + 10, row, 2, 2);
        }
      }
    }
  };
  for (const [front, duration] of [[false, 11500], [true, 4100]]) {
    const layer = scene.add.graphics();
    drawStreet(layer, front);
    if (scene.motion) scene.tweens.add({ targets: layer, x: -240, duration, repeat: -1 });
  }
  const cabin = scene.add.container();
  const frame = scene.add.graphics();
  frame.fillStyle(0x303b53).fillRect(0, 0, 240, 32).fillRect(0, 83, 240, 80);
  frame.fillStyle(0x8792a6).fillRect(0, 13, 240, 13).fillRect(0, 84, 240, 12);
  frame.fillStyle(0x516479).fillRect(0, 101, 240, 61);
  frame.fillStyle(0x7c8b9d).fillRect(0, 127, 240, 34);
  frame.fillStyle(0x29364e).fillRect(0, 79, 240, 5).fillRect(0, 26, 240, 6);
  for (const x of [0, 77, 159, 234]) {
    frame.fillStyle(0x354258).fillRect(x, 26, 6, 60);
    frame.fillStyle(0xdca24f).fillRect(x + 1, 31, 1, 48);
  }
  for (const x of [31, 109, 193]) {
    frame.lineStyle(2, 0xf3bd5e).strokeTriangle(x, 29, x - 5, 39, x + 5, 39);
    frame.fillStyle(0x384275).fillRoundedRect(x - 23, 91, 41, 25, 3).fillRoundedRect(x - 21, 113, 42, 9, 3);
    frame.fillStyle(0x6078a5).fillRect(x - 20, 94, 33, 16);
    frame.fillStyle(0x9bacbd).fillRect(x - 20, 121, 3, 10).fillRect(x + 14, 121, 3, 10);
    for (let dot = 0; dot < 8; dot += 1) {
      frame.fillStyle(0xe4ba74, 0.65).fillRect(x - 17 + (dot % 4) * 8, 97 + Math.floor(dot / 4) * 6, 1, 1);
    }
  }
  frame.fillStyle(0xf5c267).fillRect(7, 26, 2, 102).fillRect(228, 26, 2, 102);
  frame.fillStyle(0x52677e).fillRect(212, 72, 15, 20);
  frame.fillStyle(0x9dd1aa).fillRect(214, 74, 11, 5);
  const rider = scene.add.sprite(109, 97, 'tommy_sprites', 9);
  const headphones = scene.add.graphics();
  headphones.lineStyle(1.5, 0xc9dae7).strokeCircle(108, 85, 4);
  headphones.fillStyle(0xf1ddbd).fillRect(103, 85, 2, 4);
  cabin.add([frame, rider, headphones]);
  if (scene.motion) scene.tweens.add({ targets: cabin, y: 1, duration: 340, yoyo: true, repeat: -1 });
}

export function typeAtDesk(scene, mode, sound, complete) {
  const origin = { x: scene.player.x, y: scene.player.y };
  scene.player.setVisible(false);
  const seated = scene.add.sprite(151, 66, 'tommy_sprites', 3).setDepth(190);
  const display = scene.add.graphics().setDepth(175);
  const hands = scene.add.graphics().setDepth(195);
  const redraw = (frame) => {
    display.clear().fillStyle(0x4776bb, 0.18 + (frame % 3) * 0.09).fillEllipse(151, 47, 43, 23);
    display.fillStyle(0x94cdf4, 0.93).fillRect(144, 39, 12, 7);
    if (mode === 'code') {
      for (let line = 0; line < 3; line += 1) {
        display.fillStyle(line % 2 ? 0xe6d485 : 0x3c639a).fillRect(145, 40 + line * 2, 3 + (frame + line) % 6, 1);
      }
      hands.clear().fillStyle(0xf1bd86)
        .fillRect(146, 54 + (frame % 2), 2, 2).fillRect(155, 55 - (frame % 2), 2, 2);
      if (frame) sound.playText();
    } else {
      display.fillStyle(frame % 2 ? 0xe69c8b : 0x7388c6).fillRect(145, 40, 10, 5);
    }
  };
  redraw(0);
  let frame = 0;
  if (scene.motion) {
    scene.time.addEvent({ delay: 140, repeat: 8, callback: () => redraw(++frame) });
  }
  scene.time.delayedCall(scene.motion ? 1420 : 550, () => {
    [display, hands, seated].forEach(object => object.destroy());
    scene.player.setPosition(origin.x, origin.y).setVisible(true);
    complete();
  });
}
