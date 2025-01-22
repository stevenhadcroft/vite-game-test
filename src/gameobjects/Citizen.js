// src/gameobjects/Citizen.js
import { GameObjects } from "phaser";

export class Citizen {
    constructor({ scene }) {
        this.scene = scene;
        this.angle = 0; // Current angle of rotation
        this.rotationSpeed = 0.02; // Speed of rotation in radians
        this.baseRadius = 102; // Base radius (planet radius + small offset)
        this.radius = this.baseRadius; // Current radius that changes during jumps
        
        // Jump properties
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.jumpForce = 4; // Initial jump force
        this.gravity = 0.2; // Gravity force
        
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

        // Add collision detection with player bullets
        this.setupBulletCollision();
    }
    
    setupBulletCollision() {
        // Create a small physics body for the citizen
        this.body = this.scene.add.circle(0, 0, 15);
        this.scene.physics.add.existing(this.body);

        // Add overlap with player bullets
        this.scene.physics.add.overlap(
            this.body,
            this.scene.player.bullets,
            (body, bullet) => {
                bullet.destroyBullet();
                this.jump();
            }
        );
    }
    
    drawCitizen() {
        // Clear any previous drawings
        this.graphics.clear();
        
        // Draw a small circle representing the citizen
        this.graphics.fillStyle(0xff0000); // Red color
        this.graphics.fillCircle(0, 0, 15); // Small 5px radius circle
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = this.jumpForce;
        }
    }
    
    updateJump() {
        if (this.isJumping) {
            // Apply velocity to radius
            this.radius += this.jumpVelocity;
            
            // Apply gravity
            this.jumpVelocity -= this.gravity;
            
            // Check if landed
            if (this.radius <= this.baseRadius) {
                this.radius = this.baseRadius;
                this.jumpVelocity = 0;
                this.isJumping = false;
            }
        }
    }
    
    update() {
        // Update the jump physics
        this.updateJump();

        // Update the angle (rotation)
        this.angle += this.rotationSpeed;
        
        // Calculate new position using current radius (which changes during jumps)
        const x = Math.cos(this.angle) * this.radius;
        const y = Math.sin(this.angle) * this.radius;
        
        // Update citizen position relative to its center point
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2;
        
        this.graphics.setPosition(centerX + x, centerY + y);
        
        // Update physics body position to match graphics
        this.body.setPosition(centerX + x, centerY + y);
    }
    
    destroy() {
        // Clean up
        this.scene.events.off('update', this.update, this);
        this.graphics.destroy();
        this.body.destroy();
    }
}