const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabaseUrl = process.env.SUPABASE_URL || 'https://drpbpxkgediogjcsezvg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycGJweGtnZWRpb2dqY3NlenZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1OTEzNzQsImV4cCI6MjAzODE2NzM3NH0.ELerknT6OGxn1_JhYYB6inlIMZMfRWaMGtnhBmd_7g0';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(bodyParser.json());

app.post('/save', async (req, res) => {
  const { title, postHeaderOne, postHeaderTwo, postHeaderThree, postTitleOne, postTitleTwo, postTitleThree,postImagesOne, postImagesTwo, postImagesThree} = req.body;

  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ title, postHeaderOne, postHeaderTwo, postHeaderThree, postTitleOne, postTitleTwo, postTitleThree, postImagesOne, postImagesTwo, postImagesThree })
      .eq('id', 1);

    if (error) throw error;
    res.status(200).send('變更已成功保存！');
  } catch (error) {
    console.error('錯誤:', error);
    res.status(500).send(`錯誤: ${error.message}`);
  }
});

app.delete('/delete-video', async (req, res) => {
  const { videoPath } = req.body;

  try {
    const { data, error } = await supabase.storage.from('videos').remove([videoPath]);
    if (error) throw error;

    res.status(200).send('影片已成功刪除！');
  } catch (error) {
    console.error('錯誤:', error);
    res.status(500).send(`錯誤: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log('伺服器正在運行...');
});