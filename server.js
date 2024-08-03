const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(bodyParser.json());

app.post('/save', async (req, res) => {
  const { title, postHeader, postImages } = req.body;

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, postHeader, postImages }]);

    if (error) throw error;
    res.status(200).send('變更已成功保存！');
  } catch (error) {
    console.error('錯誤:', error);
    res.status(500).send(`錯誤: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log('伺服器正在運行...');
});
