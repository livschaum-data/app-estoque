# Casa em Ordem

Aplicação web responsiva para organizar despensa, itens de beleza e remédios por local da casa. As categorias iniciais de beleza e remédios foram retiradas das abas de categoria das planilhas que acompanham este projeto. Os dados e históricos das planilhas não são importados.

## Abrir e usar

Abra `index.html` em um navegador para usar no computador. Sem uma conta Supabase configurada, os cadastros ficam salvos apenas nesse navegador e aparelho. O botão no topo exporta um backup JSON.

## Publicar no GitHub Pages

O fluxo em `.github/workflows/pages.yml` publica o app automaticamente quando houver envio para a branch `main`. No GitHub, crie um repositório, envie os arquivos do projeto e selecione **Settings → Pages → Build and deployment → Source: GitHub Actions**. Acompanhe a publicação na aba **Actions**; o endereço aparecerá no ambiente `github-pages` quando o primeiro envio terminar. Se a branch principal tiver outro nome, atualize `main` no fluxo antes de enviar.

O fluxo de publicação inclui somente os arquivos necessários para executar o app. As planilhas Excel locais são ignoradas pelo Git e não são copiadas para o site. Como os inventários podem conter informações pessoais, mantenha esses arquivos fora de um repositório público.

## Sincronizar entre computador e celular

Para compartilhar o mesmo inventário, publique o app em HTTPS e configure um projeto Supabase:

1. No painel Supabase, execute o conteúdo de `supabase.sql` no SQL Editor.
2. Em **Authentication → URL Configuration** no Supabase, defina o endereço do GitHub Pages como **Site URL** e inclua-o em **Redirect URLs**. Use o endereço publicado que o GitHub mostrar (no formato `https://<usuário>.github.io/<repositório>/` para um site de projeto).
3. Em **Configurações** no app, informe a URL do projeto, a chave pública anon/publishable e seu e-mail e senha.
4. Se necessário, confirme o e-mail enviado pelo Supabase e volte ao app para entrar. Abra a mesma página publicada nos outros aparelhos e entre com a mesma conta.

O acesso à tabela usa Supabase Auth e RLS: cada conta só lê e altera sua própria linha. Não use uma service role key no navegador. Fotos são compactadas no aparelho e incluídas nos dados sincronizados.

O app é instalável como atalho de tela inicial em navegadores compatíveis e mantém a interface disponível sem conexão após a primeira visita; a sincronização com Supabase exige internet.

Para um passo a passo ilustrado da configuração no painel Supabase, consulte [GUIA_SUPABASE.md](./GUIA_SUPABASE.md).
