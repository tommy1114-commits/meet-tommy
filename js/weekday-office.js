import { officeCases } from './weekday-office-data.js?v=3.7.1';

const element = (tag, text = '') => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};

export class OfficeDesk {
  constructor(parent, sound, onFinish, onClose) {
    this.sound = sound;
    this.onFinish = onFinish;
    this.onClose = onClose;
    this.index = 0;
    this.panel = element('section');
    this.panel.className = 'weekday-office hidden';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-label', 'Tommy 的工作台');
    parent.appendChild(this.panel);
  }

  get active() {
    return !this.panel.classList.contains('hidden');
  }

  open() {
    this.panel.classList.remove('hidden');
    this.render();
  }

  close() {
    this.panel.classList.add('hidden');
    this.onClose();
  }

  destroy() {
    this.panel.remove();
  }

  confirm() {
    this.sound.playConfirm();
    if (this.index === officeCases.length) {
      this.close();
      this.onFinish();
      return;
    }
    this.index += 1;
    this.render();
  }

  back() {
    this.sound.playCancel();
    this.close();
  }

  render() {
    const job = officeCases[this.index];
    const heading = element('h2', job?.name ?? '17:00 · 下班');
    const content = element('div');
    content.className = 'weekday-office-content';
    if (job) {
      content.append(element('p', job.event));
      const response = element('p', job.response);
      response.className = 'weekday-office-response';
      content.append(response);
    } else {
      content.append(element('p', '今天的工作告一段落。收好東西，去吃晚餐吧！'));
    }
    const actions = element('div');
    actions.className = 'weekday-office-actions';
    const button = element('button', job ? 'A · 繼續' : 'A · 去吃晚餐');
    button.type = 'button';
    button.addEventListener('click', () => this.confirm());
    actions.append(button);
    this.panel.replaceChildren(heading, content, actions);
    button.focus({ preventScroll: true });
  }
}
