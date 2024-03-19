import { createEnticement } from '../interactive-elements/interactive-elements.js';
import defineDeviceByScreenSize from '../../scripts/decorate.js';
import { getLibs } from '../../scripts/utils.js';
var ccEverywhere;
async function addEnticement(container, enticement, mode) {
  const svgUrl = enticement.querySelector('a').href;
  const enticementText = enticement.innerText;
  const entcmtEl = await createEnticement(`${enticementText}|${svgUrl}`, mode);
  entcmtEl.classList.add('enticement');
  const viewports = ['tablet', 'desktop'];
  viewports.forEach((v) => {
    const mDiv = container.querySelector(`.media.${v}-only`);
    mDiv.insertBefore(entcmtEl.cloneNode(true), mDiv.firstElementChild);
  });
}

function generateDaaLL(hText, alt, v) {
  const altTxt = alt
    ? `${alt}|Marquee|${hText}`
    : `Image-${v}|Marquee|${hText}`;
  return altTxt;
}

function setImgAttrs(img, src, attrs) {
  img.src = src;
  if (attrs.alt) img.alt = attrs.alt;
  if (attrs.w) img.width = attrs.w;
  if (attrs.h) img.height = attrs.h;
}

export const loadScript = (url, type) => new Promise((resolve, reject) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (type) {
      script.setAttribute('type', type);
    }
    head.append(script);
  }

  if (script.dataset.loaded) {
    resolve(script);
    return;
  }

  const onScript = (event) => {
    script.removeEventListener('load', onScript);
    script.removeEventListener('error', onScript);

    if (event.type === 'error') {
      reject(new Error(`error loading script: ${script.src}`));
    } else if (event.type === 'load') {
      script.dataset.loaded = true;
      resolve(script);
    }
  };

  script.addEventListener('load', onScript);
  script.addEventListener('error', onScript);
});

function handleClick(a, v, deviceConfig, hText, isClicked=false) {
  const img = a.querySelector('img');
  const currIndex = deviceConfig[v].index;
  const nextIndex = (currIndex + 1) % deviceConfig[v].srcList.length;
  const src = deviceConfig[v].srcList[nextIndex];
  const attrs = deviceConfig[v].attrList[nextIndex];
  setImgAttrs(img, src, attrs);
  a.setAttribute('daa-ll', generateDaaLL(hText, attrs.alt, v));
  deviceConfig[v].index = nextIndex;
  if (!isClicked) return nextIndex;
  const imq = a.closest('.interactive-marquee')
  let qaname = '';
  if ([...imq.classList].contains('crop')) qaname = 'crop-image';
  if ([...imq.classList].contains('remove-bg')) qaname = 'remove-background';
  loadScript('https://sdk.cc-embed.adobe.com/v3/CCEverywhere.js').then(async () => {
    if (!ccEverywhere) {
      let env = 'preprod';
      ccEverywhere = await window.CCEverywhere.initialize({
        clientId: 'b20f1d10b99b4ad892a856478f87cec3',
        appName: 'express',
      }, {
        loginMode: 'delayed',
        env,
      }, {}, 
      window.authProvider,
  )};

    const exportOptions = [
      {
        target: 'Download',
        id: 'download-button',
        optionType: 'button',
        buttonType: 'native',
      },
    ];
      ccEverywhere.openQuickAction({
        id: qaname,
        modalParams: {
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
        },       
      });
    });
  return nextIndex;
}

function startAutocycle(a, autoCycleConfig, viewport, deviceConfig, interval, hText) {
  if (autoCycleConfig.isImageClicked) return;
  autoCycleConfig.autocycleInterval = setInterval(() => {
    handleClick(a, viewport, deviceConfig, hText);
    // if (autoCycleConfig.isImageClicked
    //   || deviceConfig[viewport].index === deviceConfig[viewport].srcList.length - 1) {
    //   clearInterval(autoCycleConfig.autocycleInterval);
    // }
  }, interval);
}

function processMedia(ic, miloUtil, autoCycleConfig, deviceConfig, v, hText) {
  const media = miloUtil.createTag('div', { class: `media ${v}-only` });
  const a = miloUtil.createTag('a', { class: 'genfill-link' });
  const img = miloUtil.createTag('img', { class: 'genfill-image' });
  const src = deviceConfig[v].srcList[0];
  const attrs = deviceConfig[v].attrList[0];
  setImgAttrs(img, src, attrs);
  a.setAttribute('daa-ll', generateDaaLL(hText, attrs.alt, v));
  a.appendChild(img);
  media.appendChild(a);
  ic.appendChild(media);
  a.addEventListener('click', () => {
    autoCycleConfig.isImageClicked = true;
    if (autoCycleConfig.autocycleInterval) clearInterval(autoCycleConfig.autocycleInterval);
    handleClick(a, v, deviceConfig, hText, loadScript, true);
  });
}

function getImgSrc(pic, viewport) {
  let source = '';
  if (viewport === 'mobile') source = pic.querySelector('source[type="image/webp"]:not([media])');
  else source = pic.querySelector('source[type="image/webp"][media]');
  return source.srcset;
}

export default async function decorateGenfill(el, miloUtil) {
  const { loadScript } = await import(`${getLibs()}/utils/utils.js`);
  const autoCycleConfig = {
    autocycleInterval: null,
    isImageClicked: false,
  };
  const ic = el.querySelector('.interactive-container');
  const heading = ic.closest('.foreground').querySelector('h1, h2, h3, h4, h5, h6');
  const hText = heading.id
    .split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const allP = ic.querySelectorAll('.media:first-child p');
  const pMetadata = [...allP].filter((p) => !p.querySelector('picture'));
  const [enticement, timer = null] = [...pMetadata];
  enticement.classList.add('enticement-detail');
  timer?.classList.add('timer');
  const mode = el.classList.contains('light') ? 'light' : 'dark';
  const timerValues = timer ? timer.innerText.split('|') : null;
  const [intervalTime = 2000, delayTime = 1000] = (timerValues && timerValues.length > 1)
    ? timerValues : [2000];
  [enticement, timer].forEach((i) => i?.remove());
  const currentDom = ic.cloneNode(true);
  ic.innerHTML = '';
  const viewports = ['mobile', 'tablet', 'desktop'];
  const deviceConfig = {
    mobile: { srcList: [], attrList: [], index: 0 },
    tablet: { srcList: [], attrList: [], index: 0 },
    desktop: { srcList: [], attrList: [], index: 0 },
  };
  const mediaElements = currentDom.querySelectorAll('.media');
  viewports.forEach((v, vi) => {
    const media = mediaElements[vi]
      ? mediaElements[vi]
      : currentDom.lastElementChild;
    [...media.querySelectorAll('picture')].forEach((pic, index) => {
      const src = getImgSrc(pic, v);
      deviceConfig[v].srcList.push(src);
      const img = pic.querySelector('img');
      deviceConfig[v].attrList.push({ alt: img.alt, w: img.width, h: img.height });
      if (index === 0) processMedia(ic, miloUtil, autoCycleConfig, deviceConfig, v, hText);
    });
  });
  const currentVP = defineDeviceByScreenSize().toLocaleLowerCase();
  setTimeout(() => {
    const aTag = ic.querySelector(`.${currentVP}-only a`);
    startAutocycle(aTag, autoCycleConfig, currentVP, deviceConfig, intervalTime, hText);
  }, delayTime);
  addEnticement(ic, enticement, mode);
}
