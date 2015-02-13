///<reference path = "./BaseD3Lens.ts" />
module ManyLens {

    export module Lens {

        interface selectCircle {
            _line: D3.Selection;
            _sc_radius: number;
            _sc_cx: number;
            _sc_cy: number;
            _sc_scale: number;
        }

        export class BaseCompositeLens extends BaseD3Lens {

            public static Type: string = "BaseCompositeLens";

            protected _components_select_circle: Array<selectCircle>;
            protected _components_lens: Array<BaseSingleLens>;
            protected _components_kind: Map<string, number>;
            protected _components_places: Map<number, number>;
            protected _components_data: Map<number,UnitsDataForLens>;

            protected _base_component: BaseD3Lens;
            protected _base_accessor_func: (d: any,newData?:any) => any = null;
            protected _sub_component: BaseD3Lens;
            protected _sub_accessor_func: (d: any,newData?:any) => any = null;

            protected _new_lens_count: number = 1;
            protected _need_to_reshape: boolean = false;

            public get ComponentsLens(): Array<BaseSingleLens> {
                return this._components_lens;
            }
            public get ComponentsSelectCircle(): Array<selectCircle> {
                return this._components_select_circle;
            }
            public get ComponentsCount(): number {
                return this._components_lens.length;
            }
            public get ComponentsKind(): Map<string, number> {
                return this._components_kind;
            }
            public get ComponentsPlace(): Map<number,number>{
                return this._components_places;
            }
            public get NeedtoReshape(): boolean {
                return this._need_to_reshape;
            }

            constructor(element: D3.Selection, type: string, manyLens: ManyLens, firstLens: BaseD3Lens, secondLens?: BaseSingleLens) {
                super(element, type, manyLens);
                this._is_composite_lens = true;

                this._components_select_circle = new Array<selectCircle>();
                this._components_kind = new Map<string, number>();
                this._components_places = new Map<number, number>();
                this._components_data = new Map<number, UnitsDataForLens>();
                this._components_lens = new Array<BaseSingleLens>();
                

                this._base_component = firstLens;

                this._lens_circle_cx = firstLens.LensCX;
                this._lens_circle_cy = firstLens.LensCY;

                if (secondLens) {
                    var firstLens0: BaseSingleLens = (<BaseSingleLens>firstLens);
                    this._sub_component = secondLens;

                    this._components_lens.push(firstLens0);
                    this._components_select_circle.push({
                        _line: firstLens0.LinkLine,
                        _sc_cx: firstLens0.SelectCircleCX,
                        _sc_cy: firstLens0.SelectCircleCY,
                        _sc_radius: firstLens0.SelectCircleRadius,
                        _sc_scale: firstLens0.SelectCircleScale
                    })
                    this._components_kind.set(firstLens0.Type, 1);
                    this._components_data.set(firstLens0.LensPlace, firstLens0.RawData);
                    this._components_places.set(firstLens0.LensPlace, 1);
                    this._base_accessor_func = firstLens0.DataAccesser();


                    this._components_lens.push(secondLens);
                    this._components_select_circle.push({
                        _line: secondLens.LinkLine,
                        _sc_cx: secondLens.SelectCircleCX,
                        _sc_cy: secondLens.SelectCircleCY,
                        _sc_radius: secondLens.SelectCircleRadius,
                        _sc_scale: secondLens.SelectCircleScale
                    });
                    this._components_kind.set(secondLens.Type, 1);

                    //Check if this two lens are in the same place
                    if (firstLens0.LensPlace != secondLens.LensPlace) {
                        this._components_places.set(secondLens.LensPlace, 1);
                        this._components_data.set(secondLens.LensPlace, secondLens.RawData);
                    } else {
                        var t = this._components_places.get(secondLens.LensPlace) + 1;
                        this._components_places.set(secondLens.LensPlace, t);
                    }
                    this._sub_accessor_func = secondLens.DataAccesser();

                } else {
                    ////haven't finish yet
                    //var firstLens1: BaseCompositeLens = (<BaseCompositeLens>firstLens);
                    //for (var i = 0, len = firstLens1.Lens.length; i < len; ++i) {
                    //    this._lens.push(firstLens1.Lens[i]);
                    //    this._select_circle.push(firstLens1.SelectCircle[i]);
                    //    if (this._components_kind.has(firstLens1.Lens[i].Type)) {
                    //        var num: number = this._components_kind.get(firstLens1.Lens[i].Type) + 1;
                    //        this._components_kind.set(firstLens1.Lens[i].Type, num);
                    //    } else {
                    //        this._components_kind.set(firstLens1.Lens[i].Type, 1);
                    //    }
                    //    firstLens1.Lens[i].ChangeHostTo(this);
                    //}
                    
                    ////？this._sub_data = firstLens1.RawData;
                    //firstLens1.RawData.forEach((v)=>{
                    //    this._data.push(v);
                    //});
                }
            }

            public Render(color: string): void {
                if (!this._sc_lc_svg) {
                    super.Render(color);
                }

                this._base_component.RemoveLens();
                this._base_component.HostLens = this;


                if (this._sub_component) {
                    this._sub_component.RemoveLens();
                    this._sub_component.HostLens = this;

                }

                //Update base component and sub component
                this._base_component = this;
                this._sub_component = null;
            }

            protected ExtractData(): any {
                this._data = null;
                this._components_data.forEach((componentData)=>{
                    if (this._data == null)
                        this._data = JSON.parse(JSON.stringify(componentData));

                    this._data.unitsID.concat(componentData.unitsID);
                    this._data.contents.concat(componentData.contents);
                    componentData.hashTagDistribute.forEach((d) => {
                        var key = d.Key;
                        var value = d.Value;
                        var column = this._data.hashTagDistribute;
                        for (var i = 0, len = column.length; i < len; ++i) {
                            if (key == column[i].Key) {
                                column[i].Value += value;
                                break;
                            }
                        }
                        if (i == len) {
                            column.push(d);
                        }

                    });
                    componentData.labels.forEach((d) => {
                        var key = d.Key;
                        var value = d.Value;
                        var column = this._data.labels;
                        for (var i = 0, len = column.length; i < len; ++i) {
                            if (key == column[i].Key) {
                                column[i].Value += value;
                                break;
                            }
                        }
                        if (i == len) {
                            column.push(d);
                        }
                    });
                    componentData.tweetLengthDistribute.forEach((d) => {
                        var key = d.Key;
                        var value = d.Value;
                        var column = this._data.tweetLengthDistribute;
                        for (var i = 0, len = column.length; i < len; ++i) {
                            if (key == column[i].Key) {
                                column[i].Value += value;
                                break;
                            }
                        }
                        if (i == len) {
                            column.push(d);
                        }
                    });
                });
            }

            public DisplayLens(): void {
                super.DisplayLens();


                this.ReDrawLinkLine(this._new_lens_count);
            }

            protected LensCircleDragFunc(): void {
                super.LensCircleDragFunc();

                this.ReDrawLinkLine();
            }

            protected LensCircleDragendFunc(): boolean {
                var res = super.LensCircleDragendFunc();

                if (!res) {
                    for (var i = 0, len = this._components_select_circle.length; i < len; ++i) {
                        var sc = this._components_select_circle[i];
                        var theta = Math.atan((this._lens_circle_cy - sc._sc_cy) / (this._lens_circle_cx - sc._sc_cx));
                        var cosTheta = this._lens_circle_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                        var sinTheta = this._lens_circle_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);

                        sc._line
                            .transition()
                            .duration(this._combine_failure_rebound_duration)
                            .ease('back-out')
                            .attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta)
                            .attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta)
                            .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                            .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta)
                    }
                }

                return res;
            }

            protected LensCircleZoomFunc(): void {
                super.LensCircleZoomFunc();

                this.ReDrawLinkLine();
            }

            public AddComponentLens(lens: BaseD3Lens): BaseCompositeLens {

                this._sub_component = lens;
                if (lens.IsCompositeLens) {
                    this.AddCompositeLens(<Lens.BaseCompositeLens>lens);

                } else {
                    this.AddSingleLens(<Lens.BaseSingleLens>lens);
                }
                return this;
            }

            public RemoveComponentLens(lens: BaseSingleLens): BaseD3Lens {
                //TODO remove related data here;
                var index: number = this._components_lens.indexOf(lens);
                if (-1 != index) {
                    this._components_lens.splice(index, 1);
                    this._components_select_circle.splice(index, 1);

                    var num: number = this._components_places.get(lens.LensPlace) - 1;
                    if (num > 0) {
                        this._components_places.set(lens.LensPlace, num);
                    } else if (num == 0) {
                        this._components_places.delete(lens.LensPlace);
                        this._components_data.delete(lens.LensPlace);
                    } else {
                        throw new Error("The number of this places of component is less than 0!!");
                    }

                    if (this.ComponentsCount == 1) {
                        //if there is only one component left, we can just return this one
                        this.RemoveWholeSVG();

                        var lastLens = this._components_lens[0];
                        lastLens.LensCX = this.LensCX;
                        lastLens.LensCY = this.LensCY;
                        lastLens.LensRadius = this.LensRadius;
                        lastLens.LensScale = this.LensScale;
                        lastLens.DetachHostLens();

                        return this._components_lens[0];

                    } else if (this.ComponentsCount < 1) {
                        throw new Error('The number of component of this lens is less than 2!!');
                    } else {

                        var num: number = this._components_kind.get(lens.Type) - 1;
                        if (num > 0) {
                            this._components_kind.set(lens.Type, num);

                            return this;
                        } else if (num == 0) {
                            this.RemoveWholeSVG();
                            this._components_kind.delete(lens.Type);
                            this._need_to_reshape = true;

                            return this;
                        } else {
                            throw new Error("The number of this kind of component is less than 0!!");
                        }
                    }
                }
            }

            private ReDrawLinkLine(newLensCount: number = 0): void {
                var i = newLensCount == 0 ? 0 : this._components_select_circle.length - newLensCount;
                for (var len = this._components_select_circle.length; i < len; ++i) {

                    var sc = this._components_select_circle[i];
                    var theta = Math.atan((this._lens_circle_cy - sc._sc_cy) / (this._lens_circle_cx - sc._sc_cx));
                    var cosTheta = this._lens_circle_cx > sc._sc_cx ? Math.cos(theta) : -Math.cos(theta);
                    var sinTheta = this._lens_circle_cx > sc._sc_cx ? Math.sin(theta) : -Math.sin(theta);

                    sc._line
                        .attr("x1", sc._sc_cx + sc._sc_radius * sc._sc_scale * cosTheta)
                        .attr("y1", sc._sc_cy + sc._sc_radius * sc._sc_scale * sinTheta)
                        .attr("x2", this._lens_circle_cx - this._lens_circle_radius * this._lens_circle_scale * cosTheta)
                        .attr("y2", this._lens_circle_cy - this._lens_circle_radius * this._lens_circle_scale * sinTheta)

                }
                this._new_lens_count = 0;
            }

            //haven't handle yet
            //TODO
            private AddCompositeLens(componentLens: BaseCompositeLens): void {
                if (componentLens.ComponentsSelectCircle.length != componentLens.ComponentsLens.length)
                    throw new Error('The length of sc is different from length of lens');

                for (var i = 0, len = componentLens.ComponentsLens.length; i < len; ++i) {
                    this._components_lens.push(componentLens.ComponentsLens[i]);
                    this._components_select_circle.push(componentLens.ComponentsSelectCircle[i]);
                    if (this._components_kind.has(componentLens.ComponentsLens[i].Type)) {
                        var num: number = this._components_kind.get(componentLens.ComponentsLens[i].Type) + 1;
                        this._components_kind.set(componentLens.ComponentsLens[i].Type, num);
                    } else {
                        this._components_kind.set(componentLens.ComponentsLens[i].Type, 1);
                    }
                    componentLens.ComponentsLens[i].ChangeHostTo(this);
                }

                componentLens.RemoveWholeSVG();
                this._manyLens.RemoveLens(componentLens);
                this._new_lens_count = componentLens.ComponentsLens.length;
            }

            private AddSingleLens(lens: BaseSingleLens): void {
                this._components_lens.push(lens);
                this._components_select_circle.push({
                    _line: lens.LinkLine,
                    _sc_cx: lens.SelectCircleCX,
                    _sc_cy: lens.SelectCircleCY,
                    _sc_radius: lens.SelectCircleRadius,
                    _sc_scale: lens.SelectCircleScale
                });

                //Component kind
                if (this._components_kind.has(lens.Type)) {
                    var num: number = this._components_kind.get(lens.Type) + 1;
                    this._components_kind.set(lens.Type, num);
                } else {
                    this._components_kind.set(lens.Type, 1);
                }

                //Component place
                if (this._components_places.has(lens.LensPlace)) {
                    var num:number = this._components_places.get(lens.LensPlace) + 1;
                    this._components_places.set(lens.LensPlace, num);
                } else {
                    this._components_places.set(lens.LensPlace, 1);
                    this._components_data.set(lens.LensPlace, lens.RawData);
                }
                
                this._new_lens_count = 1;
            }

            private RemoveWholeSVG() {

                this._sc_lc_svg
                    .style("pointer-events", "none")
                    .transition()
                    .duration(200)  //this is hard code, should be optimize
                    .attr("opacity", "1e-6")
                    .remove();
            }
        }
    }
}