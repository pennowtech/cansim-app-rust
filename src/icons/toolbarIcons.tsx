// src/icons/toolbarIcons.ts
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faPlay,
    faStop,
    faFileArrowDown,
    faFileArrowUp,
    faFileLines,
    faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";

import {
    faCirclePlay,
    faCircleStop,
    faFileCode,
} from "@fortawesome/free-regular-svg-icons";

export interface ThemeIcon {
    light: IconDefinition;
    dark: IconDefinition;
}

export const toolbarIcons: Record<
    | "captureStart"
    | "captureStop"
    | "csvExport"
    | "csvImport"
    | "rawExport"
    | "rawImport"
    | "demoLoad",
    ThemeIcon
> = {
    captureStart: { light: faPlay, dark: faCirclePlay },
    captureStop: { light: faStop, dark: faCircleStop },

    csvExport: { light: faFileArrowDown, dark: faFileArrowDown },
    csvImport: { light: faFileArrowUp, dark: faFileArrowUp },

    rawExport: { light: faFileLines, dark: faFileCode },
    rawImport: { light: faFileLines, dark: faFileCode },

    demoLoad: { light: faCloudArrowDown, dark: faCloudArrowDown },
};
