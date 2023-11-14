export namespace Color {
    export interface RGBA {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    export interface HSLA {
        h: number;
        s: number;
        l: number;
        a: number;
    }

    export type Hex = `#${string}`;
}

export type ColorType = Color.RGBA | Color.HSLA | Color.Hex;
export class Color<T extends ColorType = ColorType> {
    public readonly color: T;

    constructor(init: T) {
        this.color = init;
    }
}

export type Hex = `0x${string}`;
export type Address = Hex;

export type HttpUrl = `${"http" | "https"}://${string}`;
