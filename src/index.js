(function (global) {
    /**
     * Kongkow Mini App SDK
     * 
     * This library provides a bridge for communication between a Kongkow Mini App 
     * (running in an iframe) and the Kongkow parent window.
     */
    const Kongkow = {
        /**
         * Closes the current Mini App modal.
         */
        close: function () {
            window.parent.postMessage({ type: 'kongkow_miniapp_close' }, '*');
        },

        /**
         * Sends data back to the bot that launched the Mini App.
         * This data is typically processed by the bot's callback_query handler.
         */
        sendData: function (data) {
            window.parent.postMessage({ type: 'kongkow_miniapp_send_data', data: data }, '*');
        },

        /**
         * Signals to the parent window that the app is ready and loaded.
         */
        ready: function () {
            window.parent.postMessage({ type: 'kongkow_miniapp_ready' }, '*');
        }
    };

    // Expose to global scope
    if (typeof window !== 'undefined') {
        window.Kongkow = Kongkow;

        // Auto-signal ready once this script finishes loading
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            Kongkow.ready();
        } else {
            window.addEventListener('DOMContentLoaded', function () {
                Kongkow.ready();
            });
        }
    }

    // Export module for bundlers
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Kongkow;
    }
})(this);
