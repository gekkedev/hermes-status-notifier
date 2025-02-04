// ==UserScript==
// @name        Hermes Paket status change notifier
// @namespace   https://github.com/gekkedev/hermes-status-notifier
// @updateURL   https://raw.githubusercontent.com/gekkedev/hermes-status-notifier/master/hermes-status-notifier.user.js
// @downloadURL https://raw.githubusercontent.com/gekkedev/hermes-status-notifier/master/hermes-status-notifier.user.js
// @match       https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation*
// @grant       none
// @version     1.0
// @author      gekkedev
// @description Reloads the parcel tracking page of Hermes every 30 seconds (adjustable interval) to check if the parcel is available & notifies you.
// ==/UserScript==

//IDEA: add a button to store the current status in the local storage and then alert on any changes

const storageKey = "hermesNotifier" + window.location.hash
if (!window.location.hash || localStorage[storageKey]) return

setTimeout(() => { //hacky approach to wait until the frontend is ready to display the status
  if (!document.querySelector("[data-qa='status-text']").innerText.includes("Deine Sendung wurde in das Zustellfahrzeug geladen")) {
    localStorage[storageKey] = true
    alert("Status changed!")
  } else {
    console.log("No update. Reloading in 30...")
    setTimeout(() => {
      location.reload()
    }, 30 * 1000)
  }
}, 2 * 1000)
