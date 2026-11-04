# Continuidade Codex — Terapia em Dia

Atualizado em 04/11/2026, horário de Brasília.

## Estado real desta etapa

**Auditoria de código e plano registrados. Sistema novo de contratos NÃO implementado, NÃO testado de ponta a ponta e NÃO publicado. Auditoria do banco de produção PENDENTE por falta de acesso.**

Pedido vigente: começar pelo diagnóstico antes de modificar o Supabase; não disponibilizar contratos às clientes antes de revisão jurídica; não publicar funcionalidade incompleta. A venda com o novo fluxo depende da conferência dos resultados pela Ádria. Essa orientação prevalece sobre a regra geral anterior de publicação automática a cada alteração.

## Origem correta

- Repositório: `adriafreitasprofissional/terapia-em-dia`.
- Produção conferida: `7ddf8fb8cb26a239104e27e339c584e884fbd256`.
- Vercel: `prj_lsst90Ygx2bjqDZOje3zOoHIvx95`, equipe `team_cGKElK91JRmqWIWDRpZw0scx`.
- Domínio: `www.adriafreitasterapeuta.com.br`.
- Deployment conferido READY: `dpl_5RDafGAcakdtM37DU8MTbUFACwXy`.
- Projeto Supabase identificado nos registros de produção: `pucaozwefrwcvwknfjal`; reconfirmar sua vinculação antes da inspeção autorizada. O conector atual não tem acesso a ele.
- As pastas locais antigas `terapia-em-dia` e `terapia-em-dia-27` não equivalem automaticamente à produção. Trabalhar a partir do commit confirmado, preservando alterações concorrentes.
- Clube oficial e Clube 2027 são projetos diferentes. Não trocar credenciais, bancos ou domínios para aproximar ambientes.

## O que já estava publicado antes desta auditoria

- Página `/tratamentos` com pacotes existentes e respectivos links do Mercado Pago.
- Oferta mensal de R$ 280,00, publicada pelo pedido anterior, com início em dezembro/2026 e quinta consulta gratuita nas condições então informadas.
- O link de R$ 280,00 foi criado e relido na conta ADRIAFREITAS, collector `17739565`, sem pagamento de teste real e sem débito automático recorrente.
- A etapa anterior passou no build Vercel e em verificação de página/CTA e apresentação mobile/desktop. Essas evidências NÃO comprovam contratos, elegibilidade ou assiduidade do novo pedido.
- **A oferta pública anterior ainda não exige Prata pago e não aplica as novas condições de assiduidade. Não considerar a nova modalidade comercial liberada. Nenhum conteúdo comercial foi alterado nesta auditoria.**

## Regras aprovadas para implementar, ainda não ativadas

- Cadastro único em `club_clients`; produtos/contratações distintos ligados ao mesmo identificador. Não criar segundo cadastro.
- Plano A: terapia individual R$ 340,00/mês, quatro sessões, uma por semana; equivalente a R$ 85,00/sessão; independente do Clube.
- Plano B: terapia R$ 280,00/mês, quatro sessões, uma por semana; equivalente a R$ 70,00/sessão; exige Prata pago, ativo e regular; cortesia não é elegível.
- Prata contratado separadamente no Clube. R$ 49,10 é valor previsto, PENDENTE de conferência no produto oficial. O código do repositório oficial consultado ainda contém R$ 49,91. A correção anterior no clone 2027 foi apenas de exibição e preservou o valor enviado ao checkout.
- Se a cliente não concluir o Prata, só oferecer R$ 340,00 mediante confirmação expressa. Cancelamento do Prata exige comunicação prévia para próxima renovação; sem aumento retroativo ou cobrança inesperada.
- Bônus apenas nos planos que expressamente o incluírem: quatro sessões regulares cumpridas; quinta gratuita em mês elegível. Duas/três sessões por faltas da cliente retiram o bônus no próximo mês elegível. Recuperar após cumprir quatro regulares em um mês. Sem bônus, quinta opcional por R$ 37,00, sem cobrança automática.
- Remarcação autorizada e realizada e cancelamento da terapeuta não prejudicam a assiduidade. Exercício não realizado não equivale a falta.
- Contrato por contratação: dados reais do Supabase, terapeuta, produto, valores, periodicidade, sessões, datas, regras e versão integral imutável após aceite.
- Aceite por cliente autenticada, leitura anterior, sem checkbox marcado, evidência de data/hora/identidade/contratação/versão; PDF em Documentos → Meus Contratos e no painel autorizado.
- Gravação exige termo separado, autorizar ou recusar expressamente; não derivar consentimento do contrato comercial. Finalidade, acesso, armazenamento, retenção, proteção e revogação precisam de definição e revisão jurídica antes de disponibilizar.
- Agenda existente deve ser reutilizada; confirmação de presença não pode ser condição para manter sessão já agendada; prazo regular de 24h, com exceções justificadas e registro confiável pela terapeuta.
- Entre aplicativos, somente identidade necessária e elegibilidade comercial; nenhum dado clínico compartilhado.

## Alterações desta etapa

- `CONTINUIDADE_CODEX.md`: este registro.
- `docs/DIAGNOSTICO_CONTRATOS_2026-11-04.md`: relatório com achados, limites, etapas e critérios de conclusão.
- Nenhum arquivo de aplicação alterado nesta etapa.
- Supabase: nenhuma migração, tabela, política, função, permissão ou dado alterado; nenhum registro real usado como teste.
- Mercado Pago: nenhuma preferência ou pagamento criado/alterado nesta etapa.
- Vercel: nenhuma funcionalidade promovida à produção nesta etapa. Documentos salvos em branch de auditoria, sem merge em `main`.

## Problemas encontrados e tratamento

1. Conector Supabase lista projetos de outra organização e recusa a listagem de tabelas de `pucaozwefrwcvwknfjal` com falta de permissão. Não houve contorno por chave local, outra conta ou outro banco. Necessário conectar a organização/projeto correto para auditar metadados, relações e RLS.
2. Não é possível afirmar que não existam tabelas de contrato, índices únicos ou políticas corretas sem essa inspeção. Nenhuma estrutura substituta foi criada.
3. APIs examinadas ainda incluem lógica comercial legada do Clube. Não reutilizar esse webhook como se provisionasse terapia sem adaptação e testes.
4. Há logs legados de token parcial e de pagamento completo no código consultado. Não executar esses fluxos com dados reais na auditoria; preparar correção específica após o diagnóstico, sem divulgar valores de credenciais.
5. Critérios novos de bônus diferem da oferta publicada anteriormente. Reconciliar texto, contratação e direitos existentes antes de ativar regras novas; não aplicá-las retroativamente.
6. Revisão jurídica não realizada. Não há texto contratual aprovado pronto para clientes.

## Verificações reais desta etapa

- Produção/repositório/commit e domínio identificados pela Vercel.
- Código canônico das APIs de cadastro, autenticação administrativa, portal, agenda, financeiro, atividades e pagamentos examinado.
- Busca de `contrato` no repositório retornou conteúdo incidental de tarô, sem identificar o fluxo solicitado. Busca textual não prova inexistência no banco.
- Permissão Supabase testada: recusada. Auditoria de esquema, relações físicas, unicidade e RLS permanece não executada.
- Nenhum build novo nem teste funcional do sistema novo executado: não houve implementação de aplicação. Os cenários obrigatórios permanecem pendentes, listados no diagnóstico.

## Próximo passo exato

1. Apresentar este diagnóstico à Ádria e permitir sua conferência; não avançar com alteração de banco nesta etapa.
2. Conectar o Supabase à organização/projeto real do Terapia com acesso de leitura de metadados. Não pedir senha ou service-role no chat.
3. Revalidar o commit publicado e obter somente tabelas/colunas/chaves/índices/FKs/RLS/grants/funções e migrações existentes, sem conteúdo clínico. Conferir `club_clients`, `therapy_client_access`, `therapy_professionals`, `appointments`, `appointment_history` e estruturas comerciais/contratuais que efetivamente existirem.
4. Verificar como o mesmo cadastro é reconhecido no Clube oficial e onde ficam produto Prata, regularidade financeira e cortesia. Não inferir pagamento apenas de `status = ativo` ou e-mail.
5. Completar diagnóstico de banco e apresentar proposta não destrutiva concreta, com migrações necessárias e validações, antes de executá-la. Conferir valor/link oficial do Prata e revisão jurídica.
6. Só então implementar uma unidade completa por vez, testar com dados fictícios, registrar resultados e pedir liberação da venda/publicação correspondente, conforme a instrução mais recente. Nunca marcar preparado ou commitado como implantado.

## Continuidade e uso do Codex

Este arquivo é o ponto de retomada. Não existe promessa de execução ao retornar créditos. Nenhuma automação nova foi criada nem automação existente foi alterada nesta etapa. Agendamentos antigos de outras frentes não equivalem à retomada deste projeto de contratos e não autorizam superar seus bloqueios.

Ao retomar, ler este arquivo, o diagnóstico, as mensagens mais recentes, `AGENTS.md`, Git status/diff e a versão publicada. Trabalhar apenas com uso disponível, sem comprar créditos ou mudar para cobrança por API. Salvar progresso antes de encerrar; atualizar estados de preparação, teste, aprovação e publicação separadamente. Não guardar credenciais, tokens de acesso, PDFs clínicos ou dados pessoais neste registro.
