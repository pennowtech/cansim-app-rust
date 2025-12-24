// src/components/ThemeFaIcon.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeIcon } from "../icons/toolbarIcons";

interface ThemeFaIconProps {
    icon: ThemeIcon;
    className?: string;
}

export const ThemeFaIcon: React.FC<ThemeFaIconProps> = ({
    icon,
    className,
}) => {
    return (
        <>
            <span className="dark:hidden">
                <FontAwesomeIcon icon={icon.light} className={className} />
            </span>
            <span className="hidden dark:inline">
                <FontAwesomeIcon icon={icon.dark} className={className} />
            </span>
        </>
    );
};
