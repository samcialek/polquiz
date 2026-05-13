export type Rng = () => number;
export declare function createRng(seed: number): Rng;
export declare function gaussian(rng: Rng): number;
