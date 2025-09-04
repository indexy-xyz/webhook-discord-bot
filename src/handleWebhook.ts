import { WebhookPayload } from "./render";
import { fetchServiceInfo, fetchEventInfo } from "./renderApi";
import { sendServerFailedMessage } from "./discord";

export async function handleWebhook(payload: WebhookPayload) {
    try {
        switch (payload.type) {
            case "server_failed":
                const service = await fetchServiceInfo(payload);
                const event = await fetchEventInfo(payload);
                console.log(`sending discord message for ${service.name}`);
                await sendServerFailedMessage(service, event.details.reason);
                return;
            default:
                console.log(`unhandled webhook type ${payload.type} for service ${payload.data.serviceId}`);
        }
    } catch (error) {
        console.error(error);
    }
}
