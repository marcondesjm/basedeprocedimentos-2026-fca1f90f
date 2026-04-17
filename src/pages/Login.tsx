import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useAppVersion } from "@/hooks/useAppVersion";
import { toast } from "sonner";
import { Shield, RefreshCw, Trash2, LogIn, Sun, Moon, Eye, EyeOff } from "lucide-react";

const APP_VERSION = String(__APP_VERSION__).replace(/^v/i, '');
const BUILD_TIMESTAMP = String(__BUILD_TIMESTAMP__);

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let mouseX = -1000;
    let mouseY = -1000;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onMouseLeave = () => { mouseX = -1000; mouseY = -1000; };
    const onTouchMove = (e: TouchEvent) => { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; };
    const onTouchEnd = () => { mouseX = -1000; mouseY = -1000; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    const fontSize = 13;
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -80);
    let speeds: number[] = new Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.7);

    const ship = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, thrustAlpha: 0, invincible: 0 };
    const lasers: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const enemies: { x: number; y: number; vx: number; vy: number; size: number; hp: number; maxHp: number; type: number; isBoss: boolean }[] = [];
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[] = [];
    const powerups: { x: number; y: number; ptype: number; life: number }[] = [];
    const stars: { x: number; y: number; size: number; brightness: number; speed: number }[] = [];
    const floatTexts: { x: number; y: number; text: string; life: number; color: string }[] = [];

    let score = 0;
    let highScore = Number(localStorage.getItem('game_highscore') || 0);
    let lives = 3;
    let level = 1;
    let kills = 0;
    let combo = 0;
    let comboTimer = 0;
    let lastShot = 0;
    let autoShootTimer = 0;
    let bossKillCount = 0;
    let scanY = 0;
    let shieldActive = 0;
    let rapidActive = 0;
    let tripleActive = 0;
    let gameOver = false;

    for (let i = 0; i < 120; i++) {
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 0.5 + Math.random() * 1.5, brightness: 0.3 + Math.random() * 0.7, speed: 0.1 + Math.random() * 0.4 });
    }

    const spawnEnemy = (isBoss: boolean) => {
      const maxE = 8 + level * 2;
      if (enemies.length >= maxE && !isBoss) return;
      const side = Math.floor(Math.random() * 4);
      let ex = 0, ey = 0;
      if (side === 0) { ex = Math.random() * canvas.width; ey = -30; }
      else if (side === 1) { ex = canvas.width + 30; ey = Math.random() * canvas.height; }
      else if (side === 2) { ex = Math.random() * canvas.width; ey = canvas.height + 30; }
      else { ex = -30; ey = Math.random() * canvas.height; }
      const spd = 0.5 + Math.random() + level * 0.2;
      const a = Math.atan2(canvas.height / 2 - ey, canvas.width / 2 - ex) + (Math.random() - 0.5) * 0.8;
      const hp = isBoss ? 8 + level * 2 : 1;
      enemies.push({ x: ex, y: ey, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, size: isBoss ? 32 : 8 + Math.random() * 10, hp, maxHp: hp, type: isBoss ? 3 : Math.floor(Math.random() * 3), isBoss });
    };

    const explode = (x: number, y: number, count: number, color: string) => {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 1 + Math.random() * 4;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 35 + Math.random() * 25, color, size: 1.5 + Math.random() * 2.5 });
      }
    };

    const addFloat = (x: number, y: number, text: string, color: string) => floatTexts.push({ x, y, text, life: 80, color });

    const shootLaser = () => {
      const cd = rapidActive > 0 ? 3 : 10;
      if (time - lastShot < cd) return;
      lastShot = time;
      const spd = 10;
      if (tripleActive > 0) {
        [-0.2, 0, 0.2].forEach(off => {
          const ang = ship.angle + off;
          lasers.push({ x: ship.x + Math.cos(ang) * 18, y: ship.y + Math.sin(ang) * 18, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 70 });
        });
      } else {
        lasers.push({ x: ship.x + Math.cos(ship.angle) * 18, y: ship.y + Math.sin(ship.angle) * 18, vx: Math.cos(ship.angle) * spd, vy: Math.sin(ship.angle) * spd, life: 70 });
      }
    };

    const restart = () => {
      score = 0; lives = 3; level = 1; kills = 0; combo = 0; gameOver = false;
      enemies.length = 0; lasers.length = 0; particles.length = 0; powerups.length = 0; floatTexts.length = 0;
      ship.x = canvas.width / 2; ship.y = canvas.height / 2; ship.invincible = 180;
      bossKillCount = 0; rapidActive = 0; tripleActive = 0; shieldActive = 0;
    };

    const onClick = () => { if (gameOver) restart(); else shootLaser(); };
    document.addEventListener("click", onClick);

    const codeSnippets = ["const init = () => {", "await fetch('/api/data');", "git push origin main", "docker compose up -d", "CREATE TABLE users (", "npm run build", "SELECT * FROM logs;"];
    const codeLines: { x: number; y: number; text: string; alpha: number; speed: number; fs: number }[] = [];

    const resizeHandler = () => { columns = Math.floor(canvas.width / fontSize); drops = new Array(columns).fill(0).map(() => Math.random() * -80); speeds = new Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.7); };
    window.addEventListener("resize", resizeHandler);

    const animate = () => {
      time++;
      ctx.fillStyle = "rgba(0, 2, 8, 0.13)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        const tw = star.brightness * (0.7 + Math.sin(time * 0.05 + star.x) * 0.3);
        ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,220,255,${tw})`; ctx.fill();
      }

      ctx.font = `${fontSize}px 'Courier New', monospace`;
      for (let i = 0; i < drops.length; i++) {
        if (Math.random() > 0.4) continue;
        ctx.fillStyle = `rgba(0,255,170,${0.12 + Math.random() * 0.08})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) drops[i] = 0;
        drops[i] += speeds[i];
      }

      if (Math.random() < 0.015 && codeLines.length < 10) codeLines.push({ x: Math.random() * (canvas.width - 200), y: -20, text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)], alpha: 0.08 + Math.random() * 0.1, speed: 0.2, fs: 11 });
      for (let i = codeLines.length - 1; i >= 0; i--) {
        const cl = codeLines[i]; cl.y += cl.speed;
        if (cl.y > canvas.height + 20) { codeLines.splice(i, 1); continue; }
        ctx.font = `${cl.fs}px 'Courier New', monospace`; ctx.fillStyle = `rgba(0,180,140,${cl.alpha})`; ctx.fillText(cl.text, cl.x, cl.y);
      }

      scanY += 0.6; if (scanY > canvas.height) scanY = 0;
      ctx.fillStyle = "rgba(0,255,120,0.02)"; ctx.fillRect(0, scanY, canvas.width, 2);

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.font = "bold 44px 'Courier New', monospace"; ctx.fillStyle = "rgba(255,50,50,0.9)"; ctx.shadowColor = "red"; ctx.shadowBlur = 20;
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40); ctx.shadowBlur = 0;
        ctx.font = "18px 'Courier New', monospace"; ctx.fillStyle = "rgba(0,255,200,0.8)";
        ctx.fillText(`SCORE: ${score}  |  BEST: ${highScore}  |  LVL: ${level}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.font = "13px 'Courier New', monospace"; ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText("[ clique para jogar novamente ]", canvas.width / 2, canvas.height / 2 + 46);
        ctx.textAlign = "left";
        animationId = requestAnimationFrame(animate);
        return;
      }

      const newLevel = Math.floor(kills / 10) + 1;
      if (newLevel > level) { level = newLevel; addFloat(canvas.width / 2, canvas.height / 2 - 60, `LEVEL ${level}!`, "rgba(255,220,0,1)"); }

      if (shieldActive > 0) shieldActive--;
      if (rapidActive > 0) rapidActive--;
      if (tripleActive > 0) tripleActive--;
      if (ship.invincible > 0) ship.invincible--;
      if (comboTimer > 0) comboTimer--; else combo = 0;

      if (mouseX > 0 && mouseY > 0) {
        ship.x += (mouseX - ship.x) * 0.08; ship.y += (mouseY - ship.y) * 0.08;
        ship.angle = Math.atan2(mouseY - ship.y, mouseX - ship.x);
      }

      autoShootTimer++;
      if (autoShootTimer > (rapidActive > 0 ? 3 : 12) && enemies.length > 0) {
        autoShootTimer = 0;
        let nearest = enemies[0]; let minDist = Infinity;
        for (const e of enemies) { const d = Math.hypot(e.x - ship.x, e.y - ship.y); if (d < minDist) { minDist = d; nearest = e; } }
        ship.angle = Math.atan2(nearest.y - ship.y, nearest.x - ship.x);
        shootLaser();
      }

      if (kills > 0 && kills % 10 === 0 && Math.floor(kills / 10) > bossKillCount) {
        bossKillCount = Math.floor(kills / 10); spawnEnemy(true);
        addFloat(canvas.width / 2, canvas.height / 2 - 80, "BOSS INCOMING!", "rgba(255,50,50,1)");
      }

      const spawnRate = Math.max(20, 60 - level * 5);
      if (time % spawnRate === 0) spawnEnemy(false);
      if (time % (spawnRate * 2) === 0 && Math.random() > 0.4) spawnEnemy(false);

      // Powerups
      for (let i = powerups.length - 1; i >= 0; i--) {
        const p = powerups[i]; p.life--;
        if (p.life <= 0) { powerups.splice(i, 1); continue; }
        const pcols = ["rgba(0,150,255,", "rgba(255,200,0,", "rgba(180,0,255,"];
        const plabels = ["S", "R", "T"];
        ctx.beginPath(); ctx.arc(p.x, p.y, 10 + Math.sin(time * 0.1 + i) * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${pcols[p.ptype]}0.15)`; ctx.strokeStyle = `${pcols[p.ptype]}0.9)`; ctx.lineWidth = 2;
        ctx.shadowColor = `${pcols[p.ptype]}0.8)`; ctx.shadowBlur = 12; ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.font = "bold 11px 'Courier New'"; ctx.textAlign = "center"; ctx.fillStyle = `${pcols[p.ptype]}0.95)`; ctx.fillText(plabels[p.ptype], p.x, p.y + 4); ctx.textAlign = "left";
        if (Math.hypot(p.x - ship.x, p.y - ship.y) < 24) {
          if (p.ptype === 0) { shieldActive = 300; addFloat(ship.x, ship.y - 30, "SHIELD!", "rgba(0,150,255,1)"); }
          else if (p.ptype === 1) { rapidActive = 300; addFloat(ship.x, ship.y - 30, "RAPID FIRE!", "rgba(255,200,0,1)"); }
          else { tripleActive = 300; addFloat(ship.x, ship.y - 30, "TRIPLE SHOT!", "rgba(180,0,255,1)"); }
          powerups.splice(i, 1);
        }
      }

      // Lasers
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i]; l.x += l.vx; l.y += l.vy; l.life--;
        if (l.life <= 0 || l.x < -20 || l.x > canvas.width + 20 || l.y < -20 || l.y > canvas.height + 20) { lasers.splice(i, 1); continue; }
        const lc = tripleActive > 0 ? "rgba(180,0,255," : "rgba(0,255,255,";
        ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.x - l.vx * 2.5, l.y - l.vy * 2.5);
        ctx.strokeStyle = `${lc}${0.8 * (l.life / 70)})`; ctx.shadowColor = `${lc}0.8)`; ctx.shadowBlur = 8; ctx.lineWidth = 2; ctx.stroke(); ctx.shadowBlur = 0;
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (Math.hypot(l.x - e.x, l.y - e.y) < e.size + 4) {
            e.hp--; lasers.splice(i, 1);
            if (e.hp <= 0) {
              const ecols = ["rgba(255,200,50,1)", "rgba(255,100,30,1)", "rgba(0,255,200,1)", "rgba(255,50,50,1)"];
              explode(e.x, e.y, e.isBoss ? 40 : 15, ecols[e.type]);
              if (Math.random() > 0.7) powerups.push({ x: e.x, y: e.y, ptype: Math.floor(Math.random() * 3), life: 280 });
              combo++; comboTimer = 120;
              const pts = e.isBoss ? 20 * level : combo > 2 ? combo : 1;
              score += pts; kills++;
              if (score > highScore) { highScore = score; localStorage.setItem('game_highscore', String(highScore)); }
              addFloat(e.x, e.y - 20, combo > 2 ? `${pts}pts COMBO x${combo}!` : `+${pts}`, combo > 2 ? "rgba(255,220,0,1)" : "rgba(0,255,200,0.8)");
              enemies.splice(j, 1);
            }
            break;
          }
        }
      }

      // Enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i]; e.x += e.vx; e.y += e.vy;
        if (!e.isBoss && (e.x < -80 || e.x > canvas.width + 80 || e.y < -80 || e.y > canvas.height + 80)) { enemies.splice(i, 1); continue; }

        ctx.save(); ctx.translate(e.x, e.y);
        const pulse = Math.sin(time * 0.1 + e.x) * 0.2;
        if (e.isBoss) {
          ctx.rotate(time * 0.01);
          ctx.beginPath();
          for (let s = 0; s < 10; s++) { const a = (s / 10) * Math.PI * 2; const r = s % 2 === 0 ? e.size : e.size * 0.5; if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
          ctx.closePath(); ctx.fillStyle = `rgba(255,30,30,${0.7 + pulse})`; ctx.shadowColor = "rgba(255,50,0,0.8)"; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0;
          const bw = e.size * 3; const bx2 = -bw / 2; const by2 = -e.size - 14;
          ctx.fillStyle = "rgba(100,0,0,0.5)"; ctx.fillRect(bx2, by2, bw, 6);
          ctx.fillStyle = "rgba(255,50,0,0.9)"; ctx.fillRect(bx2, by2, bw * (e.hp / e.maxHp), 6);
          ctx.strokeStyle = "rgba(255,100,0,0.6)"; ctx.lineWidth = 1; ctx.strokeRect(bx2, by2, bw, 6);
        } else if (e.type === 0) {
          ctx.beginPath();
          for (let s = 0; s < 8; s++) { const a = (s / 8) * Math.PI * 2; const r = e.size * (0.7 + Math.sin(a * 3 + e.x) * 0.3); if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
          ctx.closePath(); ctx.fillStyle = `rgba(180,80,60,${0.6 + pulse})`; ctx.strokeStyle = `rgba(255,120,80,${0.7 + pulse})`; ctx.lineWidth = 1; ctx.fill(); ctx.stroke();
        } else if (e.type === 1) {
          ctx.rotate(time * 0.02 + e.y); ctx.beginPath(); ctx.moveTo(0, -e.size); ctx.lineTo(e.size * 0.7, e.size * 0.5); ctx.lineTo(-e.size * 0.7, e.size * 0.5); ctx.closePath();
          ctx.fillStyle = `rgba(255,50,80,${0.6 + pulse})`; ctx.shadowColor = "rgba(255,50,80,0.6)"; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
        } else if (!e.isBoss) {
          ctx.rotate(time * 0.03); ctx.beginPath(); ctx.moveTo(0, -e.size); ctx.lineTo(e.size * 0.6, 0); ctx.lineTo(0, e.size); ctx.lineTo(-e.size * 0.6, 0); ctx.closePath();
          ctx.fillStyle = `rgba(200,0,255,${0.5 + pulse})`; ctx.shadowColor = "rgba(200,0,255,0.6)"; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
        }
        ctx.restore();

        if (ship.invincible <= 0 && Math.hypot(e.x - ship.x, e.y - ship.y) < e.size + 16) {
          if (shieldActive > 0) {
            shieldActive = 0; explode(e.x, e.y, 20, "rgba(0,150,255,1)");
            if (!e.isBoss) enemies.splice(i, 1);
            addFloat(ship.x, ship.y - 40, "SHIELD BLOCKED!", "rgba(0,150,255,1)");
          } else {
            explode(ship.x, ship.y, 20, "rgba(255,100,0,1)"); lives--; ship.invincible = 180; combo = 0;
            addFloat(ship.x, ship.y - 40, lives > 0 ? `VIDA -1 (${lives} left)` : "MORREU!", "rgba(255,80,80,1)");
            if (!e.isBoss) enemies.splice(i, 1);
            if (lives <= 0) { gameOver = true; if (score > highScore) { highScore = score; localStorage.setItem('game_highscore', String(highScore)); } }
          }
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.life--;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const al = p.life / 50;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * al, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("1)", `${al})`); ctx.shadowColor = p.color; ctx.shadowBlur = 4; ctx.fill(); ctx.shadowBlur = 0;
      }

      // Float texts
      for (let i = floatTexts.length - 1; i >= 0; i--) {
        const ft = floatTexts[i]; ft.life--; ft.y -= 0.6;
        if (ft.life <= 0) { floatTexts.splice(i, 1); continue; }
        ctx.font = "bold 13px 'Courier New', monospace"; ctx.textAlign = "center";
        ctx.fillStyle = ft.color.replace("1)", `${ft.life / 80})`); ctx.fillText(ft.text, ft.x, ft.y); ctx.textAlign = "left";
      }

      // Draw ship
      if (!(ship.invincible > 0 && Math.floor(time / 4) % 2 === 0)) {
        ctx.save(); ctx.translate(ship.x, ship.y); ctx.rotate(ship.angle);
        ship.thrustAlpha = 0.5 + Math.sin(time * 0.3) * 0.3;
        const eg = ctx.createRadialGradient(-12, 0, 0, -12, 0, 20); eg.addColorStop(0, `rgba(0,200,255,${ship.thrustAlpha * 0.6})`); eg.addColorStop(1, "transparent");
        ctx.fillStyle = eg; ctx.fillRect(-32, -20, 20, 40);
        ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-12, -10); ctx.lineTo(-8, 0); ctx.lineTo(-12, 10); ctx.closePath();
        ctx.fillStyle = "rgba(0,255,200,0.85)"; ctx.shadowColor = "rgba(0,255,200,0.7)"; ctx.shadowBlur = 18; ctx.fill();
        ctx.strokeStyle = "rgba(0,255,255,0.9)"; ctx.lineWidth = 1; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(6, 0, 3, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fill();
        if (shieldActive > 0) {
          ctx.beginPath(); ctx.arc(0, 0, 30 + Math.sin(time * 0.1) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,150,255,${0.5 + Math.sin(time * 0.1) * 0.3})`; ctx.lineWidth = 2; ctx.shadowColor = "rgba(0,150,255,0.8)"; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;
        }
        ctx.restore();
      }

      // Aim crosshair
      if (mouseX > 0 && mouseY > 0) {
        ctx.strokeStyle = "rgba(0,255,200,0.12)"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.arc(mouseX, mouseY, 18, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mouseX - 7, mouseY); ctx.lineTo(mouseX + 7, mouseY); ctx.moveTo(mouseX, mouseY - 7); ctx.lineTo(mouseX, mouseY + 7); ctx.stroke();
      }

      // HUD
      ctx.font = "bold 12px 'Courier New', monospace"; ctx.fillStyle = "rgba(0,255,200,0.6)";
      ctx.fillText(`SCORE: ${String(score).padStart(5, '0')}`, 14, 26);
      ctx.fillText(`BEST:  ${String(highScore).padStart(5, '0')}`, 14, 44);
      ctx.fillText(`LVL:${level}  KILLS:${kills}`, 14, 62);
      if (combo > 2) { ctx.fillStyle = "rgba(255,220,0,0.9)"; ctx.font = "bold 14px 'Courier New'"; ctx.fillText(`COMBO x${combo}!`, 14, 80); }
      ctx.font = "15px serif";
      for (let h = 0; h < 3; h++) { ctx.fillStyle = h < lives ? "rgba(255,60,60,0.9)" : "rgba(60,60,60,0.4)"; ctx.fillText("♥", 14 + h * 22, 100); }
      let pi = 0;
      if (shieldActive > 0) { ctx.fillStyle = "rgba(0,150,255,0.8)"; ctx.font = "10px 'Courier New'"; ctx.fillText(`[S] ${Math.ceil(shieldActive / 60)}s`, 14, 118 + pi++ * 16); }
      if (rapidActive > 0) { ctx.fillStyle = "rgba(255,200,0,0.8)"; ctx.font = "10px 'Courier New'"; ctx.fillText(`[R] ${Math.ceil(rapidActive / 60)}s`, 14, 118 + pi++ * 16); }
      if (tripleActive > 0) { ctx.fillStyle = "rgba(180,0,255,0.8)"; ctx.font = "10px 'Courier New'"; ctx.fillText(`[T] ${Math.ceil(tripleActive / 60)}s`, 14, 118 + pi++ * 16); }

      animationId = requestAnimationFrame(animate);
    };

    ctx.fillStyle = "rgb(0, 2, 8)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", resizeHandler);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: "rgb(0, 2, 8)" }}
    />
  );
};



const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const navigate = useNavigate();
  const { isAppUpToDate: isUpToDate, lastUpdated, isSyncing, refreshApp } = useAppVersion(APP_VERSION, BUILD_TIMESTAMP);

  // Dark mode toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  const handleForceSync = async () => {
    toast.info('🔄 Limpando cache e atualizando...');
    await refreshApp();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Email ou senha incorretos");
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) toast.error("Erro ao fazer login com Google");
    } catch {
      toast.error("Erro ao conectar com Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <MatrixBackground />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center px-3 sm:px-4 py-4 gap-3 sm:gap-4 max-w-md mx-auto">
        {/* Date/Time Header */}
        <div className="w-full text-center text-white">
          <p className="text-lg sm:text-xl font-bold tracking-wide font-mono">
            DATA: {currentDateTime.toLocaleDateString('pt-BR')}, {currentDateTime.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        {/* Version & Sync Bar */}
        <div className="w-full flex flex-wrap items-center justify-between rounded-xl bg-white/5 backdrop-blur-md border border-white/10 px-3 sm:px-4 py-2 text-white text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs opacity-70">v{APP_VERSION}</span>
            {lastUpdated && (
              <span className="text-[10px] sm:text-xs opacity-50">
                • Atualizado: {new Date(lastUpdated).toLocaleDateString('pt-BR')} {new Date(lastUpdated).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {isUpToDate === true && (
              <span className="text-emerald-400 flex items-center gap-1 text-[10px] sm:text-xs">✓ Atualizado</span>
            )}
            {isUpToDate === false && (
              <span className="text-amber-400 flex items-center gap-1 text-[10px] sm:text-xs">⚠ Desatualizado</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleForceSync}
              disabled={isSyncing}
              className="h-6 sm:h-7 px-1.5 sm:px-2 text-white hover:bg-white/10 text-[10px] sm:text-xs gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              Verificar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="h-6 sm:h-7 px-1.5 sm:px-2 text-white hover:bg-white/10 text-[10px] sm:text-xs gap-1"
            >
              {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              {isDark ? 'Claro' : 'Escuro'}
            </Button>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full border-0 shadow-2xl bg-card/80 backdrop-blur-xl animate-fade-in">
          <CardHeader className="text-center space-y-3 pb-2 px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">Gestão de Procedimentos</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Faça login para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 pt-3 sm:pt-4 px-4 sm:px-6 pb-5 sm:pb-6">
            {/* Email/Password */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 sm:h-11 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs sm:text-sm">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 sm:h-11 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-10 sm:h-11 gap-2 text-sm">
                <LogIn className="w-4 h-4" />
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/80 px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Google */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full h-10 sm:h-11 text-sm gap-3"
              variant="outline"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isGoogleLoading ? "Conectando..." : "Entrar com Google"}
            </Button>

            <p className="text-center text-[10px] sm:text-xs text-muted-foreground pt-1">
              Desenvolvido por Marcondes Jorge Machado
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
