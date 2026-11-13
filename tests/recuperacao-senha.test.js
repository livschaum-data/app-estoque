const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');

test('escuta o evento de recuperação enviado pelo Supabase',()=>{
  assert.match(source,/onAuthStateChange\(\(event,currentSession\)=>\{if\(event==='PASSWORD_RECOVERY'\)/);
  assert.match(source,/function showPasswordRecovery\(\)/);
});

test('não entra na sincronização enquanto a nova senha não for definida',()=>{
  assert.match(source,/if\(recoveryMode\|\|recovering\|\|recoveryPending\(session\?\.user\?\.id\)\)/);
  assert.match(source,/if\(session\?\.user\)return showPasswordRecovery\(\)/);
});

test('oferece link de recuperação e grava a nova senha',()=>{
  assert.match(source,/resetPasswordForEmail\(email,options\)/);
  assert.match(source,/id="sbForgot"/);
  assert.match(source,/auth\.updateUser\(\{password\}\)/);
  assert.match(source,/localStorage\.removeItem\(RECOVERY_KEY\)/);
});

test('mantém a recuperação pendente mesmo após recarregar a página',()=>{
  assert.match(source,/const RECOVERY_KEY=KEY\+'-password-recovery'/);
  assert.match(source,/function recoveryPending\(userId\)/);
  assert.match(source,/history\.replaceState/);
});
