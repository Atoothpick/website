class FlatDiffusedBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.resizeCanvas(); // Initialize dimensions
        this.gradientStops = [
            { stop: 0.0, color: 'rgba(255, 255, 255, 0.15)' },
            { stop: 0.25, color: 'rgba(205, 229, 255, 0.12)' },
            { stop: 0.5, color: 'rgba(140, 191, 255, 0.10)' },
            { stop: 0.75, color: 'rgba(77, 159, 236, 0.08)' },
            { stop: 1.0, color: 'rgba(210, 198, 184, 0)' }
        ];

        this.blobs = this.createBlobs(3);
        this.animate();

        // Listen for resize events to adjust the canvas size
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createBlobs(count) {
        const blobs = [];
        const MAX_ATTEMPTS = 1000; // Maximum attempts to find non-overlapping positions

        for (let i = 0; i < count; i++) {
            let x, y;
            const radius = Math.random() * 200 + 700;
            let validPosition = false;
            let attempts = 0;

            while (!validPosition && attempts < MAX_ATTEMPTS) {
                x = Math.random() * this.width;
                y = Math.random() * this.height;

                let overlap = false;
                for (const b of blobs) {
                    const dx = x - b.x;
                    const dy = y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < (b.radius + radius) * 0.8) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    validPosition = true;
                }
                attempts++;
            }

            if (attempts === MAX_ATTEMPTS) {
                console.warn("Failed to place blob without overlap after maximum attempts.  Placing at a random location.");
                 x = Math.random() * this.width;
                 y = Math.random() * this.height;
            }
            blobs.push({
                x,
                y,
                radius,
                speed: {
                    x: (Math.random() - 0.5) * 0.2,
                    y: (Math.random() - 0.5) * 0.2
                }
            });
        }
        return blobs;
    }

    drawBlob(blob) {
        const gradient = this.ctx.createRadialGradient(
            blob.x, blob.y, 0,
            blob.x, blob.y, blob.radius
        );

        this.gradientStops.forEach(({ stop, color }) => {
            gradient.addColorStop(stop, color);
        });

        this.ctx.beginPath();
        this.ctx.fillStyle = gradient;
        this.ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    updateBlobs() {
        this.blobs.forEach(blob => {
            blob.x += blob.speed.x;
            blob.y += blob.speed.y;

            if (blob.x < -blob.radius) blob.x = this.width + blob.radius;
            if (blob.x > this.width + blob.radius) blob.x = -blob.radius;
            if (blob.y < -blob.radius) blob.y = this.height + blob.radius;
            if (blob.y > this.height + blob.radius) blob.y = -blob.radius;
        });
    }

    animate() {
        if (!this.ctx) {
            console.error("Canvas context is not available. Animation stopped.");
            return;
        }
        this.ctx.fillStyle = 'rgba(10, 20, 50, 1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.updateBlobs();
        this.blobs.forEach(blob => this.drawBlob(blob));

        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    try {
        new FlatDiffusedBackground(canvas);
    } catch (error) {
        console.error("Error initializing background animation:", error);
        // Optionally, display a message to the user about the background failing to load.
        //  You could create a simple div element and append it to the body.
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translateX(-50%)';
        errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '10px';
        errorDiv.style.zIndex = '1000';
        errorDiv.textContent = "Background animation failed to load. Please reload the page.";
        document.body.appendChild(errorDiv);
    }
});
