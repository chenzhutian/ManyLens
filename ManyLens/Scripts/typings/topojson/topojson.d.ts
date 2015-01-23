declare module TopoJSON {

    interface IFeature {
        type: string;
        features?: any;
        id?: any;
        properties?: any;
        geometry?: any;


    }

    export interface Topology{

        version: string;

        mesh: (Topology: Topology, o: any, filter?: (a: any, b: any) => any) => Object;

        meshArcs: (Topology: Topology, o?: any, filter?: (a: any, b: any) => any) => any;

        merge: (Topology: Topology, o: any) => any;

        mergeArcs: (Topology: Topology, o: any) => any;

        feature: (Topology: Topology, o: any) => IFeature;

        neighbors: (o: any) => any;

        presimplify: (Topology: Topology, trangle?: (t: any) => number) =>Topology;
    }

}

declare var topojson: TopoJSON.Topology;

declare module "topojson" {
    export = topojson;
}