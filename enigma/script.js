const sendBtn = document.getElementById('send-btn');
const inputArea = document.getElementById('input-area');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const loader = document.createElement('div');
const toggleBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('closeSidebar');
const DB_NAME = 'ConversationsDB';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';
const conversationList = document.getElementById('conversation-list');
let observer = null;
let THREAD_ID = generateId();
loader.classList.add('loader');

const editSVG = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 119.19"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><title>modify</title><path class="cls-1" d="M104.84,1.62,121.25,18a5.58,5.58,0,0,1,0,7.88L112.17,35l-24.3-24.3L97,1.62a5.6,5.6,0,0,1,7.88,0ZM31.26,3.43h36.3L51.12,19.87H31.26A14.75,14.75,0,0,0,20.8,24.2l0,0a14.75,14.75,0,0,0-4.33,10.46v68.07H84.5A14.78,14.78,0,0,0,95,98.43l0,0a14.78,14.78,0,0,0,4.33-10.47V75.29l16.44-16.44V87.93A31.22,31.22,0,0,1,106.59,110l0,.05a31.2,31.2,0,0,1-22,9.15h-72a12.5,12.5,0,0,1-8.83-3.67l0,0A12.51,12.51,0,0,1,0,106.65v-72a31.15,31.15,0,0,1,9.18-22l.05-.05a31.17,31.17,0,0,1,22-9.16ZM72.33,74.8,52.6,80.9c-13.85,3-13.73,6.15-11.16-6.91l6.64-23.44h0l0,0L83.27,15.31l24.3,24.3L72.35,74.83l0,0ZM52.22,54.7l16,16-13,4c-10.15,3.13-10.1,5.22-7.34-4.55l4.34-15.4Z"/></svg>`;
const deleteSVG = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105.16 122.88"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><title>delete</title><path class="cls-1" d="M11.17,37.16H94.65a8.4,8.4,0,0,1,2,.16,5.93,5.93,0,0,1,2.88,1.56,5.43,5.43,0,0,1,1.64,3.34,7.65,7.65,0,0,1-.06,1.44L94,117.31v0l0,.13,0,.28v0a7.06,7.06,0,0,1-.2.9v0l0,.06v0a5.89,5.89,0,0,1-5.47,4.07H17.32a6.17,6.17,0,0,1-1.25-.19,6.17,6.17,0,0,1-1.16-.48h0a6.18,6.18,0,0,1-3.08-4.88l-7-73.49a7.69,7.69,0,0,1-.06-1.66,5.37,5.37,0,0,1,1.63-3.29,6,6,0,0,1,3-1.58,8.94,8.94,0,0,1,1.79-.13ZM5.65,8.8H37.12V6h0a2.44,2.44,0,0,1,0-.27,6,6,0,0,1,1.76-4h0A6,6,0,0,1,43.09,0H62.46l.3,0a6,6,0,0,1,5.7,6V6h0V8.8h32l.39,0a4.7,4.7,0,0,1,4.31,4.43c0,.18,0,.32,0,.5v9.86a2.59,2.59,0,0,1-2.59,2.59H2.59A2.59,2.59,0,0,1,0,23.62V13.53H0a1.56,1.56,0,0,1,0-.31v0A4.72,4.72,0,0,1,3.88,8.88,10.4,10.4,0,0,1,5.65,8.8Zm42.1,52.7a4.77,4.77,0,0,1,9.49,0v37a4.77,4.77,0,0,1-9.49,0v-37Zm23.73-.2a4.58,4.58,0,0,1,5-4.06,4.47,4.47,0,0,1,4.51,4.46l-2,37a4.57,4.57,0,0,1-5,4.06,4.47,4.47,0,0,1-4.51-4.46l2-37ZM25,61.7a4.46,4.46,0,0,1,4.5-4.46,4.58,4.58,0,0,1,5,4.06l2,37a4.47,4.47,0,0,1-4.51,4.46,4.57,4.57,0,0,1-5-4.06l-2-37Z"/></svg>`;

function startNewChat() {
  THREAD_ID = generateId();
  restartObserver();
  chatWindow.innerHTML = "";
  chatHistory = {};
  document.querySelector('.card-section').style.display = 'flex';
}

function restartObserver() {
  if (observer) observer.disconnect();
  observer = new MutationObserver(async (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        try {
          if (!chatWindow.querySelector('.message.user')) return;
          await saveConversation(THREAD_ID, {
            name: chatWindow.querySelector('.message.user').innerText.slice(0, 20),
            domData: chatWindow.innerHTML,
            chatHistory: JSON.stringify(chatHistory)
          });
          await loadAllConversations();
        } catch(err) {
          console.log("⚠️ Failed to save conversation in IndexDB");
        }
      }
    }
  });
  const config = {
    childList: true
  };
  observer.observe(chatWindow, config);
}

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

document.querySelector('#closeModal').addEventListener('click', () => {
  document.querySelector('#imgModal').style.display = "none";
})
let previewerIframe = null;
let chatHistory = [{
    "role": "system",
    "content": "Conversation started"
  }];


let agentEP = 'https://wcms-milostudio-bulkops-deploy-ethos501-prod-or2-6cb495.cloud.adobe.io/api/agents';
const agentEPLocal = 'http://localhost:8081/api/agents';
const params = new URLSearchParams(window.location.search);
if (params.has('ref') && params.get('ref') == "local") agentEP = agentEPLocal;

sendBtn.addEventListener('click', () => {
  userInput.placeholder = "Ready when you are...";
  sendMessage();
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

toggleBtn.addEventListener('click', () => {
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    document.getElementById('homeIcon').style.display = 'flex';
    sidebar.classList.remove('open');
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.75 18H4.25C3.00928 18 2 16.9902 2 15.75V4.25C2 3.00977 3.00928 2 4.25 2H15.75C16.9907 2 18 3.00977 18 4.25V15.75C18 16.9902 16.9907 18 15.75 18ZM4.25 3.5C3.83643 3.5 3.5 3.83691 3.5 4.25V15.75C3.5 16.1631 3.83643 16.5 4.25 16.5H15.75C16.1636 16.5 16.5 16.1631 16.5 15.75V4.25C16.5 3.83691 16.1636 3.5 15.75 3.5H4.25Z" fill="#292929"/>
        <path d="M8.75 15H7C5.89697 15 5 14.1025 5 13V7C5 5.89746 5.89697 5 7 5H8.75C9.85303 5 10.75 5.89746 10.75 7V13C10.75 14.1025 9.85303 15 8.75 15ZM7 6.5C6.72412 6.5 6.5 6.72461 6.5 7V13C6.5 13.2754 6.72412 13.5 7 13.5H8.75C9.02588 13.5 9.25 13.2754 9.25 13V7C9.25 6.72461 9.02588 6.5 8.75 6.5H7Z" fill="#292929"/>
        <path opacity="0.12" d="M8.75 5.75H7C6.30964 5.75 5.75 6.30964 5.75 7V13C5.75 13.6904 6.30964 14.25 7 14.25H8.75C9.44036 14.25 10 13.6904 10 13V7C10 6.30964 9.44036 5.75 8.75 5.75Z" fill="#292929"/>
      </svg>
    `;
    toggleBtn.style.left = '10px';
  } else {
    sidebar.classList.add('open');
    toggleBtn.textContent = '✕';
    toggleBtn.style.left = '260px';
    document.getElementById('homeIcon').style.display = 'none';
  }
});

function sendMessage() {
  document.querySelector(".chat-window").style.display = "flex";
  document.querySelector(".input-area").classList.add('to-bottom');
  document.querySelector('.card-section').style.display = 'none';
  document.querySelector('.section-heading').style.display = 'none';
  if (!inputArea.classList.contains('to-bottom')) inputArea.classList.add('to-bottom');
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage(message, 'user');
  handleChatInteraction();
}

function linkify(text) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.replace(urlRegex, function(url) {
    return `<a href="${url}" target="_blank"">${url}</a>`;
  });
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
  else {
    msg.innerHTML = linkify(text);
  }
  
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

  const disclaimerText = document.createElement('div');
  disclaimerText.classList.add('disclaimer');
  disclaimerText.innerHTML = "* Disclaimer - These images are generated by firefly";
  msg.append(disclaimerText);

  window.addEventListener('message', (event) => {
    if (event.data.hasOwnProperty('iframeReady')) {
      previewerIframe.contentWindow.postMessage({
          chatContext: "Setting chat context",
      }, '*');
    }
  });
}

function handleChatResponse(response) {
  if (response.hasOwnProperty('message')) {
      appendMessage(response.message, 'bot', response.hasOwnProperty('hasMarkdown'));
      chatHistory.push({
        "role": "system",
        "content": response.message
      });
  }
  if (response.hasOwnProperty('previewerUrl')) {
    appendiFrameMessage(response.previewerUrl, 'bot', response.generateContent);
  }
  if (response.hasOwnProperty('thumbnail')) {
    appendImageThumbnail(`${response.thumbnail}`, 'bot');
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

    try {
      const res = await fetch(`${agentEP}/chat`, options);
      const { response } = await res.json();
      handleChatResponse(response);
      console.log(chatHistory);
    } catch (err) {
        appendMessage(`⚠️ Well, that didn’t go as planned. Give it another go?.`, 'bot');
    }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject('Database error: ' + event.target.errorCode);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

async function updateConversationName(id, name) {
  const data = await getConversationById(id);
  data.name = name;
  await saveConversation(id, data);
}

async function saveConversation(id, jsonData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, data: JSON.stringify(jsonData) });
    request.onsuccess = () => {
      resolve(`Conversation with id ${id} saved.`);
    };
    request.onerror = () => {
      reject('Error saving conversation.');
    };
  });
}

async function deleteConversation(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => {
      resolve(`Conversation with id ${id} deleted.`);
    };
    request.onerror = () => {
      reject(`Error deleting conversation with id ${id}.`);
    };
  });
}

async function getAllConversations() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const result = request.result.map(entry => ({
        id: entry.id,
        data: JSON.parse(entry.data)
      }));
      resolve(result);
    };
    request.onerror = () => {
      reject('Error fetching conversations.');
    };
  });
}

async function getConversationById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        resolve({
          id: result.id,
          data: JSON.parse(result.data)
        });
      } else {
        resolve(null);
      }
    };
    request.onerror = () => {
      reject(`Error fetching item with ID: ${id}`);
    };
  });
}

async function loadAllConversations() {
  const conversations = await getAllConversations();
  conversationList.innerHTML = '';
  conversations.forEach((c) => {
    const id = c.id;
    const li = document.createElement('li');
    li.innerHTML = `<a href='#' id=${id}>${c.data.name}...</a><div><span class='edit'>${editSVG}</span><span class='delete'>${deleteSVG}</span><div>`;
    conversationList.append(li);
    
    const edit = li.querySelector('.edit');
    const del = li.querySelector('.delete');
    const thread = li.querySelector('a');

    edit.addEventListener('click', (e) => {
      const textTag = e.target.closest('li').querySelector('a');
      textTag.setAttribute('contentEditable', 'true');
      textTag.addEventListener('blur', async (e) => {
        await updateConversationName(textTag.id, textTag.innerText);
      }, {'once': true});
    });

    del.addEventListener('click', async (e) => {
      const convId = e.target.closest('li').querySelector('a').id;
      await deleteConversation(convId);
      e.target.closest('li').remove();
    });

    thread.addEventListener('click', async () => {
      document.querySelector('.card-section').style.display = 'none';
      chatWindow.style.display = 'flex';
      observer?.disconnect();
      observer = null;
      const d = await getConversationById(id);
      chatWindow.innerHTML = d.data.domData;
      chatHistory = JSON.parse(d.data.chatHistory);
      restartObserver();
      THREAD_ID = id;
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
      });
    });
  });
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

    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(chatPayload)
      };

      let iterCount = 0;
      const idRes = await fetch(`${agentEP}/create-content`, options);
      let { id } = await idRes.json();

      async function tryToLoadContent(id) {
        try {

          const contentOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
          };

          const contentRes = await fetch(`${agentEP}/fetch-content/${id}`, contentOptions);
          const { content } = await contentRes.json();
          iterCount += 1
          if(iterCount > 30) throw new Error('Something went wrong while generating content!');
          if(Object.keys(content).length === 0) setTimeout( () => { tryToLoadContent(id); }, 15000);
          else previewerIframe.contentWindow.postMessage({ generativeContent: content}, '*');
        } catch (err) {
          console.log(err);
          previewerIframe.contentWindow.postMessage({ generativeContent: {}}, '*');
          appendMessage(`⚠️ Our content muse took a coffee break. Give it another go?.`, 'bot');
        }
      }
      tryToLoadContent(id);
    } catch (err) {
      console.log(err);
      previewerIframe.contentWindow.postMessage({ generativeContent: {}}, '*');
      appendMessage(`⚠️ Our content muse took a coffee break. Give it another go?.`, 'bot');
    }
  });

  document.querySelectorAll('.card').forEach(c => {
    if (c.querySelector(".card-overlay")) return;
    const staticSrc = c.querySelector('img').src;
    const gifSrc = c.querySelector('img').getAttribute('data-gif');

    c.addEventListener('mouseenter', () => {
      c.querySelector('img').src = gifSrc;
    });

    c.addEventListener('mouseleave', () => {
      c.querySelector('img').src = staticSrc;
    });

    c.addEventListener('click', (e) => {
      restartObserver();
      let cardPlaceholder = null;
      if (e.target.classList.contains('card')) cardPlaceholder =  e.target?.dataset?.placeholder;
      else cardPlaceholder = e.target?.closest('.card')?.dataset?.placeholder;
      userInput.value = cardPlaceholder;
    });
  });

  try {
    loadAllConversations();
  } catch (err) {
    console.log("⚠️ Error loading conversation history")
  }

  document.getElementById('homeIcon').addEventListener('click', () => {
    window.location.reload();
  })
})();
