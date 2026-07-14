from tictactoe import *
x = 'X'
o = 'O'
n = None
board =     [[x, o, n],
            [x, n, n],
            [n, n, n]]

def test_minimax():
    minimax(board)
    # print(utility(board))
    # print(terminal(board))
test_minimax()