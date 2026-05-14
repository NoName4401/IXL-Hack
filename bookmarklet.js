(async function() {
    // 1. Setup API Key
    let apiKey = localStorage.getItem('gemini_key');
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key:");
        if (apiKey) localStorage.setItem('gemini_key', apiKey);
    }

    try {
        // 2. Capture the Screen
        // Note: You must select the "This Tab" option in the popup
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
            video: { displaySurface: "browser" },
            audio: false 
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        const base64Image = canvas.toDataURL('image/png').split(',')[1];
        stream.getTracks().forEach(track => track.stop());

        // 3. The 2026 Stable API Call with CORS Proxy
        const proxy = "https://corsproxy.io/?";
        const target = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
        
        const response = await fetch(proxy + encodeURIComponent(target), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [{
                    "parts": [
                        { "text": "Solve the math or logic problem in this image. Provide ONLY the final answer." },
                        { "inline_data": { "mime_type": "image/png", "data": base64Image } }
                    ]
                }]
            })
        });

        const data = await response.json();
        const answer = data.candidates[0].content.parts[0].text;

        // 4. Hacky Alert Display
        alert("AI ANSWER: " + answer);

    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
    }
})();