"use strict";

var bpmInput = document.getElementById('bpm');
var startBtn = document.getElementById('startBtn');
var stopBtn = document.getElementById('stopBtn');
var noteTypeSelect = document.getElementById('noteType');
var intervalId = null;
var currentBpm = parseInt(bpmInput.value, 10); // 当前BPM

var currentNoteType = noteTypeSelect.value; // 当前音符类型

var audioContext = new (window.AudioContext || window.webkitAudioContext)(); // 播放节拍音效（更响亮和明显的音效）

function playClick() {
  var isStrong = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var oscillator = audioContext.createOscillator();
  var gainNode = audioContext.createGain();
  oscillator.type = 'square'; // 使用方波，产生较为响亮的声音

  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // 使用更高的频率（1000Hz）

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
  oscillator.stop(audioContext.currentTime + 0.1); // 重音和轻音的音量设置

  if (isStrong) {
    gainNode.gain.setValueAtTime(3.0, audioContext.currentTime); // 重音音量更大
  } else {
    gainNode.gain.setValueAtTime(1.2, audioContext.currentTime); // 轻音音量适中
  }
} // 更新节奏和音符类型的函数


function updateMetronome() {
  var bpm = parseInt(bpmInput.value, 10); // 检查 BPM 是否有效，若不在范围内则自动设置为范围内的有效值

  if (isNaN(bpm) || bpm < 0 || bpm > 1000) {
    bpmInput.value = Math.max(0, Math.min(1000, bpm)); // 设置为合理范围内的BPM

    return; // 不做其他操作
  } // 计算节拍间隔


  var interval = 60000 / bpm; // 获取音符类型

  var noteType = noteTypeSelect.value;
  var noteInterval = interval; // 根据音符类型调整节奏

  if (noteType === 'eighth') {
    noteInterval /= 2; // 八分音符
  } else if (noteType === 'triplet') {
    noteInterval /= 3; // 三连音
  } else if (noteType === 'sixteenth') {
    noteInterval /= 4; // 十六分音符
  } // 计算不同音符类型的重音


  var beatsInCycle;
  var strongBeatIndexes;

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
  } // 每个周期的总时间


  var cycleTime = noteInterval * beatsInCycle; // 清除之前的节拍器

  clearInterval(intervalId);
  intervalId = setInterval(function () {
    var _loop = function _loop(i) {
      var isStrong = strongBeatIndexes.includes(i); // 判断当前节拍是否是重音

      setTimeout(function () {
        return playClick(isStrong);
      }, i * noteInterval);
    };

    for (var i = 0; i < beatsInCycle; i++) {
      _loop(i);
    }
  }, cycleTime);
} // 开始节拍


function startMetronome() {
  // 启动时就开始播放
  updateMetronome();
  startBtn.disabled = true;
  stopBtn.disabled = false;
} // 停止节拍


function stopMetronome() {
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
} // 监听事件


startBtn.addEventListener('click', startMetronome);
stopBtn.addEventListener('click', stopMetronome); // 监听BPM变化

bpmInput.addEventListener('input', function () {
  // 在节拍器运行时，动态更新BPM
  if (intervalId) {
    updateMetronome();
  }
}); // 监听音符类型变化

noteTypeSelect.addEventListener('change', function () {
  // 音符类型更改时，动态更新节奏
  if (intervalId) {
    updateMetronome();
  }
});