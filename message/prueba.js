const openai = require('openai');
const readline = require('readline');
const configparser = require('configparser');
const sleep = require('util').promisify(setTimeout);
const xdg_config_home = require('xdg-basedir').config;
const fs = require('fs');

// Creador: Jesús Chapman (Yisus7u7)

const user_config = xdg_config_home;

const config = new configparser();

try {
  config.read(`${user_config}/openai_client.conf`);
  const api_token = config.get('openai', 'token');
  openai.api_key = api_token;
} catch (error) {
  console.log('Error: File does not exist ~/.config/openai_client.conf');
  console.log('Creating a new configuration file...\n');
  sleep(3000);
  console.log('Finished, you can enter your token by editing ~/.config/openai_client.conf');
  config.set('openai', 'token', '');
  config.write(`${user_config}/openai_client.conf`);
  process.exit(1);
}

class ChatSession {
  constructor() {
    this.history = [];
    this.chat_log = [];
  }

  remember(message) {
    this.history.push(message);
  }

  async respond(message) {
    this.remember(message);
    const model_engine = 'text-davinci-002';
    const prompt = this.history.join(' ');
    const completions = await openai.Completion.create({
      engine: model_engine,
      prompt,
      max_tokens: 1024,
      n: 1,
      stop: null,
      temperature: 0.5,
    });
    const response = completions.choices[0].text;
    this.remember(response);
    this.chat_log.push({ message, response });
    return response;
  }

  save_chat_log() {
    const filename = `${user_config}/openai_chat_log.txt`;
    const lines = this.chat_log.map((item) => `${item.message}\n${item.response}\n`);
    fs.writeFileSync(filename, lines.join('\n'));
    console.log(`Chat log saved to ${filename}`);
  }
}

const session = new ChatSession();

console.log(`
  Welcome to OpenAI Chat CLI !

  Source code => github.com/Yisus7u7/openai-cli-client
  Creator => Yisus7u7 
  Version => 1.0-stable

  write "exit()" to exit chat
`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', async (message) => {
  if (message === 'exit()') {
    session.save_chat_log();
    console.log('Leaving...');
    rl.close();
    process.exit(0);
  }

  const response = await session.respond(message);

  console.log(`OpenAI:\n${response}`);
});
