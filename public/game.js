var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
let line; // Reference to the line
let endpointMarker1, endpointMarker2; // Endpoint markers
let isRotating = false;
let rotateStartAngle = 0;

function preload() {
    // Preload assets here
}

function create() {
    // Create a line represented as a rectangle
    line = this.add.rectangle(400, 300, 600, 10, 0xff0000).setInteractive();
    this.input.setDraggable(line);

    // Create visual markers for the endpoints
    endpointMarker1 = this.add.circle(line.x - line.width / 2, line.y, 10, 0x00ff00);
    endpointMarker2 = this.add.circle(line.x + line.width / 2, line.y, 10, 0x00ff00);

    // Dragging logic for the line
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        if (!isRotating) {
            // Move the line
            gameObject.x = dragX;
            gameObject.y = dragY;

            // Update endpoint markers' positions
            updateEndpointMarkers();
        }
    });

    // Logic to check for rotation based on mouse position relative to endpoints
    this.input.on('pointerdown', function (pointer) {
        let distToEnd1 = Phaser.Math.Distance.Between(pointer.x, pointer.y, endpointMarker1.x, endpointMarker1.y);
        let distToEnd2 = Phaser.Math.Distance.Between(pointer.x, pointer.y, endpointMarker2.x, endpointMarker2.y);

        if (distToEnd1 < 20 || distToEnd2 < 20) {
            isRotating = true;
            rotateStartAngle = Phaser.Math.Angle.Between(line.x, line.y, pointer.x, pointer.y) - line.rotation;
        }
    });

    this.input.on('pointermove', function (pointer) {
        if (isRotating) {
            let currentAngle = Phaser.Math.Angle.Between(line.x, line.y, pointer.x, pointer.y) - rotateStartAngle;
            line.rotation = currentAngle;
            updateEndpointMarkers();
        }
    });

    this.input.on('pointerup', function () {
        isRotating = false;
    });

    // Function to update the positions of the endpoint markers
    function updateEndpointMarkers() {
        let lineHalfWidth = line.width / 2;
        let cos = Math.cos(line.rotation);
        let sin = Math.sin(line.rotation);

        endpointMarker1.x = line.x - lineHalfWidth * cos;
        endpointMarker1.y = line.y - lineHalfWidth * sin;
        endpointMarker2.x = line.x + lineHalfWidth * cos;
        endpointMarker2.y = line.y + lineHalfWidth * sin;
    }
}
