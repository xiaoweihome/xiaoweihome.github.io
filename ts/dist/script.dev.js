"use strict";

// 音符图片的路径
var binaryNotes = ['/img/notes/1.png', '/img/notes/2.png', '/img/notes/3.png', '/img/notes/4.png', '/img/notes/12.png', '/img/notes/23.png', '/img/notes/34.png', '/img/notes/14.png', '/img/notes/13.png', '/img/notes/24.png', '/img/notes/123.png', '/img/notes/234.png', '/img/notes/134.png', '/img/notes/124.png', '/img/notes/1234.png'];
var ternaryNotes = ['/img/notes/三1.png', '/img/notes/三2.png', '/img/notes/三3.png', '/img/notes/三12.png', '/img/notes/三23.png', '/img/notes/三13.png', '/img/notes/三123.png'];
var allNotes = [].concat(binaryNotes, ternaryNotes); // 难度设置

var difficultySets = {
  1: {
    binary: ['/img/notes/1.png', '/img/notes/3.png', '/img/notes/13.png', '/img/notes/134.png', '/img/notes/123.png', '/img/notes/1234.png'],
    ternary: ['/img/notes/三1.png', '/img/notes/三3.png', '/img/notes/三13.png', '/img/notes/三123.png'],
    all: [].concat(binaryNotes, ternaryNotes)
  },
  2: {
    binary: ['/img/notes/1.png', '/img/notes/3.png', '/img/notes/13.png', '/img/notes/134.png', '/img/notes/123.png', '/img/notes/1234.png', '/img/notes/14.png', '/img/notes/12.png', '/img/notes/23.png', '/img/notes/34.png', '/img/notes/124.png', '/img/notes/234.png'],
    ternary: ['/img/notes/三1.png', '/img/notes/三3.png', '/img/notes/三13.png', '/img/notes/三123.png', '/img/notes/三12.png', '/img/notes/三23.png'],
    all: [].concat(binaryNotes, ternaryNotes)
  },
  3: {
    binary: ['/img/notes/1.png', '/img/notes/3.png', '/img/notes/13.png', '/img/notes/134.png', '/img/notes/123.png', '/img/notes/1234.png', '/img/notes/14.png', '/img/notes/12.png', '/img/notes/23.png', '/img/notes/34.png', '/img/notes/124.png', '/img/notes/234.png', '/img/notes/2.png', '/img/notes/4.png', '/img/notes/24.png'],
    ternary: ['/img/notes/三1.png', '/img/notes/三3.png', '/img/notes/三13.png', '/img/notes/三123.png', '/img/notes/三12.png', '/img/notes/三23.png', '/img/notes/三2.png'],
    all: [].concat(binaryNotes, ternaryNotes)
  }
}; // 随机显示图片，允许重复

function displayRandomImages() {
  var imageCount = parseInt(document.getElementById('imageCount').value, 10);
  var noteType = document.getElementById('noteType').value;
  var difficulty = parseInt(document.getElementById('difficulty').value, 10);
  var selectedImages = difficultySets[difficulty][noteType] || []; // 清空现有的图片显示

  var container = document.getElementById('imageContainer');
  container.innerHTML = ''; // 随机选择指定数量的图片，允许重复

  for (var i = 0; i < imageCount; i++) {
    var randomIndex = Math.floor(Math.random() * selectedImages.length);
    var imgElement = document.createElement('img');
    imgElement.src = selectedImages[randomIndex];
    imgElement.alt = '音符';
    container.appendChild(imgElement);
  }
} // 导出合成图片


function exportImages() {
  var container = document.getElementById('imageContainer');
  var images = container.getElementsByTagName('img');

  if (images.length === 0) {
    alert('没有随机图片可导出！');
    return;
  }

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var imageWidth = 150;
  var imageHeight = 150;
  var padding = 10;
  var totalWidth = (imageWidth + padding) * images.length - padding;
  var totalHeight = imageHeight + padding * 2;
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  Array.from(images).forEach(function (img, index) {
    var x = index * (imageWidth + padding);
    var y = padding;
    var imgElement = new Image();
    imgElement.src = img.src;

    imgElement.onload = function () {
      ctx.drawImage(imgElement, x, y, imageWidth, imageHeight);

      if (index === images.length - 1) {
        var link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = '合成音符.png';
        link.click();
      }
    };
  });
} // 初始加载时随机显示4张图片


window.onload = displayRandomImages;