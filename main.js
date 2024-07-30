window.addEventListener('load', function () {
    // 加載已保存的內容
    if (localStorage.getItem('post_header')) {
        document.querySelector('.post_header').innerHTML = localStorage.getItem('post_header');
    }
    if (localStorage.getItem('post_images')) {
        document.querySelector('.post_images').innerHTML = localStorage.getItem('post_images');
    }

    // 保存變更
    document.getElementById('saveButton').addEventListener('click', function () {
        localStorage.setItem('post_header', document.querySelector('.post_header').innerHTML);
        localStorage.setItem('post_images', document.querySelector('.post_images').innerHTML);
        alert('變更已保存！');
    });
    
    // 處理圖片替換和刪除
    function setupImageActions(img) {
        let lastTouchTime = 0;

        img.addEventListener('dblclick', function () {
            handleImageAction(img);
        });

        img.addEventListener('touchend', function (event) {
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - lastTouchTime;
            if (timeDifference < 300 && timeDifference > 0) {
                handleImageAction(img);
            }
            lastTouchTime = currentTime;
        });
    }

    function handleImageAction(img) {
        const action = prompt('輸入 "換" 來替換圖片，輸入 "刪" 來刪除圖片，輸入 "調" 來調整圖片屬性:');
        if (action === '換') {
            const imageUpload = document.getElementById('imageUpload');
            imageUpload.click();
            imageUpload.onchange = function (event) {
                const reader = new FileReader();
                reader.onload = function () {
                    img.src = reader.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            };
        } else if (action === '刪') {
            img.remove();
        } else if (action === '調') {
            const newWidth = prompt('輸入新的寬度（例如：150px 或 50%）:');
            const newHeight = prompt('輸入新的高度（例如：150px 或 50%）:');
            const newPosition = prompt('輸入新的擺放位置（例如：left, right, center）:');
            if (newWidth) img.style.width = newWidth;
            if (newHeight) img.style.height = newHeight;
            if (newPosition) img.style.float = newPosition;
        }
    }

    document.querySelectorAll('.post_images img').forEach(setupImageActions);

    document.getElementById('addImageButton').addEventListener('click', function () {
        const imageUpload = document.getElementById('imageUpload');
        imageUpload.click();
        imageUpload.onchange = function (event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.onload = function () {
                    const newImg = document.createElement('img');
                    newImg.src = reader.result;
                    newImg.contentEditable = true;
                    newImg.style.width = '200px';
                    newImg.style.height = '200px';

                    const sectionId = document.getElementById('sectionSelector').value;
                    const targetSection = document.querySelector(`#${sectionId} .post_images .row:last-child`);

                    if (targetSection && targetSection.children.length < 2) {
                    targetSection.appendChild(newImg); // 添加到當前行
                } else {
                    const newRow = document.createElement('div');
                    newRow.classList.add('row');
                    newRow.appendChild(newImg); // 新建行並添加圖片
                    document.querySelector(`#${sectionId} .post_images`).appendChild(newRow);
                }

                    setupImageActions(newImg);
                    setupDragAndDrop(newImg);
                };
                reader.readAsDataURL(files[i]);
            }
        };
    });

    function setupDragAndDrop(img) {
        img.setAttribute('draggable', true);

        img.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('text/plain', event.target.id);
            event.target.classList.add('dragging');
        });

        img.addEventListener('dragover', function (event) {
            event.preventDefault();
        });

        img.addEventListener('drop', function (event) {
            event.preventDefault();
            const dragging = document.querySelector('.dragging');
            if (dragging && dragging !== img) {
                const draggingSrc = dragging.src;
                dragging.src = img.src;
                img.src = draggingSrc;
            }
        });

        img.addEventListener('dragend', function () {
            img.classList.remove('dragging');
        });

        img.addEventListener('touchstart', function (event) {
            event.preventDefault();
            img.classList.add('dragging');
        });

        img.addEventListener('touchmove', function (event) {
            event.preventDefault();
            const touch = event.touches[0];
            const dragging = document.querySelector('.dragging');
            const overElement = document.elementFromPoint(touch.clientX, touch.clientY);
            if (dragging && overElement && overElement.tagName === 'IMG' && dragging !== overElement) {
                const draggingSrc = dragging.src;
                dragging.src = overElement.src;
                overElement.src = draggingSrc;
            }
        });

        img.addEventListener('touchend', function () {
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                dragging.classList.remove('dragging');
            }
        });
    }

    document.querySelectorAll('.post_images img').forEach(setupDragAndDrop);
});