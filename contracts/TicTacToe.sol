pragma solidity ^0.4.15;

contract Tictactoe {
    
    struct Game {
        mapping(uint8=>mapping(uint8 => int8)) cells;
        address player1;
        address player2;
        uint bet;
        uint bet2;
        address currentPlayer;
        uint8 moveCount;
    }
 
    event StartGame(address indexed player, uint bet);
    event JoinGame(address indexed player, uint bet);
    event SetMove(address indexed player, uint row, uint col, string sign);
    event WinGame(address indexed player, uint prise, string sign);
    event DrawGame();
    event Error(string errstr);

    uint public fee;

    Game game;
    
    function Tictactoe(uint _fee) public {
        fee = _fee;
    }
    
    function startGame() public payable {
        if (game.player1 != address(0)) {
            Error('StartGame player1 not empty');
        }
        require(game.player1 == address(0));
        game.player1 = msg.sender;
        game.bet = msg.value;
        StartGame(msg.sender, msg.value);
    }

    function joinGame() public payable {
        if (game.player1 == address(0)) {
            Error('JoinGame player1 is empty');
        }
        require(game.player1 != address(0));

        if (game.player2 != address(0)) {
            Error('JoinGame player2 not empty');
        }
        require(game.player2 == address(0));

        if (game.player1 == msg.sender) {
            Error('JoinGame player1 is starter game');
        }
        require(game.player1 != msg.sender);

        if (game.bet > msg.value) {
            Error('StartGame bet less than bet of player1');
        }
        require(game.bet <= msg.value);

        game.player2 = msg.sender;
        game.currentPlayer = game.player1;
        game.bet += msg.value;
        game.bet2 = msg.value;
        JoinGame(msg.sender, msg.value);
    }
    
    function getGame() public constant returns(address,address,uint,address) {
        if (msg.sender == game.player1 || msg.sender == game.player2) {
            return (game.player1,game.player2,game.bet,game.currentPlayer);
        }
        return ;
    }
     
            //return (game.player1, game.player2, game.bet, game.currentPlayer);
    
    function getCell(uint8 row, uint8 col) public constant returns(int8){
        return game.cells[row][col];
    }
    
    
    function setMove(uint8 _row, uint8 _col) public {
        if (game.currentPlayer == address(0)) {
            Error('JoinGame currentPlayer is null');
            return;
        }
        require(game.currentPlayer != address(0));
        
        if (game.currentPlayer != msg.sender) {
            Error('JoinGame currentPlayer is not self move');
            return;
        }
        require(game.currentPlayer == msg.sender);
        
        if (_row>2 || _col>2) {
            Error('JoinGame wrong cell');
            return;
        }
        require(_row<=2 && _col<=2);
        
        if (game.cells[_row][_col]!=0) {
            Error('JoinGame is not empty cell');
            return;
        }
        require(game.cells[_row][_col]==0);

        if (msg.sender == game.player1) {
            game.cells[_row][_col] = 1;
            game.currentPlayer = game.player2;
            SetMove(msg.sender, _row, _col, 'X');
        } else {
            game.cells[_row][_col] = -1;
            game.currentPlayer = game.player1;
            SetMove(msg.sender, _row, _col, 'O');
        } 

        int8 probe = testRow(_row);
        if ( probe != 0 ) {
            gameOver(probe);
            return;
        }
        probe = testCol(_col);
        if ( probe != 0 ) {
            gameOver(probe);
            return;
        }
        if ( _row == _col || _row == 2-_col) {
            probe = testDiag();
            if ( probe != 0 ) {
                gameOver(probe);
                return;
            }
        }

        game.moveCount += 1;
        if (game.moveCount == 9) {
            gameOver(0);
        }
    }
    
    function gameOver(int8 result) public {
        if (result == 0) {
            game.player1.transfer(game.bet - game.bet2);
            game.player2.transfer(game.bet2);
            DrawGame();
        } else if (result == 1) {
            game.player1.transfer(game.bet);
            WinGame(game.player1, game.bet, "X");
        } else if (result == -1) {
            game.player2.transfer(game.bet);
            WinGame(game.player2, game.bet, "O");
        }
        Game memory emptyGame;
        game = emptyGame;
        for (uint8 i =0;i<3;i++) {
            for(uint8 j=0;j<3;j++){
                game.cells[i][j] = 0;
            }
        }
    }

    function testRow(uint8 _row) public constant returns(int8) {
        int8 rowSum = game.cells[_row][0] + game.cells[_row][1] + game.cells[_row][2];

        if ( rowSum == -3 ) {
            return -1;
        }
        if ( rowSum == 3 ) {
            return 1;
        }
        return 0;
    }
    
    function testCol(uint8 _col) public constant returns(int8) {
        int8 colSum = game.cells[0][_col] + game.cells[1][_col] + game.cells[2][_col];

        if ( colSum == -3 ) {
            return -1;
        }
        if ( colSum == 3 ) {
            return 1;
        }
        return 0;
    }
    
    function testDiag() public constant returns(int8) {
        int8 diagSum = game.cells[0][0] + game.cells[1][1] + game.cells[2][2];

        if ( diagSum == -3 ) {
            return -1;
        }
        if ( diagSum == 3 ) {
            return 1;
        }

        diagSum = game.cells[2][0] + game.cells[1][1] + game.cells[0][2];

        if ( diagSum == -3 ) {
            return -1;
        }
        if ( diagSum == 3 ) {
            return 1;
        }
        return 0;
    }
    
}