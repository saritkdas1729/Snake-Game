function getValueFromPixelString(string) {
    return +string.substring(0, string.length - 2);
}

window.addEventListener('load', () => {
    const canvasE = document.querySelector('#canvas');
    const panelE = document.querySelector('#panel');

    const canvasS = getComputedStyle(canvasE);
    const panelS = getComputedStyle(panelE);

    const GAP = 20;
    const REZ = 20;
    const COLOR_LIGHT_GREEN = '#83b700';
    const COLOR_DARK_GREEN = '#004e00';

    const screenSize = Math.floor((
            getValueFromPixelString(panelS.height) - 
            getValueFromPixelString(panelS.borderTopWidth) - 
            getValueFromPixelString(panelS.borderBottomWidth) - 
            getValueFromPixelString(panelS.paddingTop) - 
            getValueFromPixelString(panelS.paddingBottom) - 
            getValueFromPixelString(canvasS.borderTopWidth) - 
            getValueFromPixelString(canvasS.borderBottomWidth)
        - 2 * GAP) / REZ) * REZ;

    const screenWidth = screenSize;
    const screenHeight = screenSize;

    canvasE.width = screenWidth;
    canvasE.height = screenHeight;

    const ctx = canvasE.getContext("2d");

    const worldWidth = screenWidth / REZ;
    const worldHeight = screenHeight / REZ;

    const snakeBody = [{ 'x': 0, 'y': 0 }];
    let snakeDir = { 'x': 0, 'y': 0 };

    let foodPos = null;

    let isGameOver = false;

    let lastUpdateTime = Date.now();

    function draw() {
        //draw background
        ctx.fillStyle = COLOR_LIGHT_GREEN;
        ctx.fillRect(0, 0, screenWidth, screenHeight);

        //draw grid
        ctx.strokeStyle = COLOR_DARK_GREEN;
        for (let i = 1; i < worldWidth; i++) {
            ctx.beginPath();
            ctx.moveTo(i * REZ, 0);
            ctx.lineTo(i * REZ, screenHeight);
            ctx.stroke();
        }

        for (let i = 1; i < worldHeight; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * REZ);
            ctx.lineTo(screenWidth, i * REZ);
            ctx.stroke();
        }

        //draw snake
        ctx.fillStyle = COLOR_DARK_GREEN;
        for (let i = 0; i < snakeBody.length; i++) {
            const body = snakeBody[i];
            ctx.fillRect(body.x * REZ, body.y * REZ, REZ, REZ);
        }
    }

    function animate() {
        //update
        const head = snakeBody[0];
        const new_head = { 'x': head.x + snakeDir.x, 'y': head.y + snakeDir.y };
        if (new_head.x >= worldWidth || new_head.x < 0 || new_head.y >= worldHeight || new_head.y < 0) {
            isGameOver = true;
        } else {
            snakeBody.unshift(new_head);
            snakeBody.pop();
        }

        draw();

        if (isGameOver) {
            window.location.href = "./game_over.html";
        } else {
            requestAnimationFrame(() => animate());
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            snakeDir = { 'x': 0, 'y': -1 };
        } else if (e.key === 'ArrowDown') {
            snakeDir = { 'x': 0, 'y': 1 };
        } else if (e.key === 'ArrowLeft') {
            snakeDir = { 'x': -1, 'y': 0 };
        } else if (e.key === 'ArrowRight') {
            snakeDir = { 'x': 1, 'y': 0 };
        }
    });

    requestAnimationFrame(() => {
        draw();
        requestAnimationFrame(() => animate());
    });
});