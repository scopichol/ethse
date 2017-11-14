const Reverter = require('./helpers/reverter');
const Asserts = require('./helpers/asserts');
const TicTacToe = artifacts.require('./TicTacToe.sol');

contract('TicTacToe', function(accounts) {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  const asserts = Asserts(assert);
  const OWNER = accounts[0];
  const nullAddr = '0x0000000000000000000000000000000000000000';
  let tictactoe;
  var fs=require('fs');
  var data=fs.readFileSync('oxotestdata_r.json');
  const matchList = JSON.parse(data);

  before('setup', () => {
    return TicTacToe.deployed()
    .then(instance => tictactoe = instance)
    .then(reverter.snapshot);
  });

  it('should initialy to get empty game', () => {
    const player1 = accounts[3];
    return Promise.resolve()
    .then(() => tictactoe.getGame({from: player1}))
    .then(result => assert.equal(result[0],nullAddr))
  });
  
  it('should player1 on startGame', () => {
    const player1 = accounts[3];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.getGame({from: player1}))
    .then(result => assert.equal(result[0],player1));
  });
  
  it('should emit StartGame event on startGame', () => {
    const player1 = accounts[3];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(result => {
      assert.equal(result.logs.length, 1);
      assert.equal(result.logs[0].event, 'StartGame');
      assert.equal(result.logs[0].args.player, player1);
      assert.equal(result.logs[0].args.bet.valueOf(), value);
    });
  });

  it('should fail if game already started on startGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => asserts.throws(tictactoe.startGame({from: player1, value: value})))
    .then(() => asserts.throws(tictactoe.startGame({from: player2, value: value})));
  });
  
  it('should player2 is Null on startGame', () => {
    const player1 = accounts[3];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.getGame({from: player1}))
    .then(result => assert.equal(result[1],nullAddr));
  });
  
  it('should currentPlayer is Null on startGame', () => {
    const player1 = accounts[3];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.getGame({from: player1}))
    .then(result => assert.equal(result[3],nullAddr));
  });

  it('should bet is value on startGame', () => {
    const player1 = accounts[3];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.getGame({from: player1}))
    .then(result => assert.equal(result[2],value));
  });

  it('should player2 on joinGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => tictactoe.getGame({from: player2}))
    .then(result => assert.equal(result[1],player2));
  });
  
  it('should emit JoinGame event on joinGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(result => {
      assert.equal(result.logs.length, 1);
      assert.equal(result.logs[0].event, 'JoinGame');
      assert.equal(result.logs[0].args.player, player2);
      assert.equal(result.logs[0].args.bet.valueOf(), value);
    });
  });
  
  it('should currentPlayer is player1 on joinGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => tictactoe.getGame({from: player1}))
    .then(result => assert.equal(result[3],player1))
    .then(() => tictactoe.getGame({from: player2}))
    .then(result => assert.equal(result[3],player1));
  });
  
  it('should fail if player1 on joinGame', () => {
    const player1 = accounts[3];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => asserts.throws(tictactoe.joinGame({from: player1, value: value})));
  });

  it('should fail when join twice on joinGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => asserts.throws(tictactoe.joinGame({from: player2, value: value})));
  });
  
  it('should fail when join player3 on joinGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const player3 = accounts[5];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => asserts.throws(tictactoe.joinGame({from: player3, value: value})));
  });

  it('should fail when join value less than value startGame on joinGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => asserts.throws(tictactoe.joinGame({from: player2, value: value-1})));
  });

  it('should bet is equal of sum values on joinGame', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value*2}))
    .then(() => tictactoe.getGame({from: player1}))
    .then(result => assert.equal(result[2],value*3))
    .then(() => tictactoe.getGame({from: player2}))
    .then(result => assert.equal(result[2],value*3));
  });

  it('should value row and col between 0 and 2 on setMove', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => asserts.throws(tictactoe.setMove(3,0,{from: player1})))
    .then(() => asserts.throws(tictactoe.setMove(30,0,{from: player1})))
    .then(() => asserts.throws(tictactoe.setMove(0,3,{from: player1})))
    .then(() => asserts.throws(tictactoe.setMove(0,30,{from: player1})))
    .then(() => tictactoe.setMove(2,2,{from: player1}))
  });
  
  it('should be correct player switch on setMove', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => asserts.throws(tictactoe.setMove(0,0,{from: player2})))
    .then(() => tictactoe.setMove(0,0,{from: player1}))
    .then(() => asserts.throws(tictactoe.setMove(1,0,{from: player1})))
    .then(() => tictactoe.setMove(1,0,{from: player2}))
    .then(() => asserts.throws(tictactoe.setMove(2,0,{from: player2})));
  });

  it('should emit SetMove event on setMove', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => tictactoe.setMove(0,2,{from: player1}))
    .then(result => {
      assert.equal(result.logs.length, 1);
      assert.equal(result.logs[0].event, 'SetMove');
      assert.equal(result.logs[0].args.player, player1);
      assert.equal(result.logs[0].args.row.valueOf(), 0);
      assert.equal(result.logs[0].args.col.valueOf(), 2);
      assert.equal(result.logs[0].args.sign.valueOf(), 'X')
    })
    .then(() => tictactoe.setMove(1,0,{from: player2}))
    .then(result => {
      assert.equal(result.logs.length, 1);
      assert.equal(result.logs[0].event, 'SetMove');
      assert.equal(result.logs[0].args.player, player2);
      assert.equal(result.logs[0].args.row.valueOf(), 1);
      assert.equal(result.logs[0].args.col.valueOf(), 0);
      assert.equal(result.logs[0].args.sign.valueOf(), '0');
    });
  });

  it('should free cell on setMove', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 10;
    return Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}))
    .then(() => tictactoe.setMove(0,0,{from: player1}))
    .then(() => asserts.throws(tictactoe.setMove(0,0,{from: player2})))
    .then(() => tictactoe.setMove(1,0,{from: player2}))
    .then(() => asserts.throws(tictactoe.setMove(0,0,{from: player1})));
  });
  
  it('should have clear game after end of match', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 1;
    
    const matchStr = '[[[1,1,"X"],[2,2,"O"],[1,0,"X"],[0,1,"O"],[2,0,"X"],[2,1,"O"],[0,0,"X"]],"X"]';
    const match = JSON.parse(matchStr);
    
    let promise = Promise.resolve()
    .then(() => tictactoe.startGame({from: player1, value: value}))
    .then(() => tictactoe.joinGame({from: player2, value: value}));
    var currentPlayer = player1;
    match[0].forEach((entry,idx,arr) => {
        if (idx < arr.length-1) {
            promise = promise.then(() => tictactoe.setMove(entry[0],entry[1],{from: currentPlayer}))
                .then(() => {
                    if (currentPlayer == player1) {
                        currentPlayer = player2;
                    } else {
                        currentPlayer = player1;
                    }          
                });
        } else {
            promise = promise.then(() => tictactoe.setMove(entry[0],entry[1],{from: currentPlayer}))
                .then(result => {
                    assert.equal(result.logs.length, 2);
                    assert.equal(result.logs[1].event, 'WinGame');
                    assert.equal(result.logs[1].args.sign.valueOf(), match[1]);
                    assert.equal(result.logs[1].args.prise.valueOf(), value*2);
                })
                .then(() => tictactoe.getGame({from: player1}))
                .then(result => {
                    assert.equal(result[1],nullAddr,"player1");
                    assert.equal(result[2].valueOf(),0,"bet");
                    assert.equal(result[3],nullAddr,"currentPlayer");
                    assert.equal(result[0],nullAddr,"player1");
                });
        }
    });

    return promise;
  });


  it.only('should have correct result for match', () => {
    const player1 = accounts[3];
    const player2 = accounts[4];
    const value = 1;
    
    console.log(web3.eth.getBalance(accounts[5]));      
    const matchStr = '[[[1,1,"X"],[2,2,"O"],[1,0,"X"],[0,1,"O"],[2,0,"X"],[2,1,"O"],[0,0,"X"]],"X"]';
    const match = JSON.parse(matchStr);
    
    matchList.forEach(match1 => {
        console.log(match);
        console.log(match1);
        let promise = Promise.resolve()
        .then(() => tictactoe.startGame({from: player1, value: value}))
        .then(() => tictactoe.joinGame({from: player2, value: value}))
        .then(() => console.log("New GAme"));
        var currentPlayer = player1;
        match[0].forEach((entry,idx,arr) => {
            if (idx == arr.length-1) {
                promise = promise.then(() => tictactoe.setMove(entry[0],entry[1],{from: currentPlayer}))
                    .then(result => {
                        assert.equal(result.logs.length, 2);
                        assert.equal(result.logs[1].event, 'WinGame');
                        assert.equal(result.logs[1].args.sign.valueOf(), match[1]);
                        assert.equal(result.logs[1].args.prise.valueOf(), value*2);
                    });
            } else {
                promise = promise.then(() => tictactoe.setMove(entry[0],entry[1],{from: currentPlayer}))
                    .then(() => {
                        if (currentPlayer == player1) {
                            currentPlayer = player2;
                        } else {
                            currentPlayer = player1;
                        }          
                    });
            }
        });
    
        return promise;
    });
  });
  
});
