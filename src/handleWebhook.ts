import { WebhookPayload } from "./render";
import { fetchServiceInfo, fetchEventInfo } from "./renderApi";
import { sendServerFailedMessage, sendBuildCompletedMessage, sendServerUnhealthyMessage } from "./discord";
async function handleCronJobRunEnded(payload: WebhookPayload) {
    console.log("cron_job_run_ended payload:", JSON.stringify(payload, null, 2));
    // You can add Discord notification logic here if needed
}

export async function handleWebhook(payload: WebhookPayload) {
    try {
        const service = await fetchServiceInfo(payload);
        const event = await fetchEventInfo(payload);
        console.log(`received webhook of type ${payload.type} for service ${service.name} (ID: ${payload.data.serviceId}), event: ${JSON.stringify(event)}, payload: ${JSON.stringify(payload)}`);
        switch (payload.type) {
            case "server_failed": {
                console.log(`sending discord message for ${service.name}`);
                await sendServerFailedMessage(service, event.details.reason);
                return;
            }
            case "build_ended": {
                console.log(`sending build completed message for ${service.name}`);
                await sendBuildCompletedMessage(service);
                return;
            }
            case "server_unhealthy": {
                const unhealthyReason = event.details?.reason || "Unknown reason";
                console.log(`sending server unhealthy message for ${service.name}`);
                await sendServerUnhealthyMessage(service, unhealthyReason);
                return;
            }
            case "cron_job_run_ended": {
                console.log(`logging cron_job_run_ended for ${service.name}, event: ${JSON.stringify(event)}`);
                await handleCronJobRunEnded(payload);
                return;
            }
            default:
                console.log(`unhandled webhook type ${payload.type} for service ${service.name}`);
        }
    } catch (error) {
        console.error(error);
    }
}
