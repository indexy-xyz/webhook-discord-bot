import express, { NextFunction, Request, Response } from "express";
import { WebhookVerificationError } from "standardwebhooks";
import { validateWebhook } from "./webhook";
import { handleWebhook } from "./handleWebhook";

const app = express();
const port = process.env.PORT || 3001;

app.post("/webhook", express.raw({ type: 'application/json' }), (req: Request, res: Response, next: NextFunction) => {
    try {
        validateWebhook(req);
    } catch (error) {
        return next(error);
    }
    const payload = JSON.parse(req.body);
    res.status(200).send({}).end();
    handleWebhook(payload);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof WebhookVerificationError) {
        res.status(400).send({}).end();
    } else {
        res.status(500).send({}).end();
    }
});

export const server = app.listen(port, () => console.log(`App listening on port ${por}!`));
t