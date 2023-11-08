/* eslint-disable no-restricted-syntax */
async function getExcelData(link) {
  const resp = await fetch(link);
  const { data } = await resp.json();
  return data;
}

export function getSrcFromExcelData(name, viewportType, excelData, type) {
  return excelData
    .filter((data) => data.MenuName === name
    && data.Viewport === viewportType
    && data.ResourceName === type)
    .flatMap((data) => [data.Value1, data.Value2, data.Value3].filter((value) => value.trim() !== ''));
}

export function createConfigExcel(excelJson, configObjData) {
  const viewportTypes = ['mobile', 'tablet', 'desktop'];
  for (const viewportType of viewportTypes) {
    const existingGroups = configObjData[viewportType].groups;
    for (const group of existingGroups) {
      const { name } = group;
      const groupsrc = getSrcFromExcelData(name, viewportType, excelJson, 'src');
      const groupswatchSrc = getSrcFromExcelData(name, viewportType, excelJson, 'swatchSrc');
      group.options = groupsrc.map((src, i) => {
        const option = { src };
        if (groupswatchSrc[i]) option.swatchSrc = groupswatchSrc[i];
        return option;
      });
      if (group.options.length === 0) {
        delete group.options;
      }
    }
  }
}

export function configExcelData(jsonData) {
  const configObj = {};
  jsonData.forEach((item) => {
    const { Viewport, ResourceName, Value1, MenuName } = item;
    if (Viewport && ResourceName && Value1) {
      if (!configObj[Viewport]) configObj[Viewport] = { groups: [] };
      if (!['iconUrl', 'src', 'swatchSrc'].includes(ResourceName)) {
        configObj[Viewport][ResourceName] = Value1;
      } else if (ResourceName === 'iconUrl') {
        const obj = { name: MenuName, [ResourceName]: Value1 };
        configObj[Viewport].groups.push(obj);
      }
    }
  });
  return configObj;
}

export default async function changeBg(block) {
//   let marqueeAssetsData = '';
//   const customElem = document.createElement('ft-changebackgroundmarquee');
//   marqueeAssetsData = el.querySelector(':scope > div').innerText.trim();
//   const excelJsonData = await getExcelData(marqueeAssetsData);
//   customElem.config = configExcelData(excelJsonData);
//   createConfigExcel(excelJsonData, customElem.config);
//   el.append(customElem);
  const devices = ['mobile', 'tablet', 'desktop'];
  const customElem = document.createElement('ft-changebackgroundmarquee');
  customElem.config = {'mobile': {groups:[]}, 'tablet': {groups:[]}, 'desktop': {groups:[]}};
  const el = block.querySelectorAll(':scope > div');

  const defaultBgSrc =  el[0].querySelectorAll('img');
  customElem.config['mobile']['defaultBgSrc'] = `${defaultBgSrc[0].src.replace('=png', '=webply').replace('=medium', '=medium')}`;
  customElem.config['tablet']['defaultBgSrc'] = `${defaultBgSrc[1].src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000')}`;
  customElem.config['desktop']['defaultBgSrc'] = `${defaultBgSrc[2].src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000')}`;

  const marqueeTitleImgSrc =  el[2].querySelectorAll('img');
  customElem.config['mobile']['marqueeTitleImgSrc'] = `${marqueeTitleImgSrc[0].src.replace('=png', '=webply').replace('=medium', '=medium')}`;
  customElem.config['tablet']['marqueeTitleImgSrc'] = `${marqueeTitleImgSrc[1].src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000')}`;
  customElem.config['desktop']['marqueeTitleImgSrc'] = `${marqueeTitleImgSrc[2].src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000')}`;

  const talentSrc =  el[1].querySelectorAll('img');
  customElem.config['mobile']['talentSrc'] = `${talentSrc[0].src.replace('=png', '=webply').replace('=medium', '=medium')}`;
  customElem.config['tablet']['talentSrc'] = `${talentSrc[1].src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000')}`;
  customElem.config['desktop']['talentSrc'] = `${talentSrc[2].src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000')}`;

  const tryitText =  el[3].textContent.trim();
  customElem.config['mobile']['tryitText'] = tryitText
  customElem.config['tablet']['tryitText'] = tryitText
  customElem.config['desktop']['tryitText'] = tryitText

  const tryitSrc =  `${window.location.origin}/drafts/suhjain/assets-interactive-marquee/tryit.svg`
  customElem.config['mobile']['tryitSrc'] = tryitSrc;
  customElem.config['tablet']['tryitSrc'] = tryitSrc;
  customElem.config['desktop']['tryitSrc'] = tryitSrc;

  const removeBackground =  el[4].textContent.trim();
  const removeBackgroundIconUrl = `${window.location.origin}/drafts/suhjain/assets-interactive-marquee/remove-background-icon.svg`;
  customElem.config['mobile']['groups'].push({name: removeBackground, iconUrl: removeBackgroundIconUrl});
  customElem.config['tablet']['groups'].push({name: removeBackground, iconUrl: removeBackgroundIconUrl});
  customElem.config['desktop']['groups'].push({name: removeBackground, iconUrl: removeBackgroundIconUrl});

  const changePhoto =  el[5].textContent.trim();
  const changePhotoIconUrl = `${window.location.origin}/drafts/suhjain/assets-interactive-marquee/change-photo-icon.svg`;
  const mobileChangePhoto = {name: changePhoto, iconUrl: changePhotoIconUrl, options:[]};
  const tabletChangePhoto = {name: changePhoto, iconUrl: changePhotoIconUrl, options:[]};
  const desktopChangePhoto = {name: changePhoto, iconUrl: changePhotoIconUrl, options:[]};
  const swatchImages = el[6].querySelectorAll('img');
  [...el[7].querySelectorAll('div')].forEach((d, index) => {
    const imgs = d.querySelectorAll('img');
    imgs.forEach((img, i) => {
      const screen = devices[index];
      if (index === 0) mobileChangePhoto['options'].push({src: img.src.replace('=png', '=webply').replace('=medium', '=medium'), swatchSrc: swatchImages[i].src.replace('=png', '=webply').replace('=medium', '=large')});
      if (index === 1) tabletChangePhoto['options'].push({src: img.src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000'), swatchSrc: swatchImages[i].src.replace('=png', '=webply').replace('=medium', '=medium')});
      if (index === 2) desktopChangePhoto['options'].push({src: img.src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000'), swatchSrc: swatchImages[i].src.replace('=png', '=webply').replace('=medium', '=medium')});
    });
  });
  customElem.config['mobile']['groups'].push(mobileChangePhoto);
  customElem.config['tablet']['groups'].push(tabletChangePhoto);
  customElem.config['desktop']['groups'].push(desktopChangePhoto);


  const changeColor =  el[8].textContent.trim();
  const changeColorIconUrl = `${window.location.origin}/drafts/suhjain/assets-interactive-marquee/change-color-icon.svg`;
  const mobileChangeColor = {name: changeColor, iconUrl: changeColorIconUrl, options:[]};
  const tabletChangeColor = {name: changeColor, iconUrl: changeColorIconUrl, options:[]};
  const desktopChangeColor = {name: changeColor, iconUrl: changeColorIconUrl, options:[]};
  [...el[9].querySelectorAll('div')].forEach((d, index) => {
    if (d.querySelector('p')) {
      const ps = d.querySelectorAll('p');
      [...ps].forEach((p) => {
        desktopChangeColor['options'].push({src: p.textContent.trim()})
      });
    } else {
      if (index === 0) mobileChangePhoto['options'].push({src: d.textContent.trim()});
      if (index === 1) tabletChangePhoto['options'].push({src: d.textContent.trim()});
    }
  });
  customElem.config['mobile']['groups'].push(mobileChangePhoto);
  customElem.config['tablet']['groups'].push(tabletChangePhoto);
  customElem.config['desktop']['groups'].push(desktopChangePhoto);

  const changePattern =  el[10].textContent.trim();
  const changePatternIconUrl = `${window.location.origin}/drafts/suhjain/assets-interactive-marquee/change-pattern-icon.svg`;
  const mobileChangePattern = {name: changePattern, iconUrl: changePatternIconUrl, options:[]};
  const tabletChangePattern = {name: changePattern, iconUrl: changePatternIconUrl, options:[]};
  const desktopChangePattern = {name: changePattern, iconUrl: changePatternIconUrl, options:[]};
  const swatchPatternImages = el[11].querySelectorAll('img');
  [...el[12].querySelectorAll('div')].forEach((d, index) => {
    const imgs = d.querySelectorAll('img');
    imgs.forEach((img, i) => {
      const screen = devices[index];
      if (index === 0) mobileChangePattern['options'].push({src: img.src.replace('=png', '=webply').replace('=medium', '=medium'), swatchSrc: swatchPatternImages[i].src.replace('=png', '=webply').replace('=medium', '=medium')});
      if (index === 1) tabletChangePattern['options'].push({src: img.src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000'), swatchSrc: swatchPatternImages[i].src.replace('=png', '=webply').replace('=medium', '=medium')});
      if (index === 2) desktopChangePattern['options'].push({src: img.src.replace('=png', '=webply').replace('=medium', '=medium').replace('=750', '=2000'), swatchSrc: swatchPatternImages[i].src.replace('=png', '=webply').replace('=medium', '=medium')});
    });
  });
  customElem.config['mobile']['groups'].push(mobileChangePattern);
  customElem.config['tablet']['groups'].push(tabletChangePattern);
  customElem.config['desktop']['groups'].push(desktopChangePattern);
  block.innerHTML = '';
  block.append(customElem);
  console.log(customElem.config);
}
