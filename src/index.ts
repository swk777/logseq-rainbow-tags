import "@logseq/libs";
import { settingUI } from './setting';
import { logseq as PL } from "../package.json";
const pluginId = PL.id;

interface ITag {
  name: string;
  color: string;
}

const generateTagStyle = (tag: ITag) => `
div#main-content-container a.tag[data-ref="${tag.name}"] {
  color: inherit;
  padding: 2px;
  border-radius: 3px;
  background: ${hex2rgba(tag.color, 0.3)};
}
div#main-content-container div[data-refs-self*="${tag.name}"] {
  padding: 0.8em;
  border-radius: 20px;
  background: ${hex2rgba(tag.color, 0.15)};
  outline: 3px solid ${hex2rgba(tag.color, 0.7)};
  outline-offset: 3px;
}
/* dark-mode */
div#main-content-container a.tag[data-ref="${tag.name}"] {
  background: ${hex2rgba(tag.color, 0.3)};
}
div#main-content-container div[data-refs-self*="${tag.name}"] {
  background: ${hex2rgba(tag.color, 0.15)};
  outline: 3px solid ${hex2rgba(tag.color, 0.7)};
}
`;

//Credit: https://www.yoheim.net/blog.php?q=20171007
function hex2rgba(hex, alpha = 1) {
  //long #FF0000
  let r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  let c = null;
  if (r) {
    c = r.slice(1, 4).map(function (x) {
      return parseInt(x, 16);
    });
  }
  //short #F00
  r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (r) {
    c = r.slice(1, 4).map(function (x) {
      return 0x11 * parseInt(x, 16);
    });
  }
  //NG return null
  if (!c) {
    return null;
  }
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
}

const refreshSettings = (e) => {
  const settings = e || {};
  const settingKeys = Object.keys(settings || {});
  const tcArray = settingKeys
    .filter((key) => key.includes("tc"))
    .sort()
    .map((key) => settings[key]);
  const tnArray = settingKeys
    .filter((key) => key.includes("tn"))
    .sort()
    .map((key) => settings[key]);
  const settingArray: ITag[] = [];
  tcArray.forEach((tc, idx) => {
    if (tc && tnArray[idx]) {
      settingArray.push({ name: tnArray[idx].toLowerCase(), color: tc });
    }
  });
  const thisStyle = settingArray.map(generateTagStyle).join("\n");
  logseq.provideStyle(thisStyle);
  logseq.updateSettings({ stylesheet: thisStyle });
  //TODO
  //set rainbow-journal
  const SettingRainbowJournal: string = settings.rainbowJournal;
  if (SettingRainbowJournal === "enable") {
    logseq.provideStyle(String.raw`
    div#main-content-container div.block-children [level="3"] { border-right: 4px solid #ff00005c;}
    div#main-content-container div.block-children [level="4"] {border-right: 6px solid #ec87225e;}
    div#main-content-container div.block-children [level="5"] { border-right: 8px solid #ffff0052;}
    div#main-content-container div.block-children [level="6"] { border-right: 10px solid #65d95b7a;}
    div#main-content-container div.block-children [level="7"] { border-right: 12px solid #2ca0df5e;}
    div#main-content-container div.block-children [level="8"] { border-right: 14px solid #9f8af061;}
    div#main-content-container div.block-children [level="9"] {border-right: 16px solid #f15bf74f;}    
  `);
  }
  const SettingAdmonitions: string = settings.admonitions;
  if (SettingAdmonitions === "enable") {
    logseq.provideStyle(String.raw`


  `);
  }
  console.info(`#${pluginId}: provide style`); /* -plugin-id */
};

const main = () => {
  console.info(`#${pluginId}: MAIN`); /* -plugin-id */
  settingUI(); /* -setting */

  refreshSettings(logseq.settings);
  /* logseq.onSettingsChanged 無限ループNG */

  /* toolbarItem */
  logseq.App.registerUIItem("toolbar", {
    key: pluginId,
    template: `
<div data-on-click="open_color_settings" style="font-size:20px">
<svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 20.2px; height: 20px; opacity: 1;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#4B4B4B;}
</style>
<g>
	<path class="st0" d="M423.633,185.47l0.07-0.78l-0.442-0.203c0.053-1.726,0.23-3.391,0.23-5.126
		c0-92.494-74.98-167.5-167.491-167.5c-92.494,0-167.508,75.006-167.508,167.5c0,1.762,0.177,3.4,0.23,5.126l-0.425,0.203
		l0.089,0.78C35.914,213.777,0,268.853,0,332.63c0,92.503,75.016,167.509,167.509,167.509c32.283,0,62.228-9.59,87.818-25.422
		l0.673,0.488l0.673-0.488c25.59,15.832,55.535,25.422,87.819,25.422C437.021,500.139,512,425.133,512,332.63
		C512,268.853,476.087,213.777,423.633,185.47z M353.966,81.412c23.589,23.606,38.198,55.739,39.916,91.342
		c-5.702-1.762-11.528-3.241-17.443-4.418l-66.886-116.79C326.269,58.568,341.304,68.759,353.966,81.412z M392.253,202.718
		c-6.659,39.048-29.415,72.526-61.432,93.131c-7.615-33.753-25.359-63.584-49.886-86.198c19.072-9.89,40.571-15.549,63.558-15.549
		C361.316,194.103,377.341,197.237,392.253,202.718z M256,40.806c10.466,0,20.631,1.204,30.424,3.391l69.489,121.376
		c-3.772-0.266-7.579-0.424-11.422-0.424c-7.526,0-14.929,0.567-22.19,1.567l-72.004-125.76
		C252.175,40.877,254.088,40.806,256,40.806z M232.43,42.842l72.837,127.212c-8.943,2.222-17.62,5.162-25.962,8.748L205.706,50.254
		C214.242,46.933,223.168,44.436,232.43,42.842z M190.725,57.143l73.793,128.885c-2.638,1.46-5.278,2.93-7.846,4.507L256,190.056
		l-0.673,0.479c-9.74-6.012-20.118-11.113-31.008-15.141l-58.103-101.49C173.743,67.493,181.941,61.853,190.725,57.143z
		M153.997,85.645l47.62,83.161c-10.945-2.356-22.278-3.64-33.913-3.648l-31.521-55.056
		C141.212,101.281,147.161,93.082,153.997,85.645z M127.558,128.12l21.818,38.065c-10.767,1.213-21.198,3.463-31.256,6.57
		C118.862,157.056,122.138,142.038,127.558,128.12z M119.766,202.718c14.858-5.481,30.902-8.616,47.744-8.616
		c22.986,0,44.502,5.659,63.557,15.549c-24.527,22.614-42.288,52.462-49.868,86.198
		C149.127,275.245,126.371,241.767,119.766,202.718z M256,438.929c-28.954-24.172-47.778-59.652-49.673-99.772
		c15.726,4.922,32.336,7.72,49.673,7.72c17.284,0,33.93-2.798,49.656-7.72C303.761,379.311,284.954,414.782,256,438.929z
		M442.475,430.588c-25.129,25.102-59.679,40.597-97.983,40.597c-22.951,0-44.467-5.658-63.504-15.512
		C314.138,425.115,335,381.286,335,332.63c0-1.726-0.177-3.426-0.23-5.144l0.442-0.221l-0.035-0.718
		c42.059-22.64,73.403-62.503,84.188-110.476c38.304,24.678,63.681,67.621,63.681,116.559
		C483.046,370.935,467.55,405.485,442.475,430.588z" style="fill: rgb(23, 128, 74);"></path>
</g>
</svg>
</div>
`,
  });

  console.info(`#${pluginId}: loaded`);
};

const model = {
  open_color_settings() {
    logseq.showSettingsUI();
  },
};

// bootstrap
logseq.ready(model, main).catch(console.error);
