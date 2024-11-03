import { ArrowFunction } from "typescript";

export interface Button {
    id?: string;
    label?: string;
    icon?: string;
    action?: ArrowFunction | Function;
    navigate?: string;
}
