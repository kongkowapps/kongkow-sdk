/**
 * Kongkow Bot SDK
 * A lightweight library to build bots for the Kongkow platform.
 *
 * @example
 * ```typescript
 * import { KongkowBot } from '@kongkow/sdk'
 *
 * const bot = new KongkowBot(process.env.BOT_TOKEN!)
 *
 * bot.onCommand('start', async (update) => {
 *   await bot.sendMessage(update.message!.chat.id, 'Hello!')
 * })
 * ```
 */

export interface Update {
    update_id: number;
    message?: {
        message_id: string;
        from: string;
        chat: {
            id: string;
            type: "private" | "group";
        };
        text: string;
        timestamp: string;
        media?: any[];
        files?: any[];
        is_mention_of_bot?: boolean;
    };
    callback_query?: {
        id: string;
        from: string;
        message: {
            chat: { id: string };
        };
        data: string;
    };
}

export class KongkowBot {
    private token: string;
    private apiUrl: string;
    private commandHandlers: Map<string, (update: Update) => Promise<void>> = new Map();
    private messageHandler?: (update: Update) => Promise<void>;
    private callbackHandler?: (update: Update) => Promise<void>;
    private webhookSecret?: string;

    constructor(token: string, options: { apiUrl?: string; webhookSecret?: string } = {}) {
        this.token = token;
        this.apiUrl = (options.apiUrl || "https://kongkow.xyz/api/v1/bots").replace(/\/$/, "");
        this.webhookSecret = options.webhookSecret;
    }

    /**
     * Registers a command handler (e.g. /start, /help)
     */
    onCommand(command: string, handler: (update: Update) => Promise<void>) {
        this.commandHandlers.set(command, handler);
    }

    /**
     * Registers a general message handler for non-command messages
     */
    onMessage(handler: (update: Update) => Promise<void>) {
        this.messageHandler = handler;
    }

    /**
     * Registers a callback query handler (for inline keyboard buttons)
     */
    onCallback(handler: (update: Update) => Promise<void>) {
        this.callbackHandler = handler;
    }

    /**
     * Processes an incoming update from a webhook.
     * Call this in your webhook POST handler.
     */
    async handleUpdate(update: Update, secretToken?: string) {
        if (this.webhookSecret) {
            if (!secretToken || secretToken !== this.webhookSecret) {
                throw new Error("Invalid webhook secret token");
            }
        }

        // Handle callback queries
        if (update.callback_query && this.callbackHandler) {
            await this.callbackHandler(update);
            return;
        }

        // Handle messages
        if (update.message?.text) {
            const text = update.message.text.trim();
            if (text.startsWith("/")) {
                const command = text.split(" ")[0].substring(1);
                const handler = this.commandHandlers.get(command);
                if (handler) {
                    await handler(update);
                    return;
                }
            }

            if (this.messageHandler) {
                await this.messageHandler(update);
            }
        }
    }

    /**
     * Sends a message via the Bot API
     */
    async sendMessage(chatId: string, text: string, options: { reply_to_message_id?: string; reply_markup?: any } = {}) {
        return await this.callMethod("sendMessage", {
            chat_id: chatId,
            text,
            ...options,
        });
    }

    /**
     * Creates a post in the Kongkow feed
     */
    async createPost(params: {
        content: string;
        images?: string[];
        videos?: string[];
        hashtags?: string[];
        mentions?: string[];
        price?: number;
        currency?: string;
        privacy?: "public" | "subscribers_only";
    }) {
        return await this.callMethod("createPost", params);
    }

    /**
     * Sends an invoice / payment request to a user
     */
    async sendInvoice(params: {
        chat_id: string;
        title?: string;
        description?: string;
        amount: number;
        currency?: string;
    }) {
        return await this.callMethod("sendInvoice", params);
    }

    /**
     * Sets the webhook URL for the bot
     */
    async setWebhook(url: string, secretToken?: string) {
        return await this.callMethod("setWebhook", { url, secret_token: secretToken });
    }

    /**
     * Returns basic info about the bot
     */
    async getMe() {
        return await this.callMethod("getMe", {});
    }

    /**
     * Withdraw funds from the bot's wallet to the owner's wallet.
     * @param amount Optional amount in SOL. If omitted, withdraws full balance minus reserve.
     */
    async withdraw(amount?: number) {
        return await this.callMethod("withdraw", { amount });
    }

    /**
     * Internal helper to call Bot API methods
     */
    private async callMethod(method: string, payload: any) {
        const endpoint = method.startsWith("/") ? method : `/${method}`;
        const response = await fetch(`${this.apiUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Bot API error (${method}): ${error}`);
        }

        return await response.json();
    }
}
