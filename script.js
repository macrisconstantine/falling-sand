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
let mouseHeld = false; // Flag to track whether the mouse is being held
let mouseX = 0;
let mouseY = 0;

// Function to add a grain at the specified position
function addGrain(x, y) {
    grains.push({
        x: x,                  // Fixed X position
        y: y,                  // Fixed Y position
        dy: 2 + Math.random() * 4,                 // Downward speed
        size: 2 + Math.random() * 2,               // Fixed grain size
        color: 'orange'
        // color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})` // Random color
    });
}

// Function to check if a grain has landed on another grain
function hasLanded(grain) {
    for (let other of grains) {
        if (grain === other) continue; // Skip self-comparison

        // Check for collision
        if (
            grain.x < other.x + other.size &&  // Right edge of grain intersects
            grain.x + grain.size > other.x && // Left edge of grain intersects
            grain.y + grain.size >= other.y && // Bottom edge is at or just above another grain
            other.dy == 0 // Allow a small margin for collision
        ) {
            return true; // Grain has landed
        }
    }
    return false; // No collision detected
}

// Animation loop
function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and update all grains
    for (let i = 0; i < grains.length; i++) {
        const grain = grains[i];

        // Update grain position only if it's still falling
        if (grain.dy > 0) {
            grain.y += grain.dy;
            grain.dy += 0.05; // Acceleration due to gravity

            // Stop grain if it hits another grain or the bottom of the canvas
            if (grain.y + grain.size >= canvas.height || hasLanded(grain)) {
                grain.y = Math.min(grain.y, canvas.height - grain.size); // Lock position at the bottom
                grain.dy = 0; // Stop further movement
            }
        }

        // Draw the grain
        ctx.fillStyle = grain.color;
        ctx.fillRect(grain.x, grain.y, grain.size, grain.size);
    }

    // If the mouse is held, keep adding grains at the current mouse position
    if (mouseHeld) {
        addGrain(mouseX, mouseY);
    }

    // Request the next animation frame
    requestAnimationFrame(animate);
}

// Add event listeners for mouse actions
canvas.addEventListener('mousedown', function (event) {
    mouseHeld = true; // Set the flag to true when the mouse is pressed
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left; // Update mouseX
    mouseY = event.clientY - rect.top;  // Update mouseY
});

canvas.addEventListener('mouseup', function () {
    mouseHeld = false; // Reset the flag when the mouse is released
});

canvas.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left; // Update mouseX
    mouseY = event.clientY - rect.top;  // Update mouseY
});

// Start the animation
animate();
