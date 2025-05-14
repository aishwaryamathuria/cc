const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
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
  chatWindow.scrollTop = chatWindow.scrollHeight;
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

    const res = await fetch('http://localhost:8081/api/agents/chat', options);
    const { response, format } = await res.json();
    // const response = "Certainly! To create a comprehensive technical requirement document for the web design strategy targeting creative designers, I will outline the key sections and details you might need. Here's a draft template you can customize:\n\n---\n\n# Technical Requirement Document: Web Redesign Strategy to Target Creative Designers\n\n## 1. Project Overview\n- **Project Name:** Creative Designers Campaign Web Redesign\n- **Purpose:** Redesign the website to attract creative designers and encourage them to use our product.\n- **Stakeholders:** Marketing Team, Product Team, Design Team, Development Team\n\n## 2. Objectives\n- Increase engagement from creative designers\n- Highlight features relevant to designers\n- Improve user experience tailored to creative workflows\n- Enhance brand perception as a design-friendly product\n\n## 3. Target Audience\n- Professional creative designers (graphic designers, UX/UI designers, illustrators, etc.)\n- Design students and freelancers\n- Agencies specializing in creative projects\n\n## 4. Functional Requirements\n\n### 4.1 User Interface (UI) Requirements\n- Modern, visually appealing design with a creative flair\n- Use of vibrant colors, creative typography, and dynamic layouts\n- Showcase portfolio examples or case studies relevant to designers\n- Interactive elements such as sliders, hover effects, and animations\n- Responsive design for desktop, tablet, and mobile devices\n\n### 4.2 Content Requirements\n- Dedicated sections highlighting product benefits for designers\n- Tutorials, design tips, and inspiration blog posts\n- Testimonials and success stories from creative professionals\n- Downloadable resources like design templates or toolkits\n\n### 4.3 User Experience (UX) Requirements\n- Intuitive navigation tailored for designers’ interests\n- Quick access to product demos or free trials\n- Easy sign-up or onboarding process\n- Integration with design tools or plugins if applicable\n\n### 4.4 Performance Requirements\n- Fast loading times (<3 seconds)\n- Optimized images and media content\n- SEO optimized for keywords related to creative design\n\n## 5. Technical Requirements\n\n### 5.1 Platform and Technology Stack\n- Frontend: React.js / Vue.js / Angular (choose based on current stack)\n- Backend: Node.js / Django / Ruby on Rails (as applicable)\n- CMS: Headless CMS or custom CMS for managing creative content\n- Hosting: Cloud provider with CDN for performance (e.g., AWS, Azure, Cloudflare)\n\n### 5.2 Integration Requirements\n- Analytics tools (Google Analytics, Hotjar)\n- Marketing tools (Mailchimp, HubSpot)\n- Social media integrations (Instagram, Behance, Dribbble)\n- Product trial and sign-up system integration\n\n### 5.3 Security Requirements\n- HTTPS enabled\n- Data protection for user sign-ups\n- Compliance with GDPR/CCPA as applicable\n\n## 6. Design Guidelines\n- Follow brand identity with added creative elements\n- Use imagery and iconography that resonate with designers\n- Accessibility compliance (WCAG 2.1 AA standard)\n\n## 7. Testing and Quality Assurance\n- Cross-browser compatibility testing\n- Responsive design testing on various devices\n- Usability testing with creative designers’ feedback\n- Performance testing for load times\n\n## 8. Timeline and Milestones\n- Research and Requirement Gathering: 2 weeks\n- Design Phase: 3 weeks\n- Development Phase: 4 weeks\n- Testing and QA: 2 weeks\n- Launch: [Date]\n\n## 9. Success Metrics\n- Increase in website traffic from creative designers by X%\n- Increase in product sign-ups from target audience by Y%\n- Engagement metrics (time on page, bounce rate) improvement\n- Positive feedback from user testing sessions\n\n---\n\nWould you like me to help with a more detailed version or specific sections like the UI/UX design specifications or integration details?"
    appendMessage(response, 'bot');
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
