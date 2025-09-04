import { RenderEvent, RenderService, WebhookPayload } from "./render";

const renderAPIURL = process.env.RENDER_API_URL || "https://api.render.com/v1";
const renderAPIKey = process.env.RENDER_API_KEY || '';
if (!renderAPIKey) throw new Error("RENDER_API_KEY is not set.");

export async function fetchEventInfo(payload: WebhookPayload): Promise<RenderEvent> {
    const res = await fetch(
        `${renderAPIURL}/events/${payload.data.id}`,
        {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${renderAPIKey}`,
            },
        },
    );
    if (res.ok) return res.json();
    throw new Error(`unable to fetch event info; received code :${res.status.toString()}`);
}

export async function fetchServiceInfo(payload: WebhookPayload): Promise<RenderService> {
    const res = await fetch(
        `${renderAPIURL}/services/${payload.data.serviceId}`,
        {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${renderAPIKey}`,
            },
        },
    );
    if (res.ok) return res.json();
    throw new Error(`unable to fetch service info; received code :${res.status.toString()}`);
}
