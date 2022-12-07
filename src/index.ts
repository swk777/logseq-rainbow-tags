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

  //Logseq bugs fix
  logseq.provideStyle(String.raw`
      /* Fix "Extra space when journal queries are not active #6773" */
      div#journals div#today-queries>div.lazy-visibility {
        min-height: unset !important;
    }

    /* journal queries */
    div#journals div#today-queries>div.lazy-visibility>div.shadow {
        display: none;
    }

    /* background conflict journal queries */
    div#journals div#today-queries div.color-level div.blocks-container,
    div#journals div#today-queries div.color-level {
        background-color: unset;
    }
  `);
  //set rainbow-journal
  const SettingRainbowJournal: string = settings.rainbowJournal;
  if (SettingRainbowJournal === "enable") {
    logseq.provideStyle(String.raw`
  div#main-content-container div.block-children [level="3"] {
      border-right: 4px solid #ff00005c;
  }
  
  div#main-content-container div.block-children [level="4"] {
      border-right: 6px solid #ec87225e;
  }
  
  div#main-content-container div.block-children [level="5"] {
      border-right: 8px solid #ffff0052;
  }
  
  div#main-content-container div.block-children [level="6"] {
      border-right: 10px solid #65d95b7a;
  }
  
  div#main-content-container div.block-children [level="7"] {
      border-right: 12px solid #2ca0df5e;
  }
  
  div#main-content-container div.block-children [level="8"] {
      border-right: 14px solid #9f8af061;
  }
  
  div#main-content-container div.block-children [level="9"] {
      border-right: 16px solid #f15bf74f;
  }
  `);
  }

  //set admonitions
  const SettingAdmonitions: string = settings.admonitions;
  if (SettingAdmonitions === "enable") {
    logseq.provideStyle(String.raw`

    /* #caution */
    main div#main-content-container a.tag[data-ref="caution"] {
        color: inherit;
        padding: 2px;
        border-radius: 3px;
        background: rgba(248, 180, 0, 0.7);
    }
    
    main div#main-content-container div[data-refs-self='["caution"]'] {
        padding: 0.8em;
        border-radius: 20px;
        background: rgba(248, 180, 0, 0.1);
        outline: 3px solid rgba(248, 180, 0, 0.8);
        outline-offset: 3px;
    }
    
    main div#main-content-container div[data-refs-self='["caution"]']::before {
        content: "🟡";
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    div.dark-theme main div#main-content-container a.tag[data-ref="caution"] {
        background: rgba(255, 248, 220, 0.3);
    }
    
    div.dark-theme main div#main-content-container div[data-refs-self='["caution"]'] {
        background: rgba(255, 248, 220, 0.1);
        outline: 3px solid rgba(255, 248, 220, 0.7);
    }
    
    /* end #caution */
    
    /* #success */
    main div#main-content-container a.tag[data-ref="success"] {
        color: inherit;
        padding: 2px;
        border-radius: 3px;
        background: rgba(42, 178, 123, 0.6);
    }
    
    main div#main-content-container div[data-refs-self='["success"]'] {
        padding: 0.8em;
        border-radius: 20px;
        background: rgba(42, 178, 123, 0.1);
        outline: 3px solid rgba(42, 178, 123, 0.7);
        outline-offset: 3px;
    }
    
    main div#main-content-container div[data-refs-self='["success"]']::before {
        content: "🟢";
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    /* end #success */
    
    /* #warning */
    main div#main-content-container a.tag[data-ref="warning"] {
        color: inherit;
        padding: 2px;
        border-radius: 3px;
        background: rgba(255, 127, 80, 0.7);
    }
    
    main div#main-content-container div[data-refs-self='["warning"]'] {
        padding: 0.8em;
        border-radius: 20px;
        background: rgba(255, 127, 80, 0.1);
        outline: 3px solid rgba(255, 127, 80, 0.7);
        outline-offset: 3px;
    }
    
    main div#main-content-container div[data-refs-self='["warning"]']::before {
        content: "🟠";
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    /* end #warning */
    
    
    /* #failed */
    main div#main-content-container a.tag[data-ref="failed"] {
        color: inherit;
        padding: 2px;
        border-radius: 3px;
        background: rgba(220, 20, 60, 0.5);
    }
    
    main div#main-content-container div[data-refs-self='["failed"]'] {
        padding: 0.8em;
        border-radius: 20px;
        background: rgba(220, 20, 60, 0.1);
        outline: 3px solid rgba(220, 20, 60, 0.7);
        outline-offset: 3px;
    }
    
    main div#main-content-container div[data-refs-self='["failed"]']::before {
        content: "🔴";
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    /* end #failed */
    
    /* #QUESTION */
    main div#main-content-container a.tag[data-ref="question"] {
        color: inherit;
        padding: 2px;
        border-radius: 3px;
        background: rgba(147, 112, 219, 0.5);
    }
    
    main div#main-content-container div[data-refs-self='["question"]'] {
        padding: 0.8em;
        border-radius: 20px;
        background: rgba(147, 112, 219, 0.1);
        outline: 3px solid rgba(147, 112, 219, 0.7);
        outline-offset: 3px;
    }
    
    main div#main-content-container div[data-refs-self='["question"]']::before {
        content: "🟣";
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    /* end #failed */
    
    
    /* #REPORT */
    main div#main-content-container a.tag[data-ref="report"],
    main div#main-content-container a.tag[data-ref="note"],
    main div#main-content-container a.tag[data-ref="review"] {
        color: inherit;
        padding: 2px;
        border-radius: 3px;
        background: rgba(160, 82, 45, 0.5);
    }
    
    main div#main-content-container div[data-refs-self='["report"]'],
    main div#main-content-container div[data-refs-self='["note"]'],
    main div#main-content-container div[data-refs-self='["review"]'] {
        padding: 0.8em;
        border-radius: 20px;
        background: rgba(160, 82, 45, 0.1);
        outline: 3px solid rgba(160, 82, 45, 0.7);
        outline-offset: 3px;
    }
    
    main div#main-content-container div[data-refs-self='["report"]']::before,
    main div#main-content-container div[data-refs-self='["note"]']::before,
    main div#main-content-container div[data-refs-self='["review"]']::before {
        content: "🟤";
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    /* end #REPORT */
    
    /* #NOTICE #NOTE #memo */
    main div#main-content-container a.tag[data-ref="notice"],
    main div#main-content-container a.tag[data-ref="info"],
    main div#main-content-container a.tag[data-ref="memo"] {
        color: inherit;
        padding: 2px;
        border-radius: 3px;
        background: rgba(30, 144, 255, 0.5);
    }
    
    main div#main-content-container div[data-refs-self='["notice"]'],
    main div#main-content-container div[data-refs-self='["info"]'],
    main div#main-content-container div[data-refs-self='["memo"]'] {
        padding: 0.8em;
        border-radius: 20px;
        background: rgba(30, 144, 255, 0.1);
        outline: 3px solid rgba(30, 144, 255, 0.7);
        outline-offset: 3px;
    }
    
    main div#main-content-container div[data-refs-self='["notice"]']::before,
    main div#main-content-container div[data-refs-self='["info"]']::before,
    main div#main-content-container div[data-refs-self='["memo"]']::before {
        content: "🔵";
        font-size: 20px;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    
    /* end #NOTICE #NOTE #memo */
    
    /*
    🔴FAILED
    🟠WARNING
    🟡CAUTION
    🟢SUCCESS
    🔵NOTICE / INFO / memo
    🟣QUESTION
    🟤REPORT / NOTE / REVIEW
    */

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

  console.info(`#${pluginId}: loaded`);
};

const model = {
  open_color_settings() {
    logseq.showSettingsUI();
  },
};

// bootstrap
logseq.ready(model, main).catch(console.error);
