import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { BlueEnemy } from "../gameobjects/BlueEnemy";
import { Planet } from "../gameobjects/Planet";
import { Citizen } from "../gameobjects/Citizen";

export class MainScene extends Scene {
    player = null;
    enemy_blue = null;
    cursors = null;
    planet = null;  // Add this line

    points = 0;
    game_over_timeout = 140;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points
        this.points = 0;
        this.game_over_timeout = 140;
    }

    create() {
        this.add.image(0, 0, "background")
            .setOrigin(0, 0);
        this.add.image(0, this.scale.height, "floor").setOrigin(0, 1);

        // Player
        this.player = new Player({ scene: this });

        // Enemy
        this.enemy_blue = new BlueEnemy(this);

        // Add the planet
        this.planet = new Planet({ scene: this });

        this.citizen = new Citizen({ scene: this });
        
        // Cursor keys 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.on("down", () => {
            this.player.fire();
        });
        this.input.on("pointerdown", (pointer) => {
            this.player.fire(pointer.x, pointer.y);
        });

        // Add collision between player bullets and planet
        this.physics.add.overlap(this.player.bullets, this.planet.body, (planet, bullet) => {
            bullet.destroyBullet();
        });

        // Add collision between enemy bullets and planet
        this.physics.add.overlap(this.enemy_blue.bullets, this.planet.body, (planet, bullet) => {
            bullet.destroyBullet();
        });

        // Overlap enemy with bullets
        this.physics.add.overlap(this.player.bullets, this.enemy_blue, (enemy, bullet) => {
            bullet.destroyBullet();
            this.enemy_blue.damage(this.player.x, this.player.y);
            this.points += 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });

        // Overlap player with enemy bullets
        this.physics.add.overlap(this.enemy_blue.bullets, this.player, (player, bullet) => {
            bullet.destroyBullet();
            this.cameras.main.shake(100, 0.01);
            // Flash the color white for 300ms
            this.cameras.main.flash(300, 255, 10, 10, false,);
            this.points -= 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.player.start();
            this.enemy_blue.start();

            // Game Over timeout
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    if (this.game_over_timeout === 0) {
                        // You need remove the event listener to avoid duplicate events.
                        this.game.events.removeListener("start-game");
                        // It is necessary to stop the scenes launched in parallel.
                        this.scene.stop("HudScene");
                        this.scene.start("GameOverScene", { points: this.points });
                    } else {
                        this.game_over_timeout--;
                        this.scene.get("HudScene").update_timeout(this.game_over_timeout);
                    }
                }
            });
        });
    }

    // update() {
    //     this.player.update();
    //     this.enemy_blue.update();

    //     // Player movement entries
    //     if (this.cursors.up.isDown) {
    //         this.player.move("up");
    //     }
    //     if (this.cursors.down.isDown) {
    //         this.player.move("down");
    //     }

    // }

    update() {
        this.player.update();
        this.enemy_blue.update();
    
        // Player movement entries
        if (this.cursors.up.isDown) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown) {
            this.player.move("down");
        }
        if (this.cursors.left.isDown) {
            this.player.move("left");
        }
        if (this.cursors.right.isDown) {
            this.player.move("right");
        }
    }
}