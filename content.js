chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "display_answer") {
    // Create a simple overlay to show the answer
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '10px';
    div.style.right = '10px';
    div.style.padding = '15px';
    div.style.background = '#000';
    div.style.color = '#fff';
    div.style.zIndex = '10000';
    div.style.borderRadius = '8px';
    div.innerText = "Answer: " + request.answer;
    
    document.body.appendChild(div);
    
    // Remove the message after 10 seconds
    setTimeout(() => div.remove(), 10000);
  }
});