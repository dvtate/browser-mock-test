const { expect } = require('chai');

describe('lookup', function callback() {
    it('does not crash', function callback() {
        // Mock browser environment
        const jsdom = new (require('jsdom')).JSDOM();
        const canvas = jsdom.window.document.createElement('canvas');
        global.window = jsdom.window;
        global.document = jsdom.window.document;
        
        // Make renderer using headless gl
        const THREE = require('three');
        const width = 400, height = 200;
        const context = require('gl')(200, 400);
        const renderer = new THREE.WebGLRenderer({
            antialias: true, 
            canvas, context
        });
    
        // Set up renderer
        renderer.sortObjects = false;
        renderer.setClearColor(0xffffff);
        renderer.setSize(width, height, false);
        const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        camera.position.z = 1;
        const scene = new THREE.Scene();
        
        // Create sprite object using a canvas to generate the texture
        function addText(position, text) {
            var canvas,
                context,
                metrics = null,
                textHeight = 20,
                textWidth = 0,
                actualFontSize = 0.12;
            canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
            context.fillStyle = '#FF0000';
  
            metrics = context.measureText(text);
            var textWidth = metrics.width;
        
            canvas.width = textWidth;
            canvas.height = textHeight;
            context.font = "normal " + textHeight + "px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "#ff0000";
            context.fillText(text, textWidth / 2, textHeight / 2);
        
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            var material = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
            var sprite = new THREE.Sprite( material );
        
            var textObject = new THREE.Object3D();
            textObject.textHeight = actualFontSize;
            textObject.textWidth = (textWidth / textHeight) * textObject.textHeight;
            sprite.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);
                
            textObject.add(sprite);
            return textObject;
        }

        // This is what kills it:
        // It seems that mocha is trying to print all the tiny meaningless details of each texture object which can be several kilobytes in size
        const labels = [
            addText(new THREE.Vector3(1, 0, 0), "tessdfft"),
            addText(new THREE.Vector3(1, 0, 0), "tesdfagadgst"),
            addText(new THREE.Vector3(1, 0, 0), "teghkfhkst"),
            addText(new THREE.Vector3(1, 0, 0), "teskgkfjkhht"),
            addText(new THREE.Vector3(1, 0, 0), "teghjgjfgst"),
            addText(new THREE.Vector3(1, 0, 0), "teskfghjgfkt"),
            addText(new THREE.Vector3(1, 0, 0), "tesjhgjjght"),
            addText(new THREE.Vector3(1, 0, 0), "testhjfjhgjf"),
            addText(new THREE.Vector3(1, 0, 0), "thfghdhhest"),
            addText(new THREE.Vector3(1, 0, 0), "tefghdfghfst"),
            addText(new THREE.Vector3(1, 0, 0), "tefghdfhgst"),
        ];
        labels.forEach(l => scene.add(l));

        // This is just for demonstration

        // This prints instantly and is very fast
        console.log(scene.children);

        // This test intentionally fails so that chai makes mocha print the diff
        // This takes 1 eternity for each label you add and causes corporate testing server to crash
        expect(scene.children).to.include.members([{}, ...labels ]);
    });
});