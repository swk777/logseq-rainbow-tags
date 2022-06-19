import '@logseq/libs'
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin'

interface ITag {
  name: string
  color: string
}
const rainbowColor = ['#F77998', '#FA8A8B', '#EFD76C', '#7AD874', '#7BC4D0' , '#9887C5']

const generateSettings = () => {
  const settingArray = [] as SettingSchemaDesc[]
  [1, 2, 3, 4, 5, 6].forEach(idx => {
    settingArray.push({
        key: `tn${idx}`,
        title: `Tag ${idx}`,
        type: "string",
        default: `tag${idx}`,
        description: ""
    })
    settingArray.push({
      key: `tc${idx}`,
      title: "",
      type: "string",
      default: rainbowColor[idx - 1],
      description: "",
      inputAs:"color"
    })
  })
  return settingArray
}

const generateTagStyle = (tag: ITag) => `
a.tag[data-ref="${tag.name}"] {
  color: ${tag.color} !important;
}
`
const refreshSettings = () => {
  const settings = logseq.settings || {}
  const settingKeys = Object.keys(settings || {})
  const tcArray = settingKeys.filter(key => key.includes("tc")).sort().map(key => settings[key])
  const tnArray = settingKeys.filter(key => key.includes("tn")).sort().map(key => settings[key])
  const settingArray:ITag[] = []
  tcArray.forEach((tc, idx) => {
    if (tc && tnArray[idx]) {
      settingArray.push({ name: tnArray[idx].toLowerCase(), color: tc })
    }
  })
  console.log(settingArray)
  logseq.provideStyle(settingArray.map(generateTagStyle).join('\n'))
}

async function main () {
  logseq.useSettingsSchema(generateSettings());
  refreshSettings()
  logseq.onSettingsChanged(refreshSettings)
}

// bootstrap
logseq.ready(main).catch(console.error)
