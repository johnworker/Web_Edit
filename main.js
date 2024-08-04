// 確保在使用 supabase 之前正確初始化
window.addEventListener('load', async function () {
    // 初始化 Supabase 客戶端
    const supabaseUrl = 'https://drpbpxkgediogjcsezvg.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycGJweGtnZWRpb2dqY3NlenZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1OTEzNzQsImV4cCI6MjAzODE2NzM3NH0.ELerknT6OGxn1_JhYYB6inlIMZMfRWaMGtnhBmd_7g0';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    try {
        // 從 Supabase 取得初始內容
        const { data, error } = await supabase.from('postedit').select('*');
        if (error) {
            console.error('錯誤:', error);
            return;
        }

        if (data.length > 0) {
            const postData = data[0]; // 假設只有一條資料

            // 設置頁面內容
            document.querySelector('.today_mark').innerHTML = postData.title;
            document.querySelector('.post_header').innerHTML = postData.postHeader;
            document.querySelector('.post_images').innerHTML = postData.postImages;

            // 為動態添加的圖片設置事件處理
            document.querySelectorAll('.post_images img').forEach(setupImageActions);
            document.querySelectorAll('.post_images img').forEach(setupDragAndDrop);
        }
    } catch (err) {
        console.error('加載內容時發生錯誤:', err);
    }

    document.getElementById('saveButton').addEventListener('click', async function () {
        const updatedContent = {
            title: document.querySelector('.today_mark').innerHTML,
            postHeader: document.querySelector('.post_header').innerHTML,
            postImages: document.querySelector('.post_images').innerHTML
        };

        try {
            // 發送資料到 Supabase
            const { data, error } = await supabase
                .from('posts')
                .update(updatedContent)
                .eq('id', 1); // 假設資料表中的資料ID為1

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
;