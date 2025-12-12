// 初始化Canvas
const starsCanvas = document.getElementById('stars');
const auroraCanvas = document.getElementById('aurora');
const particlesCanvas = document.getElementById('particles');

// 确保Canvas存在后再执行
if (starsCanvas && auroraCanvas && particlesCanvas) {
    const starsCtx = starsCanvas.getContext('2d');
    const auroraCtx = auroraCanvas.getContext('2d');
    const particlesCtx = particlesCanvas.getContext('2d');

    // 设置Canvas尺寸为窗口大小
    function resizeCanvases() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        [starsCanvas, auroraCanvas, particlesCanvas].forEach(canvas => {
            canvas.width = width;
            canvas.height = height;
        });
    }
    
    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    // 星空背景
    class Starfield {
        constructor() {
            this.stars = [];
            this.init();
        }
        
        init() {
            const count = Math.min(800, Math.floor(window.innerWidth * window.innerHeight / 800));
            this.stars = [];
            
            for (let i = 0; i < count; i++) {
                this.stars.push({
                    x: Math.random() * starsCanvas.width,
                    y: Math.random() * starsCanvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    brightness: Math.random() * 0.8 + 0.2,
                    speed: Math.random() * 0.3 + 0.1,
                    twinkleSpeed: Math.random() * 0.05 + 0.02
                });
            }
        }
        
        update() {
            this.stars.forEach(star => {
                star.y += star.speed;
                if (star.y > starsCanvas.height) {
                    star.y = 0;
                    star.x = Math.random() * starsCanvas.width;
                }
                
                // 星星闪烁效果
                star.brightness += star.twinkleSpeed;
                if (star.brightness > 1 || star.brightness < 0.2) {
                    star.twinkleSpeed = -star.twinkleSpeed;
                }
            });
        }
        
        draw() {
            starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
            
            // 绘制星空背景渐变
            const gradient = starsCtx.createRadialGradient(
                starsCanvas.width / 2, starsCanvas.height / 2, 0,
                starsCanvas.width / 2, starsCanvas.height / 2, Math.max(starsCanvas.width, starsCanvas.height) / 1.5
            );
            gradient.addColorStop(0, 'rgba(5, 5, 30, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 10, 1)');
            
            starsCtx.fillStyle = gradient;
            starsCtx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);
            
            // 绘制星星
            this.stars.forEach(star => {
                starsCtx.beginPath();
                starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                starsCtx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
                starsCtx.fill();
            });
        }
    }

    // 极光效果
    class Aurora {
        constructor() {
            this.layers = [];
            this.colorSchemes = [
                { primary: [0, 255, 255], secondary: [0, 150, 255] }, // 青色/蓝色
                { primary: [0, 255, 150], secondary: [100, 0, 255] }, // 绿色/紫色
                { primary: [255, 100, 255], secondary: [100, 200, 255] }, // 粉色/浅蓝
                { primary: [255, 255, 0], secondary: [0, 255, 255] } // 黄色/青色
            ];
            this.currentScheme = 0;
            this.speed = 0.5;
            this.amplitude = 100;
            this.active = true;
            this.init();
        }
        
        init() {
            this.layers = [];
            const layerCount = 5;
            
            for (let i = 0; i < layerCount; i++) {
                this.layers.push({
                    points: [],
                    offset: Math.random() * 1000,
                    speed: this.speed * (0.5 + Math.random() * 0.5),
                    amplitude: this.amplitude * (0.7 + Math.random() * 0.6),
                    width: Math.random() * 100 + 50,
                    opacity: 0.1 + (i / layerCount) * 0.15
                });
            }
            
            this.generatePoints();
        }
        
        generatePoints() {
            const segmentCount = 50;
            
            this.layers.forEach(layer => {
                layer.points = [];
                for (let i = 0; i <= segmentCount; i++) {
                    const x = (i / segmentCount) * auroraCanvas.width;
                    layer.points.push({
                        x: x,
                        baseY: Math.random() * auroraCanvas.height * 0.3 + auroraCanvas.height * 0.1
                    });
                }
            });
        }
        
        update() {
            if (!this.active) return;
            
            const time = Date.now() * 0.001;
            
            this.layers.forEach(layer => {
                layer.points.forEach(point => {
                    const noiseX = point.x * 0.01 + layer.offset + time * layer.speed;
                    const noiseY = point.baseY * 0.01 + time * layer.speed * 0.7;
                    
                    // 使用Perlin噪声模拟自然波动
                    const noiseValue = Math.sin(noiseX) * Math.cos(noiseY);
                    point.currentY = point.baseY + noiseValue * layer.amplitude;
                });
            });
        }
        
        draw() {
            if (!this.active) {
                auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);
                return;
            }
            
            auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);
            
            const colors = this.colorSchemes[this.currentScheme];
            
            this.layers.forEach((layer, layerIndex) => {
                const gradient = auroraCtx.createLinearGradient(
                    0, 0, 0, auroraCanvas.height
                );
                
                // 创建极光渐变
                const alpha = layer.opacity;
                gradient.addColorStop(0, `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, 0)`);
                gradient.addColorStop(0.3, `rgba(${colors.primary[0]}, ${colors.primary[1]}, ${colors.primary[2]}, ${alpha * 0.7})`);
                gradient.addColorStop(0.7, `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, ${alpha})`);
                gradient.addColorStop(1, `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, 0)`);
                
                auroraCtx.beginPath();
                
                // 绘制极光曲线
                layer.points.forEach((point, pointIndex) => {
                    if (pointIndex === 0) {
                        auroraCtx.moveTo(point.x, point.currentY);
                    } else {
                        const prevPoint = layer.points[pointIndex - 1];
                        const cpX1 = prevPoint.x + (point.x - prevPoint.x) * 0.3;
                        const cpY1 = prevPoint.currentY;
                        const cpX2 = prevPoint.x + (point.x - prevPoint.x) * 0.7;
                        const cpY2 = point.currentY;
                        
                        auroraCtx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, point.x, point.currentY);
                    }
                });
                
                // 闭合路径形成带状
                const lastPoint = layer.points[layer.points.length - 1];
                auroraCtx.lineTo(lastPoint.x, auroraCanvas.height);
                auroraCtx.lineTo(0, auroraCanvas.height);
                auroraCtx.closePath();
                
                auroraCtx.fillStyle = gradient;
                auroraCtx.fill();
                
                // 添加内部高光
                if (layerIndex === this.layers.length - 1) {
                    auroraCtx.beginPath();
                    layer.points.forEach((point, pointIndex) => {
                        if (pointIndex === 0) {
                            auroraCtx.moveTo(point.x, point.currentY - layer.width * 0.1);
                        } else {
                            const prevPoint = layer.points[pointIndex - 1];
                            const cpX1 = prevPoint.x + (point.x - prevPoint.x) * 0.3;
                            const cpY1 = prevPoint.currentY - layer.width * 0.1;
                            const cpX2 = prevPoint.x + (point.x - prevPoint.x) * 0.7;
                            const cpY2 = point.currentY - layer.width * 0.1;
                            
                            auroraCtx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, point.x, point.currentY - layer.width * 0.1);
                        }
                    });
                    
                    auroraCtx.strokeStyle = `rgba(255, 255, 255, ${layer.opacity * 0.5})`;
                    auroraCtx.lineWidth = 2;
                    auroraCtx.stroke();
                }
            });
        }
        
        changeColor() {
            this.currentScheme = (this.currentScheme + 1) % this.colorSchemes.length;
        }
        
        toggle() {
            this.active = !this.active;
            return this.active;
        }
        
        setSpeed(factor) {
            this.speed = Math.max(0.1, Math.min(2, this.speed * factor));
            this.layers.forEach(layer => {
                layer.speed = this.speed * (0.5 + Math.random() * 0.5);
            });
        }
    }

    // 粒子系统（流星效果）
    class ParticleSystem {
        constructor() {
            this.particles = [];
            this.maxParticles = 30;
            this.active = true;
        }
        
        update() {
            if (!this.active) return;
            
            // 偶尔生成新粒子
            if (this.particles.length < this.maxParticles && Math.random() < 0.05) {
                this.createParticle();
            }
            
            // 更新现有粒子
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.01;
                
                // 移除生命周期结束的粒子
                if (p.life <= 0 || p.x < 0 || p.x > particlesCanvas.width || p.y > particlesCanvas.height) {
                    this.particles.splice(i, 1);
                }
            }
        }
        
        createParticle() {
            const speed = Math.random() * 5 + 2;
            const angle = Math.random() * Math.PI * 0.4 + Math.PI * 0.7; // 从上向下
            
            this.particles.push({
                x: Math.random() * particlesCanvas.width,
                y: -10,
                vx: Math.sin(angle) * speed,
                vy: Math.cos(angle) * speed,
                size: Math.random() * 2 + 1,
                color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 1)`,
                life: 1
            });
        }
        
        draw() {
            if (!this.active) {
                particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
                return;
            }
            
            particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            this.particles.forEach(p => {
                // 绘制流星尾巴
                const gradient = particlesCtx.createLinearGradient(
                    p.x, p.y,
                    p.x - p.vx * 3, p.y - p.vy * 3
                );
                
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                particlesCtx.beginPath();
                particlesCtx.moveTo(p.x, p.y);
                particlesCtx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
                
                particlesCtx.strokeStyle = gradient;
                particlesCtx.lineWidth = p.size;
                particlesCtx.stroke();
                
                // 绘制流星头部
                particlesCtx.beginPath();
                particlesCtx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
                particlesCtx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
                particlesCtx.fill();
            });
        }
        
        toggle() {
            this.active = !this.active;
            return this.active;
        }
    }

    // 创建效果实例
    const starfield = new Starfield();
    const aurora = new Aurora();
    const particleSystem = new ParticleSystem();

    // 动画循环
    function animate() {
        starfield.update();
        aurora.update();
        particleSystem.update();
        
        starfield.draw();
        aurora.draw();
        particleSystem.draw();
        
        requestAnimationFrame(animate);
    }

    // 启动动画
    animate();

    // 窗口大小变化时重新初始化
    window.addEventListener('resize', () => {
        resizeCanvases();
        starfield.init();
        aurora.init();
    });

    // 交互控制
    const changeColorBtn = document.getElementById('changeColor');
    if (changeColorBtn) {
        changeColorBtn.addEventListener('click', () => {
            aurora.changeColor();
        });
    }
}
