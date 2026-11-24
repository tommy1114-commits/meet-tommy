const stop = (x, y, name, action, target = [x, y, 22, 20]) => ({ x, y, name, action, target });
const trailStart = 44;
const trailFinish = 416;

export const weekday = [
  {
    time: '06:30', place: 'Tommy 的房間', art: 'room_bg', room: true,
    spawn: [66, 94],
    stops: [
      stop(81, 120, '早餐和咖啡', scene => scene.breakfast(), [80, 129, 34, 19]),
      stop(109, 148, '背上包出門', scene => {
        if (scene.done.has('breakfast')) scene.next();
        else scene.talk('先到矮桌旁吃點早餐、喝杯咖啡吧。');
      }, [119, 152, 22, 14]),
    ],
  },
  {
    time: '07:30', place: '文湖線進站', art: 'metro', spawn: [118, 136], floor: 106,
    stops: [stop(118, 99, '刷卡進站', scene => scene.talk(
      '先搭文湖線，再轉公車。今天想聽哪類 Podcast？',
      ['科技話題', '日常故事'].map(topic => ({
        text: topic,
        action: () => { scene.podcast = topic; scene.next(); },
      })),
    ), [124, 65, 31, 27])],
  },
  {
    time: '07:30', place: '搭乘文湖線', art: 'wenhu', ride: true,
    rideHint: 'A／轉乘公車',
    stops: [stop(197, 82, '下文湖線，轉搭公車', scene => scene.next())],
  },
  {
    time: '07:30', place: '轉乘公車', art: 'bus', ride: true,
    rideHint: 'A／點右側下車鈴',
    stops: [stop(224, 94, '下車鈴', scene => scene.next(), [224, 94, 20, 23])],
  },
  {
    time: '08:10–17:00', place: '公司', art: 'office', spawn: [146, 121], floor: 105,
    stops: [
      stop(149, 121, '打開工作台', scene => scene.openOfficeDesk(), [139, 51, 75, 36]),
    ],
  },
  {
    time: '18:00', place: '晚餐', art: 'dinner', spawn: [173, 138], floor: 91,
    stops: [stop(180, 101, '坐下來吃晚餐', scene => scene.talk(
      '忙完先吃個晚餐。晚一點去大湖公園跑步。',
      [{ text: '吃飽了，去大湖公園', action: () => scene.next() }],
    ), [183, 51, 23, 17])],
  },
  {
    time: '19:00', place: '大湖公園', art: 'park-trail', spawn: [47, 125], floor: 111, width: 480,
    trailStart, trailFinish,
    stops: [
      stop(trailStart, 122, '戴耳機，開始跑步', scene => {
        if (scene.done.has('run')) return;
        if (scene.player.x > 90) {
          scene.talk('先走到湖畔步道的起點，再開始跑吧。');
          return;
        }
        scene.done.add('run');
        scene.player.speed = 100;
        scene.player.isRunning = true;
        scene.talk(`接著聽早上選的「${scene.podcast}」。沿湖畔一路跑到出口吧。`);
      }, [23, 106, 20, 25]),
      stop(447, 135, '跑完回家', scene => {
        if (scene.done.has('run') && scene.runProgress >= trailFinish) scene.next();
        else if (scene.done.has('run')) scene.talk('再跑一小段，走到出口就回家。');
        else scene.talk('先回步道入口戴上耳機，再出發跑步。');
      }, [449, 119, 28, 27]),
    ],
  },
  {
    time: '20:30', place: 'Tommy 的房間', art: 'room_bg', room: true, night: true,
    spawn: [120, 111],
    stops: [
      stop(89, 75, '看看書', scene => {
        scene.eveningActivities.add('看看書');
        scene.talk('洗完澡了。睡前有時會挑本書看幾頁，看到有感覺的地方就停一下。');
      }, [87, 49, 43, 26]),
      stop(145, 74, '打開桌機', scene => scene.talk('洗完澡後，有時會在桌機前坐一下。今晚做什麼？', [
        { text: '看看 YouTube', action: () => scene.computer('video') },
        { text: '用 AI 開發 App', action: () => scene.computer('code') },
      ]), [149, 44, 24, 21]),
      stop(150, 79, '滑滑交友軟體', scene => {
        scene.eveningActivities.add('滑滑交友軟體');
        scene.talk('我做這個小遊戲，也是想試試用另一種方式打招呼。');
      }, [163, 52, 10, 11]),
      stop(49, 98, '23:00 熄燈睡覺', scene => scene.next(), [34, 66, 40, 41]),
    ],
  },
  { time: '23:00', place: '晚安', art: 'room_bg', room: true, sleep: true, stops: [] },
];
