# Guia: conectar o Casa em Ordem ao Supabase

Este guia prepara o banco e a autenticação para sincronizar o inventário entre o computador e o celular. O aplicativo salva uma única cópia do inventário por conta Supabase. Para ver o mesmo inventário em todos os aparelhos, entre com a mesma conta em cada um.

## 1. Criar o projeto

1. Entre no [painel do Supabase](https://supabase.com/dashboard) e crie um projeto novo.
2. Dê um nome, por exemplo `casa-em-ordem`, defina uma senha forte para o banco e guarde-a em um local seguro.
3. Escolha a região mais próxima. Para uso no Brasil, a região South America (São Paulo) reduz a distância até o banco. A região também define onde os dados principais do projeto ficam armazenados. [Ver regiões disponíveis](https://supabase.com/docs/guides/platform/regions).
4. Aguarde o projeto terminar de provisionar.

## 2. Criar a tabela protegida

1. No projeto, abra **SQL Editor**.
2. Abra o arquivo [`supabase.sql`](./supabase.sql) que está nesta mesma pasta.
3. Copie todo o conteúdo, cole no SQL Editor e selecione **Run**.
4. O resultado deve informar que os comandos foram executados. A tabela `public.home_inventory` guardará a ficha do inventário na coluna JSON `data`, com chave composta `user_id` + `id` (`principal`) e acesso limitado à própria conta por RLS. O script também cria o bucket privado `home-inventory-photos` e suas políticas para armazenar fotos.

O arquivo SQL pode ser executado novamente: ele cria a tabela se necessário, migra a estrutura inicial se já tiver sido criada, substitui as políticas com o mesmo nome e mantém as demais tabelas do projeto intactas.

## 3. Configurar o acesso por e-mail

1. No painel, abra a área **Authentication** e confira em **Sign In / Providers** se o provedor **Email** está habilitado.
2. Se a confirmação de e-mail estiver habilitada, o app avisará para confirmar o endereço depois de criar a conta. O link de confirmação retorna ao endereço de Site URL configurado abaixo. A URL do site também é usada nos e-mails de autenticação. [Configuração de redirecionamento do Supabase](https://supabase.com/docs/guides/auth/redirect-urls).

## 4. Permitir o endereço publicado no GitHub Pages

Depois de publicar o site, copie o endereço que aparece no ambiente `github-pages`. Em um repositório comum, ele tem um formato parecido com:

```text
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

No Supabase, abra **Authentication → URL Configuration**:

1. Cole o endereço publicado em **Site URL**, incluindo a barra final `/`.
2. Adicione esse mesmo endereço a **Redirect URLs** e salve.
3. Use o endereço real do seu site, sem os trechos `SEU-USUARIO` e `NOME-DO-REPOSITORIO`.

Se mais tarde mudar o nome do repositório ou usar um domínio próprio, atualize essas URLs.

## 5. Conferir a conexão configurada

O app já está ligado ao mesmo projeto Supabase do Aplicativo_cardapio. A URL e a chave pública `anon` ficam em `supabase-config.js`; não é preciso copiá-las para o formulário. Se decidir usar outro projeto, atualize nesse arquivo o Project URL e a chave Publishable/anon. [Tipos e uso das chaves Supabase](https://supabase.com/docs/guides/getting-started/api-keys).

> Use apenas a chave Publishable ou anon no navegador. Nunca use `sb_secret_...` ou `service_role` no app, no repositório ou em um dispositivo: essas chaves podem ignorar as políticas de acesso do banco.

## 6. Entrar no celular

1. Abra o mesmo endereço GitHub Pages no navegador do celular.
2. Abra **Configurações** e entre com o mesmo e-mail e senha do Aplicativo_cardapio.
3. Depois da primeira visita, o app pode ser adicionado à tela inicial pelo menu do navegador. A interface abre offline, mas a sincronização exige conexão com a internet.

As fotos são reduzidas no aparelho, enviadas para o bucket privado `home-inventory-photos` e referenciadas pelo inventário. Uma cópia local permite exibi-las neste aparelho offline. Fotos antigas em Base64 são migradas para o bucket quando ocorrer a próxima sincronização autenticada. Execute o `supabase.sql` atualizado para habilitar o Storage.

## Conferir se conectou

1. Cadastre um item no computador e abra **Configurações** para conferir o estado e o horário da última confirmação no painel de sincronização.
2. Abra o app no celular, entre na mesma conta e confira se o item aparece.
3. Altere a quantidade no celular e confira a atualização no computador.

## Se algo não funcionar

- **Falha na conexão**: confira se `supabase-config.js` aponta para o mesmo projeto Supabase e contém a chave Publishable/anon, nunca uma chave secreta.
- **Erro ao ler ou salvar dados**: confirme se executou todo o `supabase.sql` no projeto certo.
- **E-mail não chega**: confira spam e o e-mail cadastrado; o Supabase limita o envio de e-mails de teste em projetos sem SMTP próprio.
- **Confirmação volta para uma página incorreta**: corrija **Site URL** e **Redirect URLs**, salvando o endereço HTTPS exato do GitHub Pages.
- **Os aparelhos mostram inventários diferentes**: confira se ambos estão autenticados na mesma conta e no mesmo projeto Supabase.

O app mescla itens e configurações e confere a versão da linha antes de gravar. Se outro aparelho salvar ao mesmo tempo, ele tenta buscar a versão mais recente e mesclar novamente. Exclusões ficam registradas como metadados para não trazer de volta itens removidos.

## Referências oficiais

- [Criar e gerenciar projetos Supabase](https://supabase.com/dashboard)
- [Chaves de API e segurança](https://supabase.com/docs/guides/getting-started/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [URLs de redirecionamento](https://supabase.com/docs/guides/auth/redirect-urls)
- [Regiões Supabase](https://supabase.com/docs/guides/platform/regions)
