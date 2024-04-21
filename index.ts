#! /usr/bin/env node 
import inquirer from 'inquirer';
import chalk from 'chalk';

type Player = 'X' | 'O';
type Cell = Player | ' ';
type Board = Cell[][];

interface Move {
  row: number;
  col: number;
}

class TicTacToe {
  private currentPlayer: Player = 'X';
  private board: Board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
  ];

  public async play() {
    let currentPlayer: Player = 'X';
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
        } else {
          console.log(chalk.gray.bold('It\'s a draw!'));
        }
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  }
  

  private async displayBoard() {
    console.clear();
    console.log(chalk.blue.bold('Tic Tac Toe\n'));
    this.board.forEach(row => console.log(row.join(' | ')));
    console.log('\n');
  }

  private async promptMove(currentPlayer: Player): Promise<Move> {
    console.log(chalk.yellow.bold(`Player ${currentPlayer}, it's your turn:`));
    
    while (true) {
      const { row } = await inquirer.prompt({
        type: 'number',
        name: 'row',
        message: 'Enter row (1-3):',
        validate: (input: number) => {
          if (input >= 1 && input <= 3) {
            return true;
          } else {
            console.log(chalk.red.bold('Invalid row! Please enter a row between 1 and 3.'));
            return false;
          }
        }
      });
  
      const { col } = await inquirer.prompt({
        type: 'number',
        name: 'col',
        message: 'Enter column (1-3):',
        validate: (input: number) => {
          if (input >= 1 && input <= 3) {
            return true;
          } else {
            console.log(chalk.red.bold('Invalid column! Please enter a column between 1 and 3.'));
            return false;
          }
        }
      });
  
      const move: Move = { row: row - 1, col: col - 1 };
  
      if (this.isValidMove(move)) {
        return move;
      } else {
        console.log(chalk.red.bold('This cell is already occupied! Please choose another cell.'));
      }
    }
  }
  
  
  

  private async makeMove(move: Move, currentPlayer: Player) {
    const { row, col } = move;
    if (this.isValidMove(move)) {
      this.board[row][col] = currentPlayer;
    } else {
      console.log(chalk.red.bold('Invalid move! Try again.'));
      const newMove = await this.promptMove(currentPlayer);
      await this.makeMove(newMove, currentPlayer);
    }
  }
  
    

  private isValidMove(move: Move): boolean {
    const { row, col } = move;
    return this.board[row][col] === ' ';
  }

  private switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  private isGameOver(): boolean {
    return this.getWinner() !== null || this.isBoardFull();
  }

  private isBoardFull(): boolean {
    return this.board.every(row => row.every(cell => cell !== ' '));
  }

  private getWinner(): Player | null {
    const lines: Move[][] = [
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
      if (
        this.board[a.row][a.col] !== ' ' &&
        this.board[a.row][a.col] === this.board[b.row][b.col] &&
        this.board[a.row][a.col] === this.board[c.row][c.col]
      ) {
        return this.board[a.row][a.col] as Player;
      }
    }

    return null;
  }
}

(async () => {
  const game = new TicTacToe();
  await game.play();
})();
