/// <reference path="../d3/d3.d.ts" />

declare module D3 {

    export interface FishEyeScale{
        (d:number): number;
        focus: {
            (): number;
            (d: number): FishEyeScale;
        }
        domain: {
            (): number[];
            (d: number[]): FishEyeScale;
        }
        range: {
            (): number[];
            (d: number[]): FishEyeScale;
        }
    }
    export interface FishEyeOrdinalScale extends FishEyeScale{
        rangeBand: {
            (d:number): number;
        }
        rangeRoundBands: {
            (): number[];
            (d: number[]): FishEyeOrdinalScale;
        }
    }

    export interface FishEye {
        scale: (scaleType: () => D3.Scale.Scale) => FishEyeScale;
        ordinal: () => FishEyeOrdinalScale;
    }


    export interface Base extends Selectors {
        fisheye: FishEye;
    }
}