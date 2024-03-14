import { getLibs } from '../../scripts/utils.js';

function nextStepEventListener(el, canvas, steps) {
  const nextSteps = canvas.querySelectorAll('.next-step');
  nextSteps.forEach((nextStep) => {
    nextStep.addEventListener('click', async (e) => {
      stepIndex = (stepIndex + 1) % el.querySelectorAll(':scope > div').length;
      await implementWorkflow(el, canvas, steps);
      // const a = el.querySelectorAll(':scope > div')[stepIndex].querySelectorAll('img');
      // [...a].forEach((i) => {
      //   i?.setAttribute('loading', 'eager');
      //   i?.setAttribute('fetchpriority', 'high');
      // });
    });
  });
}

let stepIndex = 0;
async function implementWorkflow(el, canvas, steps) {
  const assets = el.querySelectorAll(':scope > div')[stepIndex].querySelectorAll('img');
  [...assets].forEach((i) => {
    i?.setAttribute('loading', 'eager');
    i?.setAttribute('fetchpriority', 'high');
  });
  const miloLibs = getLibs('/libs');
  const { loadStyle } = await import(`${miloLibs}/utils/utils.js`);
  // const ps = stepIndex === 0 ? steps.length - 1 : stepIndex - 1;
  const layers = canvas.querySelectorAll('.layer');
  let layerExists = false;
  [...layers].forEach((layer) => {
    if (layer.classList.contains(`layer-${stepIndex}`)) {
      layer.classList.add('show-layer');
      layerExists = true;
    } else {
      layer.classList.remove('show-layer');
    }
  });
  if (layerExists) {
    const img = el.querySelectorAll(':scope > div')[stepIndex].querySelector('img');
    if (!img.src.includes('svg')) {
      const imgclone = img.closest('picture').cloneNode(true);
      canvas.querySelector('picture').replaceWith(imgclone);
    }
    nextStepEventListener(el, canvas, steps);
    return;
  }
  const stepJS = `${window.location.origin}/creativecloud/features/interactive-components/${steps[stepIndex]}/${steps[stepIndex]}.js`;
  const stepCSS = `${window.location.origin}/creativecloud/features/interactive-components/${steps[stepIndex]}/${steps[stepIndex]}.css`;
  loadStyle(stepCSS);
  const { default: stepInit } = await import(stepJS);
  await stepInit({ target: canvas, config: el.querySelectorAll(':scope > div')[stepIndex], step: stepIndex });
  nextStepEventListener(el, canvas, steps);
}

export default async function init(el) {
  const intWorkFlowConfig = {
    'workflow-1': ['crop', 'start-over'],
    'workflow-2': ['crop', 'crop', 'start-over'],
  };
  let wfName = '';
  [...el.classList].forEach((cn) => {
    if (cn.match('workflow-')) wfName = cn;
  });
  const fg = document.querySelector('.marquee .asset');
  if (wfName) implementWorkflow(el, fg, intWorkFlowConfig[wfName]);
}
