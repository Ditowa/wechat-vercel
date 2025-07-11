const crypto = require('crypto');

export default async (req, res) => {
  // ⚠️ 修改成您的Token（与微信后台一致）
  const TOKEN = "twb1554590178";
  
  // 微信验证 (GET请求)
  if (req.method === 'GET') {
    const { signature, timestamp, nonce, echostr } = req.query;
    
    // 1. 字典序排序
    const arr = [TOKEN, timestamp, nonce].sort();
    
    // 2. SHA1加密
    const sha1 = crypto.createHash('sha1');
    sha1.update(arr.join(''));
    const calcSignature = sha1.digest('hex');
    
    // 3. 验证签名
    if (calcSignature === signature) {
      res.status(200).send(echostr);
    } else {
      res.status(403).send('Token验证失败');
    }
  }
  
  // 消息处理 (POST请求)
  else if (req.method === 'POST') {
    // 回复测试消息
    res.setHeader('Content-Type', 'text/xml');
    res.send(`
      <xml>
        <ToUserName><![CDATA[toUser]]></ToUserName>
        <FromUserName><![CDATA[fromUser]]></FromUserName>
        <CreateTime>${Math.floor(Date.now()/1000)}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[你好！服务器已正常工作]]></Content>
      </xml>
    `);
  }
};
