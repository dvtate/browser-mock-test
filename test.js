const { expect } = require('chai');
const THREE = require('three');


describe('lookup', function callback() {
    it('does not crash', function callback() {
        const jsdom = new (require('jsdom')).JSDOM();
        const canvas = jsdom.window.document.createElement('canvas');
        global.window = jsdom.window;
        global.document = jsdom.window.document;
        
        const THREE = require('three');
        
        const width = 400, height = 200;
        const context = require('gl')(200, 400);
        const renderer = new THREE.WebGLRenderer({
            antialias: true, 
            canvas, context
        });
    
        renderer.sortObjects = false;
        renderer.setClearColor(0xffffff);
        renderer.setSize(width, height, false);
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        camera.position.z = 1;
    
        scene = new THREE.Scene();
    
        geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        material = new THREE.MeshNormalMaterial();
    
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        
        // Canvas material
        function addText(position, text) {
            var canvas,
                context,
                metrics = null,
                textHeight = 10,
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


        // Draw some lines
        const points = [
            new THREE.Vector3(1,3,4),
            new THREE.Vector3(3,5,7),
            new THREE.Vector3(9,4,3),
            new THREE.Vector3(1,3,2),
        ];
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x666fff }));
        scene.add(line);
        
        const wf = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereBufferGeometry( 100, 100, 100 )));
        scene.add(wf);

        const labels = [
            addText(new THREE.Vector3(1, 0, 0), "test"),
            addText(new THREE.Vector3(0, 1, 0), "test1"),
            addText(new THREE.Vector3(0, 0, 1), "test2"),
        ];
        scene.add(labels[0]);
        scene.add(labels[1]);
        scene.add(labels[2]);

        renderer.setSize( window.innerWidth, window.innerHeight );
        window.document.body.appendChild( renderer.domElement );
        
        renderer.render(scene, camera);

        expect(scene.children).to.include.members([wf, [], mesh, ...labels ]);
        wf.removeFromScene();
        expect(scene.children).to.include(wf);
    });
});