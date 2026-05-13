chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture_and_solve") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
      const base64Image = dataUrl.split(',')[1];
      const result = await callGemini(base64Image);
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "display_answer", answer: result });
      });
      
      sendResponse({ answer: result });
    });
    return true; 
  }
});

async function callGemini(base64Image) {
  const storage = await chrome.storage.local.get("gemini_api_key");
  const apiKey = storage.gemini_api_key;

  if (!apiKey) return "Error: API Key is missing. Paste it into the popup.";

  // Stable May 2026 Endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  // Stable Multimodal Payload Structure
  const payload = {
    "contents": [{
      "parts": [
        { "text": "Identify the math or logic problem in this screenshot and provide only the final answer for the text box. No reasoning or steps." },
        { "inline_data": { "mime_type": "image/png", "data": base64Image } }
      ]
    }]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server Error:", data);
      return `Server Error: ${data.error?.message || "Check API Key"}`;
    }

    // Standard response path for 2026 models
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Real Network Error:", error);
    return "Network error. Try a different Wi-Fi or turn off VPN.";
  }
}