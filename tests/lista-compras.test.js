const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');

test('lista de compras usa apenas a decisão de repor',()=>{
  assert.match(source,/:item\.restockDecision==='repor'\)/);
  assert.doesNotMatch(source,/itemQuantity\(item\)<=0&&item\.restockDecision==='repor'/);
});

test('mantém a decisão ao editar item que já tinha estoque',()=>{
  assert.match(source,/quantity>0&&\(!old\|\|itemQuantity\(old\)<=0\)\?'':old\?\.restockDecision\|\|''/);
});

test('permanentes continuam usando adquirir ou substituir',()=>{
  assert.match(source,/isPermanent\?\['adquirir','substituir'\]\.includes\(item\.restockDecision\)/);
});
