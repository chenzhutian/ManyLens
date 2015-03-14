module ManyLens {
    export module MapArea {

        class Shader {
            private _gl: WebGLRenderingContext;
            private _vs: WebGLShader;
            private _fs: WebGLShader;
            private _program: WebGLProgram;
            private _value_cache: {};
            private _uniform_cache: {};
            private _attribCache: {};

            constructor( gl: WebGLRenderingContext, arg: { vertex: string; fragment: string; }) {
                var fragment, vertex;
                this._gl = gl;
                vertex = arg.vertex, fragment = arg.fragment;
                this._program = this._gl.createProgram();
                this._vs = this._gl.createShader( this._gl.VERTEX_SHADER );
                this._fs = this._gl.createShader( this._gl.FRAGMENT_SHADER );
                this._gl.attachShader( this._program, this._vs );
                this._gl.attachShader( this._program, this._fs );
                this.compileShader( this._vs, vertex );
                this.compileShader( this._fs, fragment );
                this.link();
                this._value_cache = {};
                this._uniform_cache = {};
                this._attribCache = {};
            }

            public attribLocation( name: string ): number {
                var location;
                location = this._attribCache[name];
                if ( location === void 0 ) {
                    location = this._attribCache[name] = this._gl.getAttribLocation( this._program, name );
                }
                return location;
            }

            public compileShader( shader: WebGLShader, source: string ): void {
                this._gl.shaderSource( shader, source );
                this._gl.compileShader( shader );
                if ( !this._gl.getShaderParameter( shader, this._gl.COMPILE_STATUS ) ) {
                    throw "Shader Compile Error: " + ( this._gl.getShaderInfoLog( shader ) );
                }
            }

            public link(): void {
                this._gl.linkProgram( this._program );
                if ( !this._gl.getProgramParameter( this._program, this._gl.LINK_STATUS ) ) {
                    throw "Shader Link Error: " + ( this._gl.getProgramInfoLog( this._program ) );
                }
            }

            public use(): Shader {
                this._gl.useProgram( this._program );
                return this;
            }

            public uniformLoc( name: string ): WebGLUniformLocation {
                var location;
                location = this._uniform_cache[name];
                if ( location === void 0 ) {
                    location = this._uniform_cache[name] = this._gl.getUniformLocation( this._program, name );
                }
                return location;
            }

            public int( name: string, value: number ): Shader {
                var cached, loc;
                cached = this._value_cache[name];
                if ( cached !== value ) {
                    this._value_cache[name] = value;
                    loc = this.uniformLoc( name );
                    if ( loc ) {
                        this._gl.uniform1i( loc, value );
                    }
                }
                return this;
            }

            public vec2( name: string, a: number, b: number ): Shader {
                var loc;
                loc = this.uniformLoc( name );
                if ( loc ) {
                    this._gl.uniform2f( loc, a, b );
                }
                return this;
            }

            public float( name: string, value: number ): Shader {
                var cached, loc;
                cached = this._value_cache[name];
                if ( cached !== value ) {
                    this._value_cache[name] = value;
                    loc = this.uniformLoc( name );
                    if ( loc ) {
                        this._gl.uniform1f( loc, value );
                    }
                }
                return this;
            }
        }

        class Framebuffer {
            private _gl: WebGLRenderingContext;
            private _buffer: WebGLFramebuffer;

            constructor( gl: WebGLRenderingContext ) {
                this._gl = gl;
                this._buffer = this._gl.createFramebuffer();
            }

            public bind(): Framebuffer {
                this._gl.bindFramebuffer( this._gl.FRAMEBUFFER, this._buffer );
                return this;
            }

            public unbind(): Framebuffer {
                this._gl.bindFramebuffer( this._gl.FRAMEBUFFER, null );
                return this;
            }

            public check(): Framebuffer {
                var result;
                result = this._gl.checkFramebufferStatus( this._gl.FRAMEBUFFER );
                switch ( result ) {
                    case this._gl.FRAMEBUFFER_UNSUPPORTED:
                        throw 'Framebuffer is unsupported';
                        break;
                    case this._gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                        throw 'Framebuffer incomplete attachment';
                        break;
                    case this._gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                        throw 'Framebuffer incomplete dimensions';
                        break;
                    case this._gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                        throw 'Framebuffer incomplete missing attachment';
                }
                return this;
            }

            public color( texture: Texture ): Framebuffer {
                this._gl.framebufferTexture2D( this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, texture.target, texture.handle, 0 );
                this.check();
                return this;
            }

        }

        class Texture {
            private _gl: WebGLRenderingContext;
            private _channels: number;
            private _type: number;
            private _chancount: number;
            private _width: number;
            private _height: number;
            public target: number;
            public handle: WebGLTexture;

            constructor( gl: WebGLRenderingContext, params ) {
                var _ref, _ref1;
                this._gl = gl;
                if ( params == null ) {
                    params = {};
                }
                this._channels = this._gl[( ( _ref = params.channels ) != null ? _ref : 'rgba' ).toUpperCase()];
                if ( typeof params.type === 'number' ) {
                    this._type = params.type;
                } else {
                    this._type = this._gl[( ( _ref1 = params.type ) != null ? _ref1 : 'unsigned_byte' ).toUpperCase()];
                }
                switch ( this._channels ) {
                    case this._gl.RGBA:
                        this._chancount = 4;
                        break;
                    case this._gl.RGB:
                        this._chancount = 3;
                        break;
                    case this._gl.LUMINANCE_ALPHA:
                        this._chancount = 2;
                        break;
                    default:
                        this._chancount = 1;
                }
                this.target = this._gl.TEXTURE_2D;
                this.handle = this._gl.createTexture();
            }

            public bind( unit: number ): Texture {
                if ( unit == null ) {
                    unit = 0;
                }
                if ( unit > 15 ) {
                    throw 'Texture unit too large: ' + unit;
                }
                this._gl.activeTexture( this._gl.TEXTURE0 + unit );
                this._gl.bindTexture( this.target, this.handle );
                return this;
            }

            public setSize( width: number, height: number ): Texture {
                this._width = width;
                this._height = height;
                this._gl.texImage2D( this.target, 0, this._channels, this._width, this._height, 0, this._channels, this._type, null );
                return this;
            }

            public upload( data ): Texture {
                this._width = data.width;
                this._height = data.height;
                this._gl.texImage2D( this.target, 0, this._channels, this._channels, this._type, data );
                return this;
            }

            public linear(): Texture {
                this._gl.texParameteri( this.target, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR );
                this._gl.texParameteri( this.target, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR );
                return this;
            }

            public nearest(): Texture {
                this._gl.texParameteri( this.target, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST );
                this._gl.texParameteri( this.target, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST );
                return this;
            }

            public clampToEdge(): Texture {
                this._gl.texParameteri( this.target, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE );
                this._gl.texParameteri( this.target, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE );
                return this;
            }

            public repeat(): Texture {
                this._gl.texParameteri( this.target, this._gl.TEXTURE_WRAP_S, this._gl.REPEAT );
                this._gl.texParameteri( this.target, this._gl.TEXTURE_WRAP_T, this._gl.REPEAT );
                return this;
            }
        }

        class NodeH {
            private _gl: WebGLRenderingContext;
            private _width: number;
            private _height: number;
            private _texture: Texture;
            private _fbo: Framebuffer;

            constructor( gl: WebGLRenderingContext, width: number, height: number ) {
                var floatExt;
                this._gl = gl;
                this._width = width;
                this._height = height;
                gl.getExtension( 'OES_texture_float' );
                this._texture = new Texture( this._gl, {
                    type: this._gl.FLOAT
                }).bind( 0 ).setSize( this._width, this._height ).nearest().clampToEdge();
                this._fbo = new Framebuffer( this._gl ).bind().color( this._texture ).unbind();
            }

            public use = function (): Framebuffer {
                return this._fbo.bind();
            };

            public bind = function ( unit: number ): Texture {
                return this._texture.bind( unit );
            };

            public end = function (): Framebuffer {
                return this._fbo.unbind();
            };

            public resize = function ( width: number, height: number ): Texture {
                this._width = width;
                this._height = height;
                return this._texture.bind( 0 ).setSize( this._width, this._height );
            };
        }

        var vertexShaderBlit = '\
attribute vec4 position;\n\
varying vec2 texcoord;\n\
void main(){\n\
    texcoord = position.xy*0.5+0.5;\n\
    gl_Position = position;\n\
}';

        var vertexShaderBlit1 = '\
uniform float times;\n\
uniform vec2 center;\n\
attribute vec4 position;\n\
varying vec2 texcoord;\n\
void main(){\n\
    texcoord = ((position.xy - center)* 0.5 * times + center * 0.5 + 0.5);\n\
    gl_Position = position;\n\
}';

        var fragmentShaderBlit = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;';

        var fragmentShaderHill = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;\n\
uniform vec2 viewport;\
void main(){\
    bool newPos = true;\
    float testVal;\
    float currentVal = 0.0;\
    vec2 texPos;\
    vec2 newTexPos;\
    texPos = texcoord;\
    newTexPos = texcoord;\
    \
    int flag = 0;\
    const int band = 5;\
    const int band1 = 5;\
    currentVal = texture2D(source, texPos).a;\
    for(int i=-band; i<=band; i++){\
        for(int j=-band; j<=band; j++){\
            vec2 offset = vec2(i,j)/viewport;\
            float Val = texture2D(source, texPos+offset).a;\
            if (Val > currentVal) {\
                flag = 1;\
            }\
        }\
    }\
    if(flag==0){\
        for(int i=0;i<2;i++){\
            newPos = false;\
            currentVal = texture2D(source, texPos).a;\
            for(int x=0; x>=-band1; x--){\
                for(int y=-band1; y<=band1; y++){\
                    if(x==0&&y<=0)continue;\
                    vec2 off = vec2(x,y)/viewport;\
                    testVal = texture2D(source, texPos+off).a;\
                    if (testVal >= currentVal) {\
                        currentVal = testVal;\
                        newPos = true;\
                        newTexPos = texPos + off;\
                    }\
                }\
            }\
            texPos = newTexPos;\
            if(newPos==false) {break;}\
        }\
    }else{\
        for(int i=0; i<2; i++){\
            newPos = false;\
            currentVal = texture2D(source, texPos).a;\
            for(int x=-band; x<=band; x++){\
                for(int y=-band; y<=band; y++){\
                    vec2 off = vec2(x,y)/viewport;\
                    testVal = texture2D(source, texPos+off).a;\
                    if (testVal >currentVal) {\
                        currentVal = testVal;\
                        newPos = true;\
                        newTexPos = texPos + off;\
                    }\
                }\
            }\
            texPos = newTexPos;\
            if(newPos==false) {break;}\
        }\
    }\
    gl_FragColor = vec4(vec2(texPos), currentVal, 1.0);\
}';

        var fragmentShaderFinalHill = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\nuniform sampler2D source;\n\
varying vec2 texcoord;\n\
uniform vec2 viewport;\n\
void main(){\
    vec2 newTexPos;\
    newTexPos = texcoord;\
    for(int i=0;i<16;i++){\
        newTexPos = vec2(texture2D(source, newTexPos).r, texture2D(source, newTexPos).g);\
        if(newTexPos.x==texture2D(source, newTexPos).r&&newTexPos.y==texture2D(source, newTexPos).g) {break;}\
    }\
    float x = floor(newTexPos.x*viewport.x);\
    float y = floor(newTexPos.y*viewport.y);\
    gl_FragColor = vec4(x,y,0.0,0.0);\
}';

        var vsCopy = vertexShaderBlit;
        var fsCopy = '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
uniform sampler2D source;\n\
varying vec2 texcoord;\n\
void main(){\
    float intensity = texture2D(source, texcoord).a;\
    gl_FragColor = vec4(intensity);\
}';

        class Heights {
            private _heatmap: WebGLHeatmap;
            private _gl: WebGLRenderingContext;
            private _width: number;
            private _height: number;

            private _shader: Shader; //点渲染的shader
            private _rawEdgeShader: Shader; //边渲染的shader
            private _copyShader: Shader; //将texture上的值拷贝回cpu的shader
            private _hillShader: Shader; //爬山算法用的shader
            private _dumpHillShader: Shader; //将爬山后的点聚合情况的结果拷贝回cpu的shader

            private _nodeHill: NodeH; //保存爬山后的结果的texture
            private _nodeBack: NodeH; //临时用的texture
            private _nodeDensity: NodeH; //保存帧缓冲区中的density Map
            private _textureBuffer: Float32Array; //cpu内存上的缓冲区，用来保存GPU上texture的内容

            private _vertexBuffer: WebGLBuffer; //存储点坐标的GPU上的buffer
            private _vertexSize: number; //存储点的维度，一个点是由vertexBuffer上的几个数组成的
            private _maxPointCount: number; //最多存储几个点
            private _vertexBufferData: Float32Array; //存储点坐标
            private _vertexBufferViews: any[]; //点坐标数组的索引数组
            private _bufferIndex: number; //点坐标数组的索引
            private _pointCount: number; //点的个数

            private _edgevertexBuffer: WebGLBuffer; //存储边坐标的GPU上的buffer
            private _edgevertexSize: number; //存储边的维度，一个点是由vertexBuffer上的几个数组成的
            private _edgemaxPointCount: number; //最多存储几条边
            private _edgevertexBufferData: Float32Array; //存储边坐标
            private _edgevertexBufferViews: any[]; //边坐标数组的索引数组
            private _edgebufferIndex: number; //边坐标数组的索引
            private _edgepointCount: number; //边的个数

            public nodeFront: NodeH; //用来储存屏幕展示的帧缓冲

            constructor( heatmap: WebGLHeatmap, gl: WebGLRenderingContext, width: number, height: number ) {
                var i, _i, _ref;
                this._heatmap = heatmap;
                this._gl = gl;
                this._width = width;
                this._height = height;

                this._textureBuffer = new Float32Array( this._width * this._height * 4 );

                this._shader = new Shader( this._gl, {
                    vertex: '\
attribute vec4 position, intensity;\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
uniform vec2 viewport;\n\
void main(){\n\
    dim = abs(position.zw);\n\
    off = position.zw;\n\
    vec2 pos = position.xy + position.zw;\n\
    vIntensity = intensity.x;\n\
    gl_Position = vec4((pos / viewport) * 2.0 - 1.0, 0.0, 1.0);\n\
}',
                    fragment: '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
void main(){\n\
    float falloff = (1.0 - smoothstep(0.0, 1.0, length(off / dim)));\n\
    float intensity = falloff * vIntensity;\n\
    gl_FragColor = vec4(intensity, intensity, intensity, intensity);\n\
}'
                });

                this._rawEdgeShader = new Shader( this._gl, {
                    vertex: '\
attribute vec4 position, intensity;\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
uniform vec2 viewport;\n\
void main(){\n\
    dim = abs(position.zw);\n\
    off = position.zw;\n\
    vec2 pos = position.xy + position.zw;\n\
    vIntensity = intensity.x;\n\
    gl_Position = vec4((pos/viewport)*2.0-1.0, 0.0, 1.0);\n\
}',
                    fragment: '\
#ifdef GL_FRAGMENT_PRECISION_HIGH\n\
precision highp int;\n\
precision highp float;\n\
#else\n\
precision mediump int;\n\
precision mediump float;\n\
#endif\n\
varying vec2 off, dim;\n\
varying float vIntensity;\n\
void main(){\n\
    float falloff = (1.0);\n\
    float intensity = falloff * vIntensity;\n\
    gl_FragColor = vec4(-intensity);\n\
}'
                });

                this._hillShader = new Shader( this._gl, {
                    vertex: vertexShaderBlit,
                    //fragment: this.getShaderByScriptID("fragmentShaderHill")
                    fragment: fragmentShaderHill
                });

                this._dumpHillShader = new Shader( this._gl, {
                    vertex: vertexShaderBlit,
                    fragment: fragmentShaderFinalHill
                });

                this._copyShader = new Shader( this._gl, {
                    vertex: vsCopy,
                    fragment: fsCopy
                });


                this._nodeBack = new NodeH( this._gl, this._width, this._height );
                this.nodeFront = new NodeH( this._gl, this._width, this._height );
                this._nodeHill = new NodeH( this._gl, this._width, this._height );
                this._nodeDensity = new NodeH( this._gl, this._width, this._height );

                //for Nodes
                this._vertexBuffer = this._gl.createBuffer();
                this._vertexSize = 8;
                this._maxPointCount = 1024 * 256;
                this._vertexBufferData = new Float32Array( this._maxPointCount * this._vertexSize * 6 );
                this._vertexBufferViews = [];
                for ( i = _i = 0, _ref = this._maxPointCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i ) {
                    this._vertexBufferViews.push( new Float32Array( this._vertexBufferData.buffer, 0, i * this._vertexSize * 6 ) );
                }
                this._bufferIndex = 0;
                this._pointCount = 0;

                //for Edges
                this._edgevertexBuffer = this._gl.createBuffer();
                this._edgevertexSize = 8;
                this._edgemaxPointCount = 1024 * 256;
                this._edgevertexBufferData = new Float32Array( this._edgemaxPointCount * this._edgevertexSize * 6 );
                this._edgevertexBufferViews = [];
                for ( i = _i = 0, _ref = this._edgemaxPointCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i ) {
                    this._edgevertexBufferViews.push( new Float32Array( this._edgevertexBufferData.buffer, 0, i * this._edgevertexSize * 6 ) );
                }
                this._edgebufferIndex = 0;
                this._edgepointCount = 0;
            }

            //将某个script转化成字符串
            public getShaderByScriptID( id: string ): string {
                var shaderScript = document.getElementById( id );
                if ( !shaderScript ) {
                    alert( "Error: getShader." );
                    return null;
                }
                var str = "";
                var k = shaderScript.firstChild;
                while ( k ) {
                    if ( k.nodeType == 3 ) {
                        str += k.textContent;
                    }
                    k = k.nextSibling;
                }
                return str;
            }

            public resize( width: number, height: number ): Texture {
                this._width = width;
                this._height = height;
                this._textureBuffer = new Float32Array( this._width * this._height * 4 );
                this._nodeHill.resize( this._width, this._height );
                this._nodeBack.resize( this._width, this._height );
                this._nodeDensity.resize( this._width, this._height );
                return this.nodeFront.resize( this._width, this._height );
            }

            public clear(): Framebuffer {
                this.nodeFront.use();
                this._gl.clearColor( 0, 0, 0, 0 );
                this._gl.clear( this._gl.COLOR_BUFFER_BIT );
                return this.nodeFront.end();
            }

            //将点画到帧缓冲区（nodeFront）
            public update(): void {
                var intensityLoc, positionLoc;
                if ( this._pointCount > 0 ) {
                    this._gl.enable( this._gl.BLEND );
                    this.nodeFront.use();
                    this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._vertexBuffer );
                    this._gl.bufferData( this._gl.ARRAY_BUFFER, this._vertexBufferViews[this._pointCount], this._gl.STREAM_DRAW );
                    positionLoc = this._shader.attribLocation( 'position' );
                    intensityLoc = this._shader.attribLocation( 'intensity' );
                    this._gl.enableVertexAttribArray( 1 );
                    this._gl.vertexAttribPointer( positionLoc, 4, this._gl.FLOAT, false, 8 * 4, 0 * 4 );
                    this._gl.vertexAttribPointer( intensityLoc, 4, this._gl.FLOAT, false, 8 * 4, 4 * 4 );
                    this._shader.use().vec2( 'viewport', this._width, this._height );
                    this._gl.drawArrays( this._gl.TRIANGLES, 0, this._pointCount * 6 );
                    this._gl.disableVertexAttribArray( 1 );
                    this._pointCount = 0;
                    this._bufferIndex = 0;
                    this.nodeFront.end();
                    this._nodeDensity = this.nodeFront;
                    this._gl.disable( this._gl.BLEND );
                }
            }

            //将边画到帧缓冲区（nodeFront）
            public updateEdges(): void {
                var intensityLoc, positionLoc;
                if ( this._edgepointCount > 0 ) {
                    this.nodeFront.use();

                    this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._edgevertexBuffer );
                    this._gl.bufferData( this._gl.ARRAY_BUFFER, this._edgevertexBufferViews[this._edgepointCount], this._gl.STREAM_DRAW );
                    positionLoc = this._rawEdgeShader.attribLocation( 'position' );
                    intensityLoc = this._rawEdgeShader.attribLocation( 'intensity' );
                    this._gl.enableVertexAttribArray( 1 );
                    this._gl.vertexAttribPointer( positionLoc, 4, this._gl.FLOAT, false, 8 * 4, 0 * 4 );
                    this._gl.vertexAttribPointer( intensityLoc, 4, this._gl.FLOAT, false, 8 * 4, 4 * 4 );
                    this._rawEdgeShader.use().int( 'source', 0 ).vec2( 'viewport', this._width, this._height );
                    this._gl.drawArrays( this._gl.TRIANGLES, 0, this._edgepointCount * 6 );
                    this._gl.disableVertexAttribArray( 1 );
                    this._edgepointCount = 0;
                    this._edgebufferIndex = 0;

                    this.nodeFront.end();
                }
            }

            public addVertex( x: number, y: number, xs: number, ys: number, intensity: number ): number {
                this._vertexBufferData[this._bufferIndex++] = x;
                this._vertexBufferData[this._bufferIndex++] = y;
                this._vertexBufferData[this._bufferIndex++] = xs;
                this._vertexBufferData[this._bufferIndex++] = ys;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                this._vertexBufferData[this._bufferIndex++] = intensity;
                return this._vertexBufferData[this._bufferIndex++] = intensity;
            }

            public addNode( x: number, y: number, size: number, intensity: number ): number {
                var s;
                if ( size == null ) {
                    size = 50;
                }
                if ( intensity == null ) {
                    intensity = 0.2;
                }
                if ( this._pointCount >= this._maxPointCount - 1 ) {
                    this.update();
                }
                s = size / 2;
                this.addVertex( x, y, -s, -s, intensity );
                this.addVertex( x, y, +s, -s, intensity );
                this.addVertex( x, y, -s, +s, intensity );
                this.addVertex( x, y, -s, +s, intensity );
                this.addVertex( x, y, +s, -s, intensity );
                this.addVertex( x, y, +s, +s, intensity );
                return this._pointCount += 1;
            }

            public addEdgeVertex( x: number, y: number, xs: number, ys: number, intensity: number ): number {
                this._edgevertexBufferData[this._edgebufferIndex++] = x;
                this._edgevertexBufferData[this._edgebufferIndex++] = y;
                this._edgevertexBufferData[this._edgebufferIndex++] = xs;
                this._edgevertexBufferData[this._edgebufferIndex++] = ys;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
                return this._edgevertexBufferData[this._edgebufferIndex++] = intensity;
            }

            public addEdge( x0: number, y0: number, x1: number, y1: number, size: number, intensity: number ) {
                var s, x, y;

                if ( size == null ) {
                    size = 50;
                }
                if ( intensity == null ) {
                    intensity = 0.2;
                }
                if ( this._edgepointCount >= this._edgemaxPointCount - 1 ) {
                    this.updateEdges();
                }

                var lineLength = Math.sqrt(( x0 - x1 ) * ( x0 - x1 ) + ( y0 - y1 ) * ( y0 - y1 ) );
                x = ( x0 + x1 ) / 2;
                y = ( y0 + y1 ) / 2;
                size = size / 2;
                var px0, px1, px2, px3, px4, py0, py1, py2, py3, py4;
                py0 = ( x1 - x0 ) / lineLength;
                px0 = ( y0 - y1 ) / lineLength;
                px1 = x0 + px0 * size;
                py1 = y0 + py0 * size;
                px2 = x1 + px0 * size;
                py2 = y1 + py0 * size;
                px3 = x0 - px0 * size;
                py3 = y0 - py0 * size;
                px4 = x1 - px0 * size;
                py4 = y1 - py0 * size;

                this.addEdgeVertex( x, y, px1 - x, py1 - y, intensity );
                this.addEdgeVertex( x, y, px2 - x, py2 - y, intensity );
                this.addEdgeVertex( x, y, px3 - x, py3 - y, intensity );
                this.addEdgeVertex( x, y, px3 - x, py3 - y, intensity );
                this.addEdgeVertex( x, y, px2 - x, py2 - y, intensity );
                this.addEdgeVertex( x, y, px4 - x, py4 - y, intensity );

                this._edgepointCount += 1;
            }

            //将帧缓冲区的内容copy回本地(CPU上的内存)
            public dumpDensityMapTexureBuffer(): void {
                this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._heatmap.quad );
                this._gl.vertexAttribPointer( 0, 4, this._gl.FLOAT, false, 0, 0 );
                this._nodeDensity.bind( 0 );
                this._nodeBack.use();
                this._gl.clearColor( 0, 0, 0, 0 );
                this._gl.clear( this._gl.COLOR_BUFFER_BIT );
                this._copyShader.use().int( 'source', 0 ).vec2( 'viewport', this._width, this._height );
                this._gl.drawArrays( this._gl.TRIANGLES, 0, 6 );

                this._gl.readPixels( 0, 0, this._width, this._height, this._gl.RGBA, this._gl.FLOAT, this._textureBuffer );

                this._nodeBack.end();
            }

            //获得当前本地端内存所存储的帧缓冲区内容
            public getTextureBuffer(): Float32Array {
                return this._textureBuffer;
            }

            //进行点聚合爬山算法
            public hillClimbing(): void {
                this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._heatmap.quad );
                this._gl.vertexAttribPointer( 0, 4, this._gl.FLOAT, false, 0, 0 );
                this.nodeFront.bind( 0 );
                this._nodeHill.use();
                this._gl.clearColor( 0, 0, 0, 0 );
                this._gl.clear( this._gl.COLOR_BUFFER_BIT );
                this._hillShader.use().int( 'source', 0 ).vec2( 'viewport', this._width, this._height );
                this._gl.drawArrays( this._gl.TRIANGLES, 0, 6 );
                this._nodeHill.end();
            }
            //将爬山结果copy回本地端内存缓冲区
            public dumpFinalHillClimbingResult(): void {
                this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this._heatmap.quad );
                this._gl.vertexAttribPointer( 0, 4, this._gl.FLOAT, false, 0, 0 );
                this._nodeHill.bind( 0 );
                this._nodeBack.use();
                this._gl.clearColor( 0, 0, 0, 0 );
                this._gl.clear( this._gl.COLOR_BUFFER_BIT );
                this._dumpHillShader.use().int( 'source', 0 ).vec2( 'viewport', this._width, this._height );
                this._gl.drawArrays( this._gl.TRIANGLES, 0, 6 );

                this._gl.readPixels( 0, 0, this._width, this._height, this._gl.RGBA, this._gl.FLOAT, this._textureBuffer );

                this._nodeBack.end();
            }
        }

        export class WebGLHeatmap {
            private _width: number;
            private _height: number;
            private _gl: WebGLRenderingContext;
            private _gradientTexture: Texture;
            private _shader: Shader;
            private _rawshader: Shader;
            private _heights: Heights;

            public canvas: HTMLCanvasElement;
            public quad: WebGLBuffer;

            constructor( arg ) {
                var _ref;
                _ref = arg != null ? arg : {}, this.canvas = _ref.canvas, this._width = _ref.width, this._height = _ref.height;

                if ( !this.canvas ) {
                    this.canvas = document.createElement( 'canvas' );
                }
                this._gl = this.canvas.getContext( 'experimental-webgl', { antialias: true });
                if ( this._gl === null ) { throw 'WebGL not supported'; }
                this._gl.enableVertexAttribArray( 0 );
                this._gl.getExtension( 'OES_texture_float' );
                this._gl.blendFunc( this._gl.ONE, this._gl.ONE );
                var alphaRange;
                var _ref1 = alphaRange != null ? alphaRange : [0, 1], alphaStart = _ref1[0], alphaEnd = _ref1[1];
                var output = "vec4 alphaFun(vec3 color, float intensity){\n    float alpha = smoothstep(" + ( alphaStart.toFixed( 8 ) ) + ", " + ( alphaEnd.toFixed( 8 ) ) + ", intensity);\n    return vec4(color*alpha, alpha);\n}";

                var getColorFun = 'float a0 = 0.3; float a1 = 0.6; vec4 getColor(float intensity){\n    vec3 blue = vec3(0.0, 0.0, 1.0);\n    vec3 cyan = vec3(0.0, 1.0, 1.0);\n    vec3 green = vec3(0.0, 1.0, 0.0);\n    vec3 yellow = vec3(1.0, 1.0, 0.0);\n    vec3 red = vec3(1.0, 0.0, 0.0);\n\n    vec4 color;\n if(intensity>=0.0) {if(intensity>=level6)color= vec4(0.4,0.2,0.1,0.85);else if(intensity>=level5)color= vec4(0.5,0.2,0.1,0.7);else if(intensity>=level4)color= vec4(0.7,0.4,0.15,0.9);else if(intensity>=level3)color= vec4(0.7,0.4,0.15,0.7);else if(intensity>=level2)color= vec4(0.6,0.4,0.20,0.60);else if(intensity>=level1)color= vec4(0.95*a1,0.8*a1,0.55*a1,a1);else if(intensity>=level0)color= vec4(0.95*a0,0.8*a0,0.55*a0,a0); else color=vec4(0,0,0,intensity);}\nelse{color = vec4(1.0,(1.0+intensity)*0.7,(1.0+intensity)*0.7,1.0);}\n    return color;\n}';
                var rawgetColorFun = 'vec3 getColor(float intensity){\n    vec3 blue = vec3(0.0, 0.0, 1.0);\n    vec3 cyan = vec3(0.0, 1.0, 1.0);\n    vec3 green = vec3(0.0, 1.0, 0.0);\n    vec3 yellow = vec3(1.0, 1.0, 0.0);\n    vec3 red = vec3(1.0, 0.0, 0.0);\n\n    vec3 color = (\n        fade(-0.25, 0.25, intensity)*blue +\n        fade(0.0, 0.5, intensity)*cyan +\n        fade(0.25, 0.75, intensity)*green +\n        fade(0.5, 1.0, intensity)*yellow +\n        smoothstep(0.75, 1.0, intensity)*red\n    );\n    return color;\n}';
                this._shader = new Shader( this._gl, {
                    vertex: vertexShaderBlit1,
                    fragment: fragmentShaderBlit + ( "uniform float level0;\nuniform float level1;\nuniform float level2;\nuniform float level3;\nuniform float level4;\nuniform float level5;\nuniform float level6;\n" ) + ( "float linstep(float low, float high, float value){\n    return clamp((value-low)/(high-low), 0.0, 1.0);\n}\n\nfloat fade(float low, float high, float value){\n    float mid = (low+high)*0.5;\n    float range = (high-low)*0.5;\n    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);\n    return smoothstep(0.0, 1.0, x);\n}\n\n" + getColorFun + "\n" + "\n\nvoid main(){\n    float intensity = (texture2D(source, texcoord).r);\n    vec4 color = getColor(intensity);\n   gl_FragColor = color;\n}" )
                });

                this._rawshader = new Shader( this._gl, {
                    vertex: vertexShaderBlit1,
                    fragment: fragmentShaderBlit + ( "float linstep(float low, float high, float value){\n    return clamp((value-low)/(high-low), 0.0, 1.0);\n}\n\nfloat fade(float low, float high, float value){\n    float mid = (low+high)*0.5;\n    float range = (high-low)*0.5;\n    float x = 1.0 - clamp(abs(mid-value)/range, 0.0, 1.0);\n    return smoothstep(0.0, 1.0, x);\n}\n\n" + rawgetColorFun + "\n" + output + "\n\nvoid main(){\n    float intensity = smoothstep(0.0, 1.0, texture2D(source, texcoord).r);\n    vec3 color = getColor(intensity);\n    gl_FragColor = alphaFun(color, intensity);\n}" )
                });

                if ( this._width == null ) {
                    this._width = this.canvas.offsetWidth || 2;
                }
                if ( this._height == null ) {
                    this._height = this.canvas.offsetHeight || 2;
                }
                this.canvas.width = this._width;
                this.canvas.height = this._height;
                this._gl.viewport( 0, 0, this._width, this._height );
                this.quad = this._gl.createBuffer();
                this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this.quad );
                var quad = new Float32Array( [-1, -1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1, 1, 1, 0, 1] );
                this._gl.bufferData( this._gl.ARRAY_BUFFER, quad, this._gl.STATIC_DRAW );
                this._gl.bindBuffer( this._gl.ARRAY_BUFFER, null );
                this._heights = new Heights( this, this._gl, this._width, this._height );
            }

            public adjustSize(): void {
                var canvasHeight, canvasWidth;
                canvasWidth = this.canvas.offsetWidth || 2;
                canvasHeight = this.canvas.offsetHeight || 2;
                if ( this._width !== canvasWidth || this._height !== canvasHeight ) {
                    this._gl.viewport( 0, 0, canvasWidth, canvasHeight );
                    this.canvas.width = canvasWidth;
                    this.canvas.height = canvasHeight;
                    this._width = canvasWidth;
                    this._height = canvasHeight;
                    this._heights.resize( this._width, this._height );
                }
            }

            public display( x: number, y: number, times: number, contourForIntensity: number[] ): void {
                this._gl.bindBuffer( this._gl.ARRAY_BUFFER, this.quad );
                this._gl.vertexAttribPointer( 0, 4, this._gl.FLOAT, false, 0, 0 );
                this._heights.nodeFront.bind( 0 );
                if ( !times ) times = 1.0;
                if ( !x ) x = 0;
                if ( !y ) y = 0;
                if ( !contourForIntensity ) {
                    contourForIntensity = [1, 1, 1, 1, 1, 1, 1];
                }
                if ( this._gradientTexture ) {
                    this._gradientTexture.bind( 1 );
                }
                var flag = true;
                if ( config.shaderStyle == null ) flag = true;
                else if ( config.shaderStyle == 0 ) flag = true;
                else flag = false;
                if ( flag ) {
                    this._shader.use().int( 'source', 0 )
                        .int( 'gradientTexture', 1 )
                        .float( 'level0', contourForIntensity[0] )
                        .float( 'level1', contourForIntensity[1] )
                        .float( 'level2', contourForIntensity[2] )
                        .float( 'level3', contourForIntensity[3] )
                        .float( 'level4', contourForIntensity[4] )
                        .float( 'level5', contourForIntensity[5] )
                        .float( 'level6', contourForIntensity[6] )
                        .float( 'times', times )
                        .vec2( 'center', x, y );
                } else {
                    this._rawshader.use().int( 'source', 0 )
                        .int( 'gradientTexture', 1 )
                        .float( 'times', times )
                        .vec2( 'center', x, y );
                }
                return this._gl.drawArrays( this._gl.TRIANGLES, 0, 6 );
            }

            public dumpDensityMapTexureBuffer(): void {
                this._heights.dumpDensityMapTexureBuffer();
            }

            public getTextureBuffer(): Float32Array {
                return this._heights.getTextureBuffer();
            }

            public getDensityMapTextureBuffer(): Float32Array {
                return this._heights.getTextureBuffer();
            }

            public getHillClimbingResultTextureBuffer(): Float32Array {
                return this._heights.getTextureBuffer();
            }

            public hillClimbing(): void {
                this._heights.hillClimbing();
            }

            public dumpFinalHillClimbingResult(): void {
                this._heights.dumpFinalHillClimbingResult();
            }

            public addNode( x: number, y: number, size: number, intensity: number ): number {
                return this._heights.addNode( x, y, size, intensity );
            }

            public updateNodes(): void {
                return this._heights.update();
            }

            public addEdge( x0: number, y0: number, x1: number, y1: number, size: number, intensity: number ): void {
                return this._heights.addEdge( x0, y0, x1, y1, size, intensity );
            }

            public updateEdges(): void {
                return this._heights.updateEdges();
            }

            public clear(): Framebuffer {
                return this._heights.clear();
            }

            public changTimes( x, y, times ): void {
                this._gl.viewport( -x * ( times - 1 ), -( this._height - y ) * ( times - 1 ), this._width * times, this._height * times );
            }

            public returnToInitial(): void {
                this._gl.viewport( 0, 0, this._width, this._height );
            }
        }
    }
}