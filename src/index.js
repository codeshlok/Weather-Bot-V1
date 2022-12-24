require('dotenv').config();
var weather = require('weather-js');
const { token, clientid, guildid } = process.env;
const { Client, GatewayIntentBits, EmbedBuilder, Routes, InteractionResponse } = require('discord.js');
const { REST } = require('@discordjs/rest');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const rest = new REST({ version: '10' }).setToken(token)



client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`)
})

client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        const city = interaction.options.getString('city');
        weather.find({ search: city, degreeType: 'F' }, function (err, result) {
            if (err) return interaction.reply(console.err);
            if (!city) return interaction.reply("Specify a city.");

            if (result === undefined || result.length == 0) 
            return interaction.reply("Invalid Location")

            let current = result[0].current
            let location = result[0].location
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Weather info from ${current.observationpoint}`)
            .setDescription(current.skytext)
            .setThumbnail(current.imageUrl)
            .addFields(
                { name: 'Temperature: ', value: `${current.temperature} F`, inline: true },
                { name: 'Wind Speed: ', value: current.winddisplay, inline: true },
                { name: 'Humidity: ', value: `${current.humidity}%`, inline: true },
                { name: 'Timezone: ', value: `UTC${location.timezone}`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Weather Bot'});
            interaction.reply({ embeds: [embed] });
        });
    }
});

async function main() {
    const commands = [
        {
            name: 'weather',
            description: 'Shows the weather when provided a city.',
            options: [
                {
                    name: 'city',
                    description: 'which city',
                    type: 3,
                    required: true,

                }
            ]

        },
    ];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(clientid, guildid), {
            body: commands,
        });
        client.login(token);
    } catch (err) {
        console.log(err)
    }
}
main();