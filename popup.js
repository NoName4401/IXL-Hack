document.getElementById('saveBtn').addEventListener('click', () => {
  const key = document.getElementById('apiKey').value;
  chrome.storage.local.set({ gemini_api_key: key }, () => {
    document.getElementById('status').innerText = "Key Saved!";
  });
});

document.getElementById('solveBtn').addEventListener('click', () => {
  document.getElementById('status').innerText = "Processing...";
  chrome.runtime.sendMessage({ action: "capture_and_solve" }, (response) => {
    if (response?.answer) {
      document.getElementById('status').innerText = "Done!";
    } else {
      document.getElementById('status').innerText = "Error. Check Console.";
    }
  });
});