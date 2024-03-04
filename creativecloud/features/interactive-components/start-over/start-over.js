import { getLibs } from '../../../scripts/utils.js';

export default async function stepInit(data) {
  const miloLibs = getLibs('/libs');
  const { createTag } = await import(`${miloLibs}/utils/utils.js`);
  const svg = data.config.querySelector('img[src*=svg]');
  const svgClone = svg.cloneNode(true);
  const content = 'Start Over';
  const btn = createTag('a', { class: `gray-button start-over body-s next-step layer show-layer layer-${data.step}` }, `${content}`);
  btn.prepend(svgClone);
  data.target.classList.add('step-start-over');
  data.target.append(btn);
}
