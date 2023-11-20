const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/nota-fiscal-qr-code', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  

  const url = req.body.url;

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.waitForTimeout(8000);

 const pageData = await page.evaluate(() => {

  console.log(document.querySelector('.txtTopo').innerHTML)
    return {
      nome_empresa: document.querySelector('.txtTopo').innerHTML,
      cnpj: document.querySelector('.text').innerHTML.trim().replace(/(\r\n|\n|\r|\t|CNPJ:)/gm, ""),
      total_pago: document.querySelector('.txtMax').innerHTML,
      valor_total: document.querySelectorAll ('.totalNumb')[1].innerHTML,
      total_desconto: document.querySelectorAll ('.totalNumb')[2].innerHTML,
      NOME_PRODUTO_1: document.querySelectorAll ('td .txtTit')[0].innerHTML,
      VALOR_PRODUTO_1: document.querySelectorAll ('td .valor')[0].innerHTML,
      CODE_PRODUTO_1: document.querySelectorAll ('td .RCod')[0].innerHTML.trim().replace(/(\r\n|\n|\r|\t|Código:)/gm, ""),
      QTD_PRODUTO_1: document.querySelectorAll ('td .Rqtd')[0].innerHTML.trim().replace(/(\r\n|\n|\r|\t|Qtde.:|<strong>|<\/strong>|&nbsp;)/gm, ""),
    };
  });

  await browser.close();

  res.send({
    "id": 33082,
    "EMPRESA": pageData.nome_empresa,
    "CNPJ": pageData.cnpj,
    "VALOR_TOTAL": pageData.valor_total,
    "TOTAL_DESCONTO": pageData.total_desconto,
    "TOTAL_PAGO": pageData.total_pago,
     "PRODUTO": {
       "CODE": pageData.CODE_PRODUTO_1,
       "NOME": pageData.NOME_PRODUTO_1,
       "VALOR": pageData.VALOR_PRODUTO_1, 
       "QTD": pageData.QTD_PRODUTO_1 
       
     },
  })
});


app.listen(3000);