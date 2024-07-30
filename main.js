document.getElementById('saveForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const content = document.documentElement.outerHTML;
    document.getElementById('contentInput').value = content;
    this.submit();
});

function uploadImage() {
    const formData = new FormData();
    const imagefile = document.querySelector('#imageUpload').files[0];
    formData.append('image', imagefile);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert('圖片上傳成功！');
    })
    .catch(error => {
        console.error(error);
        alert('圖片上傳失敗。');
    });
}
