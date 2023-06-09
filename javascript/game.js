var canvas_main = document.getElementById('game-canvas');
var context_main = canvas_main.getContext('2d');

var canvas_render = document.createElement('canvas');
var context_render = canvas_render.getContext('2d');

var background_left, background_right, background_top, background_bottom;
var canvas_left, canvas_right, canvas_top, canvas_bottom;
var trans_x, trans_y, trans_x_max, trans_y_max, trans_value;

trans_x = 0;
trans_y = 0;
trans_value = 5;
trans_x_max = 0;
trans_y_max = 0;


var global_mouse_x = 0;
var global_mouse_y = 0;


var sky_number = 8;//makanan
var isPause = false,
    isWin = false,
    isGameOver = false;

var score_to_level_2 = 20;//score max level 1
var score_to_level_3 = 40;//score max level 2
var score_to_level_4 = 60;//score max level 3

var background = new Image();

//Tampilan canvas
var MyCanvas = {

    canvas_width: 1000,
    canvas_height: 600,

    background_width: 0,
    background_height: 0,

    canvas_max_top: 80,

    screen_size: {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    },

    init: function() {
        console.log('MyCanvas');
        this.canvas_width = MyCanvas.screen_size.width;
        this.canvas_height = MyCanvas.screen_size.height - 4;

        canvas_main.width = this.canvas_width;
        canvas_main.height = this.canvas_height;

        this.background_width = background.width;
        this.background_height = background.height;

        canvas_render.width = background.width;
        canvas_render.height = background.height;

        background_left = 40;
        background_right = this.background_width - 150;
        background_top = 80;
        background_bottom = this.background_height - 80;

        canvas_left = 40;
        canvas_right = this.canvas_width - 150;
        canvas_top = 80;
        canvas_bottom = this.canvas_height - 100;

        trans_x_max = this.background_width - this.canvas_width;
        trans_y_max = this.background_height - this.canvas_height;

        console.log(this.canvas_width, this.canvas_height);

        console.log(background_left, background_right, background_top, background_bottom);
        console.log(canvas_left, canvas_right, canvas_top, canvas_bottom);

        console.log(trans_x_max, trans_y_max);

        console.log(canvas_render);
        console.log(canvas_main);

    },
};

//
var MyScore = {
    left: 30,
    top: 60,
    lineWidth: 20,
    score: 0,
    color: 'rgb(255,255,255)',

    draw: function() {
        this.left = 30 + trans_x;
        this.top = 60 + trans_y;
        context_render.lineWidth = this.lineWidth;
        context_render.fillStyle = this.color;

        context_render.font = 'normal bold 2em courier';

        context_render.fillText("Score: " + this.score, this.left, this.top);
    }
}

//
var MyHeart = {
    left: 250,
    top: 60,
    lineWidth: 20,
    heart: 0,
    color: 'rgb(255,255,255)',

    draw: function() {
        this.left = 250 + trans_x;
        this.top = 60 + trans_y;
        context_render.lineWidth = this.lineWidth;
        context_render.fillStyle = this.color;

        context_render.font = 'normal bold 2em courier';

        context_render.fillText("Heart: " + this.heart, this.left, this.top);
    }
}

//
var MyNoti = {
    left: 500,
    top: 60,
    lineWidth: 10,
    noti: '',
    color: 'rgb(255,255,255)',

    lostHeart: function() {
        this.noti = 'Hati-Hati Yaa!!!';

        setTimeout(function() {
            MyNoti.noti = '';
        }, 3000);
    },

    levelUp: function() {
        this.noti = 'Level Up!!!';

        setTimeout(function() {
            MyNoti.noti = '';
        }, 3000);
    },

    pause: function() {
        this.noti = 'Pause!!!';

        setTimeout(function() {
            MyNoti.noti = '';
        }, 3000);
    },

    draw: function() {
        this.left = 500 + trans_x;
        this.top = 60 + trans_y;
        context_render.lineWidth = this.lineWidth;
        context_render.fillStyle = this.color;

        context_render.font = 'normal bold 2em courier';

        context_render.fillText(this.noti, this.left, this.top);
    }
}

//
var MyProgressBar = {
    value: 0,
    max_value: 100,
    width: 500,
    height: 10,
    offsetX: 0,
    offsetY: 0,
    bg_color: 'rgb(0,0,0)',
    line_color: 'rgb(249,28,12)',
    value_color: 'rgb(226,226,42)',

    line1_offsetX: 0,
    line2_offsetX: 0,

    init: function() {
        this.value = 0;
        this.max_value = score_to_level_4;
        this.offsetX = MyCanvas.canvas_width - this.width - 50;
        this.offsetY = 50;
        this.line1_offsetX = this.offsetX + this.width / 3;
        this.line2_offsetX = this.offsetX + this.width / 3 * 2;
    },

    draw: function() {

        if (this.value > this.max_value) {
            this.value = this.max_value;
        }

        context_render.lineJoin = 'round';
        context_render.lineCap = 'round';
        context_render.fillStyle = this.bg_color;
        context_render.fillRect(this.offsetX + trans_x, this.offsetY + trans_y, this.width, this.height);

        context_render.fillStyle = this.value_color;
        context_render.fillRect(this.offsetX + trans_x, this.offsetY + trans_y, this.value / this.max_value * this.width, this.height);

        context_render.fillStyle = this.line_color;
        context_render.fillRect(this.line1_offsetX + trans_x, this.offsetY + trans_y - 1, 2, this.height + 1);
        context_render.fillRect(this.line2_offsetX + trans_x, this.offsetY + trans_y - 1, 2, this.height + 1);
    }
}

//
var MyBird = {
    value: 1,

    x: 0,
    y: 0,
    bird_left_image: 0,
    bird_right_image: 0,

    width: 0,
    height: 0,

    direction: 0,

    init: function() {
        this.x = MyCanvas.screen_size.width / 2;
        this.y = MyCanvas.screen_size.height / 2;
        this.direction = 'R';
        this.bird_left_image = new Image();
        this.bird_left_image.src = "images/bird_left,gif"; // 200x123
        this.bird_right_image = new Image();
        this.bird_right_image.src = "images/bird_right.gif"; // 200x123
        this.width = 186 / 2;
        this.height = 85 / 2;
    },

    draw: function() {
    },

    lostHeart: function(cur_value) {
        this.value = 100;
        console.log('lost heart' + cur_value);

        setTimeout(function() {
            console.log('normal' + cur_value);
            MyBird.value = cur_value;
            console.log('normal' + MyBird.value);
        }, 3000);
    }
}

// sky
var sky_source = [
    "images/sky/star.png", //200x213            // 0
    "images/sky/bird_1_left.png", // 200x100    // 1
    "images/sky/bird_1_right.png",//2
    "images/sky/bird_2_left.png", // 200x106    // 3
    "images/sky/bird_2_right.png",//4
    "images/sky/bird_3_left.png", // 200x153    // 5
    "images/sky/bird_3_right.png",//6
    "images/sky/bird_4_left.png", // 200x86     // 7
    "images/sky/bird_4_right.png",//7

];

var sky_ = [];

var MySky = {
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    add: function() {
        var mr = {
            value: 0, // 0 1 2 3 4
            top: 0,
            left: 0,
            width: 30,
            height: 30,

            img: 0,

            velocityX: -50,
            velocityY: 0,
        }

        let preRand = this.getRandomInt(0, 30);
        var rand = 0;

        if (preRand == 0) {
            rand = 0;
        }

        if (preRand == 1) {
            rand = this.getRandomInt(7, 8);
        }

        if (preRand > 1 && preRand <= 5) {
            rand = this.getRandomInt(5, 6);
        }

        if (preRand > 5 && preRand <= 17) {
            rand = this.getRandomInt(3, 4);
        }
        if (preRand > 17) {
            rand = this.getRandomInt(1, 2);
        }


        mr.img = new Image();
        mr.img.src = sky_source[rand];

        if (rand == 0) {
            mr.value = 1;
            mr.width = 50;
            mr.height = 50;
            mr.velocityX = 0;
            mr.velocityY = this.getRandomInt(1, 5);
            mr.top = 0;
            mr.left = this.getRandomInt(0 + 100, MyCanvas.background_width - 100);
        } else {
            mr.velocityY = 0;

            if (rand == 1 || rand == 2) {
                mr.value = 1;
                mr.width = 70;
                mr.height = 35;
            }

            if (rand == 3 || rand == 4) {
                mr.value = 2;
                mr.width = 100;
                mr.height = 50;
            }

            if (rand == 5 || rand == 6) {
                mr.value = 3;
                mr.width = 100;
                mr.height = 70;
            }

            if (rand == 7 || rand == 8) {
                mr.value = 4;
                mr.width = 160;
                mr.height = 68;
            }

            // kanan
            if (rand % 2 == 0) {
                mr.velocityX = this.getRandomInt(1, 5);
                mr.left = 0;
                mr.top = this.getRandomInt(MyCanvas.canvas_max_top, MyCanvas.background_height - mr.height);
            } else {
                // kiri
                mr.velocityX = this.getRandomInt(-5, -1);
                mr.left = MyCanvas.background_width;
                mr.top = this.getRandomInt(MyCanvas.canvas_max_top, MyCanvas.background_height - mr.height);
            }
        }

        sky_.push(mr);
    },

    update: function() {
        for (var i = 0; i < sky_.length; i++) {
            sky_[i].left += sky_[i].velocityX;
            sky_[i].top += sky_[i].velocityY;
        }
    },

    draw: function() {
        for (var i = 0; i < sky_.length; i++) {
            var mr = sky_[i];
            context_render.drawImage(mr.img, mr.left, mr.top, mr.width, mr.height);
        }
    }
}

//check logic
var MyCheck = {
    outOfRange: function() {
        for (var i = 0; i < sky_.length; i++) {
            var mr = sky_[i];
            if (mr.left + mr.width < 0) {
                sky_.splice(i, 1);
                continue;
            }
            if (mr.left > MyCanvas.background_width) {
                sky_.splice(i, 1);
                continue;
            }
            if (mr.top > MyCanvas.background_height) {
                sky_.splice(i, 1);
                continue;
            }
        }

        while (sky_.length <= sky_number) {
            MySky.add();
        }
    },

    collision: function() {

        var mr;
        var bird_x, bird_y;
        var cur_score = MyScore.score;
        var cur_heart = MyHeart.heart;
        var cur_value = MyBird.value;

        if (cur_value == 100) {
            return;
        }

        if (MyBird.direction == "L") {
            bird_x = MyBird.x;
            bird_y = MyBird.y + MyBird.height / 2;
        } else {
            bird_x = MyBird.x + MyBird.width;
            bird_y = MyBird.y + MyBird.height / 2;
        }


        for (var i = 0; i < sky_.length; i++) {
            mr = sky_[i];

            if (mr.left < bird_x && bird_x < mr.left + mr.width &&
                mr.top < bird_y && bird_y < mr.top + mr.height) {
                if (mr.value <= MyBird.value) {
                    cur_score += mr.value;
                    sky_.splice(i, 1);
                } else {
                    MyBird.lostHeart(cur_value);
                    MyNoti.lostHeart();
                    MyHeart.heart--;

                    if (MyHeart.heart < 0) {
                        isGameOver = true;
                    }

                    return;
                }
            }
        }

        while (sky_.length <= sky_number) {
            MySky.add();
        }

        // 
        if (cur_value != 1 && 0 <= cur_score && cur_score < score_to_level_2) {
            cur_value = 1;
            console.log('level 1');
        }
        if (cur_value != 2 && score_to_level_2 <= cur_score && cur_score < score_to_level_3) {
            cur_value = 2;
            MyHeart.heart = 3;
            MyNoti.levelUp();
            MyBird.width = 200 / 1.7 ;
            MyBird.height = 100 /1.7;
            console.log('level 2');
        }
        if (cur_value != 3 && score_to_level_3 <= cur_score && cur_score < score_to_level_4) {
            cur_value = 3;
            MyHeart.heart = 3;
            MyNoti.levelUp();
            MyBird.width = 250 / 1.4;
            MyBird.height = 110 /1.4;
            console.log('level 3');
        }

        if (cur_value != 4 && cur_score >= score_to_level_4) {
            isWin = true;
        }

        // UI
        MyBird.value = cur_value;
        MyScore.score = cur_score;
        MyProgressBar.value = cur_score;
    },
}

//event
function setMousePosition(e) {

    var mouse_x = e.clientX;
    var mouse_y = e.clientY;

    if (global_mouse_x < mouse_x) {
        MyBird.direction = 'R';
        document.getElementById('cursorID').src = 'images/bird_right.gif'
    } else {
        MyBird.direction = 'L';
        document.getElementById('cursorID').src = 'images/bird_left.gif'
    }

    global_mouse_x = mouse_x;
    global_mouse_y = mouse_y;

    if (global_mouse_x < canvas_left) {
        global_mouse_x = canvas_left - 1;
    }

    if (global_mouse_x > canvas_right) {
        global_mouse_x = canvas_right + 1;
    }

    if (global_mouse_y < canvas_top) {
        global_mouse_y = canvas_top - 1;
    }

    if (global_mouse_y > canvas_bottom) {
        global_mouse_y = canvas_bottom + 1;
    }

    document.getElementById('cursorID').width = MyBird.width;
    document.getElementById('cursorID').style.left = (global_mouse_x) + 'px';
    document.getElementById('cursorID').style.top = (global_mouse_y) + 'px';
}

document.addEventListener("mousemove", setMousePosition, false);

function changeScreenSize() {
    console.log('changeScreenSize');
}
window.addEventListener("resize", changeScreenSize); 
document.onkeypress = function(e) {
    e = e || window.event;
    if (e.keyCode == 112) { // P key
        if (isPause) {
            isPause = false;
            update();
        } else {
            isPause = true;
            MyNoti.pause();
        }
    }

    if (e.keyCode == 109){
        var my_audio = document.getElementById("game-audio");
        if (!my_audio.paused){
            document.getElementById("game-audio").pause();
        } else {
            document.getElementById("game-audio").play();
        }
    }
};

//init data
function init() {
    MyCanvas.init();
    MyBird.init();
    MyScore.score = 0;
    MyHeart.heart = 3;
    MyProgressBar.init();

    isPause = false;
    isWin = false;
    isGameOver = false;


    while (sky_.length > 0) {
        sky_.pop();
    }

    while (sky_.length < sky_number) {
        MySky.add();
    }

    console.log('init');
};

// update
function beforeupdate() {
    MyBird.x = global_mouse_x + trans_x;
    MyBird.y = global_mouse_y + trans_y;

    if (MyBird.x < background_left) {
        MyBird.x = background_left;
    }

    if (MyBird.x > background_right) {
        MyBird.x = background_right;
    }

    if (MyBird.y < background_top) {
        MyBird.y = background_top;
    }

    if (MyBird.y > background_bottom) {
        MyBird.y = background_bottom;
    }

    if (global_mouse_x < canvas_left) {
        trans_x -= trans_value;
    }

    if (global_mouse_x > canvas_right) {
        trans_x += trans_value;
    }

    if (global_mouse_y < canvas_top) {
        trans_y -= trans_value;
    }

    if (global_mouse_y > canvas_bottom) {
        trans_y += trans_value;
    }

    trans_x = (trans_x < 0) ? 0 : trans_x;
    trans_y = (trans_y < 0) ? 0 : trans_y;

    trans_x = (trans_x > trans_x_max) ? trans_x_max : trans_x;
    trans_y = (trans_y > trans_y_max) ? trans_y_max : trans_y;
}

function update() {
    context_render.drawImage(background, 0, 0);
    beforeupdate();

    MyCheck.outOfRange();
    MyCheck.collision();

    MySky.update();
    MySky.draw();

    MyBird.draw();
    MyScore.draw();
    MyHeart.draw();
    MyNoti.draw();
    MyProgressBar.draw();

    context_main.drawImage(canvas_render, trans_x, trans_y, MyCanvas.canvas_width, MyCanvas.canvas_height,

        0, 0, MyCanvas.canvas_width, MyCanvas.canvas_height);

    if (isWin) {
        console.log("WIN");
        var img = new Image();
        img.src = "images/control/win1.png";
        img.onload = function() {
            context_main.drawImage(img, (MyCanvas.canvas_width - img.width) / 2,
                (MyCanvas.canvas_height - img.height) / 2);
        };

        return;
    }

    if (isGameOver) {
        console.log("GAME OVER");
        var img = new Image();
        img.src = "images/control/gameover1.png";
        img.onload = function() {
            context_main.drawImage(img, (MyCanvas.canvas_width - img.width) / 2,
                (MyCanvas.canvas_height - img.height) / 2);
        };
        return;
    }

    if (!isPause) {
        requestAnimationFrame(update);
    }
}

// run
background.src = "images/8bit.jpg";

background.onload = function() {
    init();
    update();
}
