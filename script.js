document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');
    const imageInput = document.getElementById('imageInput');
    const convertButton = document.getElementById('convertButton');
    const dotSizeInput = document.getElementById('dotSize');
    const spacingInput = document.getElementById('spacing');

    function drawDot(x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    function convertImageToDots(image) {
        const dotSize = parseInt(dotSizeInput.value);
        const baseSpacing = parseInt(spacingInput.value);

        // Set canvas size to match image dimensions
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw original image to get pixel data
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Clear canvas to white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sample points with varying density
        for (let y = 0; y < canvas.height; y += baseSpacing) {
            for (let x = 0; x < canvas.width; x += baseSpacing) {
                const brightness = getPixelBrightness(imageData, x, y);
                const normalizedBrightness = 1 - (brightness / 255);

                // Adjust dot probability based on brightness
                // Darker areas (higher normalizedBrightness) have more dots
                const probability = Math.pow(normalizedBrightness, 2); // Square for more contrast

                if (Math.random() < probability) {
                    // Add some randomness to position
                    const offsetX = (Math.random() - 0.5) * baseSpacing * 1.5;
                    const offsetY = (Math.random() - 0.5) * baseSpacing * 1.5;

                    const finalX = x + offsetX;
                    const finalY = y + offsetY;

                    // Only draw if within bounds
                    if (
                        finalX >= 0 &&
                        finalX < canvas.width &&
                        finalY >= 0 &&
                        finalY < canvas.height
                    ) {
                        // Vary dot size slightly based on brightness
                        const finalDotSize = dotSize * (0.8 + normalizedBrightness * 0.4);
                        drawDot(finalX, finalY, finalDotSize);
                    }
                }
            }
        }
    }

    function getPixelBrightness(imageData, x, y) {
        const index = (y * imageData.width + x) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        // Convert to grayscale using luminance formula
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    convertButton.addEventListener('click', () => {
        const file = imageInput.files[0];
        if (file) {
            const image = new Image();
            image.onload = () => convertImageToDots(image);
            image.src = URL.createObjectURL(file);
        }
    });
});
