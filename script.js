const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Array to hold all grains of sand
const grains = [];
let mouseHeld = false;
let mouseX = 0, mouseY = 0;

// Function to add a grain at the specified position
function addGrain(x, y) {
    grains.push({
        x,
        y,
        dy: 2 + Math.random() * 4, // Downward speed
        size: 3,                  // Fixed grain size
        color: 'orange'
    });
}

// Check if a grain has landed on another grain
function hasLanded(grain) {
    return grains.some(other => {
        if (grain === other) return false; // Skip self-comparison
        return (
            grain.x < other.x + other.size &&
            grain.x + grain.size > other.x &&
            grain.y + grain.size >= other.y &&
            other.dy === 0
        );
    });
}

// Check if a grain can move to a specific position
function canMove(grain, dx, dy) {
    const newX = grain.x + dx;
    const newY = grain.y + dy;

    // Check bounds
    if (newX < 0 || newX + grain.size > canvas.width || newY + grain.size > canvas.height) {
        return false;
    }

    // Check collision
    return !grains.some(other => {
        if (grain === other) return false; // Skip self
        return (
            newX < other.x + other.size &&
            newX + grain.size > other.x &&
            newY < other.y + other.size &&
            newY + grain.size > other.y &&
            other.dy === 0
        );
    });
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const grain of grains) {
        if (canMove(grain, 0, grain.dy)) {
            grain.y += grain.dy;  // Move down
            grain.dy += 0.1;     // Gravity acceleration
        } else if (grain.dy > 0) {
            const canMoveRight = canMove(grain, grain.size, grain.dy);
            const canMoveLeft = canMove(grain, -grain.size, grain.dy);

            if (canMoveRight && canMoveLeft) {
                grain.x += (Math.random() < 0.5 ? 1 : -1) * grain.size;
                grain.y += grain.dy;
            } else if (canMoveRight) {
                grain.x += grain.size;
                grain.y += grain.dy;
            } else if (canMoveLeft) {
                grain.x -= grain.size;
                grain.y += grain.dy;
            } else {
                grain.dy = 0; // Stop if no movement is possible
            }
        }

        // Draw the grain
        ctx.fillStyle = grain.color;
        ctx.fillRect(grain.x, grain.y, grain.size, grain.size);
    }

    // Add grains continuously if mouse is held
    if (mouseHeld) {
        addGrain(mouseX, mouseY);
    }

    requestAnimationFrame(animate); // Next frame
}

// Add mouse event listeners
canvas.addEventListener('mousedown', (event) => {
    mouseHeld = true;
    updateMousePosition(event);
});
canvas.addEventListener('mouseup', () => mouseHeld = false);
canvas.addEventListener('mousemove', updateMousePosition);

// Update mouse position
function updateMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

// Start the animation
animate();
