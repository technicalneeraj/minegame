document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    const flagLeft = document.getElementById("flagsLeft");
    const result = document.getElementById("result");
    const width = 10; // Grid width
    const totalSquares = width * width; // Total number of squares
    const bombCount = 20;
    let squares = [];
    let isGameOver = false;
    let flags = 0;

    function createBoard() {
        flagLeft.innerHTML = bombCount;
        const bombArray = Array(bombCount).fill("bomb");
        const emptyArray = Array(totalSquares - bombCount).fill("valid");
        const gameArray = bombArray.concat(emptyArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < totalSquares; i++) {
            const square = document.createElement("div");
            square.id = i;
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener("click", () => click(square));
            square.addEventListener("contextmenu", (e) => {
                e.preventDefault(); // Prevent default right-click menu
                addFlag(square);
            });
        }

        // Calculate the number of adjacent bombs for each valid square
        for (let i = 0; i < totalSquares; i++) {
            let total = 0;
            let isLeftEdge = (i % width === 0); // Check if square is on the left edge
            let isRightEdge = (i % width === width - 1); // Check if square is on the right edge

            if (squares[i].classList.contains("valid")) {
                // Check all adjacent squares
                // Left
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
                // Right
                if (i < totalSquares - 1 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
                // Above
                if (i >= width && squares[i - width].classList.contains("bomb")) total++;
                // Below
                if (i < totalSquares - width && squares[i + width].classList.contains("bomb")) total++;
                // Above-Left
                if (i >= width && !isLeftEdge && squares[i - width - 1].classList.contains("bomb")) total++;
                // Above-Right
                if (i >= width && !isRightEdge && squares[i - width + 1].classList.contains("bomb")) total++;
                // Below-Left
                if (i < totalSquares - width && !isLeftEdge && squares[i + width - 1].classList.contains("bomb")) total++;
                // Below-Right
                if (i < totalSquares - width && !isRightEdge && squares[i + width + 1].classList.contains("bomb")) total++;

                squares[i].setAttribute("data-bombs", total);
            }
        }
    }
    createBoard();

    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains("checked") && flags < bombCount) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag");
                flags++;
                square.innerHTML = "🚩";
                flagLeft.innerHTML = bombCount - flags;
                checkWin();
            } else {
                square.classList.remove("flag");
                flags--;
                square.innerHTML = "";
                flagLeft.innerHTML = bombCount - flags;
            }
        }
    }

    function checkWin() {
        let matches = 0;
        for (let i = 0; i < totalSquares; i++) {
            if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
                matches++;
            }
        }
        if (matches === bombCount) {
            result.innerHTML = "You Win!!";
            isGameOver = true;
        }
    }

    function click(square) {
        if (isGameOver) return;
        if (square.classList.contains("checked") || square.classList.contains("flag")) return;

        if (square.classList.contains("bomb")) {
            gameOver();
        } else {
            let total = square.getAttribute("data-bombs");
            if (total != 0) {
                square.classList.add(`number-${total}`);
                square.innerHTML = total;
            } else {
                square.classList.add("checked");
                checkSquare(square);
            }
        }
        square.classList.add("checked");
    }

    function checkSquare(square) {
        const currentId = parseInt(square.id, 10);
        const isLeftEdge = (currentId % width === 0); // Check if square is on the left edge
        const isRightEdge = (currentId % width === width - 1); // Check if square is on the right edge

        // Check all adjacent squares
        // Left
        if (currentId > 0 && !isLeftEdge) click(squares[currentId - 1]);
        // Right
        if (currentId < totalSquares - 1 && !isRightEdge) click(squares[currentId + 1]);
        // Above
        if (currentId >= width) click(squares[currentId - width]);
        // Below
        if (currentId < totalSquares - width) click(squares[currentId + width]);
        // Above-Left
        if (currentId >= width && !isLeftEdge) click(squares[currentId - width - 1]);
        // Above-Right
        if (currentId >= width && !isRightEdge) click(squares[currentId - width + 1]);
        // Below-Left
        if (currentId < totalSquares - width && !isLeftEdge) click(squares[currentId + width - 1]);
        // Below-Right
        if (currentId < totalSquares - width && !isRightEdge) click(squares[currentId + width + 1]);
    }

    function gameOver() {
        result.innerHTML = "Boom!! Game Over";
        isGameOver = true;

        squares.forEach(square => {
            if (square.classList.contains("bomb")) {
                square.innerHTML = "💣";
                square.classList.remove("bomb");
                square.classList.add("checked");
            }
        });
    }
});
