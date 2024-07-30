const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // 用於調用GitHub API
const app = express();

const GITHUB_TOKEN = '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';
const REPO_OWNER = 'johnworker';
const REPO_NAME = 'Web_Edit';
const FILE_PATH = 'index.html';

app.use(bodyParser.json());

app.post('/save', (req, res) => {
    const { postHeader, postImages } = req.body;

    // 構建新的HTML內容
    const newContent = `<!DOCTYPE html>
<html>
<head>
    <title>貼文編輯器</title>
</head>
<body>
    <div class="post_header">${postHeader}</div>
    <div class="post_images">${postImages}</div>
</body>
</html>`;

    // 使用GitHub API更新文件
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update index.html',
            content: Buffer.from(newContent).toString('base64'),
            sha: 'current_sha_of_the_file' // 需要獲取當前文件的SHA
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.commit) {
            res.send('變更已保存');
        } else {
            res.status(500).send('保存失敗');
        }
    })
    .catch(error => res.status(500).send('錯誤: ' + error.message));
});

app.listen(3000, () => {
    console.log('伺服器正在運行...');
});
