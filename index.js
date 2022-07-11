const telegramApi = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options");

const token = "5337527879:AAFYmzsjcCULjXTXn_ez24fnot6kyi9Ni18";

const bot = new telegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  bot.sendMessage(
    chatId,
    "Сейчас я загадаю число от 0 до 9 а ты должен/на его отгадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "отгадывай)", gameOptions);
};

bot.setMyCommands([
  { command: "/start", description: "начальное приветсвие" },
  { command: "/info", description: "информация о нас" },
  { command: "/game", description: "начать игру" },
]);

bot.on("message", async (smg) => {
  const text = smg.text;
  const chatId = smg.chat.id;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "https://tlgrm.ru/_/stickers/c9f/10b/c9f10b75-ae6b-4a89-9dd1-ef559502a0ca/2.jpg"
    );
    return bot.sendMessage(
      chatId,
      `Привет, ${smg.from.username}👋, нажимай /info и узнай о нас`
    );
  }

  if (text === "/info") {
    return bot.sendMessage(
      chatId,
      "Мы JavaScript разработчики, сын Матвей и папа Сергей, давай сыграем /game"
    );
  }

  if (text === "/game") {
    return startGame(chatId);
  } else {
    return bot.sendMessage(
      chatId,
      "Я тебя совсем не понимаю, попробуй еще раз)"
    );
  }
});

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

  if (data === "/again") {
    return startGame(chatId);
  }

  if (data === chats[chatId]) {
    return bot.sendMessage(
      chatId,
      `круто, ты выбрал/ла ${chats[chatId]} и победил`,
      againOptions
    );
  } else {
    return bot.sendMessage(
      chatId,
      `ты проиграл/ла, бот загадал ${chats[chatId]}`,
      againOptions
    );
  }
});
