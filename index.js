#! /usr/bin/env node 
import inquirer from 'inquirer';
import chalk from 'chalk';
class TicTacToe {
    currentPlayer = 'X';
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    async play() {
        let currentPlayer = 'X';
        while (!this.isGameOver()) {
            await this.displayBoard();
            const move = await this.promptMove(currentPlayer);
            this.makeMove(move, currentPlayer);
            if (this.isGameOver()) {
                await this.displayBoard();
                console.log(chalk.yellow.bold('Game Over!'));
                const winner = this.getWinner();
                if (winner) {
                    console.log(chalk.green.bold(`Player ${winner} wins!`));
                }
                else {
                    console.log(chalk.gray.bold('It\'s a draw!'));
                }
            }
            else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }
    async displayBoard() {
        console.clear();
        console.log(chalk.blue.bold('Tic Tac Toe\n'));
        this.board.forEach(row => console.log(row.join(' | ')));
        console.log('\n');
    }
    async promptMove(currentPlayer) {
        console.log(chalk.yellow.bold(`Player ${currentPlayer}, it's your turn:`));
        while (true) {
            const { row } = await inquirer.prompt({
                type: 'number',
                name: 'row',
                message: 'Enter row (1-3):',
                validate: (input) => {
                    if (input >= 1 && input <= 3) {
                        return true;
                    }
                    else {
                        console.log(chalk.red.bold('Invalid row! Please enter a row between 1 and 3.'));
                        return false;
                    }
                }
            });
            const { col } = await inquirer.prompt({
                type: 'number',
                name: 'col',
                message: 'Enter column (1-3):',
                validate: (input) => {
                    if (input >= 1 && input <= 3) {
                        return true;
                    }
                    else {
                        console.log(chalk.red.bold('Invalid column! Please enter a column between 1 and 3.'));
                        return false;
                    }
                }
            });
            const move = { row: row - 1, col: col - 1 };
            if (this.isValidMove(move)) {
                return move;
            }
            else {
                console.log(chalk.red.bold('This cell is already occupied! Please choose another cell.'));
            }
        }
    }
    async makeMove(move, currentPlayer) {
        const { row, col } = move;
        if (this.isValidMove(move)) {
            this.board[row][col] = currentPlayer;
        }
        else {
            console.log(chalk.red.bold('Invalid move! Try again.'));
            const newMove = await this.promptMove(currentPlayer);
            await this.makeMove(newMove, currentPlayer);
        }
    }
    isValidMove(move) {
        const { row, col } = move;
        return this.board[row][col] === ' ';
    }
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
    isGameOver() {
        return this.getWinner() !== null || this.isBoardFull();
    }
    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== ' '));
    }
    getWinner() {
        const lines = [
            // Rows
            [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
            [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
            [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
            // Columns
            [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
            [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
            [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
            // Diagonals
            [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
            [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]
        ];
        for (const line of lines) {
            const [a, b, c] = line;
            if (this.board[a.row][a.col] !== ' ' &&
                this.board[a.row][a.col] === this.board[b.row][b.col] &&
                this.board[a.row][a.col] === this.board[c.row][c.col]) {
                return this.board[a.row][a.col];
            }
        }
        return null;
    }
}
(async () => {
    const game = new TicTacToe();
    await game.play();
})();
