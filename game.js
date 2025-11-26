/** GALAGA JS EXTENDED FIXED **/

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

// SVG Assets
const SVG_ASSETS = {
    PLAYER: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M15 2 L17 2 L17 6 L19 8 L19 14 L24 18 L24 24 L20 24 L20 20 L18 20 L18 26 L14 26 L14 20 L12 20 L12 24 L8 24 L8 18 L13 14 L13 8 L15 6 Z' fill='%23EEEEEE'/%3E%3Cpath d='M15 8 L17 8 L17 14 L15 14 Z' fill='%23FF0000'/%3E%3Cpath d='M8 18 L12 18 L12 22 L8 22 Z' fill='%2300AAFF'/%3E%3Cpath d='M20 18 L24 18 L24 22 L20 22 Z' fill='%2300AAFF'/%3E%3C/svg%3E`,
    ZAKO: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8 4 L16 4 L18 6 L18 10 L16 14 L14 12 L10 12 L8 14 L6 10 L6 6 Z' fill='%2300FF00'/%3E%3Crect x='8' y='6' width='2' height='2' fill='yellow'/%3E%3Crect x='14' y='6' width='2' height='2' fill='yellow'/%3E%3Cpath d='M2 8 L6 8 L6 10 L2 10 Z' fill='%2300AA00'/%3E%3Cpath d='M18 8 L22 8 L22 10 L18 10 Z' fill='%2300AA00'/%3E%3Cpath d='M8 14 L6 18 L8 18 L10 14 Z' fill='%2300AA00'/%3E%3Cpath d='M16 14 L18 18 L16 18 L14 14 Z' fill='%2300AA00'/%3E%3C/svg%3E`,
    GOEI: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8 4 L16 4 L18 8 L14 14 L10 14 L6 8 Z' fill='%23FF0000'/%3E%3Cpath d='M2 6 L8 6 L8 10 L4 12 L2 10 Z' fill='%23FFAA00'/%3E%3Cpath d='M16 6 L22 6 L22 10 L20 12 L16 10 Z' fill='%23FFAA00'/%3E%3Crect x='10' y='6' width='1' height='2' fill='black'/%3E%3Crect x='13' y='6' width='1' height='2' fill='black'/%3E%3Cpath d='M8 14 L6 18 L10 16 L12 14 Z' fill='%23AA0000'/%3E%3Cpath d='M16 14 L18 18 L14 16 L12 14 Z' fill='%23AA0000'/%3E%3C/svg%3E`,
    BOSS: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M12 4 L20 4 L24 10 L22 20 L18 24 L14 24 L10 20 L8 10 Z' fill='%230088FF'/%3E%3Cpath d='M4 12 L10 12 L10 16 L6 18 L4 16 Z' fill='%2300FF00'/%3E%3Cpath d='M22 12 L28 12 L28 16 L26 18 L22 16 Z' fill='%2300FF00'/%3E%3Crect x='13' y='8' width='2' height='3' fill='red'/%3E%3Crect x='17' y='8' width='2' height='3' fill='red'/%3E%3Cpath d='M10 20 L8 26 L12 24 L14 22 Z' fill='%230044AA'/%3E%3Cpath d='M22 20 L24 26 L20 24 L18 22 Z' fill='%230044AA'/%3E%3C/svg%3E`,
    BULLET: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3E%3Crect x='2' y='0' width='4' height='16' rx='2' fill='%23FFFF00'/%3E%3Crect x='3' y='2' width='2' height='12' fill='%23FFFFFF'/%3E%3C/svg%3E`,
};

function getPowerUpSVG(letter, color) {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='7' fill='${color}' stroke='%23FFFFFF' stroke-width='2'/%3E%3Ctext x='8' y='11' font-size='8' text-anchor='middle' fill='%23000000' font-family='sans-serif' font-weight='bold'%3E${letter}%3C/text%3E%3C/svg%3E`;
}

const IMAGES = {};

function loadAssets() {
    for (let key in SVG_ASSETS) {
        IMAGES[key] = new Image();
        IMAGES[key].src = SVG_ASSETS[key];
    }
}

const COLOR = {
    PLAYER: '#00FFFF',
    ENEMY_BEE: '#FF0000',
    ENEMY_BUTTERFLY: '#FFFF00',
    ENEMY_BOSS: '#0000FF',
    BULLET: '#FFCC00'
};

const Audio = {
    synth: null, noise: null, ready: false,
    lastExplosionTime: 0,
    init() {
        if (this.ready) return;
        this.synth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 } }).toDestination();
        this.synth.volume.value = -10;
        this.noise = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.005, decay: 0.2, sustain: 0 } }).toDestination();
        this.noise.volume.value = -5;
        this.ready = true;
    },
    playShoot() { if (this.ready) try { this.synth.triggerAttackRelease("C5", "32n"); } catch (e) { } },
    playEnemyShoot() { if (this.ready) try { this.synth.triggerAttackRelease("G2", "64n"); } catch (e) { } },
    playEnemyExplode() { if (this.ready) { const now = Tone.now(); if (now > this.lastExplosionTime + 0.05) { try { this.noise.triggerAttackRelease("16n", now); this.lastExplosionTime = now; } catch (e) { } } } },
    playPowerUp() { if (this.ready) try { const now = Tone.now(); this.synth.triggerAttackRelease("E5", "16n", now); this.synth.triggerAttackRelease("G5", "16n", now + 0.1); this.synth.triggerAttackRelease("C6", "16n", now + 0.2); } catch (e) { } },
    playPlayerExplode() { if (!this.ready) return; try { const exp = new Tone.NoiseSynth({ noise: { type: "brown" }, envelope: { attack: 0.01, decay: 0.8, sustain: 0 } }).toDestination(); exp.triggerAttackRelease("8n"); } catch (e) { } },
    playStart() { if (!this.ready) return; try { const now = Tone.now(); this.synth.triggerAttackRelease("C4", "16n", now); this.synth.triggerAttackRelease("E4", "16n", now + 0.1); this.synth.triggerAttackRelease("G4", "16n", now + 0.2); this.synth.triggerAttackRelease("C5", "8n", now + 0.3); } catch (e) { } }
};

class Entity {
    constructor(x, y, w, h) { this.x = x; this.y = y; this.width = w; this.height = h; this.markedForDeletion = false; }
    draw(ctx) { } update(dt) { }
}

class Player extends Entity {
    constructor(game) {
        super(game.width / 2 - 16, game.height - 50, 32, 32);
        this.game = game;
        this.speed = 250;
        this.isDead = false;
        this.input = { left: false, right: false, fire: false };
        this.lastShot = 0;
        this.invulnerableTime = 0;
        this.blinkTimer = 0;
    }
    update(dt) {
        if (this.isDead) return;

        if (this.input.left) this.x -= this.speed * dt;
        if (this.input.right) this.x += this.speed * dt;
        if (this.x < 10) this.x = 10;
        if (this.x > this.game.width - this.width - 10) this.x = this.game.width - this.width - 10;

        this.lastShot -= dt;

        const baseCooldown = this.game.buffs.rapid > 0 ? 0.1 : 0.25;

        if (this.input.fire && this.lastShot <= 0) {
            const maxBullets = (this.game.clones.length > 0 ? 8 : 2) * (this.game.buffs.rapid > 0 ? 2 : 1);
            if (this.game.bullets.filter(b => b.source === 'player').length < maxBullets) {
                this.fireBullet(this.x, this.y);
                this.game.clones.forEach(c => this.fireBullet(c.x, c.y));
                this.lastShot = baseCooldown;
                Audio.playShoot();
                this.game.stats.shots++;
            }
            this.input.fire = false;
        }

        if (this.invulnerableTime > 0) {
            this.invulnerableTime -= dt;
            this.blinkTimer += dt;
        } else {
            this.blinkTimer = 0;
        }
    }
    fireBullet(x, y) {
        const offset = 14;
        if (this.game.buffs.wide > 0) {
            this.game.bullets.push(new Bullet(x + offset, y, -1, 'player', 0));
            this.game.bullets.push(new Bullet(x + offset, y, -1, 'player', -100));
            this.game.bullets.push(new Bullet(x + offset, y, -1, 'player', 100));
        } else {
            this.game.bullets.push(new Bullet(x + offset, y, -1, 'player', 0));
        }
    }
    draw(ctx) {
        if (this.isDead) return;
        if (this.invulnerableTime > 0 && Math.floor(this.blinkTimer * 10) % 2 === 0) return;
        if (IMAGES.PLAYER && IMAGES.PLAYER.complete) {
            ctx.drawImage(IMAGES.PLAYER, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = COLOR.PLAYER;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Clone extends Entity {
    constructor(player, offset) {
        super(player.x + offset, player.y, 32, 32);
        this.player = player;
        this.offset = offset;
    }
    update(dt) { this.x = this.player.x + this.offset; this.y = this.player.y; }
    draw(ctx) {
        if (IMAGES.PLAYER && IMAGES.PLAYER.complete) {
            ctx.globalAlpha = 0.7; ctx.drawImage(IMAGES.PLAYER, this.x, this.y, this.width, this.height); ctx.globalAlpha = 1.0;
        }
    }
}

class PowerUp extends Entity {
    constructor(x, y, type) {
        super(x, y, 16, 16);
        this.speed = 100;
        this.type = type;
        this.image = new Image();
        let color = '#00FF00'; let letter = 'C';
        if (type === 'RAPID') { color = '#FF0000'; letter = 'R'; }
        if (type === 'WIDE') { color = '#FFFF00'; letter = 'W'; }
        this.image.src = getPowerUpSVG(letter, encodeURIComponent(color));
    }
    update(dt) { this.y += this.speed * dt; if (this.y > 640) this.markedForDeletion = true; }
    draw(ctx) {
        if (this.image.complete) ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        else { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(this.x, this.y, this.width, this.height); }
    }
}

class Enemy extends Entity {
    constructor(game, x, y, type) {
        super(x, y, 24, 24);
        this.game = game;
        this.type = type;
        this.homeX = x; this.homeY = y;
        this.state = 'GRID';
        this.diveVelocity = { x: 0, y: 0 };
        if (type === 'ZAKO') { this.imgKey = 'ZAKO'; this.scoreVal = 50; }
        else if (type === 'GOEI') { this.imgKey = 'GOEI'; this.scoreVal = 80; }
        else { this.imgKey = 'BOSS'; this.scoreVal = 150; this.width = 32; this.height = 32; }
    }
    shoot() {
        if (this.game.gameState !== 1 || this.game.player.isDead) return;
        if (this.y > 0 && this.y < this.game.height - 50) {
            this.game.bullets.push(new Bullet(this.x + this.width / 2 - 2, this.y + this.height, 1, 'enemy'));
            Audio.playEnemyShoot();
        }
    }
    startDive() {
        this.state = 'DIVING';
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = (150 + (this.game.wave * 15)) * (this.type === 'BOSS' ? 1.2 : 1);
        this.diveVelocity.x = (dx / dist) * speed;
        this.diveVelocity.y = (dy / dist) * speed;
    }
    update(dt) {
        if (this.state === 'GRID') {
            this.x = this.homeX + Math.sin(this.game.time * 2) * 20;
            this.y = this.homeY;
            if (Math.random() < 0.0002 * Math.min(this.game.wave, 10)) this.shoot();
        } else if (this.state === 'DIVING') {
            this.x += this.diveVelocity.x * dt;
            this.y += this.diveVelocity.y * dt;
            if (Math.random() < 0.003 * Math.min(this.game.wave, 10)) this.shoot();
            if (this.y > this.game.height || this.x < -50 || this.x > this.game.width + 50) {
                this.state = 'RETURNING'; this.y = -50; this.x = this.homeX;
            }
        } else if (this.state === 'RETURNING') {
            if (this.y < this.homeY) this.y += 200 * dt;
            else { this.y = this.homeY; this.state = 'GRID'; }
            this.x = this.homeX + Math.sin(this.game.time * 2) * 20;
        }
    }
    draw(ctx) {
        if (IMAGES[this.imgKey] && IMAGES[this.imgKey].complete) ctx.drawImage(IMAGES[this.imgKey], this.x, this.y, this.width, this.height);
        else { ctx.fillStyle = '#FF0000'; ctx.fillRect(this.x, this.y, this.width, this.height); }
    }
}

class Bullet extends Entity {
    constructor(x, y, dir, source, vx = 0) {
        super(x, y, 4, 10);
        this.dir = dir;
        this.speed = 400;
        this.source = source;
        this.vx = vx;
    }
    update(dt) {
        this.y += this.speed * this.dir * dt;
        this.x += this.vx * dt;
        if (this.y < -20 || this.y > 700 || this.x < -20 || this.x > CANVAS_WIDTH + 20) this.markedForDeletion = true;
    }
    draw(ctx) {
        if (IMAGES.BULLET && IMAGES.BULLET.complete) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            if (this.vx !== 0) ctx.rotate(Math.atan2(this.vx, this.speed * this.dir * -1));
            ctx.drawImage(IMAGES.BULLET, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = this.source === 'player' ? '#FF0000' : '#FFFF00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Particle extends Entity {
    constructor(x, y, color) { super(x, y, 4, 4); this.vx = (Math.random() - 0.5) * 200; this.vy = (Math.random() - 0.5) * 200; this.life = 0.5; this.color = color; }
    update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt; if (this.life <= 0) this.markedForDeletion = true; }
    draw(ctx) { ctx.fillStyle = this.color; ctx.globalAlpha = this.life * 2; ctx.fillRect(this.x, this.y, this.width, this.height); ctx.globalAlpha = 1; }
}

class Star {
    constructor(w, h) { this.x = Math.random() * w; this.y = Math.random() * h; this.size = Math.random() < 0.1 ? 2 : 1; this.speed = Math.random() * 50 + 20; }
    update(dt, h, speedMult) { this.y += this.speed * speedMult * dt; if (this.y > h) { this.y = 0; this.x = Math.random() * 480; } }
    draw(ctx) { ctx.fillStyle = Math.random() > 0.9 ? '#FFF' : '#888'; ctx.fillRect(this.x, this.y, this.size, this.size); }
}

class GalagaGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        loadAssets();
        this.resize();
        this.gameState = 0;
        this.lastTime = 0; this.time = 0;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('galaga_highscore')) || 20000;
        this.lives = 3;
        this.wave = 1;
        this.player = new Player(this);
        this.enemies = []; this.bullets = []; this.particles = []; this.stars = [];
        this.powerups = [];
        this.clones = [];
        this.buffs = { clone: 0, rapid: 0, wide: 0 };
        this.stats = { shots: 0, hits: 0 };
        this.nextDiveTime = 2;
        for (let i = 0; i < 50; i++) this.stars.push(new Star(this.width, this.height));
        this.bindEvents();
        this.updateHUD();
        requestAnimationFrame(t => this.loop(t));
    }
    resize() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
    }
    bindEvents() {
        window.addEventListener('keydown', (e) => {
            if (this.gameState === 0 && e.code === 'Space') this.startGame();
            if (this.gameState === 2 && e.code === 'Space') this.resetGame();
            if (this.gameState === 1) {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.player.input.left = true;
                if (e.code === 'ArrowRight' || e.code === 'KeyD') this.player.input.right = true;
                if (e.code === 'Space') this.player.input.fire = true;
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.player.input.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.player.input.right = false;
            if (e.code === 'Space') this.player.input.fire = false;
        });
        const setupTouch = (id, fn) => {
            const btn = document.getElementById(id);
            if (btn) {
                const handler = (v) => (e) => { e.preventDefault(); fn(v); };
                btn.addEventListener('touchstart', handler(true)); btn.addEventListener('touchend', handler(false));
                btn.addEventListener('mousedown', handler(true)); btn.addEventListener('mouseup', handler(false));
            }
        };
        setupTouch('btnLeft', v => this.player.input.left = v);
        setupTouch('btnRight', v => this.player.input.right = v);
        const btnFire = document.getElementById('btnFire');
        if (btnFire) {
            const fireH = (v) => (e) => { e.preventDefault(); if (this.gameState === 0 && v) this.startGame(); else this.player.input.fire = v; };
            btnFire.addEventListener('mousedown', fireH(true)); btnFire.addEventListener('mouseup', fireH(false));
            btnFire.addEventListener('touchstart', fireH(true)); btnFire.addEventListener('touchend', fireH(false));
        }

        const usernameInput = document.getElementById('usernameInput');
        if (usernameInput) {
            usernameInput.addEventListener('click', (e) => e.stopPropagation());
            usernameInput.addEventListener('keydown', (e) => e.stopPropagation());
        }
        const lbBtn = document.getElementById('leaderboardBtn');
        const backBtn = document.getElementById('backBtn');

        if (lbBtn) {
            lbBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showLeaderboard();
            });
        }
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideLeaderboard();
            });
        }
        document.getElementById('startScreen').addEventListener('click', () => { if (this.gameState === 0) this.startGame(); });
        document.getElementById('restartBtn').addEventListener('click', (e) => { e.stopPropagation(); this.resetGame(); });
    }
    startGame() {
        const input = document.getElementById('usernameInput');
        this.playerName = input.value.trim().toUpperCase() || "PILOT";
        console.log("Player:", this.playerName);
        Audio.init(); Audio.playStart();
        this.score = 0; this.lives = 3; this.wave = 1; this.stats = { shots: 0, hits: 0 };
        this.resetBuffs();
        this.updateHUD();
        const startScreen = document.getElementById('startScreen');
        startScreen.classList.add('hidden');
        startScreen.classList.remove('flex');

        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.classList.add('hidden');
        gameOverScreen.classList.remove('flex');

        this.player = new Player(this);
        this.startWave();
        this.gameState = 1;
    }
    startWave() {
        this.resetLevel();
        const msg = document.getElementById('stageMessage');
        document.getElementById('stageNum').innerText = this.wave;
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 2000);
    }
    resetGame() {
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.classList.add('hidden');
        gameOverScreen.classList.remove('flex');

        const startScreen = document.getElementById('startScreen');
        startScreen.classList.remove('hidden');
        startScreen.classList.add('flex');

        this.gameState = 0;
    }
    resetBuffs() { this.buffs = { clone: 0, rapid: 0, wide: 0 }; this.clones = []; }
    resetLevel() {
        this.bullets = []; this.enemies = []; this.powerups = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 8; c++) {
                let type = r === 0 ? 'BOSS' : (r === 1 ? 'GOEI' : 'ZAKO');
                if (type === 'BOSS' && (c < 2 || c > 5)) type = 'GOEI';
                this.enemies.push(new Enemy(this, 60 + c * 40, 60 + r * 30, type));
            }
        }
        this.player.x = this.width / 2 - 16; this.player.invulnerableTime = 2; this.nextDiveTime = 2;
    }
    activatePowerUp(type) {
        Audio.playPowerUp();
        const duration = 15;
        if (type === 'CLONE') { this.buffs.clone = duration; this.clones = [new Clone(this.player, -40), new Clone(this.player, 40)]; }
        else if (type === 'RAPID') { this.buffs.rapid = duration; }
        else if (type === 'WIDE') { this.buffs.wide = duration; }
    }
    spawnPowerUp(x, y) {
        const types = ['CLONE', 'RAPID', 'WIDE'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerups.push(new PowerUp(x, y, type));
    }
    loop(ts) {
        let dt = (ts - this.lastTime) / 1000; if (dt > 0.1) dt = 0.1;
        this.lastTime = ts; this.time += dt;
        this.update(dt); this.draw();
        requestAnimationFrame(t => this.loop(t));
    }
    update(dt) {
        const starSpeed = this.gameState === 1 ? 1 + (this.wave * 0.1) : 1;
        this.stars.forEach(s => s.update(dt, this.height, starSpeed));

        if (this.gameState !== 1) return;

        this.player.update(dt);
        this.clones.forEach(c => c.update(dt));
        this.powerups.forEach(p => p.update(dt));

        if (this.buffs.clone > 0) { this.buffs.clone -= dt; if (this.buffs.clone <= 0) this.clones = []; }
        if (this.buffs.rapid > 0) this.buffs.rapid -= dt;
        if (this.buffs.wide > 0) this.buffs.wide -= dt;

        this.nextDiveTime -= dt;
        let diveInterval = Math.max(0.5, 3 - this.wave * 0.3);

        if (this.nextDiveTime <= 0 && this.enemies.length > 0) {
            const c = this.enemies.filter(e => e.state === 'GRID');
            if (c.length > 0) {
                const attackers = (this.wave > 3 && Math.random() > 0.5) ? 2 : 1;
                for (let i = 0; i < attackers; i++) {
                    if (c.length > i) {
                        const idx = Math.floor(Math.random() * c.length); c[idx].startDive(); c.splice(idx, 1);
                    }
                }
            }
            this.nextDiveTime = diveInterval;
        }

        this.enemies.forEach(e => e.update(dt));
        this.bullets.forEach(b => b.update(dt));
        this.particles.forEach(p => p.update(dt));
        this.checkCollisions();

        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
        this.particles = this.particles.filter(p => !p.markedForDeletion);
        this.powerups = this.powerups.filter(p => !p.markedForDeletion);

        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
        this.particles = this.particles.filter(p => !p.markedForDeletion);
        this.powerups = this.powerups.filter(p => !p.markedForDeletion);


        this.clones = this.clones.filter(c => !c.markedForDeletion);

        if (this.enemies.length === 0) {
            this.wave++; if (this.wave % 3 === 0) this.lives = Math.min(5, this.lives + 1);
            this.updateHUD(); this.startWave();
        }
        this.updateHUD();
    }
    checkCollisions() {
        this.bullets.filter(b => b.source === 'player').forEach(b => {
            this.enemies.forEach(e => {
                if (this.aabb(b, e)) {
                    b.markedForDeletion = true; e.markedForDeletion = true;
                    this.explode(e.x + 12, e.y + 12, e.color);
                    this.score += e.scoreVal * (e.state === 'DIVING' ? 2 : 1);
                    this.stats.hits++; Audio.playEnemyExplode();
                    if (Math.random() < 0.15 && this.powerups.length < 1) this.spawnPowerUp(e.x, e.y);
                }
            });
        });
        this.powerups.forEach(p => {
            if (this.aabb(p, this.player)) { p.markedForDeletion = true; this.activatePowerUp(p.type); }
        });
        this.bullets.filter(b => b.source === 'enemy').forEach(b => {
            let cloneHit = false;
            this.clones.forEach(c => {
                if (this.aabb(b, c)) {
                    c.markedForDeletion = true; b.markedForDeletion = true;
                    this.explode(c.x + 16, c.y + 16, COLOR.PLAYER); Audio.playPlayerExplode();
                    cloneHit = true; this.buffs.clone = 0;
                }
            });
            if (cloneHit) return;
            if (!this.player.isDead && this.player.invulnerableTime <= 0 && this.aabb(b, this.player)) { this.die(); b.markedForDeletion = true; }
        });
        this.enemies.forEach(e => {
            let cloneHit = false;
            this.clones.forEach(c => {
                if (this.aabb(e, c)) {
                    c.markedForDeletion = true; e.markedForDeletion = true;
                    this.explode(c.x + 16, c.y + 16, COLOR.PLAYER); this.explode(e.x + 12, e.y + 12, e.color);
                    Audio.playPlayerExplode(); cloneHit = true; this.buffs.clone = 0;
                }
            });
            if (cloneHit) return;
            if (!this.player.isDead && this.player.invulnerableTime <= 0) {
                if (this.aabb(e, this.player)) { this.die(); e.markedForDeletion = true; this.explode(e.x + 12, e.y + 12, e.color); }
            }
        });
    }
    die() {
        this.player.isDead = true;
        this.explode(this.player.x + 16, this.player.y + 16, COLOR.PLAYER, 50);
        Audio.playPlayerExplode();
        this.resetBuffs();
        document.getElementById('game-container').classList.add('shake');
        setTimeout(() => document.getElementById('game-container').classList.remove('shake'), 500);
        setTimeout(() => {
            this.lives--; this.updateHUD();
            if (this.lives <= 0) this.gameOver();
            else {
                this.player.isDead = false; this.player.x = this.width / 2 - 16; this.player.invulnerableTime = 3;
                this.enemies.forEach(e => { if (e.state === 'DIVING') e.state = 'RETURNING'; });
                this.bullets = [];
            }
        }, 1500);
    }
    gameOver() {
        this.gameState = 2;
        if (this.score > this.highScore) { this.highScore = this.score; localStorage.setItem('galaga_highscore', this.highScore); }
        this.updateHUD();
        document.getElementById('finalScore').innerText = this.score;
        document.getElementById('shotsFired').innerText = this.stats.shots;

        const goScreen = document.getElementById('gameOverScreen');
        goScreen.classList.remove('hidden');
        goScreen.classList.add('flex');
        if (this.score > 0) {
            fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.playerName,
                    score: this.score
                })
            }).then(() => console.log("Score sent to DB!"));
        }
        document.getElementById('finalScore').innerText = this.score;
    }
    updateHUD() {
        document.getElementById('scoreDisplay').innerText = this.score.toString().padStart(6, '0');
        document.getElementById('highScoreDisplay').innerText = this.highScore.toString().padStart(6, '0');
        document.getElementById('livesDisplay').innerText = this.lives;
        const updateTimer = (id, time) => {
            const el = document.getElementById(id);
            const parent = el.parentElement;
            if (time > 0) { parent.classList.remove('hidden'); el.innerText = Math.ceil(time); }
            else { parent.classList.add('hidden'); }
        };
        updateTimer('timerClone', this.buffs.clone);
        updateTimer('timerRapid', this.buffs.rapid);
        updateTimer('timerWide', this.buffs.wide);
    }
    aabb(r1, r2) { return r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y; }
    explode(x, y, c, n = 10) { for (let i = 0; i < n; i++) this.particles.push(new Particle(x, y, c)); }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.stars.forEach(s => s.draw(this.ctx));
        if (this.gameState === 1 || this.gameState === 2) {
            this.player.draw(this.ctx);
            this.clones.forEach(c => c.draw(this.ctx));
            this.powerups.forEach(p => p.draw(this.ctx));
            this.enemies.forEach(e => e.draw(this.ctx));
            this.bullets.forEach(b => b.draw(this.ctx));
            this.particles.forEach(p => p.draw(this.ctx));
        }
    }
    async showLeaderboard() {
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('flex');

        const lbScreen = document.getElementById('leaderboardScreen');
        lbScreen.classList.remove('hidden');
        lbScreen.classList.add('flex');

        const list = document.getElementById('leaderboardList');
        list.innerHTML = '<li class="text-center text-gray-500 animate-pulse">LOADING DATA...</li>';

        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();

            list.innerHTML = ''; 

            if (data.length === 0) {
                list.innerHTML = '<li class="text-center text-gray-500">NO RECORDS YET</li>';
                return;
            }

            data.forEach((entry, index) => {
                const li = document.createElement('li');
                li.className = 'flex justify-between text-white border-b border-gray-800 pb-1';

                let rankColor = 'text-gray-400';
                if (index === 0) rankColor = 'text-yellow-400';
                if (index === 1) rankColor = 'text-gray-300';
                if (index === 2) rankColor = 'text-orange-400';

                li.innerHTML = `
                    <span class="${rankColor} w-8">#${index + 1}</span>
                    <span class="text-cyan-300 flex-1 text-center">${entry.username || 'UNKNOWN'}</span>
                    <span class="text-red-400 w-20 text-right">${entry.score}</span>
                `;
                list.appendChild(li);
            });

        } catch (err) {
            console.error(err);
            list.innerHTML = '<li class="text-center text-red-500">CONNECTION ERROR</li>';
        }
    }

    hideLeaderboard() {
        const lbScreen = document.getElementById('leaderboardScreen');
        lbScreen.classList.add('hidden');
        lbScreen.classList.remove('flex');

        const startScreen = document.getElementById('startScreen');
        startScreen.classList.remove('hidden');
        startScreen.classList.add('flex');
    }
}
window.onload = () => new GalagaGame();