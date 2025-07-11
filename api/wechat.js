const crypto = require('crypto');

export default async (req, res) => {
  // 确保Token与微信后台一致
  const TOKEN = "twb1554590178";
  
  // GET请求验证
  if (req.method === 'GET') {
    const { signature, timestamp, nonce, echostr } = req.query;
    
    // 修复1: 正确的签名计算方式
    const paramArr = [TOKEN, timestamp, nonce];
    const sortedStr = paramArr.sort().join('');
    const sha1 = crypto.createHash('sha1');
    sha1.update(sortedStr);
    const calcSignature = sha1.digest('hex');
    
    if (calcSignature === signature) {
      res.status(200).send(echostr);
    } else {
      res.status(403).send(`Token验证失败! 计算签名:${calcSignature} 接收签名:${signature}`);
    }
  } 
  // POST消息处理
  else if (req.method === 'POST') {
    // 修复2: 纯净的XML响应
    res.setHeader('Content-Type', 'text/xml');
    res.send(`
      <xml>
        <ToUserName><![CDATA[toUser]]></ToUserName>
        <FromUserName><![CDATA[fromUser]]></FromUserName>
        <CreateTime>${Math.floor(Date.now()/1000)}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[服务器已恢复正常工作]]></Content>
      </xml>
    `);
  }
};
