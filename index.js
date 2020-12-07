const Slack = require('slack');
const qs = require('qs');
require('dotenv').config();

const token = process.env.SLACK_BOT_TOKEN;
const channel = process.env.SLACK_CHANNEL_ID;
const userId = process.env.SLACK_BOT_USER_ID;
const slackSecret = process.env.SLACK_SIGNING_SECRET;
const bot = new Slack({ token });

const join = async () => {
  const data = await bot.conversations.members({ channel });
  if (!data.members.includes(userId)) {
    bot.conversations.join({ channel });
  }
};

const slackConf = req => {
  const reqBody = qs.stringify(req.body, { format: 'RFC1738' });
  const timeStamp = req.headers['x-slack-request-timestamp'];
  const slackSig = req.headers['x-slack-signature'];
  if (Math.abs(Math.floor(Date.now() / 1000) - timeStamp) > 300) {
    return false;
  }
  const baseString = `v0:${timeStamp}:${reqBody}`;
  const mySecret = `v0=${crypto
    .createHmac('sha256', slackSecret)
    .update(baseString)
    .digest('hex')}`;

  if (
    crypto.timingSafeEqual(
      Buffer.from(mySecret, 'utf8'),
      Buffer.from(slackSig, 'utf8')
    )
  ) {
    return true;
  }
  return false;
};

const meow = text => bot.chat.postMessage({ channel, text });

const getNextMeow = () =>
  Math.floor(Date.now() + Math.random() * Math.floor(10000000));

join();
let nextMeow = getNextMeow();

setInterval(() => {
  if (Date.now > nextMeow) {
    meow('meow');
    nextMeow = getNextMeow();
  }
}, 600000);

module.exports = { meow, slackConf };
