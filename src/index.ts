import "@logseq/libs";
import { settingUI } from './setting';
import { logseq as PL } from "../package.json";
const pluginId = PL.id;
import Swal from 'sweetalert2';//https://sweetalert2.github.io/

//hex -> rgba
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


//for tag
interface ITag {
  name: string;
  color: string;
}
const generateTagStyle = (tag: ITag) => `div#app-container a.tag[data-ref="${CSS.escape(tag.name)}"]{color:inherit;padding:2px;border-radius:3px;background:${hex2rgba(tag.color, 0.3)}}
div#app-container div[data-refs-self*="${CSS.escape(tag.name)}"]{padding:1.4em;border-radius:16px;background:${hex2rgba(tag.color, 0.15)}}`;

//for page
interface IPage {
  name: string;
  color: string;
}
const generatePageStyle = (page: IPage) => `body[data-page="page"] div#main-content-container div.page-blocks-inner div#${CSS.escape(page.name)}{border-radius:0.4em;background:${hex2rgba(page.color, 0.2)};outline:2px double ${hex2rgba(page.color, 0.2)};outline-offset:3px}
body[data-page="page"] div#main-content-container h1.page-title span[data-ref="${CSS.escape(page.name)}"]{color:${hex2rgba(page.color, 0.8)}}
body[data-page="page"] div#main-content-container div.page-blocks-inner div#${CSS.escape(page.name)} div.page-properties{background:${hex2rgba(page.color, 0.2)}}
div#left-sidebar li.favorite-item[data-ref*="${CSS.escape(page.name)}" i] span.page-title{border-bottom:2px solid ${hex2rgba(page.color, 1)}}`;

//for tag and page
const refreshSettings = (e) => {
  const settings = e || {};
  const settingKeys = Object.keys(settings || {});
  //tag
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
  //tag end

  //page
  const pcArray = settingKeys
    .filter((key) => key.includes("pc"))
    .sort()
    .map((key) => settings[key]);
  const pnArray = settingKeys
    .filter((key) => key.includes("pn"))
    .sort()
    .map((key) => settings[key]);
  const settingArrayPage: IPage[] = [];
  pcArray.forEach((pc, idx) => {
    if (pc && pnArray[idx]) {
      settingArrayPage.push({ name: pnArray[idx].toLowerCase(), color: pc });
    }
  });
  const thisStylePage = settingArrayPage.map(generatePageStyle).join("\n");
  logseq.provideStyle(thisStylePage);
  //page end

  //set BulletClosed
  const SettingBulletClosedColor: string = settings.bulletClosedColor;
  const bulletClosedStyle: string = `div#app-container span.bullet{height:9px;width:9px;border-radius:40%;opacity:.6;transition:unset!important}
  div#app-container span.bullet-container.bullet-closed{height:11px;width:11px;outline:5px solid ${hex2rgba(SettingBulletClosedColor, 0.6)}
  `;
  logseq.provideStyle(bulletClosedStyle);
};


//CSS
async function ProvideStyle(e) {
  const settings = e || {};
  //Logseq bugs fix
  /* Fix "Extra space when journal queries are not active #6773" */
  /* background conflict journal queries */
  /* journal queries No shadow */
  logseq.provideStyle(String.raw`
  body[data-page="home"] div#today-queries>div.lazy-visibility{min-height:unset!important}body[data-page="home"] div#today-queries>div.lazy-visibility>div.shadow{display:none}body[data-page="home"] div#today-queries div.color-level div.blocks-container,body[data-page="home"] div#today-queries div.color-level{background-color:unset}
  `);
  //set today journal coloring
  const SettingTodayJournal: string = settings.todayJournal;
  if (SettingTodayJournal === "enable") {
    parent.document.body.classList.add('pc-todayJournal');
  }
  logseq.provideStyle(`body[data-page="home"].pc-todayJournal div.light-theme div#journals div.journal-item.content:first-child{border-radius:0.4em;background:rgba(251,255,177,0.2);outline:3px double rgba(251,255,177,0.6);outline-offset:3px}
  body[data-page="home"].pc-todayJournal div.light-theme div#journals div.journal-item.content:nth-of-type(2){border-radius:0.4em;background:rgba(144,238,144,0.16);outline:3px double rgba(144,238,144,0.6);outline-offset:3px}
  `);

  //set rainbow-journal
  const SettingRainbowJournal: string = settings.rainbowJournal;
  if (SettingRainbowJournal === "enable") {
    parent.document.body.classList.add('pc-rainbowJournal');
  }

  //set admonitions
  const SwitchAdmonitions: string = settings.admonitions;
  if (SwitchAdmonitions === "enable") {
    parent.document.body.classList.add('pc-admonitions');
  }
  logseq.provideStyle(String.raw`
  article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading001"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading002"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading003"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading004"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading005"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading006"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading007"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading008"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading009"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading0010"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading0011"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading0012"]{color:green}
  article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading101"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading102"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading103"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading104"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading105"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading106"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading107"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading108"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading109"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading1010"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading1011"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="heading1012"]{color:orange}
  article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn1"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn2"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn3"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn4"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn5"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn6"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn7"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn8"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn9"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn10"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn11"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pn12"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn1"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn2"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn3"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn4"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn5"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn6"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn7"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn8"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn9"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn10"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn11"],article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tn12"]{width: 48%}
  body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc1"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc2"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc3"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc4"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc5"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc6"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc7"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc8"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc9"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc10"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc11"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc12"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc1"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc2"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc3"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc4"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc5"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc6"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc7"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc8"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc9"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc10"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc11"],body.is-awUi-enabled article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc12"]{left: 48%;margin-top:-4.4em}
  body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc1"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc2"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc3"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc4"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc5"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc6"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc7"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc8"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc9"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc10"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc11"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="pc12"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc1"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc2"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc3"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc4"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc5"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc6"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc7"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc8"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc9"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc10"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc11"],body:not(.is-awUi-enabled) article div[data-id="logseq-plugin-panel-coloring"].panel-wrap div[data-key="tc12"]{left: 48%;position:absolute;margin-top:-5.4em}
  body.pc-rainbowJournal div#app-container div.block-children [level="3"]{border-right:4px solid #ff00005c}
  body.pc-rainbowJournal div#app-container div.block-children [level="4"]{border-right:6px solid #ec87225e}
  body.pc-rainbowJournal div#app-container div.block-children [level="5"]{border-right:8px solid #ffff0052}
  body.pc-rainbowJournal div#app-container div.block-children [level="6"]{border-right:10px solid #65d95b7a}
  body.pc-rainbowJournal div#app-container div.block-children [level="7"]{border-right:12px solid #2ca0df5e}
  body.pc-rainbowJournal div#app-container div.block-children [level="8"]{border-right:14px solid #9f8af061}
  body.pc-rainbowJournal div#app-container div.block-children [level="9"]{border-right:16px solid #f15bf74f}
  body.pc-admonitions main div#app-container a.tag[data-ref="caution"],body.pc-admonitions main div#app-container a.tag[data-ref="declaration"]{color:inherit;padding:2px;border-radius:3px;background:rgba(248,180,0,0.7)}
  body.pc-admonitions main div#app-container div[data-refs-self='["caution"]'],body.pc-admonitions main div#app-container div[data-refs-self='["declaration"]']{padding:1.4em;border-radius:16px;background:rgba(248,180,0,0.1);outline:3px double rgba(248,180,0,0.8);outline-offset:3px}
  body.pc-admonitions main div#app-container div[data-refs-self='["caution"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["declaration"]']::before{content:"🟡";font-size:20px;position:absolute;right:10px;top:10px}
  body.pc-admonitions div.dark-theme main div#app-container a.tag[data-ref="caution"],body.pc-admonitions div.dark-theme main div#app-container a.tag[data-ref="declaration"]{background:rgba(255,248,220,0.3)}
  body.pc-admonitions div.dark-theme main div#app-container div[data-refs-self='["caution"]'],body.pc-admonitions div.dark-theme main div#app-container div[data-refs-self='["declaration"]']{background:rgba(255,248,220,0.1);outline:3px double rgba(255,248,220,0.7)}
  body.pc-admonitions main div#app-container a.tag[data-ref="success"],body.pc-admonitions main div#app-container a.tag[data-ref="facts"]{color:inherit;padding:2px;border-radius:3px;background:rgba(42,178,123,0.6)}
  body.pc-admonitions main div#app-container div[data-refs-self='["success"]'],body.pc-admonitions main div#app-container div[data-refs-self='["facts"]']{padding:1.4em;border-radius:16px;background:rgba(42,178,123,0.1);outline:3px double rgba(42,178,123,0.7);outline-offset:3px}
  body.pc-admonitions main div#app-container div[data-refs-self='["success"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["facts"]']::before{content:"🟢";font-size:20px;position:absolute;right:10px;top:10px}
  body.pc-admonitions main div#app-container a.tag[data-ref="warning"],body.pc-admonitions main div#app-container a.tag[data-ref="learned"]{color:inherit;padding:2px;border-radius:3px;background:rgba(255,127,80,0.7)}
  body.pc-admonitions main div#app-container div[data-refs-self='["warning"]'],body.pc-admonitions main div#app-container div[data-refs-self='["learned"]']{padding:1.4em;border-radius:16px;background:rgba(255,127,80,0.1);outline:3px double rgba(255,127,80,0.7);outline-offset:3px}
  body.pc-admonitions main div#app-container div[data-refs-self='["warning"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["learned"]']::before{content:"🟠";font-size:20px;position:absolute;right:10px;top:10px}
  body.pc-admonitions main div#app-container a.tag[data-ref="failed"],body.pc-admonitions main div#app-container a.tag[data-ref="remedy"]{color:inherit;padding:2px;border-radius:3px;background:rgba(220,20,60,0.5)}
  body.pc-admonitions main div#app-container div[data-refs-self='["failed"]'],body.pc-admonitions main div#app-container div[data-refs-self='["remedy"]']{padding:1.4em;border-radius:16px;background:rgba(220,20,60,0.1);outline:3px double rgba(220,20,60,0.7);outline-offset:3px}
  body.pc-admonitions main div#app-container div[data-refs-self='["failed"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["remedy"]']::before{content:"🔴";font-size:20px;position:absolute;right:10px;top:10px}
  body.pc-admonitions main div#app-container a.tag[data-ref="question"],body.pc-admonitions main div#app-container a.tag[data-ref="discovery"]{color:inherit;padding:2px;border-radius:3px;background:rgba(147,112,219,0.5)}
  body.pc-admonitions main div#app-container div[data-refs-self='["question"]'],body.pc-admonitions main div#app-container div[data-refs-self='["discovery"]']{padding:1.4em;border-radius:16px;background:rgba(147,112,219,0.1);outline:3px double rgba(147,112,219,0.7);outline-offset:3px}
  body.pc-admonitions main div#app-container div[data-refs-self='["question"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["discovery"]']::before{content:"🟣";font-size:20px;position:absolute;right:10px;top:10px}
  body.pc-admonitions main div#app-container a.tag[data-ref="report"],body.pc-admonitions main div#app-container a.tag[data-ref="note"],body.pc-admonitions main div#app-container a.tag[data-ref="review"]{color:inherit;padding:2px;border-radius:3px;background:rgba(160,82,45,0.5)}
  body.pc-admonitions main div#app-container div[data-refs-self='["report"]'],body.pc-admonitions main div#app-container div[data-refs-self='["note"]'],body.pc-admonitions main div#app-container div[data-refs-self='["review"]']{padding:1.4em;border-radius:16px;background:rgba(160,82,45,0.1);outline:3px double rgba(160,82,45,0.7);outline-offset:3px}
  body.pc-admonitions main div#app-container div[data-refs-self='["report"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["note"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["review"]']::before{content:"🟤";font-size:20px;position:absolute;right:10px;top:10px}
  body.pc-admonitions main div#app-container a.tag[data-ref="notice"],body.pc-admonitions main div#app-container a.tag[data-ref="info"],body.pc-admonitions main div#app-container a.tag[data-ref="review"]{color:inherit;padding:2px;border-radius:3px;background:rgba(30,144,255,0.5)}
  body.pc-admonitions main div#app-container div[data-refs-self='["notice"]'],body.pc-admonitions main div#app-container div[data-refs-self='["info"]'],body.pc-admonitions main div#app-container div[data-refs-self='["review"]']{padding:1.4em;border-radius:16px;background:rgba(30,144,255,0.1);outline:3px double rgba(30,144,255,0.7);outline-offset:3px}
  body.pc-admonitions main div#app-container div[data-refs-self='["notice"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["info"]']::before,body.pc-admonitions main div#app-container div[data-refs-self='["review"]']::before{content:"🔵";font-size:20px;position:absolute;right:10px;top:10px}
  `);

  console.info(`#${pluginId}: provide style`); /* -plugin-id */
}


//admonition selector
function selectAdmonition(uuid) {
  const block = logseq.Editor.getBlock(uuid);
  //dialog
  logseq.showMainUI();
  Swal.fire({
    text: 'Select Admonition panel',
    input: 'select',
    inputOptions: {
      FAILED: "🔴Failed",
      REMEDY: "🔴Remedy",
      WARNING: "🟠Warning",
      LEARNED: "🟠Learned",
      CAUTION: "🟡Caution",
      DECLARATION: "🟡Declaration",
      SUCCESS: "🟢Success",
      FACTS: "🟢Facts",
      NOTICE: "🔵Notice",
      INFO: "🔵Info",
      REVIEW: "🔵Review",
      QUESTION: "🟣Question",
      DISCOVERY: "🟣Discovery",
      REPORT: "🟤Report",
      NOTE: "🟤Note",
    },
    inputPlaceholder: 'Select a tag',
    showCancelButton: true,
  }).then((answer) => {
    if (answer) {
      const { value: tag } = answer;
      if (tag) {
        logseq.Editor.getBlock(uuid).then((e) => {
          if (e) {
            const content = "#" + tag + " " + e.content;
            logseq.Editor.updateBlock(uuid, content).then(() => {
              logseq.Editor.insertBlock(uuid, "");
            });
          }
        });
      }
    }
    logseq.hideMainUI();
  });
}


//main
const main = async () => {
  console.info(`#${pluginId}: MAIN`); /* -plugin-id */
  ProvideStyle(logseq.settings);
  refreshSettings(logseq.settings);
};
//main end


//after
const after = async () => {
  console.info(`#${pluginId}: AFTER`); /* -plugin-id */

  settingUI(); /* -setting */

  /* toolbarItem */
  logseq.App.registerUIItem("toolbar", {
    key: pluginId,
    template: `
  <div data-on-click="open_color_settings" style="font-size:20px">
  <svg width="20.2" height="20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.0182 46.589C33.7497 46.2081 32.5148 45.6785 31.3397 45C26.9837 42.4851 23.9873 38.2365 23.0182 33.4109C21.7497 33.7919 20.5148 34.3215 19.3397 35C13.9807 38.094 10.6794 43.812 10.6794 50C10.6794 56.188 13.9807 61.906 19.3397 65C24.6987 68.094 31.3012 68.094 36.6602 65C37.8861 64.2922 39.0043 63.4472 40 62.4906C36.6431 59.2654 34.6794 54.7725 34.6794 50C34.6794 48.8418 34.7951 47.7001 35.0182 46.589Z" fill="#27AE60" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M31.3397 15C36.6987 11.906 43.3012 11.906 48.6602 15C54.0192 18.094 57.3205 23.812 57.3205 30C57.3205 31.1582 57.2048 32.2999 56.9817 33.411C52.4654 32.0548 47.5236 32.5845 43.3397 35C42.1138 35.7078 40.9956 36.5529 40 37.5095C39.0043 36.5529 37.8861 35.7078 36.6602 35C32.4763 32.5845 27.5345 32.0548 23.0182 33.411C22.7951 32.2999 22.6794 31.1582 22.6794 30C22.6794 23.812 25.9807 18.094 31.3397 15Z" fill="#EB5757" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M44.9817 46.5891C45.2049 47.7002 45.3205 48.8418 45.3205 50C45.3205 54.7725 43.3568 59.2654 40 62.4906C40.9957 63.4472 42.1139 64.2922 43.3397 65C48.6987 68.094 55.3013 68.094 60.6603 65C66.0192 61.906 69.3205 56.188 69.3205 50C69.3205 43.812 66.0192 38.094 60.6603 35C59.4851 34.3215 58.2502 33.7919 56.9817 33.411C56.0127 38.2365 53.0162 42.4851 48.6603 45C47.4851 45.6785 46.2502 46.2081 44.9817 46.5891Z" fill="#2D9CDB" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M44.9817 46.5891C40.4655 47.9452 35.5236 47.4156 31.3397 45C26.9838 42.4851 23.9873 38.2365 23.0183 33.411C27.5345 32.0548 32.4764 32.5844 36.6603 35C41.0162 37.5149 44.0127 41.7635 44.9817 46.5891Z" fill="#F2994A" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M56.9817 33.411C56.0127 38.2365 53.0162 42.4851 48.6603 45C44.4764 47.4156 39.5345 47.9452 35.0183 46.5891C35.9873 41.7635 38.9838 37.5149 43.3397 35C47.5236 32.5844 52.4655 32.0548 56.9817 33.411Z" fill="#BB6BD9" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M40 37.5094C43.3568 40.7346 45.3205 45.2275 45.3205 50C45.3205 54.7725 43.3568 59.2654 40 62.4906C36.6432 59.2654 34.6795 54.7725 34.6795 50C34.6795 45.2275 36.6432 40.7346 40 37.5094Z" fill="#56CCF2" />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.0183 46.5891C35.7146 43.1216 37.4578 39.952 40 37.5095C42.5423 39.952 44.2855 43.1216 44.9818 46.5891C41.734 47.5643 38.2661 47.5643 35.0183 46.5891Z" fill="#F2F2F2" />
  </svg>
  </div>
  `,
  });

  /* Block slash command */
  logseq.Editor.registerSlashCommand('🌈Select Admonition panel', async ({ uuid }) => {
    selectAdmonition(uuid);
  });

  /* Block ContextMenuItem  */
  logseq.Editor.registerBlockContextMenuItem('🌈Select Admonition', async ({ uuid }) => {
    selectAdmonition(uuid);
  });

  parent.document.body.classList.add('is-plugin-panel-coloring-enabled');
  logseq.beforeunload(async () => {
    parent.document.body.classList.remove('is-plugin-panel-coloring-enabled');
  });
  logseq.onSettingsChanged((settings, oldSettings) => {
    if (settings !== oldSettings) {
      console.log(`#${pluginId}: onSettingsChanged`);
      refreshSettings(settings);
      onSettingsChangedCallback(settings, oldSettings);
    }
  });

  console.info(`#${pluginId}: loaded`);
};


// Setting changed
const onSettingsChangedCallback = (newSettings: any, oldSettings: any) => {
  if (oldSettings.admonitions !== "disable" && newSettings.admonitions === "disable") {
    parent.document.body.classList.remove('pc-admonitions');
  } else if (oldSettings.admonitions !== "enable" && newSettings.admonitions === "enable") {
    parent.document.body.classList.add('pc-admonitions');
  }
  if (oldSettings.rainbowJournal !== "disable" && newSettings.rainbowJournal === "disable") {
    parent.document.body.classList.remove('pc-rainbowJournal');
  } else if (oldSettings.rainbowJournal !== "enable" && newSettings.rainbowJournal === "enable") {
    parent.document.body.classList.add('pc-rainbowJournal');
  }
  if (oldSettings.todayJournal !== "disable" && newSettings.todayJournal === "disable") {
    parent.document.body.classList.remove('pc-todayJournal');
  } else if (oldSettings.todayJournal !== "enable" && newSettings.todayJournal === "enable") {
    parent.document.body.classList.add('pc-todayJournal');
  }
}


const model = {
  //toolbar onclick
  open_color_settings() {
    logseq.showSettingsUI();
  }
};

// bootstrap
logseq.ready(model, main).then(after).catch(console.error);