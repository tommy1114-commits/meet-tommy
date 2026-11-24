const workCards = [
  ['NDA', '合作夥伴下週要來開會。我會先看看保密協議還在不在效期，這次的討論有沒有涵蓋在裡面。', ['先確認期限和討論範圍', '直接把資料寄出去'], ['對，先確認範圍，再決定哪些資料可以分享。', '我會先留住資料，查清楚能分享的範圍再寄。']],
  ['營業秘密', '這份研究資料是內部使用的。我得想想，哪幾個人真的需要看？', ['依工作需要設定權限', '讓有連結的人都能看'], ['我會把權限留給需要的人，也記下分享的範圍。', '連結很容易被轉傳。我會改成只有指定的人能看。']],
  ['專利申請', '研究團隊準備發表成果，我會跟團隊確認公開日期，再一起安排專利申請。', ['確認最早會在哪一天公開', '發表完再問申請進度'], ['對，知道最早公開的日子，才好把申請時程往前排。', '我會在公開前先跟團隊對一下時程。']],
  ['技轉授權', '有廠商想把研究成果用在產品裡。我會先問清楚，他們想用在哪裡、希望用多久。', ['先問用途和期間', '先答應所有用途'], ['問清楚這兩件事，就有方向可以接著談。', '我會先釐清需求，再和團隊討論適合的授權範圍。']],
];

const stop = (x, y, name, action) => ({ x, y, name, action });

export const weekday = [
  {
    time: '06:30', place: 'Tommy 的房間', art: 'room_bg', room: true,
    spawn: [69, 100],
    stops: [
      stop(81, 120, '吃早餐、喝咖啡', scene => {
        scene.done.add('breakfast');
        scene.talk('早安！我通常六點半起床。先吃個早餐、喝杯咖啡，再拿背包出門。');
      }),
      stop(120, 151, '背上包出門', scene => {
        if (scene.done.has('breakfast')) scene.next();
        else scene.talk('出門前，我通常會先坐下來吃早餐、喝杯咖啡。走到矮桌旁吧！');
      }),
    ],
  },
  {
    time: '07:30', place: '捷運站', art: 'metro', spawn: [118, 136], floor: 106,
    stops: [stop(118, 113, '戴上耳機，搭捷運', scene => scene.talk(
      '七點半出門。先搭捷運，再轉公車去公司。通勤這段時間，我通常會聽 Podcast。今天聽哪一類？',
      ['聊科技的', '聊日常故事的'].map(topic => ({
        text: topic,
        action: () => { scene.podcast = topic; scene.next(); },
      })),
    ))],
  },
  {
    time: '07:30', place: '轉乘公車', art: 'bus', ride: true,
    stops: [stop(120, 123, '下車去公司', scene => scene.next())],
  },
  {
    time: '08:10–17:00', place: '公司', art: 'office', spawn: [122, 138], floor: 105,
    stops: [
      ...workCards.map(([name, text, choices, replies], index) =>
        stop(104 + index * 27, 109, name, scene => scene.talk(text, choices.map((choice, answer) => ({
          text: choice,
          action: () => {
            scene.done.add(name);
            scene.lastWork = name;
            scene.afterDialogue(() => scene.talk(replies[answer]));
          },
        }))))),
      stop(218, 145, '17:00 下班', scene => {
        if (scene.lastWork) scene.next();
        else scene.talk('下班前，先選一份文件看看我今天在忙什麼吧。');
      }),
    ],
  },
  {
    time: '18:00', place: '晚餐', art: 'dinner', spawn: [173, 138], floor: 91,
    stops: [stop(180, 101, '坐下來吃晚餐', scene => scene.talk(
      `下班後，六點左右吃晚餐。今天看了${scene.lastWork}，現在先把工作放一放。吃完晚一點去大湖公園跑步。`,
      [{ text: '吃飽了，去大湖公園', action: () => scene.next() }],
    ))],
  },
  {
    time: '19:00', place: '大湖公園', art: 'park', spawn: [47, 126], floor: 105,
    stops: [
      stop(44, 122, '戴耳機，開始跑步', scene => {
        scene.done.add('run');
        scene.player.speed = 100;
        scene.talk('晚上七點，我會來大湖公園跑步，邊跑邊聽 Podcast。沿著湖畔跑到前面的路燈吧！');
      }),
      stop(206, 124, '跑完回家', scene => {
        if (scene.done.has('run')) scene.next();
        else scene.talk('走到步道起點戴上耳機，就可以開始跑了。');
      }),
    ],
  },
  {
    time: '20:30', place: 'Tommy 的房間', art: 'room_bg', room: true,
    spawn: [120, 111],
    stops: [
      stop(89, 75, '看看書', scene => {
        scene.done.add('evening');
        scene.talk('洗完澡了。睡前有時會挑本書看幾頁，看到有感覺的地方就停一下。');
      }),
      stop(145, 74, '打開電腦', scene => scene.talk('洗完澡後，偶爾會在電腦前坐一下。今晚做什麼？', [
        { text: '看看 YouTube', action: () => scene.computer('video') },
        { text: '用 AI 開發 App', action: () => scene.computer('code') },
      ])),
      stop(105, 127, '滑滑交友軟體', scene => {
        scene.done.add('evening');
        scene.talk('有時也會打開交友軟體，看看有沒有想多聊兩句的人。這個小遊戲，就是我想到的一種打招呼方式。');
      }),
      stop(49, 98, '23:00 熄燈睡覺', scene => scene.next()),
    ],
  },
  {
    time: '23:00', place: '晚安', art: 'room_bg', room: true, sleep: true,
    stops: [stop(120, 123, '結束這一天', scene => scene.finish())],
  },
];
