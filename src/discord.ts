import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    Events,
    GatewayIntentBits,
    MessageActionRowComponentBuilder
} from "discord.js";
import { RenderService } from "./render";

const discordToken = process.env.DISCORD_TOKEN || '';
const discordChannelID = process.env.DISCORD_CHANNEL_ID || '';

if (!discordToken) throw new Error("DISCORD_TOKEN is not set.");
if (!discordChannelID) throw new Error("DISCORD_CHANNEL_ID is not set.");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Discord client setup! Logged in as ${readyClient.user.tag}`);
});

client.login(discordToken).catch(err => {
    console.error(`unable to connect to Discord: ${err}`);
});

export async function sendServerFailedMessage(service: RenderService, failureReason: any) {
    const channel = await client.channels.fetch(discordChannelID);
    if (!channel) throw new Error(`unable to find specified Discord channel ${discordChannelID}`);
    if (!channel.isSendable()) throw new Error(`specified Discord channel ${discordChannelID} is not sendable`);

    let description = "Failed for unknown reason";
    if (failureReason.nonZeroExit) description = `Exited with status ${failureReason.nonZeroExit}`;
    else if (failureReason.oomKilled) description = `Out of Memory`;
    else if (failureReason.timedOutSeconds) description = `Timed out ` + failureReason.timedOutReason;
    else if (failureReason.unhealthy) description = failureReason.unhealthy;

    const embed = new EmbedBuilder()
        .setColor(`#FF5C88`)
        .setTitle(`${service.name} Failed`)
        .setDescription(description)
        .setURL(service.dashboardUrl);

    const logs = new ButtonBuilder()
        .setLabel("View Logs")
        .setURL(`${service.dashboardUrl}/logs`)
        .setStyle(ButtonStyle.Link);
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(logs);

    channel.send({ embeds: [embed], components: [row] });
}
