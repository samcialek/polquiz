/**
 * Combined election activation contexts for all 60 elections (1789-2024).
 */
import type { ElectionContext } from "./activation.js";
export declare const ALL_CONTEXTS: ElectionContext[];
/** Look up activation context by year */
export declare function getContext(year: number): ElectionContext | undefined;
