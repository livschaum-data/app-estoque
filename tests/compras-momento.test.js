const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');

test('adiciona a página Compras do momento no contexto de permanentes',()=>{
  assert.match(source,/data-page="compras-momento"/);
  assert.match(source,/page==='compras-momento'\?'permanent':'stock'/);
  assert.match(source,/\['compras','compras-permanentes','compras-momento'\]\.includes\(page\)/);
});

test('mostra a flag Momento na lista de compras e filtra a lista do momento',()=>{
  assert.match(source,/data-moment-item="\$\{escapeHtml\(item\.id\)\}"/);
  assert.match(source,/!isMoment\|\|item\.momentList/);
  assert.match(source,/momentList:Boolean\(checked\)/);
});

test('remove a marcação do momento ao registrar a compra',()=>{
  assert.match(source,/if\(inventoryMode==='permanent'\)item\.momentList=false/);
});

test('preserva a marcação ao salvar a edição do item',()=>{
  assert.match(source,/momentList:Boolean\(old\?\.momentList\)/);
});
