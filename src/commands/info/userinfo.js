const commando = require('discord.js-commando');
const Discord = require("discord.js");
const moment = require('moment');

module.exports = class UserInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'uinfo',
            aliases: ['user'],
            group: 'info',
            memberName: 'uinfo',
            description: 'Gets information about a user.',
            examples: ['uinfo @Favna#2846', 'uinfo Favna'],
            guildOnly: true,

            args: [{
                key: 'member',
                label: 'user',
                prompt: 'What user would you like to snoop on?',
                type: 'member'
            }]
        });
    }

    async run(msg, args) {
        const member = args.member;
        const user = member.user;
        let userInfoEmbed = new Discord.RichEmbed();
        //Variables for the embed
        if (msg.channel.type !== 'dm' && msg.channel.type !== 'group') {
            var userNickname = member.nickname === null ? "No Nickname" : member.nickname;
            var userRoles = member.roles.map(r => r.name).slice(1).length >= 1 ? member.roles.map(r => r.name).slice(1) : null;
            var userRoleColor = member.displayHexColor;
            var userJoinedDate = moment(member.joinedAt).format('MMMM Do YYYY');
        };

        let userID = user.id;
        let userName = user.username;
        let userDiscriminator = user.discriminator;
        let userAvatar = user.displayAvatarURL;
        let userStatus = user.presence.status;
        let userCreateDate = moment(user.createdAt).format('MMMM Do YYYY')

        //Adding data to rich embed
        userInfoEmbed.setAuthor(`${userName}` + "#" + `${userDiscriminator}`, `${userAvatar}`);
        userInfoEmbed.setColor("#d43939");
        userInfoEmbed.setImage(userAvatar);

        if (msg.channel.type !== 'dm' && msg.channel.type !== 'group') {
            if (userRoles !== null) {
                userInfoEmbed.setFooter(`has ${userRoles.length} role(s)`, userAvatar)
            } else {
                userInfoEmbed.setFooter(`has 0 roles`, userAvatar)
            }
        } else {
            userInfoEmbed.setFooter(`${userName}'s info requested by Favna`, userAvatar)
        }

        //First row
        userInfoEmbed.addField("ID", userID, true);
        userInfoEmbed.addField("Discriminator", userDiscriminator, true);
        userInfoEmbed.addField("Status", userStatus, true);

        //Second row
        userInfoEmbed.addField("Name", userName, true);
        msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Color", userRoleColor, true) : null;

        msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Nickname", userNickname, true) : null;

        //Third Row
        msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Roles", userRoles, true) : null

        //Fourth row
        userInfoEmbed.addField("Created at", userCreateDate, true);
        msg.channel.type !== 'dm' && msg.channel.type !== 'group' ? userInfoEmbed.addField("Joined at", userJoinedDate, true) : null

        await msg.embed(userInfoEmbed);
    }
};