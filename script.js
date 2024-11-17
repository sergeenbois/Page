let speed = 20;
let scale = 0.17; // Image scale (I work on 1080p monitor)
let canvas;
let ctx;
let icons = [];
const iconSize = 150; // Fixed size for all icons

const iconUrls = [
    "https://github.com/sergeenbois/Page/raw/ressource/AI.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Cinema.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Foot.png",
    "https://github.com/sergeenbois/Page/raw/ressource/JV.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Livre.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Maths.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Philo.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Science.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Tennis.png",
    "https://github.com/sergeenbois/Page/raw/ressource/Volley.png"
];

(function main() {
    canvas = document.getElementById("tv-screen");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;

    // Load and initialize icons
    iconUrls.forEach(url => {
        let icon = {
            x: 0,
            y: 0,
            xspeed: (Math.random() * 10 - 3) * 2, // Random speed between -6 and 6
            yspeed: (Math.random() * 10 - 3) * 2, // Random speed between -6 and 6
            img: new Image(),
            color: pickColor()
        };
        icon.img.src = url;
        icon.img.onload = () => {
            icon.width = iconSize;
            icon.height = iconSize;
            placeIcon(icon);
            icons.push(icon);
        };
    });

    update();
})();

function placeIcon(icon) {
    let attempts = 0;
    const maxAttempts = 100;

    do {
        icon.x = Math.random() * (canvas.width - icon.width);
        icon.y = Math.random() * (canvas.height - icon.height);
        attempts++;
    } while (icons.some(otherIcon => checkCollision(icon, otherIcon)) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        console.warn('Max attempts reached, using last position.');
    }
}

function update() {
    setTimeout(() => {
        // Draw the canvas background
        ctx.fillStyle = '#333'; // Gris clair
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw each icon
        icons.forEach(icon => {
            // Move the icon
            icon.x += icon.xspeed;
            icon.y += icon.yspeed;

            // Check for border collision
            if (icon.x + icon.width >= canvas.width || icon.x <= 0) {
                icon.xspeed *= -1;
                icon.color = pickColor();
            }
            if (icon.y + icon.height >= canvas.height || icon.y <= 0) {
                icon.yspeed *= -1;
                icon.color = pickColor();
            }

            // Check for icon collision
            icons.forEach(otherIcon => {
                if (otherIcon !== icon && checkCollision(icon, otherIcon)) {
                    resolveCollision(icon, otherIcon);
                    icon.xspeed *= -1;
                    icon.yspeed *= -1;
                    icon.color = pickColor();
                    otherIcon.color = pickColor();
                }
            });

            // Draw the halo effect
            ctx.save();
            ctx.filter = 'blur(10px)'; // Effet de flou
            ctx.fillStyle = icon.color;
            ctx.fillRect(icon.x +15, icon.y + 15, icon.width - 30, icon.height - 30);
            ctx.restore();

            // Draw the icon
            ctx.drawImage(icon.img, icon.x, icon.y, icon.width, icon.height);
        });

        update();
    }, speed);
}

// Check for collision between two icons
function checkCollision(icon1, icon2) {
    return !(
        icon1.x + icon1.width < icon2.x ||
        icon1.x > icon2.x + icon2.width ||
        icon1.y + icon1.height < icon2.y ||
        icon1.y > icon2.y + icon2.height
    );
}

// Resolve collision between two icons
function resolveCollision(icon1, icon2) {
    const overlapX = Math.min(
        icon1.x + icon1.width - icon2.x,
        icon2.x + icon2.width - icon1.x
    );
    const overlapY = Math.min(
        icon1.y + icon1.height - icon2.y,
        icon2.y + icon2.height - icon1.y
    );

    if (overlapX < overlapY) {
        // Resolve along X axis
        if (icon1.x < icon2.x) {
            icon1.x -= overlapX;
            icon2.x += overlapX;
        } else {
            icon1.x += overlapX;
            icon2.x -= overlapX;
        }
    } else {
        // Resolve along Y axis
        if (icon1.y < icon2.y) {
            icon1.y -= overlapY;
            icon2.y += overlapY;
        } else {
            icon1.y += overlapY;
            icon2.y -= overlapY;
        }
    }
}

// Pick a random color in RGB format
function pickColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner tous les conteneurs avec la classe "category"
    const categories = document.querySelectorAll('.category');

    // Ajouter un gestionnaire de clic à chaque conteneur
    categories.forEach(category => {
        category.addEventListener('click', () => {
            // Récupérer le lien à partir de l'attribut data-link
            const link = category.getAttribute('data-link');
            
            // Rediriger vers la page correspondante
            if (link) {
                window.location.href = link;
            }
        });
    });
});
