const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const loader = document.createElement('div');
loader.classList.add('loader');
let chatHistory = [{
    "role": "system",
    "content": "Conversation started"
  }];

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  handleChatInteraction();
}

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  if (text.includes('```')) {
    text = text.replace('`', '');
    text = text.replace('markdown', '');
  }
  msg.innerHTML = marked.parse(text);
  if (sender == "bot" && isMarkdown(text)) {
    document.querySelector('div[contentEditable="true"]')?.removeAttribute('contentEditable');
    d = document.createElement("div");
    d.classList.add("icon");
    d.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-2 14-3 1 1-3 7-7 2 2z"/></svg>`;
    msg.prepend(d);
    d.addEventListener('click', () => {
      msg.contentEditable = true;
      msg.addEventListener('blur', () => {
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(msg.innerHTML);
        const updatedMessage = markdown.trim();
        if (updatedMessage !== text) {
          chatHistory[chatHistory.length - 1].content = updatedMessage;
        }
        msg.contentEditable = false;
      });
    });
  }
  chatWindow.appendChild(msg);
  msg.scrollIntoView({
    behavior: 'smooth'
  });
  loader.remove();
}

function appendiFrameMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender} has-iframe`;
  const ifr = document.createElement('iframe');
  ifr.src = `${text}&mepbutton=off`;
  msg.append(ifr);
  chatWindow.appendChild(msg);
  msg.scrollIntoView({
    behavior: 'smooth'
  });
  window.addEventListener('message', (e) => {
    wondow.open(e.data.daUrl, "_blank");
  }, { once: true });
  loader.remove();
}

async function handleChatInteraction() {
    const inputBox = window["user-input"];
    const newMessages = inputBox.value.trim();
    chatHistory.push({
      "role": "user",
      "content": newMessages
    });
    inputBox.value = "";
    const chatPayload = {
      "message": JSON.stringify(chatHistory)
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatPayload)
    };

    chatWindow.append(loader);
    loader.scrollIntoView({
      behavior: 'smooth'
    });
    // const res = await fetch('http://localhost:8081/api/agents/chat', options);
    const res = await fetch('https://ff69-130-248-126-34.ngrok-free.app/api/agents/chat', options);
    
    const { response, format } = await res.json();
    if (response.startsWith('PREVIEW_URL:')) {
      const previewerURL = response.split("PREVIEW_URL:")[1];
      appendiFrameMessage(previewerURL, 'bot');
    } else {
      appendMessage(response, 'bot');
    }
    chatHistory.push({
      "role": "system",
      "content": response
    });
    console.log(chatHistory);
}

function isMarkdown(text) {
  const markdownPatterns = [
    /#\s+/g,
    /\*\*.*\*\*/g,
    /__.*__/g,
    /\*.*\*/g,
    /_.*_/g,
    /[-*]\s+/g,
    /\[.*\]\(.*\)/g 
  ];
  return markdownPatterns.some(pattern => pattern.test(text));
}
