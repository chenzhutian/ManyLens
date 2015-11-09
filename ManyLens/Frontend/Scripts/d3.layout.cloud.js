// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf
(function () {
    function cloud() {
        var size = [256, 256],
            text = cloudText,
            font = cloudFont,
            fontSize = cloudFontSize,
            fontStyle = cloudFontNormal,
            fontWeight = cloudFontNormal,
            rotate = cloudRotate,
            padding = cloudPadding,
            spiral = archimedeanSpiral,
            filter = cloudFilter,
            words = [],
            timeInterval = Infinity,
            event = d3.dispatch("word", "end","step"),
            timer = null,
            cloud = {};

        cloud.start = function () {
            var board = zeroArray((size[0] >> 5) * size[1]),
                bounds = null,
                n = words.length,
                i = -1,
                tags = [],

                data = words.map(function (d, i) {
                    d.text = text.call(this, d, i);
                    d.font = font.call(this, d, i);
                    d.style = fontStyle.call(this, d, i);
                    d.weight = fontWeight.call(this, d, i);
                    d.rotate = rotate.call(this, d, i);
                    d.size = ~~fontSize.call(this, d, i);
                    d.padding = padding.call(this, d, i);
                    return d;
                }).sort(function (a, b) { return b.size - a.size; });

            if (timer) clearInterval(timer);
            timer = setInterval(step, 0);

            step(arguments[0]);

            return cloud;

            function step() {
                var start = +new Date,
                    d;
                while (+new Date - start < timeInterval && ++i < n && timer) {
                    d = data[i];
                    if (!filter(d))
                        continue;
                    if (d.group) {
                        if (d.coordinates) {
                            d.x = size[0] / 2 +  d.coordinates[0];
                            d.y = size[1] / 2 + d.coordinates[1];
                        } else {
                            d.x = size[0] / 2 + Math.sin(Math.PI * (2 - parseInt(d.group)) * 2 / 3) * 60;
                            d.y = size[1] / 2 + Math.cos(Math.PI * (2 - parseInt(d.group)) * 2 / 3) * 60;
                        }
                    } else {
                        d.x = size[0] / 2;//(size[0] * (Math.random() + .5)) >> 1;
                        d.y = size[1] / 2;//(size[1] * (Math.random() + .5)) >> 1;
                    }
                    cloudSprite(d, data, i);
                    if (d.hasText & place(board, d, bounds)) {
                        tags.push(d);
                        event.word(d);
                        if (d.group) {

                            if (!bounds)
                                bounds = {};

                            if (bounds[d.group]) {
                                cloudBounds(bounds, d);
                            } else {
                                bounds[d.group] = [
                                    { x: d.x + d.x0, y: d.y + d.y0 },
                                    { x: d.x + d.x1, y: d.y + d.y1 }
                                ];
                            }
                        }else{
                            if (bounds) {
                                cloudBounds(bounds, d);
                            }
                            else {
                                bounds = [
                                    { x: d.x + d.x0, y: d.y + d.y0 },
                                    { x: d.x + d.x1, y: d.y + d.y1 }
                                ];
                            }
                        }
                       
                        // Temporary hack
                        d.x -= size[0] >> 1;
                        d.y -= size[1] >> 1;
                    }
                }
                if (i >= n) {
                    cloud.stop();
                    event.end(tags, bounds, arguments[0]);
                }
            }
        }

        function place(board, tag, bounds) {
            var startX = tag.x, 
                startY = tag.y, 
                maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
                maxR = maxDelta * maxDelta * 0.25,
                s = spiral(size),
                dt = Math.random() < .5 ? 1 : -1,
                t = -dt,
                dxdy,
                dx,
                dy;

            while (dxdy = s(t += dt)) {
                
                dx = ~~dxdy[0];
                dy = ~~dxdy[1];

                if (Math.min(dx, dy) > maxDelta) break;

                tag.x = startX + dx;
                tag.y = startY + dy;

                //This is for test
                event.step({text:tag.text,x:tag.x,y:tag.y});

                var r1 = (startX - (tag.x0+tag.x)) * (startX - (tag.x0+tag.x)) + (startY - (tag.y0+tag.y)) * (startY - (tag.y0+tag.y));
                var r2 = (startX - (tag.x1+tag.x)) * (startX - (tag.x1+tag.x)) + (startY - (tag.y1+tag.y)) * (startY - (tag.y1+tag.y));
                //if (r1 > maxR || r2 > maxR)
                //    continue;
                if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
                    tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1])
                    continue;

                // only check for collisions within current bounds.
                if (!bounds || !cloudCollide(tag, board, size[0])) {
                    if (!bounds || collideRects(tag, bounds)) {
                        var sprite = tag.sprite,
                            w = tag.width >> 5,
                            sw = size[0] >> 5,
                            lx = tag.x - (w << 4),
                            sx = lx & 0x1f, //shift right, I think 0x1f is just a magic number -- by czt
                            msx = 32 - sx,  // shift left -- by czt
                            h = tag.y1 - tag.y0,
                            x = (tag.y + tag.y0) * sw + (lx >> 5),
                            last;

                        for (var j = 0; j < h; j++) {
                            last = 0;
                            for (var i = 0; i <= w; i++) {
                                board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
                            }
                            x += sw;
                        }
                        delete tag.sprite;
                        return true;
                    }
                }
            }
            return false;
        }

        cloud.stop = function () {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            return cloud;
        };

        cloud.timeInterval = function (x) {
            if (!arguments.length) return timeInterval;
            timeInterval = x == null ? Infinity : x;
            return cloud;
        };

        cloud.words = function (x) {
            if (!arguments.length) return words;
            words = x;
            return cloud;
        };

        cloud.size = function (x) {
            if (!arguments.length) return size;
            size = [+x[0], +x[1]];
            return cloud;
        };

        cloud.font = function (x) {
            if (!arguments.length) return font;
            font = d3.functor(x);
            return cloud;
        };
        cloud.filter = function (x) {
            if (!arguments.length) return filter;
            filter = x;
            return cloud;
        }
        cloud.fontStyle = function (x) {
            if (!arguments.length) return fontStyle;
            fontStyle = d3.functor(x);
            return cloud;
        };

        cloud.fontWeight = function (x) {
            if (!arguments.length) return fontWeight;
            fontWeight = d3.functor(x);
            return cloud;
        };

        cloud.rotate = function (x) {
            if (!arguments.length) return rotate;
            rotate = d3.functor(x);
            return cloud;
        };

        cloud.text = function (x) {
            if (!arguments.length) return text;
            text = d3.functor(x);
            return cloud;
        };

        cloud.spiral = function (x) {
            if (!arguments.length) return spiral;
            spiral = spirals[x + ""] || x;
            return cloud;
        };

        cloud.fontSize = function (x) {
            if (!arguments.length) return fontSize;
            fontSize = d3.functor(x);
            return cloud;
        };

        cloud.padding = function (x) {
            if (!arguments.length) return padding;
            padding = d3.functor(x);
            return cloud;
        };

        return d3.rebind(cloud, event, "on");
    }

    function cloudFilter(d) {
        if (d.Value > 0)
            return true;
        return false;
    }

    function cloudText(d) {
        return d.Key;
    }

    function cloudFont() {
        return "serif";
    }

    function cloudFontNormal() {
        return "normal";
    }

    function cloudFontSize(d) {
        return d.Value;//Math.sqrt(d.value);
    }

    function cloudRotate() {
        return (~~(Math.random() * 6) - 3) * 30;
    }

    function cloudPadding() {
        return 1;
    }

    // Fetches a monochrome sprite bitmap for the specified text.
    // Load in batches for speed.
    function cloudSprite(d, data, di) {
        if (d.sprite) return;

        c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
        var x = 0,
            y = 0,
            maxh = 0,
            n = data.length;
        --di;
        while (++di < n) {
            d = data[di];
            c.save();
            c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
            var w = c.measureText(d.text + "m").width * ratio,
                h = d.size << 1;
            if (d.rotate) {
                var sr = Math.sin(d.rotate * cloudRadians),
                    cr = Math.cos(d.rotate * cloudRadians),
                    wcr = w * cr,
                    wsr = w * sr,
                    hcr = h * cr,
                    hsr = h * sr;
                w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
                h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
            } else {
                //set the w to the nearest 2^k, and w >= 32 unless w == 0 -- by czt 
                w = (w + 0x1f) >> 5 << 5;
            }
            if (h > maxh) maxh = h;

            //It just change to next line -- by czt
            if (x + w >= (cw << 5)) {
                x = 0;               
                y += maxh;           
                maxh = 0;            
            }
            if (y + h >= ch)        
                break;

            c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
            
            if (d.rotate)
                c.rotate(d.rotate * cloudRadians);   
            c.fillText(d.text, 0, 0);

            if (d.padding) {
                c.lineWidth = 2 * d.padding;
                c.strokeText(d.text, 0, 0);
            }
            c.restore();
            d.width = w;
            d.height = h;
            d.xoff = x;
            d.yoff = y;
            d.x1 = w >> 1;
            d.y1 = h >> 1;
            d.x0 = -d.x1;
            d.y0 = -d.y1;
            d.hasText = true;
            x += w;
        }
        var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
            sprite = [];
        while (--di >= 0) {
            d = data[di];
            if (!d.hasText)
                continue;
            var w = d.width,
                w32 = w >> 5,
                h = d.y1 - d.y0;
            // Zero the buffer
            for (var i = 0; i < h * w32; i++)
                sprite[i] = 0;

            x = d.xoff;
            if (x == null) return;
            y = d.yoff;
            var seen = 0,
                seenRow = -1;

            var firstSeen = false;  //change by czt, I think it's the right way to detecth the lower bound
            for (var j = 0; j < h; j++) {
                seen = 0;  //change by czt, I think 'seen' need to reset to 0
                for (var i = 0; i < w; i++) {
                    var k = w32 * j + (i>> 5),
                        m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
                    sprite[k] |= m;
                    seen |= m;
                }
                if (seen) {
                    seenRow = j;
                    firstSeen = true;
                } else if (!firstSeen) { //change by czt, I think it's the right way to detecth the lower bound
                    d.y0++;
                    h--;
                    j--;
                    y++;
                }
            }
            d.y1 = d.y0 + seenRow;
            d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
        }
    }

    // Use mask-based collision detection.
    function cloudCollide(tag, board, sw) {
        sw >>= 5;
        var sprite = tag.sprite,
            w = tag.width >> 5,
            lx = tag.x - (w << 4),
            sx = lx & 0x1f,
            msx = 32 - sx,
            h = tag.y1 - tag.y0,
            x = (tag.y + tag.y0) * sw + (lx >> 5),
            last;
        for (var j = 0; j < h; j++) {
            last = 0;
            for (var i = 0; i <= w; i++) {
                if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
                    & board[x + i])
                    return true;
            }
            x += sw;
        }
        return false;
    }

    function cloudBounds(bounds, d) {
        if (d.group) {
            bounds = bounds[d.group];
            console.log("group cloudBounds");
        }

        var b0 = bounds[0],
            b1 = bounds[1];

        if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
        if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
        if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
        if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
    }

    function collideRects(a, b) {
        if (a.group) {
            b = b[a.group];
            if (!b)
                return true;
        }

        return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
    }

    function archimedeanSpiral(size) {
        var e = size[0] / size[1];
        return function (t) {
            return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
        };
    }

    function rectangularSpiral(size) {
        var dy = 4,
            dx = dy * size[0] / size[1],
            x = 0,
            y = 0;
        return function (t) {
            var sign = t < 0 ? -1 : 1;
            // See triangular numbers: T_n = n * (n + 1) / 2.
            switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
                case 0: x += dx; break;
                case 1: y += dy; break;
                case 2: x -= dx; break;
                default: y -= dy; break;
            }
            return [x, y];
        };
    }

    // TODO reuse arrays?
    function zeroArray(n) {
        var a = [],
            i = -1;
        while (++i < n) a[i] = 0;
        return a;
    }

    var cloudRadians = Math.PI / 180,
        cw = 1 << 11 >> 5,
        ch = 1 << 11,
        canvas,
        ratio = 1;

    if (typeof document !== "undefined") {
        canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;

        //extract the pixel data of canvas (x,y,width,heigh)
        var canvasData = canvas.getContext("2d").getImageData(0, 0, 1, 1).data;
        ratio = Math.sqrt(canvasData.length >> 2);
        canvas.width = (cw << 5) / ratio;
        canvas.height = ch / ratio;

    } else {
        // Attempt to use node-canvas.
        canvas = new Canvas(cw << 5, ch);
    }

    var c = canvas.getContext("2d");
        c.fillStyle = c.strokeStyle = "red";
        c.textAlign = "center";
        c.textBaseline = "middle"; //change by czt, put the text in the middle of baseline

    var spirals = {
            archimedean: archimedeanSpiral,
            rectangular: rectangularSpiral
    };

    if (typeof module === "object" && module.exports) module.exports = cloud;
    else (d3.layout || (d3.layout = {})).cloud = cloud;
})();
