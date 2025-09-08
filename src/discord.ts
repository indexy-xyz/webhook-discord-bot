import { RenderService } from "./render";

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
if (!discordWebhookUrl) throw new Error("DISCORD_WEBHOOK_URL is not set.");

export async function sendServerFailedMessage(service: RenderService, failureReason: any) {
    let description = "Failed for unknown reason";
    if (failureReason.nonZeroExit) description = `Exited with status ${failureReason.nonZeroExit}`;
    else if (failureReason.oomKilled) description = `Out of Memory`;
    else if (failureReason.timedOutSeconds) description = `Timed out ` + failureReason.timedOutReason;
    else if (failureReason.unhealthy) description = failureReason.unhealthy;

    // Discord webhook expects a JSON payload
    const payload = {
        username: "Render Webhook Bot",
        embeds: [
            {
                title: `${service.name} Failed`,
                description,
                color: 0xFF5C88,
                url: service.dashboardUrl,
            }
        ],
        components: [
            {
                type: 1, // ActionRow
                components: [
                    {
                        type: 2, // Button
                        style: 5, // Link
                        label: "View Logs",
                        url: `${service.dashboardUrl}/logs`
                    }
                ]
            }
        ]
    };

    await fetch(discordWebhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}

export async function sendBuildCompletedMessage(service: RenderService) {
    const payload = {
        username: "Render Webhook Bot",
        embeds: [
            {
                title: `${service.name} Build Completed` ,
                description: "Build has completed successfully.",
                color: 0x57F287,
                url: service.dashboardUrl,
            }
        ]
    };

    await fetch(discordWebhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}

export async function sendServerUnhealthyMessage(service: RenderService, unhealthyReason: any) {
    const payload = {
        username: "Render Webhook Bot",
        embeds: [
            {
                title: `${service.name} Unhealthy` ,
                description: `Server is unhealthy: ${unhealthyReason}`,
                color: 0xFAA61A,
                url: service.dashboardUrl,
            }
        ]
    };

    await fetch(discordWebhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
}
