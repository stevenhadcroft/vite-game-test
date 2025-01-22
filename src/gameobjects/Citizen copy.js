// src/gameobjects/Citizen.js
import { GameObjects } from "phaser";

export class Citizen {
    constructor({ scene }) {
        this.scene = scene;
        this.angle = 0; // Current angle of rotation
        this.rotationSpeed = 0.02; // Speed of rotation in radians
        this.radius = 102; // Planet radius (100) + small offset for sitting on edge
        
        // Create the citizen sprite/graphics
        this.graphics = this.scene.add.graphics();
        
        // Draw the citizen
        this.drawCitizen();
        
        // Position initially at the planet's center (will be offset in update)
        this.graphics.setPosition(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        );
        
        // Start the update loop
        this.scene.events.on('update', this.update, this);
    }
    
    drawCitizen() {
        // Clear any previous drawings
        this.graphics.clear();
        
        // Draw a small circle representing the citizen
        this.graphics.fillStyle(0xff0000); // Red color
        this.graphics.fillCircle(0, 0, 5); // Small 5px radius circle
    }
    
    update() {
        // Update the angle
        this.angle += this.rotationSpeed;
        
        // Calculate new position
        const x = Math.cos(this.angle) * this.radius;
        const y = Math.sin(this.angle) * this.radius;
        
        // Update citizen position relative to its center point
        this.graphics.setPosition(
            this.scene.scale.width / 2 + x,
            this.scene.scale.height / 2 + y
        );
    }
    
    destroy() {
        // Clean up
        this.scene.events.off('update', this.update, this);
        this.graphics.destroy();
    }
}