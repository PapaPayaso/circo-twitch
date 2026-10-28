const canal = 'papapayaso';
const canvas = document.getElementById('canvasStream');
const ctx = canvas.getContext('2d');
const avatares = {}, particulas = [];
let exclusivoSalió = false;

function aj() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
aj(); window.addEventListener('resize', aj);

class Particula {
    constructor(x, y, col) {
        this.x = x; this.y = y; this.col = col;
        this.vx = (Math.random() - 0.5) * 6; this.vy = (Math.random() - 0.8) * 8;
        this.size = Math.random() * 3 + 2; this.alfa = 1;
    }
    act() { this.x += this.vx; this.vy += 0.25; this.y += this.vy; this.alfa -= 0.02; }
    dib() { ctx.save(); ctx.globalAlpha = this.alfa; ctx.fillStyle = this.col; ctx.fillRect(this.x, this.y, this.size, this.size); ctx.restore(); }
}
class PayasoGacha {
    constructor(id, nombre) {
        this.id = id; this.nombre = nombre;
        this.x = Math.random() * (canvas.width - 60); this.y = canvas.height - 95;
        this.velX = (Math.random() * 0.6 + 0.4) * (Math.random() > 0.5 ? 1 : -1);
        this.jumpY = 0; this.velY = 0; this.enSuelo = true;
        this.timerVida = Date.now(); this.explotando = false;
        this.f = 0; this.tAnim = 0; this.timerBroma = 0; this.estado = 'caminar';
        this.kills = 0; // Registro de bajas activado
        this.hue = Math.random() * 360;
        this.colorTraje = `hsl(${this.hue}, 90%, 55%)`;
        this.colorSombra = `hsl(${this.hue}, 90%, 35%)`;
        this.colorPelo = `hsl(${(this.hue + 120) % 360}, 95%, 50%)`;

        let r = Math.random() * 100;
        if (r <= 1 && !exclusivoSalió) {
            exclusivoSalió = true; this.rar = '👑 SUPREMO'; this.col = '#ffd700'; this.escala = 1.6; this.tipoGafas = 'futuristas';
        } else if (r > 1 && r <= 6) {
            this.rar = '🔮 ÉPICO'; this.col = '#a335ee'; this.escala = 1.3; this.tipoGafas = 'espiral';
        } else if (r > 6 && r <= 26) {
            this.rar = '⭐ RARO'; this.col = '#0070dd'; this.escala = 1.15; this.tipoGafas = 'estrella';
        } else {
            this.rar = '🎪 COMÚN'; this.col = '#ff0055'; this.escala = 1.0; this.tipoGafas = 'redondas';
        }
    }
    act() {
        if (this.explotando) return;
        if (this.estado === 'caminar') { this.x += this.velX; let w = 48 * this.escala; if (this.x < 0 || this.x > canvas.width - w) this.velX *= -1; }
        if (!this.enSuelo) { this.jumpY += this.velY; this.velY -= 0.4; if (this.jumpY <= 0) { this.jumpY = 0; this.enSuelo = true; this.estado = 'caminar'; } }
        if (this.estado === 'broma' && Date.now() > this.timerBroma) this.estado = 'caminar';
        if (Date.now() > this.tAnim) { this.tAnim = Date.now() + 120; this.f = (this.f + 1) % 4; }
    }
    dibujarPayasoPixel(px, py) {
        ctx.fillStyle = this.colorPelo; ctx.fillRect(px + 6, py + 2, 10, 14); ctx.fillRect(px + 32, py + 2, 10, 14); ctx.fillRect(px + 12, py, 24, 6);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(px + 12, py + 6, 24, 16); ctx.fillStyle = '#ff0000'; ctx.fillRect(px + 21, py + 14, 6, 5);
        ctx.fillStyle = this.colorTraje; ctx.fillRect(px + 8, py + 22, 32, 22); ctx.fillStyle = this.colorSombra; ctx.fillRect(px + 8, py + 38, 32, 6);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(px + 18, py + 22, 12, 6); ctx.fillStyle = '#ffcc00'; ctx.fillRect(px + 21, py + 30, 6, 6);
        ctx.lineWidth = 2;
        if (this.tipoGafas === 'redondas') {
            ctx.strokeStyle = '#000'; ctx.fillStyle = '#00ffcc';
            ctx.beginPath(); ctx.arc(px + 18, py + 11, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.arc(px + 30, py + 11, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        } else if (this.tipoGafas === 'estrella') {
            ctx.fillStyle = '#ffd700'; ctx.fillRect(px + 14, py + 8, 7, 7); ctx.fillRect(px + 27, py + 8, 7, 7);
        } else if (this.tipoGafas === 'espiral') {
            ctx.strokeStyle = '#000'; ctx.fillStyle = '#fff'; ctx.fillRect(px + 14, py + 8, 8, 8); ctx.fillRect(px + 26, py + 8, 8, 8);
            ctx.fillStyle = '#000'; let rot = this.f * 2; ctx.fillRect(px + 15 + (rot % 5), py + 9 + (rot % 5), 3, 3); ctx.fillRect(px + 27 + (rot % 5), py + 9 + (rot % 5), 3, 3);
        } else if (this.tipoGafas === 'futuristas') {
            ctx.fillStyle = '#ff00ff'; ctx.fillRect(px + 13, py + 8, 22, 6); ctx.fillStyle = '#00ffff'; ctx.fillRect(px + 15, py + 9, 18, 2);
        }
        let op = Math.abs(this.velX) > 0.1 ? Math.sin(Date.now() * 0.015) * 5 : 0;
        ctx.fillStyle = '#111'; ctx.fillRect(px + 14, py + 44, 5, 6 + op); ctx.fillRect(px + 29, py + 44, 5, 6 - op);
        ctx.fillStyle = '#ff3300'; ctx.fillRect(this.velX >= 0 ? px + 14 : px + 10, py + 50 + op, 9, 5); ctx.fillRect(this.velX >= 0 ? px + 29 : px + 25, py + 50 - op, 9, 5);
        if (this.estado === 'broma') {
            let dir = this.velX >= 0 ? 1 : -1; let bx = dir === 1 ? px + 38 : px - 14;
            ctx.fillStyle = '#8b5a2b'; ctx.fillRect(bx, py + 26, 12 * dir, 4); ctx.fillStyle = '#ffffff'; ctx.fillRect(dir === 1 ? bx + 2 : bx - 2, py + 20, 8 * dir, 6);
        }
    }
    dib() {
        if (this.explotando) return; const px = this.x, py = this.y - this.jumpY;
        ctx.save(); ctx.shadowBlur = this.rar !== '🎪 COMÚN' ? 18 : 0; ctx.shadowColor = this.col;
        ctx.translate(px + (24 * this.escala), py + (28 * this.escala)); ctx.scale(this.escala, this.escala); ctx.translate(-(px + 24), -(py + 28));
        if (this.velX < 0) { ctx.translate(px + 48, py); ctx.scale(-1, 1); ctx.translate(-px, -py); }
        this.dibujarPayasoPixel(px, py); ctx.restore();
        ctx.save(); ctx.fillStyle = 'rgba(10, 10, 12, 0.85)'; ctx.font = 'bold 12px sans-serif';
        
        // Muestra el nombre, el rango y las Kills con una calavera si tiene alguna baja
        let t = `${this.nombre} [${this.rar}]` + (this.kills > 0 ? ` 💀 ${this.kills}` : '');
        let ancho = ctx.measureText(t).width; let barraY = py - (22 * this.escala);
        ctx.fillRect(px + (24 * this.escala) - ancho / 2 - 6, barraY, ancho + 12, 18);
        ctx.fillStyle = this.col; ctx.textAlign = 'center'; ctx.fillText(t, px + (24 * this.escala), barraY + 13); ctx.restore();
    }
    saltar() { if (this.enSuelo && !this.explotando) { this.velY = 8; this.enSuelo = false; } }
    broma() {
        if (this.explotando) return; this.estado = 'broma'; this.timerBroma = Date.now() + 1000;
        for (let oId in avatares) {
            if (oId === this.id) continue; const e = avatares[oId];
            if (Math.abs((this.x + 24) - (e.x + 24)) < 85) { 
                e.velY = 8; e.enSuelo = false; e.estado = 'quieto'; 
                let dirEmpujon = e.x > this.x ? 6 : -6; e.velX = dirEmpujon; 
                
                // Si el empujón manda al enemigo cerca del borde de la pantalla, sumamos una kill
                setTimeout(() => {
                    if ((dirEmpujon > 0 && e.x > canvas.width - 120) || (dirEmpujon < 0 && e.x < 120)) {
                        this.kills++;
                    }
                }, 500);
            }
        }
    }
    explotar() { this.explotando = true; for (let i = 0; i < 45; i++) { let c = Math.random() > 0.5 ? this.col : this.colorPelo; particulas.push(new Particula(this.x + (24 * this.escala), this.y + (28 * this.escala) - this.jumpY, c)); } }
}

function bucle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); const ahora = Date.now();
    for (let id in avatares) {
        const av = avatares[id]; if (ahora - av.timerVida > 30000 && !av.explotando) { av.explotar(); setTimeout(() => { delete avatares[id]; }, 50); continue; }
        av.act(); av.dib();
    }
    for (let i = particulas.length - 1; i >= 0; i--) { particulas[i].act(); particulas[i].dib(); if (particulas[i].alfa <= 0) particulas.splice(i, 1); }
    requestAnimationFrame(bucle);
}
bucle();

const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
ws.onopen = () => {
    ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands\r\n'); ws.send('PASS anonymous\r\n');
    ws.send('NICK justinfan12984\r\n'); ws.send(`JOIN #${canal}\r\n`);
};
ws.onmessage = (ev) => {
    const msg = ev.data;
    if (msg.includes('PRIVMSG')) {
        const displayMatch = msg.match(/display-name=([^;]+)/); const userIdMatch = msg.match(/user-id=(\d+)/);
        const usuario = displayMatch ? displayMatch[1] : 'Espectador'; const idUsuario = userIdMatch ? userIdMatch[1] : usuario;
        if (!avatares[idUsuario]) avatares[idUsuario] = new PayasoGacha(idUsuario, usuario); else avatares[idUsuario].timerVida = Date.now();
        const p = avatares[idUsuario]; const partes = msg.split(`PRIVMSG #${canal} :`); const txt = partes[1] ? partes[1].trim().toLowerCase() : '';
        if (txt.startsWith('!saltar')) p.saltar();
        else if (txt.startsWith('!correr')) { if (Math.abs(p.velX) < 3) p.velX *= 2.0; }
        else if (txt.startsWith('!parar')) p.velX = 0;
        else if (txt.startsWith('!broma') || txt.startsWith('!pelea')) p.broma();
        else { p.saltar(); if (p.velX === 0) p.velX = Math.random() > 0.5 ? 0.6 : -0.6; }
    }
    if (msg.startsWith('PING')) ws.send('PONG :tmi.twitch.tv\r\n');
};
