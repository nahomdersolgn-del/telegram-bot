const { Telegraf } = require('telegraf');

const bot = new Telegraf('88837557731:AAHShCFPJtoFUd8zHpsAayCgVvS2DSu427Y');

console.log("moder bot is running..");

// MAIN MENU
function showMainMenu(ctx) {
  ctx.reply('🏠 Main Menu', {
    reply_markup: {
      keyboard: [
        ["💰 Money", "🧮 Calculator"],
        ["📝 Notes", "💡 Tips"],
        ["🎮 Fun", "❓ Help"]
      ],
      resize_keyboard: true
    }
  });
}

// START
bot.start((ctx) => {
  showMainMenu(ctx);
});

// MONEY
bot.hears('💰 Money', (ctx) => {
  ctx.reply('Choose a money action:', {
    reply_markup: {
      keyboard: [
        ['💼 add income', '👜 Expense'],
        ['🔙 Back']
      ],
      resize_keyboard: true
    }
  });
});

bot.hears('📝 Notes', (ctx) => {
  ctx.reply('Notes feature coming soon!');
});

bot.hears('❓ Help', (ctx) => {
  ctx.reply('Need help? Select an option from the menu.');
});

let balance = 0;
let waitingForIncome = false;
let waitingForExpense = false;

// ADD INCOME
bot.hears('💼 add income', (ctx) => {
  waitingForIncome = true;
  ctx.reply('👜 How much money did you earn?');
});

// EXPENSE
bot.hears('👜 Expense', (ctx) => {
  waitingForExpense = true;
  ctx.reply('💸 How much did you spend?');
});


// ====================
// CALCULATOR
// ====================

let waitingForFirstNumber = false;
let waitingForSecondNumber = false;

let firstNumber = 0;
let secondNumber = 0;

let operation = '';

bot.hears('🧮 Calculator', (ctx) => {
  ctx.reply('Choose an option:', {
    reply_markup: {
      keyboard: [
        ['🐱 Sum', '🦘 Subtract'],
        ['🐻 Multiply', '👺 Divide']
      ],
      resize_keyboard: true
    }
  });
});

// SUM
bot.hears('🐱 Sum', (ctx) => {
  operation = 'sum';
  waitingForFirstNumber = true;
  ctx.reply('Enter the first number');
});

// SUBTRACT
bot.hears('🦘 Subtract', (ctx) => {
  operation = 'subtract';
  waitingForFirstNumber = true;
  ctx.reply('Enter the first number');
});

// MULTIPLY
bot.hears('🐻 Multiply', (ctx) => {
  operation = 'multiply';
  waitingForFirstNumber = true;
  ctx.reply('Enter the first number');
});

// DIVIDE
bot.hears('👺 Divide', (ctx) => {
  operation = 'divide';
  waitingForFirstNumber = true;
  ctx.reply('Enter the first number');
});


// ====================
// ONE TEXT HANDLER
// ====================

bot.on('text', (ctx) => {

  // INCOME
  if (waitingForIncome) {
    const amount = Number(ctx.message.text);

    if (isNaN(amount) || amount <= 0) {
      ctx.reply('❌ Please enter a positive number, like 500.');
      return;
    }

    balance += amount;
    waitingForIncome = false;

    ctx.reply(
      `✅ Added ${amount} to your balance.\n` +
      `💰 Your balance is now ${balance}.`
    );

    showMainMenu(ctx);
    return;
  }


  // EXPENSE
  if (waitingForExpense) {
    const expense = Number(ctx.message.text);

    if (isNaN(expense) || expense <= 0) {
      ctx.reply('❌ Please enter a positive number.');
      return;
    }

    balance -= expense;
    waitingForExpense = false;

    ctx.reply(
      `💸 Expense recorded: ${expense}\n` +
      `💰 Your new balance is: ${balance}`
    );

    showMainMenu(ctx);
    return;
  }


  // FIRST NUMBER
  if (waitingForFirstNumber) {
    firstNumber = Number(ctx.message.text);

    if (isNaN(firstNumber)) {
      ctx.reply('❌ Please enter a valid number.');
      return;
    }

    waitingForFirstNumber = false;
    waitingForSecondNumber = true;

    ctx.reply('Now enter the second number');
    return;
  }


  // SECOND NUMBER
  if (waitingForSecondNumber) {
    secondNumber = Number(ctx.message.text);

    if (isNaN(secondNumber)) {
      ctx.reply('❌ Please enter a valid number.');
      return;
    }

    // Division by zero
    if (operation === 'divide' && secondNumber === 0) {
      ctx.reply('❌ You cannot divide by zero.');
      return;
    }

    waitingForSecondNumber = false;

    let result;

    // SUM
    if (operation === 'sum') {
      result = firstNumber + secondNumber;
    }

    // SUBTRACT
    if (operation === 'subtract') {
      result = firstNumber - secondNumber;
    }

    // MULTIPLY
    if (operation === 'multiply') {
      result = firstNumber * secondNumber;
    }

    // DIVIDE
    if (operation === 'divide') {
      result = firstNumber / secondNumber;
    }

    ctx.reply(`🧮 Your result is ${result}`);

    showMainMenu(ctx);
    return;
  }

});

bot.launch();