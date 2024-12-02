// 音符图片的路径
const binaryNotes = [
    '/img/notes/1.png', '/img/notes/2.png', '/img/notes/3.png', '/img/notes/4.png',
    '/img/notes/12.png', '/img/notes/23.png', '/img/notes/34.png', '/img/notes/14.png',
    '/img/notes/13.png', '/img/notes/24.png', '/img/notes/123.png', '/img/notes/234.png',
    '/img/notes/134.png', '/img/notes/124.png', '/img/notes/1234.png'
];

const ternaryNotes = [
    '/img/notes/三1.png', '/img/notes/三2.png', '/img/notes/三3.png', '/img/notes/三12.png',
    '/img/notes/三23.png', '/img/notes/三13.png', '/img/notes/三123.png'
];

const allNotes = [
    ...binaryNotes, ...ternaryNotes
];

// 难度设置
const difficultySets = {
    1: {
        binary: ['/img/notes/1.png', '/img/notes/3.png', '/img/notes/13.png', '/img/notes/134.png', '/img/notes/123.png', '/img/notes/1234.png'],
        ternary: ['/img/notes/三1.png', '/img/notes/三3.png', '/img/notes/三13.png', '/img/notes/三123.png'],
        all: [...binaryNotes, ...ternaryNotes]
    },
    2: {
        binary: ['/img/notes/1.png', '/img/notes/3.png', '/img/notes/13.png', '/img/notes/134.png', '/img/notes/123.png', '/img/notes/1234.png', '/img/notes/14.png', '/img/notes/12.png', '/img/notes/23.png', '/img/notes/34.png', '/img/notes/124.png', '/img/notes/234.png'],
        ternary: ['/img/notes/三1.png', '/img/notes/三3.png', '/img/notes/三13.png', '/img/notes/三123.png', '/img/notes/三12.png', '/img/notes/三23.png'],
        all: [...binaryNotes, ...ternaryNotes]
    },
    3: {
        binary: ['/img/notes/1.png', '/img/notes/3.png', '/img/notes/13.png', '/img/notes/134.png', '/img/notes/123.png', '/img/notes/1234.png', '/img/notes/14.png', '/img/notes/12.png', '/img/notes/23.png', '/img/notes/34.png', '/img/notes/124.png', '/img/notes/234.png', '/img/notes/2.png', '/img/notes/4.png', '/img/notes/24.png'],
        ternary: ['/img/notes/三1.png', '/img/notes/三3.png', '/img/notes/三13.png', '/img/notes/三123.png', '/img/notes/三12.png', '/img/notes/三23.png', '/img/notes/三2.png'],
        all: [...binaryNotes, ...ternaryNotes]
    }
};

// 随机显示图片，允许重复
function displayRandomImages() {
    const imageCount = parseInt(document.getElementById('imageCount').value, 10);
    const noteType = document.getElementById('noteType').value;
    const difficulty = parseInt(document.getElementById('difficulty').value, 10);

    let selectedImages = difficultySets[difficulty][noteType] || [];

    // 清空现有的图片显示
    const container = document.getElementById('imageContainer');
    container.innerHTML = '';

    // 随机选择指定数量的图片，允许重复
    for (let i = 0; i < imageCount; i++) {
        const randomIndex = Math.floor(Math.random() * selectedImages.length);
        const imgElement = document.createElement('img');
        imgElement.src = selectedImages[randomIndex];
        imgElement.alt = '音符';
        container.appendChild(imgElement);
    }
}

// 导出合成图片
function exportImages() {
    const container = document.getElementById('imageContainer');
    const images = container.getElementsByTagName('img');

    if (images.length === 0) {
        alert('没有随机图片可导出！');
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const imageWidth = 150;
    const imageHeight = 150;
    const padding = 10;
    const totalWidth = (imageWidth + padding) * images.length - padding;
    const totalHeight = imageHeight + padding * 2;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Array.from(images).forEach((img, index) => {
        const x = index * (imageWidth + padding);
        const y = padding;

        const imgElement = new Image();
        imgElement.src = img.src;

        imgElement.onload = function () {
            ctx.drawImage(imgElement, x, y, imageWidth, imageHeight);

            if (index === images.length - 1) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = '合成音符.png';
                link.click();
            }
        };
    });
}

// 初始加载时随机显示4张图片
window.onload = displayRandomImages;
