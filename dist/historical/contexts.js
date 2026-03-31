/**
 * Combined election activation contexts for all 60 elections (1789-2024).
 */
import { CONTEXTS_1789_1852 } from "./contexts-1789-1852.js";
import { CONTEXTS_1856_1916 } from "./contexts-1856-1916.js";
import { CONTEXTS_1920_2024 } from "./contexts-1920-2024.js";
export const ALL_CONTEXTS = [
    ...CONTEXTS_1789_1852,
    ...CONTEXTS_1856_1916,
    ...CONTEXTS_1920_2024,
];
/** Look up activation context by year */
export function getContext(year) {
    return ALL_CONTEXTS.find(c => c.year === year);
}
//# sourceMappingURL=contexts.js.map