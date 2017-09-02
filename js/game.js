var canvas, ctx, players, total = 200;

window.onload = function () {
    initEnv(); //初始化环境
    initMoney(); //初始化筹码
    var poker = GameProxy.initPoker(); //生成牌
    poker = GameProxy.shufflePoker(); //洗牌
    players = GameProxy.createPlayers(); //生成2个玩家
    players = GameProxy.dealPoker(poker, players); //发牌
    play();
}

function drawPlayerZmInit() {
    ctx.drawPokerBack(800, 10, 150, '#7A7BB8', '#2E319C');
    ctx.drawPokerBack(600, 10, 150, '#7A7BB8', '#2E319C');
    ctx.drawPokerBack(400, 10, 150, '#7A7BB8', '#2E319C');
    var headPortrait_p1 = new Image();
    headPortrait_p1.src = '../images/zm.jpg';
    headPortrait_p1.height = 50;
    headPortrait_p1.onload = function () {
        ctx.drawImage(headPortrait_p1, 10, 10, 150, 200);
    }
    ctx.fillStyle = '#519fff';
    ctx.strokeStyle = '#ff626c';
    ctx.fillRect(10, 210, 150, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("筹 码：" + localStorage.getItem("zm"), 18, 234);
}
function drawPlayerMeInit() {
    var headPortrait_p2 = new Image();
    headPortrait_p2.src = '../images/head.jpg';
    headPortrait_p2.height = 50;
    headPortrait_p2.onload = function () {
        ctx.drawImage(headPortrait_p2, 10, 558, 150, 200);
    };
    ctx.drawPokerBack(800, 558, 150, '#7A7BB8', '#2E319C');
    ctx.drawPokerBack(600, 558, 150, '#7A7BB8', '#2E319C');
    ctx.drawPokerBack(400, 558, 150, '#7A7BB8', '#2E319C');
    ctx.fillStyle = '#519fff';
    ctx.strokeStyle = '#ff626c';
    ctx.fillRect(10, 528, 150, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("筹 码：" + localStorage.getItem("me"), 18, 553);
}

function drawMybtn() {
    ctx.fillStyle = '#b064ff';
    ctx.strokeStyle = '#ff626c';
    ctx.fillRect(180, 558, 100, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("看 牌", 200, 580);

    ctx.fillStyle = '#b064ff';
    ctx.fillRect(180, 600, 100, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("比 牌", 200, 622);

    ctx.fillStyle = '#b064ff';
    ctx.fillRect(180, 642, 100, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("加 注", 200, 664);
}

function drawCenter() {
    ctx.fillStyle = '#ff6ffb';
    ctx.strokeStyle = '#ff626c';
    ctx.fillRect(387, 360, 250, 50);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("押注筹码：" + total, 437, 395);
}

function initEnv() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    ctx.font = "20px 楷体";

    drawPlayerZmInit();
    drawPlayerMeInit();
    drawCenter();
    drawMybtn();

    canvas.addEventListener("click", clickCanvas, false);

    canvas.onmousemove = function () {
        this.style.cursor = 'pointer'
    };

}
function play() {
    localStorage.setItem("zm", localStorage.getItem("zm") - 100);
    localStorage.setItem("me", localStorage.getItem("me") - 100);
}

function redrawBtn() {
    ctx.clearRect(10, 210, 150, 30);
    ctx.fillStyle = '#519fff';
    ctx.strokeStyle = '#ff626c';
    ctx.fillRect(10, 210, 150, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("筹 码：" + localStorage.getItem("zm"), 18, 234);

    ctx.clearRect(10, 528, 150, 30);
    ctx.fillStyle = '#519fff';
    ctx.strokeStyle = '#ff626c';
    ctx.fillRect(10, 528, 150, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("筹 码：" + localStorage.getItem("me"), 18, 553);

    ctx.clearRect(387, 360, 250, 50);
    ctx.fillStyle = '#ff6ffb';
    ctx.strokeStyle = '#ff626c';
    ctx.fillRect(387, 360, 250, 50);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("押注筹码：" + total, 437, 395);
}
function clickCanvas() {
    var x = event.pageX - canvas.getBoundingClientRect().left;
    var y = event.pageY;
    console.log(x + ":" + y);
    ctx.beginPath();
    ctx.rect(180, 558, 100, 30);
    if (ctx.isPointInPath(x, y)) {
        ctx.fillStyle = '#ffa81c';
        ctx.strokeStyle = '#ff626c';
        ctx.fillRect(180, 558, 100, 30);
        ctx.fillStyle = '#EEEEEE';
        ctx.fillText("看 牌", 200, 580);
        ctx.drawPokerCard(800, 558, 150, getFlowerValueByInt(players[1].cards[0].flower)
            , getFaceValueByInt(players[1].cards[0].face));
        ctx.drawPokerCard(600, 558, 150, getFlowerValueByInt(players[1].cards[1].flower)
            , getFaceValueByInt(players[1].cards[1].face));
        ctx.drawPokerCard(400, 558, 150, getFlowerValueByInt(players[1].cards[2].flower)
            , getFaceValueByInt(players[1].cards[2].face));
    }
    ctx.closePath()

    ctx.beginPath();
    ctx.rect(180, 600, 100, 30);
    if (ctx.isPointInPath(x, y)) {
        if (total <= 200) {
            alert("不能直接比牌");
            return;
        }

        ctx.fillStyle = '#ffa81c';
        ctx.fillRect(180, 600, 100, 30);
        ctx.fillStyle = '#EEEEEE';
        ctx.fillText("比 牌", 200, 622);
        ctx.drawPokerCard(800, 10, 150, getFlowerValueByInt(players[0].cards[0].flower)
            , getFaceValueByInt(players[0].cards[0].face));
        ctx.drawPokerCard(600, 10, 150, getFlowerValueByInt(players[0].cards[1].flower)
            , getFaceValueByInt(players[0].cards[1].face));
        ctx.drawPokerCard(400, 10, 150, getFlowerValueByInt(players[0].cards[2].flower)
            , getFaceValueByInt(players[0].cards[2].face));

        ctx.drawPokerCard(800, 558, 150, getFlowerValueByInt(players[1].cards[0].flower)
            , getFaceValueByInt(players[1].cards[0].face));
        ctx.drawPokerCard(600, 558, 150, getFlowerValueByInt(players[1].cards[1].flower)
            , getFaceValueByInt(players[1].cards[1].face));
        ctx.drawPokerCard(400, 558, 150, getFlowerValueByInt(players[1].cards[2].flower)
            , getFaceValueByInt(players[1].cards[2].face));

        var result = compare(players[1], players[0]);
        if (result) {
            ctx.clearRect(387, 360, 250, 50);
            ctx.fillStyle = '#ff6ffb';
            ctx.strokeStyle = '#ff626c';
            ctx.fillRect(387, 360, 450, 50);
            ctx.fillStyle = '#EEEEEE';
            ctx.fillText("you win!!恭喜你，击败了辣鸡掌门", 437, 395);
            localStorage.setItem("me", parseInt(localStorage.getItem("me")) + total);
        } else {
            ctx.clearRect(387, 360, 250, 50);
            ctx.fillStyle = '#ff6ffb';
            ctx.strokeStyle = '#ff626c';
            ctx.fillRect(387, 360, 450, 50);
            ctx.fillStyle = '#EEEEEE';
            ctx.fillText("you lose!!很遗憾，再接再厉", 437, 395);
            localStorage.setItem("zm", parseInt(localStorage.getItem("zm")) + total);
        }
    }
    ctx.closePath()
    ctx.beginPath();
    ctx.rect(180, 642, 100, 30);
    if (ctx.isPointInPath(x, y)) {//加注
        console.log("加注");
        if (localStorage.getItem("me") < 100 || localStorage.getItem("zm") < 100) {
            alert("呀！没钱了。。")
            return;
        }
        localStorage.setItem("me", localStorage.getItem("me") - 100);
        localStorage.setItem("zm", localStorage.getItem("zm") - 100);
        total += 200;
        //重绘
        redrawBtn();

    }
    ctx.closePath()
}


function Card(flower, face) {//一张牌
    var card = {};
    card.flower = flower;
    card.face = face;
    return card;
}


function getFlowerValueByInt(val) {
    switch (val) {
        case 0:
            return "diamonds";
        case 1:
            return "clubs";
        case 2:
            return "hearts";
        case 3:
            return "spades";
        default:
            return "error";
    }
}

function getFaceValueByInt(val) {
    if (val >= 2 && val <= 10) {
        return val + "";
    } else if (val == 11) {
        return "J";
    } else if (val == 12) {
        return "Q";
    } else if (val == 13) {
        return "K";
    } else if (val == 14) {
        return "A";
    }
    return "error";
}


var CardsType = {};
CardsType.C235 = -1
CardsType.NORMAL = 0;
CardsType.PAIR = 1;
CardsType.STRAIGHT = 2;
CardsType.FLUSH = 3;
CardsType.STRAIGHT_FLUSH = 4;
CardsType.BOMB = 5;

function Player(name, money) {
    var player = {};
    player.name = name;
    player.money = money;
    player.cards = [];
    player.type = CardsType.NORMAL;
    return player;
}

function getRandomFlower() {
    return Math.floor(Math.random() * 4);
}

function getRandomFace() {
    return Math.floor(Math.random() * 13) + 2;
}

function createSinglePlayer(name) {
    // var cards = [];
    // for (var i = 0; i < 3; i++) {
    //     var flower = getRandomFlower();
    //     var face = getRandomFace();
    //     var card = new Card(flower, face);
    //     cards.push(card);
    // }
    var money = localStorage.getItem(name);
    if (money < 100) {
        alert("没钱了。。在首页点一下辣鸡掌门充值。。");
        location.href = "../main.html";
    }
    return new Player(name, money);
}

var GameProxy = {};
GameProxy.initPoker = function () {//生成一副牌
    var cards = [];
    for (var i = 14; i > 1; i--) {
        for (var j = 3; j >= 0; j--) {
            var card = new Card(j, i);
            cards.add(card);
        }
    }
    return cards;
}

GameProxy.shufflePoker = function (cards) {//洗牌
    for (var i = 0; i < 52; i++) {
        var rd = Math.floor(Math.random() * 53);//0-52
        var temp = cards[i];//交换
        cards[i] = cards[rd];
        cards[rd] = temp;
    }
    return cards;
}

GameProxy.dealPoker = function (cards, players) {//发牌
    for (var i = 0; i < players.length; i++) {
        players[i].cards.push(cards.shift());
    }
    return players;
}

GameProxy.createPlayers = function () {
    var players = [];
    var zhangmen = createSinglePlayer("zm");
    var me = createSinglePlayer("me");
    players.push(zhangmen);
    players.push(me);
    // for (var p in players) {
    //     console.log("created player-->" + players[p].name + "余额:" + players[p].money + "--->花色" + players[p].cards[0].flower + "牌面"
    //         + players[p].cards[0].face + "，花色" + players[p].cards[1].flower + "牌面" + players[p].cards[1].face
    //         + "，花色" + players[p].cards[2].flower + "牌面" + players[p].cards[2].face);
    // }
    return players;
}


//排序
function sortPlayerCardsByFace(player) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3 - i - 1; j++) {
            if (player.cards[j].face < player.cards[j + 1].face) {
                var tempCard = player.cards[j];
                player.cards[j] = player.cards[j + 1];
                player.cards[j + 1] = tempCard;
            }
        }
    }
    // var log = "";
    // for (var i = 0; i < 3; i++) {
    //     log += player.cards[i].face + " "
    //
    // }
    // console.log("排序后：" + log);
    return player;
}

// 对子放前面
function movePair2Front(player) {
    if (player.cards[1].face == player.cards[2].face) {
        var tempCard = player.cards[0];
        player.cards[0] = player.cards[2];
        player.cards[2] = tempCard;
    }
    // var log = "";
    // for (var i = 0; i < 3; i++) {
    //     log += player.cards[i].face + " "
    //
    // }
    // console.log("放前面后：" + log);
    return player;
}

function initMoney() {
    if (!localStorage.getItem("zm") && !localStorage.getItem("me")) {
        localStorage.setItem("zm", 1000000);
        localStorage.setItem("me", 10000);
    }
}

//豹子
function isBomb(player) {
    return player.cards[0].face == player.cards[1].face
        && player.cards[1].face == player.cards[2].face;
}


//金花
function isFlush(player) {
    return player.cards[0].flower == player.cards[1].flower
        && player.cards[1].flower == player.cards[2].flower;
}

//顺子
//todo A23的情况
function isStraight(player) {
    return player.cards[0].face == player.cards[1].face + 1
        && player.cards[1].face == player.cards[2].face + 1;
}

//对子
function isPair(player) {
    return player.cards[0].face == player.cards[1].face
        || player.cards[1].face == player.cards[2].face
        || player.cards[0].face == player.cards[2].face;
}

//普通235
function is235(player) {
    return !isFlush(player) && player.cards[0].face == 5 && player.cards[1].face == 3 && player.cards[2].face == 2;
}


function setPlayerCardsType(player) {
    if (isFlush(player)) {
        if (isStraight(player)) {// 顺金
            player.type = CardsType.STRAIGHT_FLUSH;
        } else {//金花
            player.type = CardsType.FLUSH;
        }
    } else if (isStraight(player)) {// 顺子
        player.type = CardsType.STRAIGHT;
    } else if (isPair(player)) {
        if (isBomb(player)) {// 豹子
            player.type = CardsType.BOMB;
        } else {// 对子
            player.type = CardsType.PAIR;
        }
    } else {
        player.type = CardsType.NORMAL;
        if (is235(player)) {
            player.type = CardsType.C235;
        }
    }
    return player;
}

function showCardsType(type) {
    switch (type) {
        case -1 :
            return "235";
        case 0 :
            return "普通牌";
        case 1 :
            return "对子";
        case 2 :
            return "顺子";
        case 3 :
            return "金花";
        case 4 :
            return "顺金";
        case 5 :
            return "豹子";
        default:
            return "什么鸟牌，不认识";
    }

}

function compare(player1, player2) {
    //player1比牌方，player2被比牌
    //排好序
    player1 = sortPlayerCardsByFace(player1);
    player2 = sortPlayerCardsByFace(player2);
    //计算出牌的类型
    player1 = setPlayerCardsType(player1);
    player2 = setPlayerCardsType(player2);
    console.log("比牌方是：" + showCardsType(player1.type));
    console.log("被比牌是：" + showCardsType(player2.type));
    if (player1.type > player2.type) {
        return true;
    } else if (player1.type < player2.type) {
        if (player1.type == CardsType.C235 && player2.type == CardsType.BOMB) {
            //235赢豹子
            return true;
        }
        return false;
    }

    if (player1.type == CardsType.PAIR && player2.type == CardsType.PAIR) {
        console.log("都是对子，对子放前面");
        player1 = movePair2Front(player1);
        player2 = movePair2Front(player2);
    }

    if (player1.cards[0].face > player2.cards[0].face) {
        return true;
    } else if (player1.cards[0].face < player2.cards[0].face) {
        return false;
    }

    if (player1.cards[1].face > player2.cards[1].face) {
        return true;
    } else if (player1.cards[1] < player2.cards[1].face) {
        return false;
    }

    if (player1.cards[2].face > player2.cards[2].face) {
        return true;
    } else if (player1.cards[2].face < player2.cards[2].face) {
        return false;
    }
    return false;

}




























