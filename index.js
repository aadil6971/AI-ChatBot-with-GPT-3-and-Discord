
require('dotenv').config();

// Prepare to connect to the discord API
const { Client, GatewayIntentBits } = require('discord.js');
const PREFIX = "$";
const client = new Client({intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

const {Configuration , OpenAIApi} = require('openai');

const configuration = new Configuration({
    organization:process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY
})

const openai = new OpenAIApi(configuration)

// check for whwn a message on discord is sent

client.on('messageCreate', async function(message){
    try {
        if(message.author.bot) return;
        if(message.content.startsWith(PREFIX)){
            const [CMD_NAME,...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/)
            message.reply(`${args}`);
            return;
        }
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Correct this to standard English:\n\n ${message.content}`,
            temperature: 0,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
          });
        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
    } catch (error) {
        console.log(error)
    }
})

client.login(process.env.DISCORD_TOKEN);
console.log("ChatGpt Bot is online on Discord");