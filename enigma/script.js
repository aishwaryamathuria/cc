const sendBtn = document.getElementById('send-btn');
const inputArea = document.getElementById('input-area');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const loader = document.createElement('div');
loader.innerHTML = `
                      <div class="skeleton-line short"></div>
                      <div class="skeleton-line long"></div>
                    `;
const toggleBtn = document.getElementById('toggleSidebar');
const homeIconBtn = document.getElementById('homeIcon');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('closeSidebar');
const DB_NAME = 'ConversationsDB';
const DB_VERSION = 1;
const STORE_NAME = 'conversations';
const conversationList = document.getElementById('conversation-list');
let observer = null;
let THREAD_ID = generateId();
let THREAD_NAME = null;
let CONVERSATION_STARTED = false;
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
const likeOutline =  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.922 6L11.647 6.005C11.9248 5.01597 12.0595 3.99224 12.047 2.965C12.0692 2.50005 11.92 2.04312 11.6277 1.6809C11.3353 1.31869 10.9202 1.0764 10.461 1C10.0374 1.0051 9.63179 1.17164 9.32683 1.46564C9.02188 1.75963 8.8406 2.15891 8.82 2.582C8.585 4.859 6.194 6.714 4.936 7.269C4.89434 7.18901 4.83183 7.12177 4.75507 7.07442C4.67831 7.02706 4.59018 7.00135 4.5 7H1.5C1.36739 7 1.24021 7.05268 1.14645 7.14645C1.05268 7.24021 1 7.36739 1 7.5V15.5C1 15.6326 1.05268 15.7598 1.14645 15.8536C1.24021 15.9473 1.36739 16 1.5 16H4.5C4.63261 16 4.75979 15.9473 4.85355 15.8536C4.94732 15.7598 5 15.6326 5 15.5V15H12.222C12.6435 15.0045 13.0583 14.894 13.4218 14.6805C13.7853 14.4669 14.0837 14.1584 14.285 13.788L16.277 8.152C16.3875 7.92302 16.438 7.6697 16.4238 7.41584C16.4095 7.16198 16.3309 6.91592 16.1955 6.70076C16.06 6.4856 15.872 6.30841 15.6493 6.18583C15.4265 6.06325 15.1763 5.9993 14.922 6ZM15.374 7.712L13.366 13.39C13.3026 13.5703 13.1847 13.7264 13.0286 13.8368C12.8726 13.9471 12.6861 14.0063 12.495 14.006L5 14V8.3C6.434 7.723 9.575 5.537 9.82 2.6C9.84003 2.4409 9.91508 2.29382 10.0321 2.18424C10.1492 2.07466 10.3009 2.00948 10.461 2C10.761 2 11.021 2.371 11.047 2.969C11.137 4.36774 10.8347 5.76384 10.174 7H14.923C15.0075 6.99999 15.0907 7.0214 15.1647 7.06224C15.2386 7.10308 15.3011 7.162 15.3461 7.23351C15.3912 7.30503 15.4174 7.38679 15.4222 7.47117C15.4271 7.55554 15.4105 7.63978 15.374 7.716V7.712Z" fill="#2C2C2C"/>
                      </svg>`;
const likeFill =  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3.5 7H1.5C1.22386 7 1 7.22386 1 7.5V15.5C1 15.7761 1.22386 16 1.5 16H3.5C3.77614 16 4 15.7761 4 15.5V7.5C4 7.22386 3.77614 7 3.5 7Z" fill="#2C2C2C"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.483 7.00001H10.5C10.7924 5.50318 10.9597 3.9846 11 2.46001C11 1.63001 10.484 1.00001 10 1.00001C9.8656 0.987715 9.73015 1.00514 9.60323 1.05104C9.47632 1.09695 9.36106 1.17022 9.26563 1.26565C9.1702 1.36108 9.09694 1.47633 9.05103 1.60325C9.00513 1.73016 8.9877 1.86561 9 2.00001C8.90792 3.14651 8.46915 4.23784 7.742 5.12901C6.89223 5.99711 5.97539 6.79691 5 7.52101V15C5 15 6.4 14.984 12 15C12.3921 15.0035 12.7764 14.8901 13.1038 14.6742C13.4311 14.4583 13.6868 14.1498 13.838 13.788L16.4 8.39401C16.4651 8.24207 16.4916 8.07636 16.477 7.91169C16.4624 7.74702 16.4072 7.58855 16.3163 7.45044C16.2255 7.31233 16.1018 7.1989 15.9564 7.12029C15.811 7.04169 15.6483 7.00036 15.483 7.00001Z" fill="#2C2C2C"/>
                  </svg>`;
const unlikeOutline =  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.277 9.848L14.285 4.212C14.0837 3.84161 13.7853 3.53307 13.4218 3.31953C13.0583 3.106 12.6435 2.99553 12.222 3H5C5 2.86739 4.94732 2.74021 4.85355 2.64645C4.75979 2.55268 4.63261 2.5 4.5 2.5H1.5C1.36739 2.5 1.24021 2.55268 1.14645 2.64645C1.05268 2.74021 1 2.86739 1 3V11C1 11.1326 1.05268 11.2598 1.14645 11.3536C1.24021 11.4473 1.36739 11.5 1.5 11.5H4.5C4.63261 11.5 4.75979 11.4473 4.85355 11.3536C4.94732 11.2598 5 11.1326 5 11V10.762C6.272 11.349 8.588 13.177 8.82 15.418C8.8406 15.8411 9.02188 16.2404 9.32683 16.5344C9.63179 16.8284 10.0374 16.9949 10.461 17C10.9209 16.9235 11.3366 16.6807 11.629 16.3176C11.9215 15.9545 12.0702 15.4966 12.047 15.031C12.0595 14.0038 11.9248 12.98 11.647 11.991L14.922 12C15.1763 12.0007 15.4265 11.9368 15.6493 11.8142C15.872 11.6916 16.06 11.5144 16.1955 11.2992C16.3309 11.0841 16.4095 10.838 16.4238 10.5842C16.438 10.3303 16.3875 10.077 16.277 9.848ZM14.923 11H10.174C10.8347 12.2362 11.137 13.6323 11.047 15.031C11.021 15.631 10.765 15.998 10.461 16C10.3009 15.9905 10.1492 15.9253 10.0321 15.8158C9.91508 15.7062 9.84003 15.5591 9.82 15.4C9.575 12.462 6.434 10.276 5 9.7V4L12.5 3.99C12.6911 3.98974 12.8776 4.04888 13.0336 4.15923C13.1897 4.26959 13.3076 4.42571 13.371 4.606L15.379 10.284C15.4157 10.3606 15.4323 10.4453 15.4272 10.5301C15.4221 10.6149 15.3954 10.697 15.3498 10.7686C15.3042 10.8403 15.241 10.8991 15.1664 10.9396C15.0917 10.9801 15.0079 11.0009 14.923 11Z" fill="#222222"/>
                        </svg>`;
const unlikeFill =  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5625 2H1.4375C1.19588 2 1 2.19588 1 2.4375V9.5625C1 9.80412 1.19588 10 1.4375 10H3.5625C3.80412 10 4 9.80412 4 9.5625V2.4375C4 2.19588 3.80412 2 3.5625 2Z" fill="#222222"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1283 10H9.78905C9.78905 10 10.2244 12.1734 10.2244 13.9725C10.2244 14.6991 9.77501 15.25 9.35368 15.25C8.7357 15.25 8.4923 14.8548 8.48295 14.375C8.46626 13.5189 7.95298 12.2587 7.38751 11.6371C6.48871 10.6492 5 9.54428 5 9.54428V3.00001C5 3.00001 6.22288 3.01427 11.0951 3.00001C11.8122 2.99792 12.4215 3.41721 12.6959 4.06065L14.9286 8.78033C15.1749 9.35775 14.7535 10 14.1283 10Z" fill="#222222"/>
                    </svg>`;
const copyText = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path></svg>`;
const downloadPrd = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.186 11.3C11.1625 11.3258 11.1338 11.3464 11.1019 11.3605C11.07 11.3746 11.0354 11.3819 11.0005 11.3819C10.9656 11.3819 10.9311 11.3746 10.8991 11.3605C10.8672 11.3464 10.8385 11.3258 10.815 11.3L7.77001 7.917C7.73775 7.88106 7.71659 7.83655 7.70909 7.78884C7.70159 7.74113 7.70806 7.69227 7.72774 7.64816C7.74741 7.60405 7.77944 7.56659 7.81995 7.5403C7.86046 7.514 7.90772 7.50001 7.95601 7.5H10V2C10 1.86739 10.0527 1.74021 10.1465 1.64645C10.2402 1.55268 10.3674 1.5 10.5 1.5H11.5C11.6326 1.5 11.7598 1.55268 11.8536 1.64645C11.9473 1.74021 12 1.86739 12 2V7.5H14.136C14.1846 7.50006 14.2322 7.51429 14.2728 7.54096C14.3135 7.56763 14.3455 7.60557 14.3649 7.65014C14.3843 7.69471 14.3903 7.74398 14.3822 7.79191C14.374 7.83984 14.3521 7.88435 14.319 7.92L11.186 11.3Z" fill="#222222"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.25 4.5H3C2.86739 4.5 2.74021 4.55268 2.64645 4.64645C2.55268 4.74021 2.5 4.86739 2.5 5V17C2.5 17.1326 2.55268 17.2598 2.64645 17.3536C2.74021 17.4473 2.86739 17.5 3 17.5H19C19.1326 17.5 19.2598 17.4473 19.3536 17.3536C19.4473 17.2598 19.5 17.1326 19.5 17V5C19.5 4.86739 19.4473 4.74021 19.3536 4.64645C19.2598 4.55268 19.1326 4.5 19 4.5H15.75C15.6837 4.5 15.6201 4.52634 15.5732 4.57322C15.5263 4.62011 15.5 4.6837 15.5 4.75V5.75C15.5 5.8163 15.5263 5.87989 15.5732 5.92678C15.6201 5.97366 15.6837 6 15.75 6H18V16H4V6H6.25C6.3163 6 6.37989 5.97366 6.42678 5.92678C6.47366 5.87989 6.5 5.8163 6.5 5.75V4.75C6.5 4.6837 6.47366 4.62011 6.42678 4.57322C6.37989 4.52634 6.3163 4.5 6.25 4.5Z" fill="#222222"/>
                    </svg>`;
const editPrd = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.127 5.56799L3.73298 14.022C3.66693 14.0882 3.61816 14.1695 3.59098 14.259L2.02798 19.5C1.96398 19.712 2.28698 19.978 2.46898 19.978C2.48062 19.979 2.49233 19.979 2.50398 19.978C2.65898 19.942 6.93098 18.659 7.74398 18.414C7.8321 18.3875 7.9122 18.3394 7.97698 18.274L16.377 9.81899L12.127 5.56799ZM7.28498 17.368C6.06898 17.733 4.54898 18.192 3.49898 18.506L4.62898 14.718L7.28498 17.368Z" fill="#222222"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.761 5.48201L16.517 2.23801C16.4531 2.17407 16.3772 2.12346 16.2936 2.08912C16.21 2.05479 16.1204 2.03741 16.03 2.03801H16.008C15.8111 2.04455 15.6242 2.12654 15.486 2.26701L13.119 4.63501L17.364 8.88001L19.731 6.51301C19.8654 6.37979 19.9462 6.20186 19.958 6.01301C19.9646 5.9156 19.9505 5.8179 19.9165 5.72637C19.8826 5.63483 19.8296 5.55154 19.761 5.48201Z" fill="#222222"/>
                </svg>`;

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  }
}

function restartObserver() {
  if (observer) observer.disconnect();
  observer = new MutationObserver(async (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        try {
          if (!chatWindow.querySelector('.message.user')) return;
          if (!THREAD_NAME) THREAD_NAME = chatWindow.querySelector('.message.user').innerText.slice(0, 20);
          await saveConversation(THREAD_ID, {
            name: THREAD_NAME ? THREAD_NAME : chatWindow.querySelector('.message.user').innerText.slice(0, 20),
            domData: processDomForSave(),
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
    if (CONVERSATION_STARTED) homeIconBtn.style.display = 'flex';
    sidebar.classList.remove('open');
  } else {
    if (CONVERSATION_STARTED) homeIconBtn.style.display = 'none';
    sidebar.classList.add('open');
  }
});

function processDomForSave() {
  if (!chatWindow.querySelector('iframe')) return chatWindow.innerHTML;
  const domClone = chatWindow.cloneNode(true);
  const iframes = domClone.querySelectorAll('iframe');
  iframes.forEach((ifr) => {
    if (!ifr.src.includes('/preview.html')) return;
    const url = new URL(ifr.src);
    url.searchParams.set('source', 'da');
    url.searchParams.set('contentUrl', url.searchParams.get('targetUrl'));
    ifr.src = url.toString();
  });
  return domClone.innerHTML;
}

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  CONVERSATION_STARTED = true;
  document.querySelector(".chat-window").style.display = "flex";
  document.querySelector(".input-area").classList.add('to-bottom');
  document.querySelector('.card-section').style.display = 'none';
  document.querySelector('.section-heading').style.display = 'none';
  document.getElementById('homeIcon').style.display = 'flex';
  if (!chatWindow.querySelector('.message.user')) restartObserver();
  if (!inputArea.classList.contains('to-bottom')) inputArea.classList.add('to-bottom');
  appendMessage(message, 'user');
  handleChatInteraction();
}

function linkify(text) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.replace(urlRegex, function(url) {
    return `<a href="${url}" target="_blank"">${url}</a>`;
  });
}

function activateIcons(msgs = chatWindow.querySelectorAll('.message.bot')) {
  msgs.forEach((msg) => {
    msg.querySelector('.icons .thumbs-up')?.addEventListener('click', async (e) => {
      const icn = e.target.nodeName == 'SPAN' ? e.target : e.target.closest('span');
      if (icn.classList.contains('active')) {
        icn.classList.remove('active');
        icn.innerHTML = likeOutline;
      } else {
        icn.classList.add('active');
        icn.innerHTML = likeFill;
        const unlike = icn.closest('.icons').querySelector('.thumbs-down.active');
        if (unlike) {
          unlike.classList.remove('active');
          unlike.innerHTML = unlikeOutline;
        }
      }
      await saveConversation(THREAD_ID, {
        name: THREAD_NAME ? THREAD_NAME : chatWindow.querySelector('.message.user').innerText.slice(0, 20),
        domData: processDomForSave(),
        chatHistory: JSON.stringify(chatHistory)
      });
    });

    msg.querySelector('.icons .thumbs-down')?.addEventListener('click', async (e) => {
      const icn = e.target.nodeName == 'SPAN' ? e.target : e.target.closest('span');
      if (icn.classList.contains('active')) {
        icn.classList.remove('active');
        icn.innerHTML = unlikeOutline;
      } else {
        icn.classList.add('active');
        icn.innerHTML = unlikeFill;
        const like = icn.closest('.icons').querySelector('.thumbs-up.active');
        if (like) {
          like.classList.remove('active');
          like.innerHTML = likeOutline;
        }
      }
      await saveConversation(THREAD_ID, {
        name: THREAD_NAME ? THREAD_NAME : chatWindow.querySelector('.message.user').innerText.slice(0, 20),
        domData: processDomForSave(),
        chatHistory: JSON.stringify(chatHistory)
      });
    });

    msg.querySelector('.icons .copy-response')?.addEventListener('click', (e) => {
      const hasMarkdown = msg.querySelector('.markdown-content');
      if (hasMarkdown) {
        const m = e.target.closest('.message').querySelector('.markdown-content');
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(m.innerHTML);
        copyTextToClipboard(markdown.trim());
      } else {
        copyTextToClipboard(msg.innerText.trim());
      }
    });

    msg.querySelector('.icons .download-prd')?.addEventListener('click', (e) => {
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(e.target.closest('.message').querySelector('.markdown-content').innerHTML);
      const markdownMessage = markdown.trim();

      const options = {
        method: 'POST',
        headers: {'Content-Type': 'text/markdown'},
        body: markdownMessage
      };

      fetch(`${agentEP}/download`, options)
      .then(response => response.blob())
      .then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Stream_PRD_Document.docx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
      })
      .catch(err => console.error(err));
    });

    msg.querySelector('.icons .edit-prd')?.addEventListener('click', (e) => {
      const icn = e.target.nodeName == 'SPAN' ? e.target : e.target.closest('span');
      const mkdnEl = msg.querySelector('.markdown-content');
      if (icn.classList.contains('active')) {
        mkdnEl.removeAttribute('contentEditable');
        icn.classList.remove('active');
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(msg.innerHTML);
        const updatedMessage = markdown.trim();
        const chatHistoryMkdnIdx = parseInt(msg.dataset.chathistoryidx);
        chatHistory[chatHistoryMkdnIdx].content = updatedMessage;
        msg.contentEditable = false;
        saveConversation(THREAD_ID, {
          name: THREAD_NAME ? THREAD_NAME : chatWindow.querySelector('.message.user').innerText.slice(0, 20),
          domData: processDomForSave(),
          chatHistory: JSON.stringify(chatHistory)
        });
      } else {
        mkdnEl.setAttribute('contentEditable', 'true');
        icn.classList.add('active')
      }
    });
  });
}

function appendMessage(text, sender, hasMarkdown = false) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  if (hasMarkdown) {
    if (text.includes('`')) {
      text = text.replaceAll('`', '');
      text = text.replaceAll('markdown', '');
    }
    msg.innerHTML = `<div class='markdown-content'>${marked.parse(text)}</div>`;
    msg.setAttribute('data-chathistoryidx', `${chatHistory.length}`);
  }
  else {
    msg.innerHTML = linkify(text);
  }
  chatWindow.appendChild(msg);

  if (sender == 'bot') {
    if (hasMarkdown) {
      msg.innerHTML += `
        <div class="icons for-markdown">
          <span class="thumbs-up">${likeOutline}</span>
          <span class="thumbs-down">${unlikeOutline}</span>
          <span class="copy-response">${copyText}</span>
          <span class="edit-prd">${editPrd}</span>
          <span class="download-prd">${downloadPrd}</span>
        </div>`;
    } else {
      msg.innerHTML += `
        <div class="icons">
          <span class="thumbs-up">${likeOutline}</span>
          <span class="thumbs-down">${unlikeOutline}</span>
          <span class="copy-response">${copyText}</span>
        </div>`;
    }
    activateIcons([msg]);
  }
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
  msg.scrollIntoView({
    behavior: 'smooth'
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

function appendPreflightMessage(message) {
  let tabs = '<div class="tabs">';
  let tabContents = '';
  Object.keys(message).forEach((i, idx1) => {
    let badLinks = `<table class='badLinks' id="tab-${idx1}-table"><tr><th>Problematic Urls</th><th>Located In</th><th>Status</th></tr>`;
    let hasBadLinks = false;
    let preflightDetails = '';
    if (i.toLowerCase().trim() == 'seo') {
      tabs += `<button class="tab-button active" id="tab-${idx1}">${i}</button>`;
      if (!Object.keys(message[i]).length) {
        preflightDetails = `<div class="tab-content is-empty active" id="tab-${idx1}-content">`;
      } else {
        preflightDetails = `<div class="tab-content active" id="tab-${idx1}-content">`;
      }
    } else {
      tabs += `<button class="tab-button" id="tab-${idx1}">${i}</button>`;
      if (!Object.keys(message[i]).length) {
        preflightDetails = `<div class="tab-content is-empty" id="tab-${idx1}-content">`;
      } else {
        preflightDetails = `<div class="tab-content" id="tab-${idx1}-content">`;
      }
    }

    if (!Object.keys(message[i]).length) {
      preflightDetails += `<div class="preflight-launching-soon">Launching Soon. Stay tuned.</div>`
    } else {
      Object.keys(message[i]).forEach((j) => {
        if (message[i][j].icon == "green") {
          preflightDetails += `<div class="preflight-item">
            <div class="preflight-icon"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path fill="#3AAF3C" d="M256 0c141.39 0 256 114.61 256 256S397.39 512 256 512 0 397.39 0 256 114.61 0 256 0z"/><path fill="#0DA10D" fill-rule="nonzero" d="M391.27 143.23h19.23c-81.87 90.92-145.34 165.89-202.18 275.52-29.59-63.26-55.96-106.93-114.96-147.42l22.03-4.98c44.09 36.07 67.31 76.16 92.93 130.95 52.31-100.9 110.24-172.44 182.95-254.07z"/><path fill="#fff" fill-rule="nonzero" d="M158.04 235.26c19.67 11.33 32.46 20.75 47.71 37.55 39.53-63.63 82.44-98.89 138.24-148.93l5.45-2.11h61.06c-81.87 90.93-145.34 165.9-202.18 275.53-29.59-63.26-55.96-106.93-114.96-147.43l64.68-14.61z"/></svg></div>
            <div class="preflight-content">
              <div class="preflight-title">${message[i][j].title}</div>
              <div class="preflight-description">${message[i][j].description}</div>
            </div>
          </div>`
        } else if (message[i][j].icon == "red") {
          preflightDetails += `<div class="preflight-item">
            <div class="preflight-icon"><?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.879px" height="122.879px" viewBox="0 0 122.879 122.879" enable-background="new 0 0 122.879 122.879" xml:space="preserve"><g><path fill-rule="evenodd" clip-rule="evenodd" fill="#FF4141" d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"/></g></svg></div>
            <div class="preflight-content">
              <div class="preflight-title">${message[i][j].title}</div>
              <div class="preflight-description">${message[i][j].description}</div>
            </div>
          </div>`
        } else {
          preflightDetails += `<div class="preflight-item">
            <div class="preflight-icon"><svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path fill-rule="nonzero" d="M256 0c70.686 0 134.69 28.658 181.016 74.984C483.342 121.31 512 185.314 512 256c0 70.686-28.658 134.69-74.984 181.016C390.69 483.342 326.686 512 256 512c-70.686 0-134.69-28.658-181.016-74.984C28.658 390.69 0 326.686 0 256c0-70.686 28.658-134.69 74.984-181.016C121.31 28.658 185.314 0 256 0z"/><path fill="#FEC901" d="M256 29.464c125.114 0 226.536 101.422 226.536 226.536S381.114 482.536 256 482.536 29.464 381.114 29.464 256 130.886 29.464 256 29.464z"/><path d="M256 341.492c14.453 0 26.168 11.717 26.168 26.171 0 14.453-11.715 26.167-26.168 26.167s-26.171-11.714-26.171-26.167c0-14.454 11.718-26.171 26.171-26.171zm19.55-39.211c-.88 22.063-38.246 22.092-39.1-.007-3.778-37.804-13.443-127.553-13.135-163.074.311-10.946 9.383-17.426 20.989-19.898 3.578-.765 7.513-1.136 11.477-1.132 3.986.007 7.932.4 11.514 1.165 11.988 2.554 21.401 9.301 21.398 20.444l-.045 1.117-13.098 161.385z"/></svg></div>
            <div class="preflight-content">
              <div class="preflight-title">${message[i][j].title}</div>
              <div class="preflight-description">${message[i][j].description}</div>
            </div>
          </div>`
        }
        if (message[i][j].badLinks) {
          hasBadLinks = true;
          message[i][j].badLinks.forEach((bl) => {
            badLinks += `<tr><td><a href="${bl.href}">${bl.href}</a></td><td>${bl.parent}</td><td>${bl.status}</td></tr>`;
          });
        }
      });
    }
    preflightDetails += "</div>";
    badLinks += '</table>';
    if (hasBadLinks) preflightDetails += badLinks;
    tabContents += preflightDetails;
  });
  tabs += '</div>';
  const msg = document.createElement('div');
  msg.className = `message bot has-table`;
  msg.innerHTML = tabs;
  msg.innerHTML += tabContents;
  chatWindow.append(msg);
  msg.scrollIntoView({
    behavior: 'smooth'
  });
  msg.querySelectorAll('.tab-button').forEach((tbtn) => {
    tbtn.addEventListener('click', (e) => {
      const currTab = e.target.classList.contains('tab-button') ? e.target : e.target.closest('.tab-button');
      e.target.closest('.message').querySelectorAll('.tab-button.active').forEach((x) => x.classList.remove('active'));
      currTab.classList.add('active');
      const currTabContentId = `#${currTab.id}-content`;
      e.target.closest('.message')?.querySelectorAll('.tab-content.active').forEach((t) => t.classList.remove('active'));
      if (e.target.closest('.message').querySelector('.badLinks')) e.target.closest('.message').querySelector('.badLinks').style.display = 'none';
      if(e.target.closest('.message').querySelector(`#${currTab.id}-table`)) e.target.closest('.message').querySelector(`#${currTab.id}-table`).style.display = 'flex';
      e.target.closest('.message')?.querySelector(currTabContentId)?.classList.add('active');
    });
  });
  if (!msg.querySelector('.tab-button.active')) msg.querySelector('.tab-button').click();
  loader.remove();
}

function appendFollowUpQuestions(questions) {
  const msg = document.createElement('div');
  msg.className = `message bot is-followup`;
  questions.forEach((q) => { 
    const msgDiv = `<a href="#" class="followup-question" data-question="${q}">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M13.7244 5.97676L10.1467 2.41284C10.0288 2.2954 9.95947 2.13827 9.95219 1.9724C9.94491 1.80654 10.0003 1.64397 10.1074 1.51675C10.2144 1.38953 10.3655 1.30687 10.5307 1.28508C10.6959 1.26328 10.8634 1.30393 11 1.399L11.0889 1.47427L15.8444 6.21583L15.9111 6.3088L15.9467 6.38406L15.9778 6.47261L15.9867 6.5036C15.9957 6.54878 16.0002 6.59476 16 6.64084L15.9911 6.54344L15.9956 6.58329V6.69839L15.9778 6.8135L15.9511 6.89319L15.8978 6.99502L15.8222 7.09242L11.0889 11.8074C10.971 11.9248 10.8132 11.9939 10.6467 12.0011C10.4802 12.0084 10.317 11.9532 10.1893 11.8466C10.0616 11.7399 9.97862 11.5894 9.95674 11.4249C9.93486 11.2603 9.97566 11.0935 10.0711 10.9574L10.1467 10.8688L13.7244 7.30492H8C3.30222 7.30492 0.151105 4.67958 0.0044384 0.938572L-5.72205e-06 0.664084C-5.72205e-06 0.487958 0.0702324 0.319046 0.195256 0.194506C0.320281 0.0699657 0.48985 0 0.666661 0C0.843472 0 1.01304 0.0699657 1.13807 0.194506C1.26309 0.319046 1.33333 0.487958 1.33333 0.664084C1.33333 3.68345 3.74222 5.84837 7.65333 5.97233L8 5.97676H13.7244Z" fill="black"></path></svg>
      </div>
      <div class='question-text'>
        ${q}
      </div>
    </a>`
    msg.innerHTML += msgDiv;
  });
  chatWindow.append(msg);
  msg.scrollIntoView({
    behavior: 'smooth'
  });
  msg.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const txt = e.target.nodeName == 'A' ? e.target.querySelector('.question-text').innerText.trim() : e.target.closest('a').querySelector('.question-text').innerText.trim();
      inputArea.querySelector('textarea').value = txt;
      sendMessage();
    });
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
  if (response.hasOwnProperty('preflight')) {
    appendPreflightMessage(response.preflight[0], 'bot');
  }
  if (response.hasOwnProperty('questions')) {
    appendFollowUpQuestions(response.questions, 'bot');
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
  const { data } = await getConversationById(id);
  const parsedData = JSON.parse(data);
  parsedData.name = name;
  THREAD_NAME = name;
  await saveConversation(id, parsedData);
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
        resolve(result);
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
    li.innerHTML = `<a href='#' id="${id}">${c.data.name}</a><div><span class='edit show'>${editSVG}</span><span class='edit-done hide'>${editDoneSVG}</span><span class='delete show'>${deleteSVG}</span><div>`;
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
      updateConversationName(textTag.id, textTag.innerText.trim());
    });

    del.addEventListener('click', async (e) => {
      const li = e.target.closest('li')
      const convId = li.querySelector('a').id;
      await deleteConversation(convId);
      li.remove();
    });

    thread.addEventListener('click', async (e) => {
      if (e.target.hasAttribute('contentEditable')) return;
      CONVERSATION_STARTED = true;
      const li = e.target.closest('li')
      const convId = li.querySelector('a').id;
      document.querySelector('.card-section').style.display = 'none';
      document.querySelector('.section-heading').style.display = 'none';
      chatWindow.style.display = 'flex';
      observer?.disconnect();
      observer = null;
      const { id, data } = await getConversationById(convId);
      const parsedData = JSON.parse(data);
      chatWindow.innerHTML = parsedData.domData;
      chatHistory = JSON.parse(parsedData.chatHistory);
      restartObserver();
      THREAD_ID = id;
      THREAD_NAME = parsedData.name;
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
      });
      activateIcons();
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
  });


  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sidebar') && !e.target.closest('.toggle-btn') && !e.target.classList.contains('.toggle-btn')) {
      sidebar.classList.remove('open');
      if (CONVERSATION_STARTED) document.getElementById('homeIcon').style.display = 'flex';
    }
  });
})();
