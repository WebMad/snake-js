const canvas = document.getElementById('game');
canvas.width = 700;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const box = 50;

const bounds = {
    x: {
        min: 1,
        max: 12,
    },
    y: {
        min: 1,
        max: 10,
    },
}

const background = new Image();
background.src = "img/background.png";

const appleImage = new Image();
appleImage.src = "img/apple.png";

const game = {
    isStart: false,
    bestScore: 0,
    score: 0,
};

let snake = {
    x: 2,
    y: 5,
    body: [
        {
            x: 2,
            y: 5,
        },
    ]
};
let move_interval;

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

const food = {
    x: randomInteger(bounds.x.min, bounds.x.max),
    y: randomInteger(bounds.y.min, bounds.y.max),
}

let direction;
let switch_dir;

document.addEventListener('keydown', (e) => {
    if (!switch_dir) {
        if (e.key === 'ArrowLeft' && direction !== 'right')
            direction = 'left'
        else if (e.key === 'ArrowUp' && direction !== 'down')
            direction = 'up'
        else if (e.key === 'ArrowRight' && direction !== 'left')
            direction = 'right'
        else if (e.key === 'ArrowDown' && direction !== 'up')
            direction = 'down';

        if (!game.isStart && ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].indexOf(e.key) !== -1) {
            startGame()
        }

    }
    switch_dir = true;
});

document.getElementById('start').onclick = () => {
    if (!game.isStart) {
        startGame()
    }
}

document.addEventListener('keydown', (e) => {
    if (["Escape", " ", "Enter"].indexOf(e.key) !== -1) {
        if (!game.isStart) {
            startGame()
        }
    }
})

function checkBorders(x, y) {
    let res = false;
    snake.body.forEach((coords) => {
        if (coords.x === x && coords.y === y) {
            res = true;
            return null;
        }
    });


    if (x > bounds.x.max || x < bounds.x.min || y > bounds.y.max || y < bounds.y.min) {
        res = true;
    }

    return res;
}

function switchFoodCoords() {
    let x;
    let y;
    do {
        x = randomInteger(bounds.x.min, bounds.x.max);
        y = randomInteger(bounds.y.min, bounds.y.max);
    } while (checkBorders(x, y));

    food.x = x;
    food.y = y;
}

function startGame() {
    document.getElementById("menu").style.display = 'none';
    game.isStart = true;
    game.score = 0;

    document.getElementById('score').innerText = game.score;

    snake = {
        x: 2,
        y: 5,
        body: [
            {
                x: 2,
                y: 5,
            },
        ]
    };

    direction = "right";
    switch_dir = false;

    move_interval = setInterval(move, 100);

    drawGame();
}

function stopGame() {
    game.isStart = false;
    document.getElementById("menu").style.display = 'flex';
    clearInterval(move_interval);
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);

    let color = "#ffa2aa";
    snake.body.forEach((coords, i) => {
        if (i % 3 === 0 && i !== 0) {
            color = color === "#d33333" ? "#f8e8ec" : "#d33333"
        }
        if (i === 1) {
            color = "#f8e8ec"
        }
        ctx.fillStyle = color;
        ctx.fillRect(box * coords.x + 2, box * coords.y + 2, 46, 46);
    })

    ctx.drawImage(appleImage, food.x * box, food.y * box, box, box);

    if (game.isStart || !game.isPause) {
        requestAnimationFrame(drawGame);
    }
}
background.onload = () => {
    drawGame();
}

function addScore() {
    game.score++;
    game.bestScore = Math.max(game.score, game.bestScore);
    document.getElementById('score').innerText = game.score;
    document.getElementById('bestScore').innerText = game.bestScore;
}

function move() {
    switch (direction) {
        case 'right': snake.x += 1; break;
        case 'left': snake.x -= 1; break;
        case 'up': snake.y -= 1; break;
        case 'down': snake.y += 1; break;
    }

    let newHead = {
        x: snake.x,
        y: snake.y,
    };

    if (checkBorders(newHead.x, newHead.y)) {
        stopGame();
        return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
        switchFoodCoords();
        addScore();
    } else {
        snake.body.pop();
    }

    snake.body.unshift(newHead);

    switch_dir = false;
}