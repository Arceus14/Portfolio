
"""
Tic Tac Toe Player
"""

import math, copy, random

X = "X"
O = "O"
EMPTY = None

class InvalidActionException(Exception):
    def __init__(self, msg):
        self.msg = msg

    def __str__(self):
        print("InvalidActionException: ", self.msg)

def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]

#turn(False) =  X, turn(True) = O

def player(board):
    global turn
    """
    Returns player who has the next turn on a board.
    """
    x = 0
    o = 0
    for i in range(3):
        for j in range(3):
            if board[i][j] == X:
                x += 1
            elif board[i][j] == O:
                o += 1
    if x - o == 0:
        return X
    elif x - o == 1:
        return O
    elif x - o == -1:
        return X
    

    # raise NotImplementedError


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    #no actions for terminal board
    if terminal(board):
        return set()
    
    else:
        free_cells = set()
        for i in range(3):
            for j in range(3):
                if  board[i][j] == None:
                    free_cells.add((i, j))
        return free_cells

    # raise NotImplementedError


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """
    dc_board = copy.deepcopy(board)
    
    action_cell = dc_board[action[0]][action[1]]
    if action_cell is not None:
        raise InvalidActionException("The cell is not empty")
    else:
        dc_board[action[0]][action[1]] = player(board)
        return dc_board
    # raise NotImplementedError


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """
    #check rows
    for i in range(3):
        if board[i] == [X, X, X]:
            return X
        elif board[i] == [O, O, O]:
            return O
        
    #check columns
    for j in range(3):
        if [ board[0][j],  board[1][j], board[2][j] ] == [X, X, X]:
            return X
        elif [ board[0][j],  board[1][j], board[2][j] ] == [O, O, O]:
            return O

    #check diagonals
    d1 = [ board[0][0],  board[1][1],  board[2][2]]
    d2 = [ board[0][2],  board[1][1],  board[2][0]]

    if [X, X, X] in [d1, d2]:
        return X
    elif [O, O, O] in [d1, d2] :
        return O
    
    else:
        return None


def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    #check winner
    win = winner(board)
    if win in [X, O]:
        return True
    
    #check ongoing
    for i in range(3):
        for j in range(3):
            if board[i][j] is None:
                return False
    #check draw
    return True

def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    win = winner(board)

    if win == X:
        return 1
    elif win == O:
        return -1
    else:
        return 0

def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    if board == initial_state():
        i = random.randint(0,2)
        j = random.randint(0,2)
        return tuple((i, j))
    elif terminal(board):
        return None

    play = player(board)
    lst = list(actions(board))
    min = lst[0]
    max = lst[0]
    for action in lst:
        if minimax_helper(result(board, action)) == minimax_helper(board):
            return action
    

    if play == O:
        return min
    elif play == X:
        return max
    #print visited nodes
    # print("Visited terminal nodes")
    # count = 1
    # for each in visited:
    #     if each.terminal:
    #         print(count,end='\n')
    #         print("Utility: ", each.utility) 
    #         print("Siblings: ", each.siblings)
    #         count += 1
            
    #         for i in range(3):
    #             for j in range(3):
    #                 if each.state[i][j] ==  X:
    #                     print("X ", end='')
    #                 elif each.state[i][j] == O:
    #                     print("O ", end='')
    #                 else:
    #                     print("  ", end= '')
    #             print()
    #         print("\n")
        



def minimax_helper(board):
    Board = copy.deepcopy(board)
    if terminal(Board):
        return utility(Board)
    Player  = player(Board)

    if Player == X:
        MAX = -10000
        for action in actions(Board):        
            child = result(Board, action)
            eval = minimax_helper(child)
            max_eval = max(MAX, eval)
            MAX = max_eval
        return max_eval

    elif Player == O:
        MIN = 10000
        for action in actions(Board):
            child = result(Board, action)
            eval = minimax_helper(child)
            min_eval = min(eval, MIN)
            MIN = min_eval
        return min_eval
