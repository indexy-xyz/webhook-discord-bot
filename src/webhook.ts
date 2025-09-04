import { Request } from "express";
import { Webhook, WebhookUnbrandedRequiredHeaders } from "standardwebhooks";

const renderWebhookSecret = process.env.RENDER_WEBHOOK_SECRET || '';
if (!renderWebhookSecret) throw new Error("RENDER_WEBHOOK_SECRET is not set.");

export function validateWebhook(req: Request) {
    const headers: WebhookUnbrandedRequiredHeaders = {
        "webhook-id": req.header("webhook-id") || "",
        "webhook-timestamp": req.header("webhook-timestamp") || "",
        "webhook-signature": req.header("webhook-signature") || ""
    };
    const wh = new Webhook(renderWebhookSecret);
    wh.verify(req.body, headers);
}
