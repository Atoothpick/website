class FlatDiffusedBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.width = canvas.width = window.innerWidth;
        this.height = canvas.height = window.innerHeight;

        // A single soft multi-stop gradient config for all blobs:
        // Lower alpha near center, fade out to transparent for a more diffused look
        this.gradientStops = [
            { stop: 0.0,  color: 'rgba(255, 255, 255, 0.15)' },  // Softer white center
            { stop: 0.25, color: 'rgba(205, 229, 255, 0.12)' },
            { stop: 0.5,  color: 'rgba(140, 191, 255, 0.10)' },
            { stop: 0.75, color: 'rgba(77, 159, 236, 0.08)'  },
            { stop: 1.0,  color: 'rgba(210, 198, 184, 0)'     }  // desert titanium fade-out
        ];

        this.blobs = this.createBlobs(3);
        this.animate();
    }

    createBlobs(count) {
        const blobs = [];

        for (let i = 0; i < count; i++) {
            // Attempt to find a random position that doesn't overlap with existing blobs
            let x, y;
            const radius = Math.random() * 200 + 700; // Larger radius: 700-900
            let validPosition = false;

            while (!validPosition) {
                x = Math.random() * this.width;
                y = Math.random() * this.height;

                // Check distance from previously placed blobs
                let overlap = false;
                for (const b of blobs) {
                    const dx = x - b.x;
                    const dy = y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < (b.radius + radius) * 0.8) {
                        // If they’re too close, we consider it overlap (0.8 factor to leave some breathing room)
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    validPosition = true;
                }
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
        // Create a multi-stop radial gradient
        const gradient = this.ctx.createRadialGradient(
            blob.x, blob.y, 0,
            blob.x, blob.y, blob.radius
        );

        // Add each color stop
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

            // Simple boundary wrapping
            if (blob.x < -blob.radius) blob.x = this.width + blob.radius;
            if (blob.x > this.width + blob.radius) blob.x = -blob.radius;
            if (blob.y < -blob.radius) blob.y = this.height + blob.radius;
            if (blob.y > this.height + blob.radius) blob.y = -blob.radius;
        });
    }

    animate() {
        // Clear with solid fill (a dark blue)
        this.ctx.fillStyle = 'rgba(10, 20, 50, 1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.updateBlobs();
        this.blobs.forEach(blob => this.drawBlob(blob));

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the background when the page loads
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

    new FlatDiffusedBackground(canvas);
});
