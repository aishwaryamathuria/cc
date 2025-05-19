const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const loader = document.createElement('div');
loader.classList.add('loader');
document.querySelector('#closeModal').addEventListener('click', () => {
  document.querySelector('#imgModal').style.display = "none";
})
let previewerIframe = null;
let chatHistory = [{
    "role": "system",
    "content": "Conversation started"
  }];
// const agentEP = 'http://localhost:8081/api/agents/chat';
const agentEP = 'https://2133-49-207-235-196.ngrok-free.app/api/agents/chat';

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

function appendMessage(text, sender, hasMarkdown = false) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;

  if (hasMarkdown) {
    if (text.includes('```')) {
      text = text.replace('`', '');
      text = text.replace('markdown', '');
    }
    msg.innerHTML = marked.parse(text);
  }
  else msg.innerHTML = text;

  if (sender == "bot" && hasMarkdown) {
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

function appendImageThumbnail(src, sender) {
  const img = document.createElement('img');
  img.src = src
  const msg = document.createElement('div');
  msg.className = `message ${sender} has-thumbnails`;
  msg.append(img);
  chatWindow.appendChild(msg);
  img.addEventListener('click', (e) => {
    document.querySelector('#imgModal').querySelector('img').src = src;
    document.querySelector('#imgModal').style.display = 'flex';
  });
}

function appendiFrameMessage(link, sender, generateContent = false) {
  const msg = document.createElement('div');
  msg.className = `message ${sender} has-iframe`;
  previewerIframe = document.createElement('iframe');
  previewerIframe.src = `${link}&martech=off`;
  msg.append(previewerIframe);
  chatWindow.appendChild(msg);
  msg.scrollIntoView({
    behavior: 'smooth'
  });
  loader.remove();
  if (!generateContent) return;
  previewerIframe.onload = () => {
    previewerIframe.contentWindow.postMessage({
        chatContext: "Setting chat context",
    }, '*');
  }
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
    const res = await fetch(agentEP, options);
    const { response } = await res.json();
    
    if (response.hasOwnProperty('message')) {
        appendMessage(response.message, 'bot', response.hasOwnProperty('hasMarkdown'));
        chatHistory.push({
          "role": "system",
          "content": response.message
        });
    }
    if (response.hasOwnProperty('previewerUrl')) {
      appendiFrameMessage(response.previewerUrl.replace("https://develop--da-helpx-gem--adobecom.hlx.page", 'http://localhost:8080'), 'bot', response.generateContent);
    }
    if (response.hasOwnProperty('thumbnail')) {
       appendImageThumbnail(`${response.thumbnail}`, 'bot');
    }
    console.log(chatHistory);
}

(() => {
    window.addEventListener("message", async (e) => {
      const eventData = e.data;
      let blockNames = "";
      if (eventData.hasOwnProperty('blockList')) {
        blockNames = eventData;
      } else {
        return;
      }
      console.log(blockNames);
      chatHistory.push({
        "role": "user",
        "content": 'Generate content for da page for the following block list'
      });
      chatHistory.push({
        "role": "user",
        "content": blockNames
      });

      const chatPayload = {
        "message": JSON.stringify(chatHistory)
      };
      console.log(chatHistory)

      const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(chatPayload)
    };

  fetch('https://2133-49-207-235-196.ngrok-free.app/api/agents/generate-content', options)
    .then(response => response.json())
    .then(response => {
      previewerIframe.contentWindow.postMessage({ generativeContent: response.parsedData }, '*');
    })
    .catch(err => {
      // previewerIframe.contentWindow.postMessage({ generativeContent: {} }, '*');

      previewerIframe.contentWindow.postMessage({ generativeContent: {
          "0": {
            "Marquee": {
              "heading": "Your Creativity, Amplified",
              "body": "Unleash your potential with tools that bring your ideas to life. Craft, design, and innovate like never before with Adobe's cutting-edge solutions.",
              "cta": "Get Started Today"
            }
          },
          "1": {
            "Text": {
              "heading": "Everything You Need to Create",
              "body": "From photo editing to graphic design, video production to digital marketing—our powerful suite of tools empowers creators of all kinds to turn their visions into reality."
            }
          },
          "2": {
            "Media": {
              "heading": "Edit Like a Pro",
              "body": "Transform photos and videos with professional-grade editing tools. Fine-tune details, experiment with effects, and create stunning visuals effortlessly."
            }
          },
          "3": {
            "Media": {
              "heading": "Design Without Limits",
              "body": "Bring your ideas to life with intuitive design tools. From logos to layouts, create anything you can imagine with precision and ease."
            }
          },
          "4": {
            "Media": {
              "heading": "Collaborate Seamlessly",
              "body": "Work smarter, not harder. Share projects, gather feedback, and collaborate with your team in real-time—all from one place."
            }
          },
          "5": {
            "Media": {
              "heading": "Master Social Media",
              "body": "Create scroll-stopping content for every platform. With templates, presets, and automation, crafting engaging posts has never been simpler."
            }
          },
          "6": {
            "Media": {
              "heading": "Elevate Your Storytelling",
              "body": "Captivate your audience with immersive storytelling tools. Whether it’s a presentation, a video, or a digital experience, make it unforgettable."
            }
          },
          "7": {
            "HowTo": {
              "heading": "How to Get Started",
              "body": "1. Choose the tools that fit your needs. 2. Explore tutorials and templates to jumpstart your projects. 3. Start creating and let your imagination run wild."
            }
          },
          "8": {
            "Aside": {
              "heading": "Your Vision, Our Tools",
              "body": "Join millions of creators worldwide who trust Adobe to bring their ideas to life. Start your journey today and see what you can achieve."
            }
          },
          "9": {
            "Accordion": {
              "heading": "Frequently Asked Questions",
              "body": "Find answers to common questions about tools, subscriptions, and getting started. We're here to help you make the most of your creative journey."
            }
          }
        } }, '*');
      appendMessage(`⚠️ Our content muse took a coffee break. Give it another go?.`, 'bot');
    });
  });
})();
