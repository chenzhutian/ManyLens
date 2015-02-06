// Type definitions for d3JS cloud layout plugin by Jason Davies
// Project: https://github.com/jasondavies/d3-cloud
// Definitions by: hans windhoff <https://github.com/hansrwindhoff>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../d3/d3.d.ts" />

declare module D3 {
  export module Layout {
    export interface IRotate      { 
      (number:number) : CloudLayout;
        (number:()=>number) : CloudLayout;
    }

    export interface ICloudData {
        text: string;
        value: number;
    }

    export interface CloudLayout {
      (layers: any[], index?: number): any[];
      values(accessor?: (d: any) => any): CloudLayout;
      offset(offset: string): CloudLayout;
      size: {
        /**
      * Gets the available layout size 
      */
        (): Array<number>;
        /**
      * Sets the available layout size 
      */
        (size: Array<number>): CloudLayout;
      };
      words: (inputArray: Array<ICloudData>) => CloudLayout;
      rotate:IRotate;
      padding: (number:number) => CloudLayout;
      font: (string:string) => CloudLayout;
      fontSize(fctn: (d: any) => number): CloudLayout;
      fontWeight:(string: string) => CloudLayout;
      on: (eventname: string, callBackFunc: (words: any[],bounds:number[]) => void) => CloudLayout;
      start: () => CloudLayout;
    }


    export interface Layout {
      cloud(): CloudLayout; 
    }

        ////The definistion by myself -czt
        //export interface CloudLayout {
        //    start: {
        //        (): CloudLayout;
        //    }
        //    stop: {
        //        (): CloudLayout;
        //    }
        //    timeInterval: {
        //        (): number;
        //        (interval: number): CloudLayout;
        //        (interval: () => number): CloudLayout;
        //        (interval: (d: any) => number): CloudLayout;
        //        (interval: (d: any, i: number) => number): CloudLayout;
        //    }
        //    words: {
        //        (): cloudData[];
        //        (word: cloudData[]): CloudLayout;
        //        (word: () => cloudData[]): CloudLayout;
        //        (word: (d: any) => cloudData[]): CloudLayout;
        //        (word: (d: any, i: number) => cloudData[]): CloudLayout;
        //    }
        //    size: {
        //        (): [number, number];
        //        (size: [number, number]): CloudLayout;
        //        (size: () => [number, number]): CloudLayout;
        //        (size: (d: any) => [number, number]): CloudLayout;
        //        (size: (d: any, i: number) => [number, number]): CloudLayout;
        //    }
        //    font: {
        //        (): () => string;
        //        (font: string): CloudLayout;
        //        (font: () => string): CloudLayout;
        //        (font: (d: any) => string): CloudLayout;
        //        (font: (d: any, i: number) => string): CloudLayout;
        //    }
        //    fontStyle: {
        //        (): () => string;
        //        (fontStyle: string): CloudLayout;
        //        (fontStyle: () => string): CloudLayout;
        //        (fontStyle: (d: any) => string): CloudLayout;
        //        (fontStyle: (d: any, i: number) => string): CloudLayout;
        //    }
        //    fontWeight: {
        //        (): () => string;
        //        (fontWeight: string): CloudLayout;
        //        (fontWeight: () => string): CloudLayout;
        //        (fontWeight: (d: any) => string): CloudLayout;
        //        (fontWeight: (d: any, i: number) => string): CloudLayout;
        //    }
        //    rotate: {
        //        (): () => number;
        //        (rotate: number): CloudLayout;
        //        (rotate: () => number): CloudLayout;
        //        (rotate: (d: any) => number): CloudLayout;
        //        (rotate: (d: any, i: number) => number): CloudLayout;
        //    }
        //    text: {
        //        (): (d: any, i?: number) => string;
        //        (text: string): CloudLayout;
        //        (text: () => string): CloudLayout;
        //        (text: (d: any) => string): CloudLayout;
        //        (text: (d: any, i: number) => string): CloudLayout;
        //    }

        //    fontSize: {
        //        (): (d: any) => number;
        //        (fontSize: number): CloudLayout;
        //        (fontSize: () => number): CloudLayout;
        //        (fontSize: (d: any) => number): CloudLayout;
        //        (fontSize: (d: any, i: number)=> number): CloudLayout;
        //    }
        //    padding: {
        //        (): () => number;
        //        (padding: number): CloudLayout;
        //        (padding: () => number): CloudLayout;
        //        (padding: (d: any) => number): CloudLayout;
        //        (padding: (d: any, i: number) => number): CloudLayout;
        //    }

        //    on: {
        //        (event: string, callBackFunc: (words:any[],bounds:number[]) => any): CloudLayout; 
        //    }
        //}

  }
}