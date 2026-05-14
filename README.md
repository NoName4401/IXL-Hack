# Universal IXL Solver v1.5

**Universal IXL Solver** is a high-performance, multimodal AI bookmarklet designed to solve complex math problems—ranging from standard equations to coordinate geometry and calculus—directly within your browser.

By leveraging the **Gemini 3 Flash** vision API, this tool "sees" the problem on your screen and provides an answer in seconds, bypassing the need for manual data entry.

---

### Essential Shortcuts (Chromebook)

*   **`Ctrl` + `Shift` + `B`**: Toggles the Bookmarks Bar. Hide it instantly if a teacher walks by.
*   **`Ctrl` + `Shift` + `O`**: Opens the Bookmark Manager to edit the URL for future updates.
*   **`Alt` + `Shift` + `B`**: Focuses the bookmarks bar for keyboard-only navigation.

---

## Installation

Adding the solver to your browser takes less than 30 seconds:

1.  **Open your Bookmarks Bar**: Press `Ctrl + Shift + B`.
2.  **Create a New Bookmark**: Right-click the bar and select **Add Page**.
3.  **Name it**: Use something discreet like `Library Search` or `Classroom Refresh`.
4.  **Paste the Code**: Copy the entire block below into the **URL** field.

### The Bookmarklet (Copy this)
```javascript
javascript:(async function(){if(window.isSolving)return;window.isSolving=true;const controller=new AbortController();for(let i=1;i<9999;i++)window.clearInterval(i);window.onbeforeunload=()=>"No";const k="AIzaSyCHK1ZFijBESRJYKmUGkABOBqxYPKqBWb0";const load=document.createElement('div');load.style.cssText="position:fixed;top:20px;right:20px;padding:15px;background:#000;color:#0f0;border:1px solid #0f0;z-index:9999999;font-family:monospace;border-radius:10px;text-align:center;box-shadow:0 0 15px #000;min-width:180px;";load.innerHTML=`<span style='font-size:10px;color:#888;'>SYSTEM STATUS</span><br><span id='solve-status' style='font-size:14px;'>INITIALIZING...</span><br><button id='cancel-solve' style='margin-top:10px;background:#300;color:#f33;border:1px solid #f33;cursor:pointer;font-size:10px;padding:2px 8px;border-radius:4px;'>CANCEL</button>`;document.body.appendChild(load);const cleanup=()=>{load.remove();window.isSolving=false;};document.getElementById('cancel-solve').onclick=()=>{controller.abort();cleanup();};try{const s=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser"}}).catch(()=>{throw new Error("Share Cancelled");});document.getElementById('solve-status').innerText="COMPRESSING...";const v=document.createElement('video');v.srcObject=s;await v.play();const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);const b=c.toDataURL('image/jpeg',0.6).split(',')[1];s.getTracks().forEach(t=>t.stop());document.getElementById('solve-status').innerText="SOLVING...";const promptText="Identify the math problem. 1) If it is a simple equation or word problem, solve it instantly. 2) If it is a graph, locate (0,0) and trace axes carefully to find key points or the vertex. Output ONLY the final numerical or coordinate answer. No text.";const url=`[https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=$){k}`;const response=await fetch(url,{method:"POST",signal:controller.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:promptText},{inline_data:{mime_type:"image/jpeg",data:b}}]}]})});const d=await response.json();cleanup();if(d.error)throw new Error(d.error.message);const a=d.candidates[0].content.parts[0].text;const o=document.createElement('div');o.style.cssText="position:fixed;top:20px;right:20px;padding:25px;background:#000;color:#fff;border:2px solid #0f0;z-index:9999999;font-family:monospace;border-radius:15px;box-shadow:0 0 20px #0f0;cursor:pointer;text-align:center;min-width:150px;";o.innerHTML=`<span style='font-size:10px;color:#0f0;'>NONAME'S SOLVER</span><br><br><span style='font-size:38px;font-weight:bold;'>${a}</span><br><p style='font-size:10px;margin-top:10px;color:#888;'>Click to dismiss</p>`;o.onclick=()=>o.remove();document.body.appendChild(o);}catch(e){cleanup();if(e.name!=='AbortError'&&e.message!=="Share Cancelled"){alert("Error: "+e.message);}}})();

How to Use:

Navigate to any IXL problem.
Click your saved bookmark.
CRITICAL: When the "Share your screen" popup appears, select the Entire Screen tab and click your monitor.
Note: Sharing just the 'Tab' or 'Window' can trigger IXL's anti-cheat/refresh loops.Wait for the status in the top-right to change from SCANNING to SOLVING.
The answer will appear in a high-visibility overlay. Click it to dismiss.

Tips for Maximum Accuracy:

Zoom In: For graphs, press Ctrl + to zoom in. 
Larger grid lines lead to more accurate AI coordinate counting.

Clear the View: The solver is positioned in the top-right to avoid blocking the problem area.

The Refresh Workaround: If the page reloads upon sharing, wait 3 seconds after the page loads before activating the bookmark.

Latency: v1.5 uses JPEG compression to reduce payload size by over $70\%$, speeding up performance on slow networks.🛠️ Technical OverviewDeveloped with a focus on low-latency execution and spatial reasoning bypasses:Origin Anchoring: Logic is instructed to locate $(0,0)$ first to prevent coordinate hallucinations.Abort Signal: Includes a CANCEL function to terminate API calls and save quota.CSP Bypass: Communicates directly with whitelisted Google endpoints to avoid security blocks on school domains.


JavaScript
(async function() {
  // Prevent double execution
  if (window.isSolving) return;
  window.isSolving = true;
  const controller = new AbortController();

  // Kill refresh loops
  for (let i = 1; i < 9999; i++) window.clearInterval(i);
  window.onbeforeunload = () => "No";

  const apiKey = "AIzaSyCHK1ZFijBESRJYKmUGkABOBqxYPKqBWb0";

  // UI Setup
  const load = document.createElement('div');
  // ... styling code ...
  load.innerHTML = `<span>INITIALIZING...</span><button id='cancel-solve'>CANCEL</button>`;
  document.body.appendChild(load);

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({video: {displaySurface: "browser"}});
    // JPEG Compression for speed
    // ... canvas drawing logic ...
    const base64Data = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];

    // API Call to Gemini v1beta
    const response = await fetch(apiUrl, {
      method: "POST",
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Universal Math Logic Prompt" },
            { inline_data: { mime_type: "image/jpeg", data: base64Data } }
          ]
        }]
      })
    });
    // ... result handling ...
  } catch (e) {
    // ... error cleanup ...
  }
})();

Future Plans:
A dedicated Browser Extension is in development, featuring:Automatic answer injection.Background processing (no screen-share popup).Encrypted API keys and advanced school-device bypasses.[!WARNING]Disclaimer: This tool is intended for educational demonstrations and verifying your own work. Use responsibly.Built by NoName