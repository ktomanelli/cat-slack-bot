const Slack = require('slack');
require('dotenv').config();

const token = process.env.SLACK_BOT_TOKEN;
const channel = process.env.SLACK_CHANNEL_ID;
const userId = process.env.SLACK_BOT_USER_ID;
const bot = new Slack({ token });

const join = async () => {
  const data = await bot.conversations.members({ channel });
  if (!data.members.includes(userId)) {
    bot.conversations.join({ channel });
  }
};

const meow = () => bot.chat.postMessage({ channel, text: 'meow' });

const getNextMeow = () =>
  Math.floor(Date.now() + Math.random() * Math.floor(10000000));

join();
let nextMeow = getNextMeow();

setInterval(() => {
  if (Date.now > nextMeow) {
    meow();
    nextMeow = getNextMeow();
  }
}, 600000);
