import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";
export const settingUI = () => {
    /* https://logseq.github.io/plugins/types/SettingSchemaDesc.html */

    const rainbowColor = [
        "#F77998",
        "#FA8A8B",
        "#EFD76C",
        "#7AD874",
        "#7BC4D0",
        "#9887C5",
    ];

    const generateSettings = () => {
        const settingArray = [] as SettingSchemaDesc[];

        //rainbow-right-border
        settingArray.push(
            {
                key: "heading00",
                title: "*Please reboot Logseq to reflect styles.",
                type: "heading",
                default: "",
                description: "",
            },
            {
                key: "heading01",
                title: "Custom style",
                type: "heading",
                default: "",
                description: "",
            },
            {
                key: "rainbowJournal",
                title: "right border *",
                type: "enum",
                enumChoices: ["enable", "disable"],
                enumPicker: "radio",
                default: "enable",
                description: "Color according to nesting depth.",
            },
            {
                key: "admonitions",
                title: "admonitions by tags *",
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
                key: `bulletClosedColor`,
                title: `choice closed-bullet color *`,
                type: "string",
                default: "f8b400",
                description: "",
                inputAs: "color",
            },
        );

        [1, 2, 3, 4, 5, 6].forEach((idx) => {
            settingArray.push(
                {
                    key: `heading00${idx}`,
                    title: `Custom #tag (${idx})`,
                    type: "heading",
                    default: "",
                    description: "",
                },
                {
                    key: `tn${idx}`,
                    title: `set #tag name *`,
                    type: "string",
                    default: `tag${idx}`,
                    description: "without #",
                },
                {
                    key: `tc${idx}`,
                    title: `choice background color`,
                    type: "string",
                    default: rainbowColor[idx - 1],
                    description: "",
                    inputAs: "color",
                },
            );
        });

        settingArray.push(
            {
                key: "heading03",
                title: "created stylesheet",
                type: "heading",
                default: "",
                description: "",
            },
            {
                key: "stylesheet",
                title: "custom tags",
                inputAs: "textarea",
                type: "string",
                default: "",
                description: "",
            },
        );

        return settingArray;
    };
    logseq.useSettingsSchema(generateSettings());
};