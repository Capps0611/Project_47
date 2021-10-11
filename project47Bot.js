const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],partials: ['MESSAGE', 'CHANNEL', 'REACTION'], });
const settings = require('./settings.json');
var mysql = require('mysql');
var gameChannel = client.channels.fetch("275324286594449408")
var streamers = [];

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'project47'
});
//connection.query("INSERT INTO accounts (username, password, email) VALUES (?,?,?)",[username,password,email])
//connection.query('SELECT * FROM accounts WHERE username = ?', [username]
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
    client.user.setActivity('You', { type: 'WATCHING' });

		//Need to create a Menu for Account Creation/battles/Characters/etc
		var gameChannel = client.channels.cache.get("275324286594449408")
		gameChannel.send("create account");
		//console.log(client.GuildManager.resolveId(125655189846753280).name)
    //client.users.resolve("218720642264989697").send("Yo WTF are you doing"); //DMes Mike the bot is online
    //dath = 218720642264989697
    //capps = 125429756786114561
  //console.log(client.users);
    /*client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })*/
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (receivedMessage.content.startsWith("$")) {
        processCommand(receivedMessage)
    }
})

client.on('messageReactionAdd', async (reaction,user) => {

	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	if (reaction.message.author == client.user) { // Prevent bot from responding to its own messages
			if (reaction.message.content == "create account") {
				createAccount(user,reaction.message.guildId)

			} else {

			}
	}

})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    switch (primaryCommand.toLowerCase()) {
      case 'help':
        helpCommand(arguments, receivedMessage)
        break;
      case 'createaccount':
        createAccount(arguments, receivedMessage)
        break;
      default: receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        switch (arguments[0].toLowerCase()) {
          case 'clearstreamers':
            receivedMessage.channel.send("This command clears the current Live Streamers array");
            break;
          default: receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
        }
    }
    else
    {
      receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

function createAccount(user,guildID) {
	connection.query('SELECT * FROM users WHERE name = ?', [user.username], function(error, results, fields) {
			if (results.length > 0) {
				user.send('This Username already exsists')

			} else {
				connection.query("INSERT INTO users (name, discord_guilds) VALUES (?,?)",[user.username,guildID])
				user.send('Account created!')
			}
		});

}


// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
//Invite link -> https://discord.com/oauth2/authorize?client_id=895301755691221052&scope=bot&permissions=8
bot_secret_token = settings.token

client.login(bot_secret_token)
