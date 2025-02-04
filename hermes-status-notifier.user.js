// ==UserScript==
// @name        Hermes Paket Status Change Notifier
// @namespace   https://github.com/gekkedev/hermes-status-notifier
// @updateURL   https://raw.githubusercontent.com/gekkedev/hermes-status-notifier/master/hermes-status-notifier.user.js
// @downloadURL https://raw.githubusercontent.com/gekkedev/hermes-status-notifier/master/hermes-status-notifier.user.js
// @match       https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation*
// @grant       none
// @version     2.0
// @author      gekkedev
// @description Reloads the parcel tracking page of Hermes every 30 seconds (adjustable interval) to check if the parcel is available & notifies you.
// ==/UserScript==

const RELOAD_INTERVAL = 30 * 1000; // Reload interval in milliseconds
const STATUS_SELECTOR = "[data-qa='status-text']"; // Selector for status text
const storageKey = "hermesNotifier" + window.location.hash;

// Function to get current status text
function getCurrentStatus() {
    const statusElement = document.querySelector(STATUS_SELECTOR);
    return statusElement ? statusElement.innerText.trim() : null;
}

// Function to save the current status in localStorage
function saveCurrentStatus() {
    const status = getCurrentStatus();
    if (status) {
        localStorage.setItem(storageKey, status);
        alert("Current status saved!");
    }
}

// Function to check for status change
function checkStatusChange() {
    const savedStatus = localStorage.getItem(storageKey);
    const currentStatus = getCurrentStatus();

    if (!savedStatus || savedStatus !== currentStatus) {
        localStorage.setItem(storageKey, currentStatus); // Update stored status
        alert("Status changed!");
    } else {
        console.log("No update. Reloading in 30...");
        setTimeout(() => location.reload(), RELOAD_INTERVAL);
    }
}

// Add a button to manually save the current status
function addSaveButton() {
    const button = document.createElement("button");
    button.innerText = "Save Current Status";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    button.onclick = saveCurrentStatus;
    document.body.appendChild(button);
}

// Use MutationObserver to detect when the status text appears
function waitForStatus() {
    const observer = new MutationObserver(() => {
        if (document.querySelector(STATUS_SELECTOR)) {
            observer.disconnect();
            checkStatusChange();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize script
(function () {
    if (!window.location.hash) return; // Exit if no hash in URL

    addSaveButton();
    waitForStatus(); // Start monitoring for status updates
})();
