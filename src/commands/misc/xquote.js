// Copyright (C) 2017 Favna
// 
// This file is part of PyrrhaBot.
// 
// PyrrhaBot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// PyrrhaBot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with PyrrhaBot.  If not, see <http://www.gnu.org/licenses/>.
// 

const commando = require('discord.js-commando');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = class quoteCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'xquote',
            group: 'misc',
            aliases: ['xq'],
            memberName: 'xquote',
            description: 'Quote someone else\'s message into a RichEmbed. Allows for cross server quoting but IDs are required',
            examples: ['quote server channelID messageID exta_content'],
            guildOnly: false,

            args: [{
                    key: 'guild',
                    prompt: 'Which server?',
                    type: 'guild',
                    wait: 60
                },
                {
                    key: 'channel',
                    prompt: 'Which channel on that server?',
                    type: 'string',
                    wait: 60
                },
                {
                    key: 'message',
                    prompt: 'And what message?',
                    type: 'string',
                    wait: 60
                },
                {
                    key: 'content',
                    prompt: 'What content would you like to send along with the quote?',
                    type: 'string',
                    wait: 60
                }
            ]
        });
    }

    async run(msg, args) {


        msg.client.guilds.get(args.guild.id).channels.get(args.channel)
            .fetchMessage(args.message)
            .then(quote => {

                const quoteEmbed = new Discord.RichEmbed();
                quoteEmbed
                    .setAuthor(`Quoting ${quote.member.displayName}`, quote.author.displayAvatarURL)
                    .setColor(msg.channel.type === 'text' ? quote.member.displayHexColor : '#FF0000')
                    .setFooter(`Message dates from ${moment(msg.createdAt).format('MMMM Do YYYY | HH:mm:ss')}`)
                    .setDescription(quote.cleanContent)

                msg.embed(quoteEmbed, args.content);
                msg.delete();
            })
            .catch(err => {
                console.error(err)
                return msg.reply('Something went wrong')
            })


        // msg.client.guilds.get(args.guild.id).channels.get(args.channel)
        //     .fetchMessage(args.message)
        //     .then(quote => console.log(quote.content))
        //     .catch(err => console.error(err))
    };
};