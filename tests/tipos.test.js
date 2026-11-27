const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');

test('registra a criação do tipo para sincronizar e evitar descarte',()=>{
  assert.match(source,/clearDeleted\('types',value\)/);
  assert.match(source,/stockMeta=normalizeSyncMeta\(data\.syncMeta\)/);
});

test('preserva tipos criados mesmo com nome igual a um tipo permanente',()=>{
  assert.match(source,/wasCreated=type=>\{const removed=Date\.parse\(stockMeta\.deleted\.types\[type\]\)\|\|0,recreated=Date\.parse\(stockMeta\.restored\.types\[type\]\)\|\|0;return recreated>0&&recreated>=removed\}/);
  assert.match(source,/\|\|wasCreated\(type\)\)/);
});

test('continua removendo tipos excluídos',()=>{
  assert.match(source,/markDeleted\('types',oldType\)/);
});
