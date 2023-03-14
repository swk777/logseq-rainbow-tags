import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";
export const settingUI = () => {
    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */

    const rainbowColor = [
        "#37306B", "#66347F", "#9E4784", "#D27685", "#9DC08B", "#609966", "#40513B", "#060047", "#B3005E", "#E90064", "#FF5F9E", "#E21818"
    ];

    const generateSettings = () => {
        const settingArray = [] as SettingSchemaDesc[];

        //option
        settingArray.push(
            {
                key: "admonitions",
                title: "admonitions by tags",
                type: "enum",
                enumChoices: ["enable", "disable"],
                enumPicker: "radio",
                default: "enable",
                description: `
                🔴#FAILED / #REMEDY, 
                🟠#WARNING / #LEARNED, 
                🟡#CAUTION / #DECLARATION, 
                🟢#SUCCESS / #FACTS, 
                🔵#NOTICE / #INFO / #REVIEW, 
                🟣#QUESTION / #DISCOVERY, 
                🟤#REPORT / #NOTE
                `,
            },
            {
                key: "rainbowJournal",
                title: "outline right border",
                type: "enum",
                enumChoices: ["enable", "disable"],
                enumPicker: "radio",
                default: "enable",
                description: "Color according to nesting depth.",
            },
            {
                key: "todayJournal",
                title: "today & yesterday journal coloring",
                type: "enum",
                enumChoices: ["enable", "disable"],
                enumPicker: "radio",
                default: "disable",
                description: "background-color: yellow & green (**light theme only)",
            },
            {
                key: "todayDayOfWeek",
                title: "today & yesterday journal Day of week",
                type: "enum",
                enumChoices: ["English", "disable"],
                enumPicker: "radio",
                default: "disable",
                description: "title after",
            },
            {
                key: `bulletClosedColor`,
                title: `choice closed-bullet color`,
                type: "string",
                default: "f8b400",
                description: "Accentuate with color",
                inputAs: "color",
            },
        );


        //page
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((idx) => {
            settingArray.push(
                {
                    key: `heading10${idx}`,
                    title: `page [ ${idx} ]`,
                    type: "heading",
                    default: "",
                    description: "Accentuate the specified page like a panel.",
                },
                {
                    key: `pn${idx}`,
                    title: `set [ page title ] word`,
                    type: "string",
                    default: ``,
                    description: "",
                },
                {
                    key: `pc${idx}`,
                    title: `choice background color`,
                    type: "string",
                    default: rainbowColor[idx - 1],
                    description: "color fades",
                    inputAs: "color",
                },
            );
        });


        //tag
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((idx) => {
            settingArray.push(
                {
                    key: `heading00${idx}`,
                    title: `#tag [ ${idx} ]`,
                    type: "heading",
                    default: "",
                    description: "Accentuate tagged blocks like a panel.",
                },
                {
                    key: `tn${idx}`,
                    title: `set [ tag ] word`,
                    type: "string",
                    default: ``,
                    description: "without [ # ]",
                },
                {
                    key: `tc${idx}`,
                    title: `choice background color`,
                    type: "string",
                    default: rainbowColor[idx - 1],
                    description: "color fades",
                    inputAs: "color",
                },
            );
        });

        return settingArray;
    };
    logseq.useSettingsSchema(generateSettings());
};