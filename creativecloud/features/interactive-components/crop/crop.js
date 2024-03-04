import { getLibs } from '../../../scripts/utils.js';

export default async function stepInit(data) {
  const miloLibs = getLibs('/libs');
  const { createTag } = await import(`${miloLibs}/utils/utils.js`);
  const img = data.config.querySelector('img');
  if (!img.src.includes('svg')) {
    const imgclone = img.closest('picture').cloneNode(true);
    data.target.querySelector('picture').replaceWith(imgclone);
  }
  const svg = data.config.querySelector('img[src*=svg]');
  const svgClone = svg.cloneNode(true);
  const content = 'Crop';
  const btn = createTag('a', { class: `gray-button body-s next-step layer layer-${data.step} show-layer` }, `${content}`);
  btn.prepend(svgClone);
  data.target.classList.add('step-crop');
  data.target.append(btn);
}
