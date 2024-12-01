let bpmInput = document.getElementById('bpm');
let startBtn = document.getElementById('startBtn');
let stopBtn = document.getElementById('stopBtn');
let noteTypeSelect = document.getElementById('noteType');

let intervalId = null;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 播放节拍音效
function playClick(isStrong = false) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    oscillator.stop(audioContext.currentTime + 0.1);

    // 如果是重音，音量设置为极大；如果是轻音，音量设置为较大
    if (isStrong) {
        gainNode.gain.setValueAtTime(2.0, audioContext.currentTime); // 重音音量极大
    } else {
        gainNode.gain.setValueAtTime(0.6, audioContext.currentTime); // 轻音音量较大
    }
}

// 开始节拍
function startMetronome() {
    const bpm = parseInt(bpmInput.value, 10);
    if (isNaN(bpm) || bpm < 40 || bpm > 240) {
        alert('请输入有效的 BPM（40-240）');
        return;
    }

    const interval = 60000 / bpm; // 计算节拍间隔（ms）

    // 获取音符类型
    const noteType = noteTypeSelect.value;

    let noteInterval = interval;

    // 根据音符类型调整节奏
    if (noteType === 'eighth') {
        noteInterval /= 2; // 八分音符
    } else if (noteType === 'triplet') {
        noteInterval /= 3; // 三连音
    } else if (noteType === 'sixteenth') {
        noteInterval /= 4; // 十六分音符
    }

    // 计算不同音符类型的重音
    let beatsInCycle;
    let strongBeatIndexes;

    if (noteType === 'eighth') {
        beatsInCycle = 2;
        strongBeatIndexes = [0]; // 第1个重
    } else if (noteType === 'triplet') {
        beatsInCycle = 3;
        strongBeatIndexes = [0]; // 第1个重
    } else if (noteType === 'sixteenth') {
        beatsInCycle = 4;
        strongBeatIndexes = [0]; // 第1个重
    } else {
        beatsInCycle = 1;
        strongBeatIndexes = [0]; // 四分音符，只有第一个重
    }

    // 每个周期的总时间
    const cycleTime = noteInterval * beatsInCycle;

    // 清除之前的节拍器
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        for (let i = 0; i < beatsInCycle; i++) {
            let isStrong = strongBeatIndexes.includes(i); // 判断当前节拍是否是重音
            setTimeout(() => playClick(isStrong), i * noteInterval);
        }
    }, cycleTime);

    startBtn.disabled = true;
    stopBtn.disabled = false;
}

// 停止节拍
function stopMetronome() {
    clearInterval(intervalId);
    intervalId = null;

    startBtn.disabled = false;
    stopBtn.disabled = true;
}

// 添加事件监听
startBtn.addEventListener('click', startMetronome);
stopBtn.addEventListener('click', stopMetronome);
noteTypeSelect.addEventListener('change', () => {
    // 音符类型更改时，重新开始节拍器
    if (intervalId) {
        stopMetronome();
        startMetronome();
    }
});
