declare global {
    interface Window {
        Kongkow: KongkowSDK;
    }
}

export interface KongkowSDK {
    /**
     * Closes the current Mini App modal.
     */
    close(): void;

    /**
     * Sends data back to the bot that launched the Mini App.
     * @param data The data payload to send.
     */
    sendData(data: any): void;

    /**
     * Signals to the parent window that the app is ready and loaded.
     */
    ready(): void;
}

declare const Kongkow: KongkowSDK;
export default Kongkow;
