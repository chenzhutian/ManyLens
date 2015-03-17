///<reference path = "./WebGLLod.ts" />
module ManyLens {
    export module MapArea {
        export class config {
            public static kernelBandwidth = 64;
            public static intensity = 3;
            public static shaderStyle = 0;
            public static stops = [0.007, 0.02, 0.037, 0.065, 0.114, 0.21, 0.295];
            public static LoDMap;
            public static setKernelBandWidth( val ) {
                config.kernelBandwidth = val;
                config.LoDMap.DrawCanvas();
            }

            public static setIntensity( val ) {
                config.intensity = val;
                config.LoDMap.DrawCanvas();
            }

            public static setShader( val ) {
                config.shaderStyle = val;
                config.LoDMap.DrawCanvas();
            }

        }

        export class HeatMapLayer {
            private _id: string;
            private _parent_container: HTMLElement;

            private _canvas: HTMLCanvasElement; //浏览器上的画板
            private _canvas_width: number;
            private _canvas_height: number;
            private _canvas_top_offset: number;
            private _canvas_left_offset: number;
            //private _unit_size: number;

            private _LoD: WebGLHeatmap; //热力图
            private _pixelMatrix: number[][]; //viewport的像素矩阵
            private _contourForIntensity: number[]; //各等高线的值
            private _nodeArray: { x: number; y: number;value:number }[]; //点数组，每一个点由经纬度(x,y)组成
   
            constructor( id: string, parentContainer: HTMLElement, canvasWidth: number,canvasHeight:number,unitWidth:number, unitHeight:number,topOffset:number,leftOffset:number,nodeArray: { x: number; y: number; value:number }[] ) {
                config.LoDMap = this;
                this._id = id;
                this._parent_container = parentContainer;

                this._canvas_width = canvasWidth * unitWidth;
                this._canvas_height = canvasHeight * unitHeight;
                this._canvas_top_offset = topOffset;
                this._canvas_left_offset = leftOffset;
                //this._unit_size = unitSize;

                this._nodeArray = nodeArray.map(( d ) => {
                    return { x: d.x * unitWidth, y: d.y * unitHeight, value: d.value };
                });
                this.addAndInitCanvas();
                this.DrawCanvas();
            }
            //在html上添加canvas并初始化，热力图和LoD就画在这个canvas上
            private addAndInitCanvas() {
                this._canvas = document.createElement( 'canvas' );       
                this._canvas.id = this._id;

                this._canvas.height = this._canvas_height;
                this._canvas.width = this._canvas_width;
                this._canvas.style.top = this._canvas_top_offset + 'px';
                this._canvas.style.left = this._canvas_left_offset + 'px';

                this._parent_container.appendChild( this._canvas );
                
                //创建热力图
                this._LoD = new WebGLHeatmap( { canvas: this._canvas });

                //初始化像素矩阵
                var width = this._LoD.canvas.width;
                var height = this._LoD.canvas.height;

                this._pixelMatrix = new Array( this._canvas_height );
                for ( var i = 0; i < height; ++i ) {
                    this._pixelMatrix[i] = new Array( this._canvas_width );
                    //for ( var j = 0; j < width; ++j )
                    //    this._pixelMatrix[i][j] = 0;
                };
                //初始化等高线值,这里设置为7层
                this._contourForIntensity = new Array( 7 );
                for ( var i = 0, len = this._contourForIntensity.length; i < len; ++i ) {
                    this._contourForIntensity[i] = 0.0;
                };

            }
            public ScaleCanvas( scale:number): void {
                this._canvas_width *= scale;
                this._canvas_height *= scale;
                this._canvas_top_offset *= (1+scale);
                this._canvas_left_offset *= scale;

                this._canvas.height = this._canvas_height;
                this._canvas.width = this._canvas_width;
                this._canvas.style.top = this._canvas_top_offset + 'px';
                this._canvas.style.left = this._canvas_left_offset + 'px';

                //初始化像素矩阵
                var width = Math.ceil( this._canvas_width );
                var height = Math.ceil( this._canvas_height );

                this._pixelMatrix = new Array( width );
                for ( var i = 0; i < height; ++i ) {
                    this._pixelMatrix[i] = new Array( height );
                };

                this._nodeArray = this._nodeArray.map(( d ) => {
                    return { x: d.x * scale, y: d.y * scale, value: d.value };
                });

                this.DrawCanvas();
            }

            //每次页面刷新，或者Bing Map的视角改变时，就根据当前Bing Map的状态重新绘制热力图或LoD
            public DrawCanvas(): void {

                var dStart = new Date();
                this.getEdgesNodesAndDraw();
                var nSpan = ( new Date() ).getMilliseconds() - dStart.getMilliseconds();
                console.log( "overall time is :" + nSpan + "ms" );
            }

            //1、统计pixel矩阵上每个点出现的次数，然后根据每个Pixel点上不同的点个数赋予不同的强度，然后画到帧缓冲区中;并将当前的densityMap的结果copy回CPU端
            //2、根据densityMap的强度矩阵获得强度矩阵的最大值，并设置等高线的值;
            public getEdgesNodesAndDraw(): void {
                this._LoD.clear(); //每次重新绘制图时都需要将GPU的帧缓冲区清零
                //var s: string = "[";
                //this._nodeArray.forEach(( d ) => {
                //    s += '{"x":'+d.x+',"y":'+d.y+',"value":'+d.value+'},'
                //});
                //s += "]";
                //console.log( s );
                this.drawNodes( this._nodeArray ); //画点，渲染的结果在帧缓冲区中
                this._LoD.display( 0, 0, 1.0, this._contourForIntensity ); //将最终渲染的帧缓冲区的结果展示到屏幕上
            }

            public drawNodes( nodes: any ): void {
                //初始像素矩阵为零
                var width = this._pixelMatrix[0].length;
                var height = this._pixelMatrix.length;
                for ( var i = 0; i < height; i++ ) {
                    for ( var j = 0; j < width; j++ )
                        this._pixelMatrix[i][j] = 0;
                }

                //点聚合，对于每一个像素，统计累加落到同一个像素的点的个数
                //for ( var i = 0, len = nodes.length; i < len; i++ ) {
                //    var x = Math.floor( nodes[i].x );
                //    var y = height - Math.floor( nodes[i].y );
                //    if ( x >= 0 && x < width && y >= 0 && y < height ) {
                //        this._pixelMatrix[y][x]++;
                //    }
                //}

                for ( var i = 0, len = nodes.length; i < len; ++i ) {
                    var x = nodes[i].x;//* this._unit_size;
                    var y = height - 1 - nodes[i].y; //* this._unit_size;
                    if ( this._pixelMatrix[y][x] != null)
                        this._pixelMatrix[y][x] = nodes[i].value;
                    else
                        console.log( this._pixelMatrix[y] );
                }

                //获得当前bing Map的放大倍数
                var zoomLevel = 5;//this._map.getZoom();
                //根据不同的zoomLevel设置不同的强度基数和核半径
                var density = config.intensity;
                density = density * zoomLevel / 5.0;//Math.max(zoomLevel-4.0, 1.0);
                var ans = 0;

                var kernelBand = 0;
                var BaseKernelBand = config.kernelBandwidth;
                if ( zoomLevel < 5.0 ) {
                    kernelBand = BaseKernelBand * Math.pow( 0.75, 5.0 - zoomLevel );
                } else kernelBand = BaseKernelBand * Math.atan( zoomLevel - 3.3 ) * Math.pow( 1.05, zoomLevel - 5.0 );
                // adds the buffered points
                //准备画点所需要的点坐标和强度
                for ( var i = 0; i < height; i++ ) {
                    for ( var j = 0; j < width; j++ ) {
                        if ( this._pixelMatrix[i][j] > 0 ) {
                            //遍历点聚合后的像素矩阵，将点的坐标以及其对应的核半径和强度值加入点缓冲区中
                            this._LoD.addNode( j, i, kernelBand, Math.sqrt( this._pixelMatrix[i][j] ) * density / 300 );
                            ans++;
                        }
                    }
                }
                //在GPU中画点的热力图，帧缓冲与纹理nodeFront绑定
                this._LoD.updateNodes();
                // get the Maximum Val of density from the retrieved Buffer, and compute the contour Map
                //画完热力图，将热力图的强度矩阵拷贝回CPU端，CPU端计算热力图中的最大强度，然后根据这个最大强度设置等高线的值。
                this.getTextureBufferIntensity( null );
            }

            public getTextureBufferIntensity( textureBuffer: Float32Array ): void {
                // dump the densityMap from GPU's FrameBuffer (bind the TextureBuffer)
                this._LoD.dumpDensityMapTexureBuffer();
                if ( textureBuffer == null ) textureBuffer = this._LoD.getDensityMapTextureBuffer();
                var maxVal = 0;
                for ( var idx = 0, len = textureBuffer.length; idx < len; idx += 16 ) {
                    maxVal = Math.max( textureBuffer[idx], maxVal );
                }
                //var rate = [0.01,0.02,0.04,0.08,0.15,0.19,0.28];
                if ( maxVal == 0 ) maxVal = 1.0;
                //提前估算好各个等高线的值与最大值的比率，然后根据得到的densityMap的最大值计算出当前各个等高线的值
                var rate = config.stops;
                for ( var idx = 0, len = this._contourForIntensity.length; idx < len; idx++ ) {
                    this._contourForIntensity[idx] = maxVal * rate[idx];
                }
            }
        }
    }
}