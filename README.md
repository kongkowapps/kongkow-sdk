# Kongkow Mini App SDK

The official JavaScript SDK for building Mini Apps on the Kongkow platform.

## Installation

```bash
npm install @kongkow/miniapp-sdk
```

## Usage

This SDK handles the communication between your Mini App (running in a WebView/iframe) and the Kongkow client.

### Basic Setup

Include the script in your HTML or import it in your bundle:

```html
<script src="path/to/kongkow-miniapp.js"></script>
```

or

```javascript
import Kongkow from '@kongkow/miniapp-sdk';
```

### API Reference

#### `Kongkow.ready()`
Signals to the client that your app is fully loaded. The SDK calls this automatically on `DOMContentLoaded`, but you can call it manually if you need to perform async initialization.

#### `Kongkow.sendData(data: any)`
Sends data back to the bot that launched the Mini App. This triggers a `web_app_data` update to the bot.

```javascript
Kongkow.sendData({
  action: "purchase_complete",
  id: "12345"
});
```

#### `Kongkow.close()`
Closes the Mini App.

```javascript
Kongkow.close();
```
