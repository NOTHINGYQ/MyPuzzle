//定义全局变量
var global ={
    game_area: null,     // 拼图区域
    pics: [],            // 图片数组
    empty: null,         // 空白图片
    time: null,          // 时间控件
    step: null,          // 步数控件
    start: false,        // 是否开始游戏
    firstload: true,     // 是否首次加载
    difficulty: 1,       // 难度等级
    timeId: null         // 计时器id
    // level:
}

window.onload = function(){



    if (global.firstload == true) { // 首次加载, 初始化变量
        global.firstload = false;
        global.game_area = document.getElementById('fifteen2');
        global.step = document.getElementById('step');
        global.time = document.getElementById('time');
        global.difficulty = document.getElementsByTagName('select')[0];
    } else {   // 不是第一次加载, 移除旧的拼图
        while (global.game_area.hasChildNodes())
            global.game_area.removeChild(global.game_area.firstChild);
    }


    //创建拼图
    // document.getElementById('level1').onclick = function()
    createPuzzle();


    global.empty = document.getElementById('empty');
    global.pics = document.getElementById('fifteen2').children;
    for (var i = 0; i + 1 < global.pics.length; ++i) {
        // 设置点击事件监听器, 点击图片进行移动
        global.pics[i].onclick = function () {
            if (!global.start)  // 未开始游戏, 不移动
                return;
            var clickPos = this.className.match(/[0-9]/g); // 被点击的图片坐标
            var emptyPos = empty.className.match(/[0-9]/g); // 空白格的坐标
            // 如果点击图片的坐标合法, 与空白格相邻，和空白格交换
            if (isValid(clickPos, emptyPos)) {
                var temp = this.className;
                this.className = empty.className;
                global.empty.className = temp;
                ++global.step.innerHTML;
                // 判断是否完成拼图
                if (isDone())
                    success();
            }
        };
    }
    if (global.start == true) {
        initPos(global.difficulty.selectedIndex + 1);  // 初始化图片位置
        global.time.textContent = '00:00';
        global.step.textContent = 0;
        global.timeId = setInterval(showTime, 1000);   // 定时器, 每秒执行一次
    }
    //点击重新开始按钮，清除定时器，重新加载页面
    document.getElementById('restart').onclick = function () {
        clearInterval(global.timeId);
        global.start = true;
        window.onload();
    }

    //点击暂停按钮，停止计时
    // document.getElementById('stop').onclick = function () {
    //
    //
    // }

}

//创建8*8的拼图
function createPuzzle() {
    //先将63个存在documentFragment，页面只需要渲染一次，提高性能
    var frag = document.createDocumentFragment();
    for (var i = 1; i <= 8; ++i) {
        for (var j = 1; j <= 8; ++j) {
            if (i == 8 && j == 8) {
                var empty = document.createElement("div");
                empty.setAttribute('id', 'empty');
                empty.setAttribute('class','row2_8 col2_8');//注意这里不要把col拼成clo
                frag.appendChild(empty);            //注意此处命名变量时其实不应该加数字，否则后边用match匹配时会将名字中的数字算上
                break;
            }
            var pic = document.createElement("div");
            pic.setAttribute("id","pic2_" + ((i-1) * 8+ j)); //???
            pic.setAttribute("class","row2_"+ i +" col2_"+ j);//????
            frag.appendChild(pic);                                         //????
        }
    }
    document.getElementById("fifteen2").appendChild(frag);//????

}

//初始化图片的位置，3种不同难度
function initPos(difficulty) {
    var arr = [];
    if (difficulty == 1)
        arr = [45, 46, 47,53,54,55,61,62];
    else if (difficulty == 2)
        arr = [27,28,29,30,31,35,36,37,38,39,43,44,45,46,47,51,52,53,54,55,59,60,61,62];
    else {
        arr=[]
        for (i=0;i<63;i++){
            arr[i]=i
        }
        // console.log(arr);

    }

    // 随机打乱数组
    arr.sort(function () {
         return Math.random() - 0.5;
    });
    console.log(arr);
    // 每次交换3张图片的位置, 最后的拼图一定是可还原的
    // 难度越大, 交换的图片数越多
    if(difficulty==1) {
        for (i = 0; i < difficulty * 3; i += 3) {   //？？？？？？为什么这里之前设置的20，就不能正常计数了，换成5之后可以正常计数了？？？？？
            var temp = global.pics[arr[i]].className;
            global.pics[arr[i]].className = global.pics[arr[i + 1]].className;
            global.pics[arr[i + 1]].className = global.pics[arr[i + 2]].className;
            global.pics[arr[i + 2]].className = temp;
        }
    }
    if(difficulty==2){
        for (i=0;i<22;i+=3){
            var temp = global.pics[arr[i]].className;
            global.pics[arr[i]].className = global.pics[arr[i+1]].className;
            global.pics[arr[i+1]].className = global.pics[arr[i+2]].className;
            global.pics[arr[i+2]].className = temp;
        }
    }
    if(difficulty==3){
        for (i = 0 ;i<61;i+=3){
            var temp = global.pics[arr[i]].className;
            global.pics[arr[i]].className = global.pics[arr[i+1]].className;
            global.pics[arr[i+1]].className = global.pics[arr[i+2]].className;
            global.pics[arr[i+2]].className = temp;
        }
    }
}

//显示游戏用时
function showTime() {
    var curTime = global.time.textContent.split(':'),
        min = parseInt(curTime[0]),
        sec = parseInt(curTime[1]);
    if (sec == 59) {
        ++min, sec = 0;
    }
    else {
        ++sec;
    }
    if (min < 10)
        min = '0' + min;
    if (sec < 10)
        sec = '0' + sec;
    global.time.innerHTML = min + ':' + sec;
}

//判断点击图片是否合法，是否在空白格周围
function isValid(a, b) {
    return (a[1] == b[1] && Math.abs(a[3] - b[3]) == 1)
        || (a[3] == b[3] && Math.abs(a[1] - b[1]) == 1);
}

//判断图片是否完成，每个div的类名是否与位置对应
function isDone() {
    var done = true, pos = [];
    for(var i =0;i<global.pics.length;++i){
        pos = global.pics[i].className.match(/[0-9]/g);
        id = global.pics[i].id.match(/[0-9]+/);
        if(id&&id[1]!=(pos[1]-1)*8+parseInt(pos[3])){//???????????此处要讲4改为8
            done=false;
            break;
        }
    }
    return done;
}

function success() {
    clearInterval(global.timeId);
    var curTime = global.time.textContent.split(':');
    var diff = global.difficulty.selectedIndex,
        str = '恭喜通过' + global.difficulty[diff].textContent+ ',用时';
    if(parseInt(curTime[0]))
        str+=parseInt(curTime[0]+'分');
    if(parseInt(curTime[1]))
        str+=parseInt(curTime[1])+'秒';
    str += '，共计'+global.step.textContent+'步\n';
    if(diff ==2)
        str+= "!!!!";
    else
        str+= "你可以继续更复杂的挑战了";
    global.start = false;
    setTimeout(function (){alert(str)},500);

}