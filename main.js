// 確保在使用 supabase 之前正確初始化
window.addEventListener('load', async function () {
    // 初始化 Supabase 客戶端
    const supabaseUrl = 'https://drpbpxkgediogjcsezvg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycGJweGtnZWRpb2dqY3NlenZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1OTEzNzQsImV4cCI6MjAzODE2NzM3NH0.ELerknT6OGxn1_JhYYB6inlIMZMfRWaMGtnhBmd_7g0';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    try {
        // 從 Supabase 取得初始內容
        const { data, error } = await supabase.from('posts').select('*');
        if (error) {
            console.error('錯誤:', error);
            return;
        }

        if (data.length > 0) {
            const postData = data[0]; // 假設只有一條資料

            // 設置頁面內容
            document.querySelector('.today_mark').innerHTML = postData.title;
            document.querySelector('.post_header_one').innerHTML = postData.postHeaderOne;
            document.querySelector('.post_header_two').innerHTML = postData.postHeaderTwo;
            document.querySelector('.post_header_three').innerHTML = postData.postHeaderThree;
            document.querySelector('.post_images_one').innerHTML = postData.postImagesOne;
            document.querySelector('.post_images_two').innerHTML = postData.postImagesTwo;
            document.querySelector('.post_images_three').innerHTML = postData.postImagesThree;


            // 為動態添加的圖片設置事件處理
            document.querySelectorAll('.post_images_one img').forEach(setupImageActions);
            document.querySelectorAll('.post_images_one img').forEach(setupDragAndDrop);
            document.querySelectorAll('.post_images_two img').forEach(setupImageActions);
            document.querySelectorAll('.post_images_two img').forEach(setupDragAndDrop);
            document.querySelectorAll('.post_images_three img').forEach(setupImageActions);
            document.querySelectorAll('.post_images_three img').forEach(setupDragAndDrop);
        }
    } catch (err) {
        console.error('加載內容時發生錯誤:', err);
    }

    // 讀取最新資料並更新頁面內容的函數
    async function loadLatestData() {
        try {
            // 從 Supabase 取得最新資料
            const { data, error } = await supabase.from('posts').select('*');
            if (error) {
                console.error('讀取資料時發生錯誤:', error);
                return;
            }

            if (data && data.length > 0) {
                const postData = data[0]; // 假設只有一條資料
                // 設置頁面內容
                document.querySelector('.today_mark').innerHTML = postData.title || '';
                document.querySelector('.post_header_one').innerHTML = postData.postHeaderOne || '';
                document.querySelector('.post_header_two').innerHTML = postData.postHeaderTwo || '';
                document.querySelector('.post_header_three').innerHTML = postData.postHeaderThree || '';
                document.querySelector('.post_images_one').innerHTML = postData.postImagesOne || '';
                document.querySelector('.post_images_two').innerHTML = postData.postImagesTwo || '';
                document.querySelector('.post_images_three').innerHTML = postData.postImagesThree || '';
            }
        } catch (err) {
            console.error('讀取資料時發生錯誤:', err);
        }
    }

    // 在頁面加載時自動讀取最新資料
    window.addEventListener('load', loadLatestData);

    // 為讀取按鈕設置事件監聽器
    document.getElementById('loadButton').addEventListener('click', loadLatestData);

    // 保存按鈕的事件監聽器
    document.getElementById('saveButton').addEventListener('click', async function () {
        const updatedContent = {
            title: document.querySelector('.today_mark').innerHTML,
            postHeaderOne: document.querySelector('.post_header_one').innerHTML,
            postHeaderTwo: document.querySelector('.post_header_two').innerHTML,
            postHeaderThree: document.querySelector('.post_header_three').innerHTML,
            postImagesOne: document.querySelector('.post_images_one').innerHTML,
            postImagesTwo: document.querySelector('.post_images_two').innerHTML,
            postImagesThree: document.querySelector('.post_images_three').innerHTML
        };

        try {
            // 發送資料到 Supabase
            const { data, error } = await supabase
                .from('posts')
                .upsert({ id: 1, ...updatedContent }); // 使用 upsert 方法，如果記錄存在則更新，否則插入

            if (error) {
                console.error('保存失敗:', error);
                alert(`保存失敗：${error.message || '未知錯誤'}`);
            } else {
                alert('變更已成功保存！');
            }
        } catch (err) {
            console.error('捕捉到的錯誤:', err);
            alert(`發生錯誤：${err.message || '未知錯誤'}`);
        }
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
            removeImageAndRearrange(img);
        } else if (action === '調') {
            const newWidth = prompt('輸入新的寬度（例如：150px 或 50%）:');
            const newHeight = prompt('輸入新的高度（例如：150px 或 50%）:');
            const newPosition = prompt('輸入新的擺放位置（例如：left, right, center）:');
            if (newWidth) img.style.width = newWidth;
            if (newHeight) img.style.height = newHeight;
            if (newPosition) img.style.float = newPosition;
        }
    }

    function removeImageAndRearrange(img) {
        const row = img.parentElement;
        const section = row.parentElement;
    
        img.remove(); // 移除圖片
    
        // 將所有剩下的圖片集合起來
        const images = section.querySelectorAll('img');
        const allImages = Array.from(images);
    
        // 清空現有的行
        section.innerHTML = '';
    
        // 重新排列圖片
        let newRow;
        allImages.forEach((image, index) => {
            if (index % 2 === 0) { // 每兩個圖片新建一行
                newRow = document.createElement('div');
                newRow.classList.add('row');
                section.appendChild(newRow);
            }
            newRow.appendChild(image);
        });
    
        // 重新設置每個圖片的操作
        allImages.forEach(setupImageActions);
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
    
                    // 使用 JavaScript 設置初始寬度和高度
                    newImg.style.width = window.innerWidth > 768 ? '200px' : '180px';
                    newImg.style.height = window.innerWidth > 768 ? '200px' : '180px';
    
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
    ;
});

// 新增影片設置處理
document.getElementById('addVideoButton').addEventListener('click', function () {
    const videoUpload = document.getElementById('videoUpload');
    videoUpload.click();
    videoUpload.onchange = function (event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function () {
                // 創建影片容器
                const videoContainer = document.createElement('div');
                videoContainer.classList.add('video-container');

                // 創建影片元素
                const newVideo = document.createElement('video');
                newVideo.src = reader.result;
                newVideo.controls = true;
                newVideo.style.width = '300px';
                newVideo.style.height = '200px';

                // 創建刪除按鈕
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '刪除';
                deleteButton.classList.add('delete-video-button');
                deleteButton.onclick = function () {
                    videoContainer.remove();
                };

                // 將影片和刪除按鈕添加到容器中
                videoContainer.appendChild(newVideo);
                videoContainer.appendChild(deleteButton);

                // 添加到選定的貼文部分
                const sectionId = document.getElementById('sectionSelector').value;
                const targetSection = document.querySelector(`#${sectionId} .post_images .row:last-child`);

                if (targetSection && targetSection.children.length < 2) {
                    targetSection.appendChild(videoContainer); // 添加到當前行
                } else {
                    const newRow = document.createElement('div');
                    newRow.classList.add('row');
                    newRow.appendChild(videoContainer); // 新建行並添加影片
                    document.querySelector(`#${sectionId} .post_images`).appendChild(newRow);
                }
            };
            reader.readAsDataURL(files[i]);
        }
    };
});