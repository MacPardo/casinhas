const canvas    = document.getElementById("canvas");
const ctx       = canvas.getContext("2d");
const homeImage = document.getElementById("home");

function listMin(list) {
    if (list.length == 0) return;
    
    return list.reduce(function(acc, n) {
        return Math.min(acc, n);
    }, list[0]);
}

function ImagesContainer(CANVAS, IMAGE, SPEED, FPS) {
    const THIS = {
        pixelsPerFrame: SPEED / FPS,
        ctx: CANVAS.getContext("2d"),
        images: [],
        newImage: function() {

            const coordinates = ([
                [
                    0,
                    Math.random() * CANVAS.height - IMAGE.height
                ],
                [
                    CANVAS.width - IMAGE.naturalWidth, 
                    Math.random() * CANVAS.height - IMAGE.height
                ],
                [
                    Math.random() * CANVAS.width - IMAGE.width,
                    0
                ],
                [
                    Math.random() * CANVAS.width - IMAGE.width,
                    CANVAS.height - IMAGE.height
                ]
            ])[Math.floor(Math.random() * 4)];

            THIS.images.push({
                left:      coordinates[0],
                top:       coordinates[1],
                direction: Math.random() * 2 * Math.PI
            });

        },
        nextState: function() {
            THIS.images = THIS.images.filter(function(img) {
                return !(
                    img.top < 0 ||
                    img.left < 0 ||
                    img.top + IMAGE.height > CANVAS.height ||
                    img.left + IMAGE.width > CANVAS.width
                );
            });

            THIS.images = THIS.images.map(function(img) {
                return {
                    top: img.top + Math.sin(img.direction) * THIS.pixelsPerFrame,
                    left: img.left  + Math.cos(img.direction) * THIS.pixelsPerFrame,
                    direction: img.direction
                }
            });
        },
        render: function() {

            function getOpacity(img) {
                //menor distancia ate a parede
                const x = listMin([
                    img.top,
                    img.left,
                    CANVAS.height - (img.top +  IMAGE.height),
                    CANVAS.width  - (img.left + IMAGE.width)
                ]);
                const L = CANVAS.height;

                const opacity = (-x * (x - L)) / (-(L / 2) * (L / 2 - L));
                return Math.max(opacity, 0);
            }

            THIS.ctx.clearRect(0, 0, CANVAS.width, CANVAS.height)
            THIS.images.forEach(function(img) {
                ctx.globalAlpha = getOpacity(img);
                THIS.ctx.drawImage(IMAGE, img.left, img.top);
            });
        }
    };
    return THIS;
}

const fps = 30;
const speed = 15;

const imgc = new ImagesContainer(canvas, homeImage, speed, fps);

imgc.newImage();

var counter = 0;

setInterval(function() {
    counter++;
    if (counter % Math.floor(fps / 2) == 0 && Math.random() < 1) {
        imgc.newImage();
    }
    imgc.nextState();
    imgc.render();
}, 1000 / fps)