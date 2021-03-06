var canvas, ctx, players, total = 200;

var mainPagePath = "../main.html";

window.onload = function () {
    var poker = GameProxy.initPoker(); //生成牌
    poker = GameProxy.shufflePoker(poker); //洗牌
    players = GameProxy.createPlayers(); //生成2个玩家
    players = GameProxy.dealPoker(poker, players); //发牌
    play();
    initEnv(); //初始化环境
    loadImgAsync();

}

function loadImgAsync() { //异步加载图片
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
        var url = imgs[i].getAttribute("data-src");
        if (!imgs[i].src && url) {
            imgs[i].src = url;
        }
    }
}

function play() {
    localStorage.setItem("zm", localStorage.getItem("zm") - 100);
    localStorage.setItem("me", localStorage.getItem("me") - 100);
}

function drawHeadPortait(path, x, y, w, h) {//画头像
    var headPortrait_p1 = new Image();
    headPortrait_p1.src = path;
    headPortrait_p1.height = 50;
    headPortrait_p1.onload = function () {
        ctx.drawImage(headPortrait_p1, x, y, w, h);
    }
}

function drawThreePokerBack(x1, x2, x3, y) { //三张扑克牌位置
    //size:150
    ctx.drawPokerBack(x1, y, 150, '#7A7BB8', '#2E319C');
    ctx.drawPokerBack(x2, y, 150, '#7A7BB8', '#2E319C');
    ctx.drawPokerBack(x3, y, 150, '#7A7BB8', '#2E319C');

}
function drawPlayerZmInit() {

    drawHeadPortait("../images/zm.jpg", 10, 10, 150, 200);

    drawThreePokerBack(800, 600, 400, 10);

    ctx.fillStyle = '#519fff';
    ctx.fillRect(10, 210, 150, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("筹 码：" + localStorage.getItem("zm"), 18, 234);
}
function drawPlayerMeInit() {
    drawHeadPortait("../images/head.jpg", 10, 558, 150, 200);

    drawThreePokerBack(800, 600, 400, 558);

    ctx.fillStyle = '#519fff';
    ctx.fillRect(10, 528, 150, 30);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("筹 码：" + localStorage.getItem("me"), 18, 553);
}

function drawMybtn() {
    ctx.fillStyle = '#b064ff';
    ctx.fillRect(180, 558, 100, 30);
    ctx.fillRect(180, 600, 100, 30);
    ctx.fillRect(180, 642, 100, 30);

    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("看 牌", 200, 580);
    ctx.fillText("比 牌", 200, 622);
    ctx.fillText("加 注", 200, 664);
}

function drawCenter() {
    ctx.fillStyle = '#ff6ffb';
    ctx.fillRect(387, 360, 250, 50);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("押注筹码：" + total, 437, 395);
}

function initEnv() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    ctx.font = "20px 楷体";

    drawPlayerZmInit();//上面玩家
    drawPlayerMeInit(); //下面..
    drawCenter(); //中间
    drawMybtn(); //操作按钮

    canvas.addEventListener("click", clickView, false);
    canvas.addEventListener("click", clickPk, false);
    canvas.addEventListener("click", clickRaise, false);

    canvas.onmousemove = function () {
        this.style.cursor = 'pointer'
    };

}

function redrawMoneyBtn() {
    ctx.clearRect(10, 210, 150, 30);
    ctx.clearRect(10, 528, 150, 30);
    ctx.clearRect(387, 360, 250, 50);

    ctx.fillStyle = '#519fff';
    ctx.fillRect(10, 210, 150, 30);
    ctx.fillRect(10, 528, 150, 30);
    ctx.fillStyle = '#ff6ffb';
    ctx.fillRect(387, 360, 250, 50);

    ctx.fillStyle = '#EEEEEE';
    ctx.fillText("筹 码：" + localStorage.getItem("zm"), 18, 234);
    ctx.fillText("筹 码：" + localStorage.getItem("me"), 18, 553);
    ctx.fillText("押注筹码：" + total, 437, 395);
}

function clickView() { //看牌
    var x = event.pageX - canvas.getBoundingClientRect().left;
    var y = event.pageY;
    ctx.beginPath();
    ctx.rect(180, 558, 100, 30);
    if (ctx.isPointInPath(x, y)) {
        ctx.fillStyle = '#ffa81c';
        ctx.fillRect(180, 558, 100, 30);
        ctx.fillStyle = '#EEEEEE';
        ctx.fillText("看 牌", 200, 580);
        drawPlayerThreePokerCard(800, 600, 400, 558, players[1]);
    }
    ctx.closePath()
}

function drawPlayerThreePokerCard(x1, x2, x3, y, player) {
    ctx.drawPokerCard(x1, y, 150, getFlowerValueByInt(player.cards[0].flower)
        , getFaceValueByInt(player.cards[0].face));
    ctx.drawPokerCard(x2, y, 150, getFlowerValueByInt(player.cards[1].flower)
        , getFaceValueByInt(player.cards[1].face));
    ctx.drawPokerCard(x3, y, 150, getFlowerValueByInt(player.cards[2].flower)
        , getFaceValueByInt(player.cards[2].face));
}

function clickPk() {//比牌
    var x = event.pageX - canvas.getBoundingClientRect().left;
    var y = event.pageY;
    ctx.beginPath();
    ctx.rect(180, 600, 100, 30);
    if (ctx.isPointInPath(x, y)) {
        if (total <= 200) {
            resetCenterText("不能直接比牌");
            return;
        }
        ctx.fillStyle = '#ffa81c';
        ctx.fillRect(180, 600, 100, 30);
        ctx.fillStyle = '#EEEEEE';
        ctx.fillText("比 牌", 200, 622);
        drawPlayerThreePokerCard(800, 600, 400, 10, players[0]);
        drawPlayerThreePokerCard(800, 600, 400, 558, players[1]);

        var result = compare(players[1], players[0]);
        if (result) {
            localStorage.setItem("me", parseInt(localStorage.getItem("me")) + total);
            redrawMoneyBtn();
            resetCenterText("you win!!恭喜你，击败辣鸡掌门");
        } else {
            localStorage.setItem("zm", parseInt(localStorage.getItem("zm")) + total);
            redrawMoneyBtn();
            resetCenterText("you lose!!很遗憾，再接再厉");
        }
        canvas.removeEventListener("click", clickView, false);
        canvas.removeEventListener("click", clickPk, false);
        canvas.removeEventListener("click", clickRaise, false);

        setTimeout(function () { //看掌门表演
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.parentNode.removeChild(canvas);
            document.body.setAttribute("class", "bg1");
            document.getElementById("container").style.width = "100%";
            document.getElementById("show").style.display = "block";//zhangmen show
            // location.href = mainPagePath;
        }, 1500);
    }
    ctx.closePath();


}

function resetCenterText(text) {
    ctx.clearRect(387, 360, 250, 50);
    ctx.fillStyle = '#ff6ffb';
    ctx.fillRect(387, 360, 450, 50);
    ctx.fillStyle = '#EEEEEE';
    ctx.fillText(text, 437, 395);
}

function clickRaise() { //加注
    var x = event.pageX - canvas.getBoundingClientRect().left;
    var y = event.pageY;
    console.log(x + ":" + y);
    ctx.beginPath();
    ctx.rect(180, 642, 100, 30);
    if (ctx.isPointInPath(x, y)) {//加注
        if (localStorage.getItem("me") < 100 || localStorage.getItem("zm") < 100) {
            resetCenterText("呀！没钱了。。");
            return;
        }
        localStorage.setItem("me", localStorage.getItem("me") - 100);
        localStorage.setItem("zm", localStorage.getItem("zm") - 100);
        total += 200;
        //重绘
        redrawMoneyBtn();

    }
    ctx.closePath();
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

function createSinglePlayer(name) {
    var money = localStorage.getItem(name);
    if (money < 100) {
        alert("没钱了。。在首页点一下辣鸡掌门充值。。");
        location.href = mainPagePath;
    }
    return new Player(name, money);
}

var GameProxy = {};
GameProxy.initPoker = function () {//生成一副牌
    var cards = [];
    for (var i = 14; i > 1; i--) {
        for (var j = 3; j >= 0; j--) {
            var card = new Card(j, i);
            cards.push(card);
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
        for (var j = 0; j < 3; j++) {
            players[i].cards.push(cards.shift());
        }
    }
    return players;
}

GameProxy.createPlayers = function () {
    var players = [];
    var zhangmen = createSinglePlayer("zm");
    var me = createSinglePlayer("me");
    players.push(zhangmen);
    players.push(me);
    initMoney(); //初始化筹码
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
        localStorage.setItem("me", 1000000);
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




























