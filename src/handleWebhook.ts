import { WebhookPayload } from "./render";
import { fetchServiceInfo, fetchEventInfo } from "./renderApi";
import { sendServerFailedMessage, sendBuildCompletedMessage } from "./discord";

export async function handleWebhook(payload: WebhookPayload) {
    try {
        switch (payload.type) {
            case "server_failed": {
                const service = await fetchServiceInfo(payload);
                const event = await fetchEventInfo(payload);
                console.log(`sending discord message for ${service.name}`);
                await sendServerFailedMessage(service, event.details.reason);
                return;
            }
            case "build_ended": {
                const service = await fetchServiceInfo(payload);
                console.log(`sending build completed message for ${service.name}`);
                await sendBuildCompletedMessage(service);
                return;
            }
            default:
                console.log(`unhandled webhook type ${payload.type} for service ${payload.data.serviceId}`);
        }
    } catch (error) {
        console.error(error);
    }
}
