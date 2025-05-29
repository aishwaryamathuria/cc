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

const editSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 9.5H16.5V8.5C16.5 7.04131 15.9205 5.64236 14.8891 4.61091C13.8576 3.57946 12.4587 3 11 3C9.54131 3 8.14236 3.57946 7.11091 4.61091C6.07946 5.64236 5.5 7.04131 5.5 8.5V9.5H4.5C4.36739 9.5 4.24021 9.55268 4.14645 9.64645C4.05268 9.74021 4 9.86739 4 10V19C4 19.1326 4.05268 19.2598 4.14645 19.3536C4.24021 19.4473 4.36739 19.5 4.5 19.5H17.5C17.6326 19.5 17.7598 19.4473 17.8536 19.3536C17.9473 19.2598 18 19.1326 18 19V10C18 9.86739 17.9473 9.74021 17.8536 9.64645C17.7598 9.55268 17.6326 9.5 17.5 9.5ZM7.5 8.5C7.5 7.57174 7.86875 6.6815 8.52513 6.02513C9.1815 5.36875 10.0717 5 11 5C11.9283 5 12.8185 5.36875 13.4749 6.02513C14.1313 6.6815 14.5 7.57174 14.5 8.5V9.5H7.5V8.5ZM12 14.611V16C12 16.1326 11.9473 16.2598 11.8536 16.3536C11.7598 16.4473 11.6326 16.5 11.5 16.5H10.5C10.3674 16.5 10.2402 16.4473 10.1464 16.3536C10.0527 16.2598 10 16.1326 10 16V14.611C9.80916 14.4416 9.66506 14.226 9.58153 13.9848C9.498 13.7437 9.47785 13.4852 9.523 13.234C9.58849 12.8643 9.79025 12.5326 10.0884 12.3044C10.3866 12.0762 10.7595 11.9682 11.1335 12.0016C11.5075 12.035 11.8553 12.2075 12.1083 12.4849C12.3613 12.7623 12.5011 13.1245 12.5 13.5C12.4996 13.71 12.4549 13.9175 12.3687 14.1089C12.2826 14.3004 12.1569 14.4715 12 14.611Z" fill="#222222"/>
                </svg>`;
const deleteSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 16.5C10.5578 16.4997 10.3735 16.4233 10.2376 16.2874C10.1017 16.1515 10.0253 15.9672 10.025 15.775V8.725C10.025 8.53272 10.1014 8.34831 10.2373 8.21235C10.3733 8.07638 10.5577 8 10.75 8C10.9423 8 11.1267 8.07638 11.2626 8.21235C11.3986 8.34831 11.475 8.53272 11.475 8.725V15.775C11.4747 15.9672 11.3983 16.1515 11.2624 16.2874C11.1264 16.4233 10.9422 16.4997 10.75 16.5Z" fill="#222222"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.371 16.486C8.18499 16.5071 7.99821 16.4536 7.85161 16.3372C7.70502 16.2208 7.61057 16.051 7.589 15.865L6.965 8.73801C6.95978 8.55293 7.02547 8.37285 7.14864 8.2346C7.27181 8.09635 7.44314 8.01039 7.6276 7.9943C7.81205 7.9782 7.99569 8.03319 8.14094 8.14802C8.28619 8.26284 8.38208 8.42882 8.409 8.61201L9.034 15.738C9.04494 15.925 8.9813 16.1088 8.85703 16.249C8.73276 16.3892 8.55799 16.4744 8.371 16.486Z" fill="#222222"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.129 16.486C12.9424 16.4749 12.7677 16.3903 12.6434 16.2506C12.5192 16.1109 12.4553 15.9277 12.466 15.741L13.088 8.641C13.1127 8.45584 13.2078 8.28733 13.3536 8.17051C13.4994 8.0537 13.6846 7.99757 13.8707 8.01379C14.0568 8.03002 14.2295 8.11736 14.3528 8.25764C14.4762 8.39792 14.5407 8.58035 14.533 8.767L13.91 15.867C13.9 15.9592 13.8717 16.0484 13.8269 16.1296C13.7821 16.2107 13.7216 16.2822 13.6489 16.3398C13.5762 16.3974 13.4929 16.4399 13.4036 16.465C13.3144 16.4902 13.221 16.4973 13.129 16.486Z" fill="#222222"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 5H15V4C15 3.60218 14.842 3.22064 14.5607 2.93934C14.2794 2.65804 13.8978 2.5 13.5 2.5H8C7.60218 2.5 7.22064 2.65804 6.93934 2.93934C6.65804 3.22064 6.5 3.60218 6.5 4V5H3C2.86739 5 2.74021 5.05268 2.64645 5.14645C2.55268 5.24021 2.5 5.36739 2.5 5.5V6C2.5 6.13261 2.55268 6.25979 2.64645 6.35355C2.74021 6.44732 2.86739 6.5 3 6.5H3.75L4.957 19C4.96897 19.1241 5.02689 19.2393 5.11939 19.3229C5.21189 19.4065 5.3323 19.4526 5.457 19.452H16.046C16.1707 19.4526 16.2911 19.4065 16.3836 19.3229C16.4761 19.2393 16.534 19.1241 16.546 19L17.75 6.5H18.5C18.6326 6.5 18.7598 6.44732 18.8536 6.35355C18.9473 6.25979 19 6.13261 19 6V5.5C19 5.36739 18.9473 5.24021 18.8536 5.14645C18.7598 5.05268 18.6326 5 18.5 5ZM8 4H13.5V5H8V4ZM15.141 18H6.365L5.257 6.5H16.243L15.141 18Z" fill="#222222"/>
                  </svg>`;
const editDoneSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 9.49999H7.5V6.12699C7.48765 5.25608 7.7927 4.41045 8.35819 3.74798C8.92368 3.08552 9.71095 2.65151 10.573 2.52699C11.288 2.44012 12.0124 2.57597 12.6474 2.91601C13.2824 3.25604 13.797 3.7837 14.121 4.42699C14.1762 4.53407 14.2682 4.61761 14.3801 4.66226C14.492 4.7069 14.6162 4.70965 14.73 4.66999L15.677 4.33199C15.7433 4.30779 15.8038 4.27 15.8547 4.22106C15.9056 4.17211 15.9456 4.11309 15.9724 4.04776C15.9991 3.98243 16.0119 3.91224 16.0099 3.84168C16.008 3.77111 15.9913 3.70174 15.961 3.63799C15.4971 2.66346 14.7567 1.84695 13.832 1.29021C12.9074 0.733461 11.8393 0.461079 10.761 0.506995C9.32532 0.597117 7.97904 1.235 7.00006 2.28898C6.02107 3.34296 5.4841 4.73258 5.5 6.17099V9.49999H4.5C4.36739 9.49999 4.24021 9.55267 4.14645 9.64644C4.05268 9.74021 4 9.86739 4 9.99999V19C4 19.1326 4.05268 19.2598 4.14645 19.3535C4.24021 19.4473 4.36739 19.5 4.5 19.5H17.5C17.6326 19.5 17.7598 19.4473 17.8536 19.3535C17.9473 19.2598 18 19.1326 18 19V9.99999C18 9.86739 17.9473 9.74021 17.8536 9.64644C17.7598 9.55267 17.6326 9.49999 17.5 9.49999ZM12 14.611V16C12 16.1326 11.9473 16.2598 11.8536 16.3535C11.7598 16.4473 11.6326 16.5 11.5 16.5H10.5C10.3674 16.5 10.2402 16.4473 10.1464 16.3535C10.0527 16.2598 10 16.1326 10 16V14.611C9.80916 14.4416 9.66506 14.226 9.58153 13.9848C9.498 13.7437 9.47785 13.4852 9.523 13.234C9.58849 12.8643 9.79025 12.5326 10.0884 12.3044C10.3866 12.0762 10.7595 11.9682 11.1335 12.0016C11.5075 12.035 11.8553 12.2075 12.1083 12.4849C12.3613 12.7623 12.5011 13.1245 12.5 13.5C12.4996 13.71 12.4549 13.9175 12.3687 14.1089C12.2826 14.3004 12.1569 14.4715 12 14.611Z" fill="#222222"/>
                    </svg>`;

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
    li.innerHTML = `<a href='#' id="${id}">${c.data.name}...</a><div><span class='edit'>${editSVG}</span><span class='edit-done hide'>${editDoneSVG}</span><span class='delete'>${deleteSVG}</span><div>`;
    conversationList.append(li);
  });

  conversationList.querySelectorAll('li').forEach((li) => {
    
    const edit = li.querySelector('.edit');
    const editDone = li.querySelector('.edit-done')
    const del = li.querySelector('.delete');
    const thread = li.querySelector('a');

    edit.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      const edit = li.querySelector('.edit');
      const editDone = li.querySelector('.edit-done');
      const textTag = li.querySelector('a');
      textTag.setAttribute('contentEditable', 'true');
      editDone.classList.add('show');
      edit.classList.remove('show');
      editDone.classList.remove('hide');
      edit.classList.add('hide');
      textTag.focus();
    });

    editDone.addEventListener('click', (e) => {
      const li = e.target.closest('li')
      const edit = li.querySelector('.edit');
      const editDone = li.querySelector('.edit-done')
      const textTag = li.querySelector('a');
      textTag.removeAttribute('contentEditable', 'true');
      edit.classList.add('show');
      edit.classList.remove('hide');
      editDone.classList.add('hide');
      editDone.classList.remove('show');
    });

    del.addEventListener('click', async (e) => {
      const li = e.target.closest('li')
      const convId = li.querySelector('a').id;
      await deleteConversation(convId);
      li.remove();
    });

    thread.addEventListener('click', async () => {
      const li = e.target.closest('li')
      const convId = li.querySelector('a').id;
      document.querySelector('.card-section').style.display = 'none';
      chatWindow.style.display = 'flex';
      observer?.disconnect();
      observer = null;
      const d = await getConversationById(convId);
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
