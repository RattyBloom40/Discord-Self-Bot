/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
 *       * Requiring preservation of specified reasonable legal notices or
 *         author attributions in that material or in the Appropriate Legal
 *         Notices displayed by works containing it.
 *       * Prohibiting misrepresentation of the origin of that material,
 *         or requiring that modified versions of such material be marked in
 *         reasonable ways as different from the original version.
 */

const Discord = require('discord.js'),
	commando = require('discord.js-commando'),
	urban = require('urban');

module.exports = class urbanCommand extends commando.Command {
	constructor (client) {
		super(client, {
			'name': 'urban',
			'group': 'search',
			'aliases': ['ub', 'ud'],
			'memberName': 'urban',
			'description': 'Find definitions on urban dictionary',
			'examples': ['urban {word}', 'urban ugt'],
			'guildOnly': false,

			'args': [
				{
					'key': 'query',
					'prompt': 'What word do you want to define?',
					'type': 'string',
					'label': 'Word to define'
				}
			]
		});
	}

	deleteCommandMessages (msg) {
		if (msg.deletable && this.client.provider.get('global', 'deletecommandmessages', false)) {
			msg.delete();
		}
	}

	run (msg, args) {
		urban(args.query).first((json) => {
			if (!json) {
				return msg.reply('⚠️ ***nothing found***');
			}
			const urbanEmbed = new Discord.MessageEmbed(); // eslint-disable-line one-var

			urbanEmbed
				.setAuthor(`Urban Search - ${json.word}`, 'https://i.imgur.com/miYLsGw.jpg')
				.setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
				.addField('Definition', json.definition.length <= 1024 ? json.definition : `Truncated due to exceeding maximum length\n${json.definition.slice(0, 970)}`, false)
				.addField('Example', json.example.length <= 1024 ? json.example : `Truncated due to exceeding maximum length\n${json.example.slice(0, 970)}`, false)
				.addField('Permalink', json.permalink, false);

			this.deleteCommandMessages(msg);

			return msg.embed(urbanEmbed);
		});
	}
};