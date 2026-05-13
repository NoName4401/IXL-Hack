async function ixlSolve() {
    // 1. Get API Key from LocalStorage or Prompt
    let apiKey = localStorage.getItem('gemini_key');
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key:");
        if (apiKey) localStorage.setItem('gemini_key', apiKey);
    }

    // 2. Capture the Screen (User must select the tab)
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "browser" } });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const base64Image = canvas.toDataURL('image/png').split(',')[1];

        // Stop the screen share
        stream.getTracks().forEach(track => track.stop());

        // 3. Call AI via Proxy (Required for Bookmarklets)
        // Note: You may need to use a proxy like 'cors-anywhere' 
        // Use a CORS proxy to bypass browser security
        const proxy = "https://corsproxy.io/?"; 
        const apiTarget = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" + apiKey;

        const response = await fetch(proxy + encodeURIComponent(apiTarget), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [{
                    "parts": [
                        { "text": "Solve the problem in this image. Output only the final answer." },
                        { "inline_data": { "mime_type": "image/png", "data": base64Image } }
                    ]
                }]
            })
        });

        const data = await response.json();
        alert("AI Answer: " + data.candidates[0].content.parts[0].text);

    } catch (err) {
        alert("Error: Make sure you allow screen sharing! " + err);
    }
}

ixlSolve();