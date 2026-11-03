const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');

test('mantém metadados de exclusão separados',()=>{
  assert.match(source,/permanentSyncMeta/);
  assert.match(source,/inventoryMode==='permanent'\?'permanentSyncMeta':'syncMeta'/);
});

test('sincroniza e inclui fotos das duas coleções no backup',()=>{
  assert.match(source,/\.\.\.state\.stockItems,\.\.\.state\.permanentItems/);
  assert.match(source,/\.\.\.backup\.items,\.\.\.backup\.permanentItems/);
});

test('usa decisões próprias sem conversão temporária',()=>{
  assert.match(source,/'decision-ok':item\.restockDecision==='ok'/);
  assert.match(source,/'decision-acquire':item\.restockDecision==='adquirir'/);
  assert.match(source,/'decision-replace':item\.restockDecision==='substituir'/);
  assert.doesNotMatch(source,/const mapped=\{ok:'nao-repor'/);
});

test('limpa filtros ao alternar entre as coleções',()=>{
  assert.match(source,/if\(nextMode!==inventoryMode\)\{activeType='';shoppingTypes=new Set\(\)/);
});
