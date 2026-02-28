# @kongkow/sdk

Official SDK for building **Bots** and **Mini Apps** on the [Kongkow](https://kongkow.xyz) platform.

## Installation

```bash
npm install @kongkow/sdk
```

---

## Bot SDK (Server-side)

Build bots that respond to messages, create posts, send invoices, and manage wallets.

### Quick Start

```typescript
import express from "express";
import { KongkowBot } from "@kongkow/sdk";

const bot = new KongkowBot(process.env.BOT_TOKEN!, {
    webhookSecret: process.env.WEBHOOK_SECRET,
});

// Handle /start command
bot.onCommand("start", async (update) => {
    await bot.sendMessage(update.message!.chat.id, "Hello! 👋");
});

// Handle all other messages
bot.onMessage(async (update) => {
    const text = update.message!.text;
    await bot.sendMessage(update.message!.chat.id, `You said: ${text}`);
});

// Express webhook server
const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
    const secret = req.headers["x-kongkow-bot-api-secret-token"] as string;
    await bot.handleUpdate(req.body, secret);
    res.json({ ok: true });
});

app.listen(3000, () => console.log("Bot running on port 3000"));
```

### Bot API Methods

| Method | Description |
|--------|-------------|
| `sendMessage(chatId, text, options?)` | Send a text message |
| `createPost(params)` | Create a feed post (supports PPV) |
| `sendInvoice(params)` | Send a payment request |
| `setWebhook(url, secretToken?)` | Set webhook URL |
| `getMe()` | Get bot info |
| `withdraw(amount?)` | Withdraw SOL to owner wallet |

### Event Handlers

```typescript
bot.onCommand("help", handler)     // Handle /help command
bot.onMessage(handler)             // Handle non-command messages
bot.onCallback(handler)            // Handle inline keyboard callbacks
```

---

## Mini App SDK (Client-side)

Build interactive UI components that run inside Kongkow chat.

### Usage

```html
<script src="https://unpkg.com/@kongkow/sdk/src/miniapp.js"></script>
```

Or import in a bundler:

```javascript
import "@kongkow/sdk/miniapp";
```

### API

| Method | Description |
|--------|-------------|
| `Kongkow.ready()` | Signal the app is loaded (auto-called on DOMContentLoaded) |
| `Kongkow.sendData(data)` | Send data back to the bot |
| `Kongkow.close()` | Close the Mini App modal |

### Example

```html
<button onclick="Kongkow.sendData({ action: 'purchase', id: '123' })">
    Buy Now
</button>
<button onclick="Kongkow.close()">Close</button>
```

---

## Links

- [Getting Started](https://github.com/kongkowapps/kongkow/blob/main/docs/getting-started.md)
- [API Reference](https://github.com/kongkowapps/kongkow/blob/main/docs/api-reference.md)
- [Webhooks](https://github.com/kongkowapps/kongkow/blob/main/docs/webhooks.md)
- [Examples](https://github.com/kongkowapps/kongkow-examples)

## License

MIT
