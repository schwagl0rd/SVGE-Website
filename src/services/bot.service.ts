import * as Discord from 'discord.js';
import { Connection } from 'typeorm';
const debug = require('debug')("discord");

export namespace DiscordBot
{
    const client = new Discord.Client();

    export const init = () =>
    {        
        client.on("ready", DiscordEventHandler.ready);
        client.on("message", DiscordEventHandler.message);

        client.login(process.env.DISCORD_BOT_TOKEN as string);
    };

    namespace DiscordEventHandler
    {
        export const ready = () => 
        {
            debug(`Logged into Discord as ${client.user.tag}!`);
        };

        export const message = () => 
        {

        };
    }

    export namespace Utils
    {
        export const CheckRole = (userId : string, guildId : string) : boolean =>
        {
            const guild : Discord.Guild | undefined = client.guilds.get(guildId);
            if(!guild)
            {
                debug(`Client is not a member of the guild with ID ${guildId}.`);
                return false;
            }

            //const user : Discord.User | undefined = guild.members.
        };
    }
}

