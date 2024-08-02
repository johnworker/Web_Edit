const cors = require('cors');
app.use(cors());
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // 用於調用GitHub API
const app = express();

const GITHUB_TOKEN = 'process.env.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';
const REPO_OWNER = 'johnworker';
const REPO_NAME = 'Web_Edit';
const FILE_PATH = 'index.html';

app.use(cors({
    origin: 'https://web-edit-git-main-darkness-projects-4ba22d35.vercel.app/', // 允許前端域名的請求
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

app.post('/save', async (req, res) => {
    const { title, postHeader, postImages } = req.body;

    const newContent = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>貼文編輯器</title>
    <link rel="stylesheet" href="./style.css">
</head>

<body>
    <h1 class="today_mark" contenteditable="true">${title}</h1>
    <div class="post_section" id="section1">
        <div class="post_header" contenteditable="true">${postHeader}</div>
        <div class="post_images" contenteditable="true">${postImages}</div>
    </div>
    <div class="post_section" id="section2">
        <div class="post_header" contenteditable="true">${postHeader}</div>
        <div class="post_images" contenteditable="true">${postImages}</div>
    </div>
        <div class="post_section" id="section3">
        <div class="post_header" contenteditable="true">${postHeader}</div>
        <div class="post_images" contenteditable="true">${postImages}</div>
    </div>
    <button id="saveButton">保存變更</button>
    <script src="./main.js"></script>
</body>
</html>`;

    try {
        // 獲取當前文件的SHA
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch file data: ${response.statusText}`);
        }

        const fileData = await response.json();
        const sha = fileData.sha;

        // 更新文件內容
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update index.html',
                content: Buffer.from(newContent).toString('base64'),
                sha: sha
            })
        });

        if (updateResponse.ok) {
            res.send('變更已成功保存！');
        } else {
            const errorText = await updateResponse.text();
            throw new Error(`Failed to update file: ${errorText}`);
        }
    } catch (error) {
        console.error('錯誤:', error);
        res.status(500).send(`錯誤: ${error.message}`);
    }
});

app.listen(3000, () => {
    console.log('伺服器正在運行...');
});
