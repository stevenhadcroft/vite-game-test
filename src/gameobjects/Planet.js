// src/gameobjects/Planet.js
import { GameObjects } from "phaser";

export class Planet {
    constructor({ scene }) {
        this.scene = scene;
        
        // Create a graphics object through the scene
        this.graphics = this.scene.add.graphics();
        
        // Draw the planet
        this.drawPlanet();
        
        // Position the planet in the center of the screen
        this.graphics.setPosition(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        );

        // Add physics body for the planet
        this.body = this.scene.add.circle(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            100
        );
        this.scene.physics.add.existing(this.body, true); // true makes it static
    }
    
    drawPlanet() {
        // Clear any previous drawings
        this.graphics.clear();
        
        // Set the style for the circle
        this.graphics.lineStyle(2, 0x888888); // Add a gray border
        
        // Draw a circle with radius 100 (200px diameter)
        this.graphics.fillStyle(0x4444ff); // Fill with blue color
        this.graphics.fillCircle(0, 0, 100);
        this.graphics.strokeCircle(0, 0, 100);
    }
}