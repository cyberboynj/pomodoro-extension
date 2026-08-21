const ALARM_NAME = 'pomodoro-extension-tick';

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  const { pomodoroExtensionTimer } = await chrome.storage.local.get('pomodoroExtensionTimer');
  if (!pomodoroExtensionTimer?.isRunning || !pomodoroExtensionTimer.startedAt) return;

  const elapsedSeconds = Math.floor((Date.now() - pomodoroExtensionTimer.startedAt) / 1000);
  const remaining = Math.max(0, pomodoroExtensionTimer.totalSeconds - elapsedSeconds);
  await chrome.action.setBadgeText({ text: remaining ? `${Math.ceil(remaining / 60)}` : '' });
  if (remaining === 0) {
    await chrome.notifications.create(`pomodoro-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'favicon.svg',
      title: 'Focus block complete',
      message: 'Take a breath, then choose what comes next.',
    });
  }
});