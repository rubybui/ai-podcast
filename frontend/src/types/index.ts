export type Brand<K, T> = K & { __brand: T };
export type Seconds = Brand<number, "Seconds">;

export * from "./boundary";
export * from "./podcast";
export * from "./category";
export * from "./survey";
