// Telegram Web App初始化
window.addEventListener('load', () => {
    const tg = window.Telegram.WebApp; // 获取Telegram WebApp对象

    tg.ready(); // 通知Telegram Web App已准备好
    tg.expand(); // 将Web App展开为全屏

    // 获取Telegram上下文信息
    console.log("用户信息:", tg.initDataUnsafe.user);
    
    const audio = document.getElementById('background-audio');
    const audioControl = document.getElementById('audio-control');
    const audioIcon = document.getElementById('audio-icon');

    function playAudio() {
        audio.muted = false; // 解除静音
        audio.play().catch((error) => {
            console.log('需要用户交互来启动音频:', error);
        });
    }

    playAudio(); // 尝试自动播放音频

    document.body.addEventListener('click', playAudio, { once: true });

    // 控制音符按钮的静音和恢复
    audioControl.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false;
            audioIcon.src = 'images/sound-on.png'; // 切换为音效开启图标
        } else {
            audio.muted = true;
            audioIcon.src = 'images/sound-off.png'; // 切换为音效关闭图标
        }
    });
});

// 抽奖逻辑
document.getElementById('start-btn').addEventListener('click', function () {
    let items = document.querySelectorAll('.lottery-item');
    let index = 0; // 当前高亮的格子索引
    let speed = 100; // 初始转动速度
    let isSpinning = false; // 确保点击时能够触发
    let finalIndex = Math.floor(Math.random() * items.length); // 随机生成中奖的格子索引
    let slowDown = false; // 是否进入减速状态
    let spinDuration = 3000; // 转动的时间
    let elapsed = 0; // 已经过的时间
    let interval;

    // 防止重复触发
    if (isSpinning) return;

    isSpinning = true;
    interval = setInterval(startLottery, speed); // 启动抽奖动画

    function startLottery() {
        items.forEach(item => item.classList.remove('active')); // 清除所有格子高亮
        items[index].classList.add('active'); // 当前格子高亮

        // 检测是否需要停止
        if (slowDown && index === finalIndex) {
            clearInterval(interval);
            isSpinning = false;
            setTimeout(() => {
                alert(`恭喜你，抽中了${items[index].innerText}`); // 显示中奖结果
            }, speed);
            return;
        }

        index = (index + 1) % items.length; // 下一个高亮格子的索引
        elapsed += speed; // 更新经过的时间

        // 判断是否开始减速
        if (elapsed >= spinDuration && !slowDown) {
            slowDown = true; // 达到持续时间后进入减速状态
        }

        // 如果已经进入减速状态，则逐渐减速
        if (slowDown) {
            speed += 30; // 每次循环增加间隔时间，实现平滑减速
            clearInterval(interval);
            interval = setInterval(startLottery, speed);
        }
    }
});

// 自动调整图标大小的函数
function adjustIconSize() {
    const items = document.querySelectorAll('.lottery-item .icon');
    items.forEach(icon => {
        const parent = icon.parentElement;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;

        // 计算图标应该的大小，确保它不会超出格子并保持比例
        const maxSize = Math.min(parentWidth, parentHeight) * 0.8; // 图标最大为格子的80%
        icon.style.width = `${maxSize}px`;
        icon.style.height = `${maxSize}px`;
    });
}

// 页面加载后调整图标大小
window.addEventListener('load', adjustIconSize);

// 窗口大小变化时重新调整图标
window.addEventListener('resize', adjustIconSize);
