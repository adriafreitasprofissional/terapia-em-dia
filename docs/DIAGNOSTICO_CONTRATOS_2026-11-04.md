# Diagnóstico de contratos digitais — Terapia em Dia

Data: 04/11/2026. Escopo desta entrega: auditoria de código, limites de acesso e plano anterior a alterações de banco. Estado: diagnóstico de aplicação concluído no recorte examinado; auditoria de banco pendente. Nenhuma nova funcionalidade liberada para venda.

## Base examinada

Repositório `adriafreitasprofissional/terapia-em-dia`, produção `7ddf8fb8cb26a239104e27e339c584e884fbd256`, deployment READY `dpl_5RDafGAcakdtM37DU8MTbUFACwXy`, domínio `www.adriafreitasterapeuta.com.br`. A fonte canônica foi consultada pelo GitHub, não substituída pelas cópias locais antigas.

## Achados

| Área | Evidência observada | Consequência para a implementação |
| --- | --- | --- |
| Identidade | `src/app/api/terapia/admin/clientes/route.ts` busca `club_clients` por ID ou e-mail antes de criar; associa `therapy_client_access.client_id` | Reutilizar a pessoa; conferir unicidade, FKs e concorrência no banco antes de criar novas estruturas |
| Profissional | `src/app/api/terapia/admin/_auth.ts` valida token por `auth.getUser` e consulta `club_clients`/`therapy_professionals` | Reutilizar a autenticação; autorização e vínculo devem ser conferidos no servidor também para contratos/PDF |
| Vínculo | Cadastro procura vínculo ativo e bloqueia associação simultânea a outro profissional; parte do vínculo usa nome textual `professional` | Confirmar modelo real e IDs; não alterar essa regra nem converter nomes em IDs sem diagnóstico de impacto |
| Portal | API `src/app/api/terapia/portal/route.ts` e tela `src/app/terapia/acesso/[token]/page.tsx` usam acesso individual por token; não foi localizado Meus Contratos nesse fluxo | Aceite exige prova da identidade autenticada e autorização da contratação; acesso por link isolado não deve ser presumido suficiente |
| Agenda | `appointments`, `professional_schedule_settings`, RPC de conflitos e `appointment_history` já são referenciados | Reutilizar agenda/histórico, não reconstruir |
| Cancelamento/remarcação | API `src/app/api/terapia/agenda-cliente/route.ts` contém cancelamento direto e remarcação de horário; não foi localizado bloqueio de 24h nesse fluxo | Acrescentar regra contratual e exceções justificadas após aprovação, sem cancelamento automático por falta de confirmação |
| Comparecimento | API administrativa aceita status e grava histórico; referencia `realizado`/`cancelado` | Definir distinção de falta da cliente, cancelamento da terapeuta e remarcação realizada antes de calcular bônus |
| Histórico | Escrita de `appointment_history` ocorre separadamente da atualização; no trecho examinado não há transação nem verificação de erro dessa escrita | Auditoria de bônus/contrato não pode depender de histórico potencialmente incompleto sem corrigir a atomicidade no fluxo necessário |
| Atividades | `therapy_quizzes` e `therapy_quiz_responses` já usados; preview administrativo é impedido de salvar respostas | Integrar a área existente e manter respostas independentes de comparecimento |
| Financeiro | API `src/app/api/terapia/admin/financeiro/route.ts` consulta `appointments` | Não presumir que isso seja o cadastro completo de produtos, contratos ou assinaturas; conferir o banco |
| Pagamentos legados | Criar preferência aceita `valor` do corpo, identifica produto como Clube e aponta retorno/webhook ao domínio do Clube | Não usar essa rota como implementação pronta dos planos terapêuticos; preço e elegibilidade novos devem ser resolvidos no servidor |
| Webhook legado | `src/lib/mercadopago/processarWebhook.ts` consulta `checkout_pendentes`, cria cadastro com produto Clube e retorna sem provisionar terapia para cliente existente | Não atende compra de terapia por cliente nova/existente e múltiplos produtos do pedido; precisa fluxo próprio preservando o cadastro |
| Logs | Criação de preferência contém log de prefixo de token; processador loga pagamento e checkout completos | Correção necessária no escopo de pagamento; não reproduzir dados reais nem copiar segredos no relatório |
| Oferta mensal | `/tratamentos` já contém link público de R$ 280,00 sem consulta de Prata ou aceite | Nova regra promocional ainda não aplicada; não anunciar o sistema completo como disponível |
| Prata | Repositório oficial `adriafreitasprofissional/clube-do-taro`, `src/app/components/sections/PlanosMensais.tsx`, blob `45ffac598e73432174df61f7afc5f8bfd05f9ffd`, contém `valor: 49.91` | R$ 49,10 segue pendente de confirmação no produto oficial; não alterar Clube 2026 nem usar somente o preço de exibição do clone como prova |
| Contratos e consentimento | Fluxos examinados e busca textual não identificaram o sistema solicitado | Não é prova de ausência física de tabelas; inspecionar esquema antes de propor/adicionar qualquer tabela |

## Banco: o que não foi possível confirmar

A conexão Supabase lista projetos de outra organização e recusou a listagem de tabelas do projeto identificado para o Terapia (`pucaozwefrwcvwknfjal`). Não houve consulta de pacientes, alteração de dados, execução de DDL ou migração. Não foi tentado contornar a permissão por credencial local ou outro projeto.

Continuam pendentes: estrutura e RLS reais; índices únicos de identidade; FK entre Auth e cliente; contratos já existentes; armazenamento/PDFs; trilha de auditoria; catálogo oficial de produtos; pagamentos, assinaturas e cortesia; separação entre profissionais e aplicativos. Não é seguro criar cadastros ou contratos por suposição.

## Plano de implementação, com unidades verificáveis

1. **Auditoria do banco e conciliação de identidade/produtos.** Ler somente metadados; mapear contrato/assinatura e comprovação de pagamento existentes; conferir produto oficial do Prata. Entrega: diagrama lógico ou mapa de vínculos e proposta concreta de migração não destrutiva, submetida à conferência antes de executar.
2. **Contratações e preços no servidor.** Reutilizar `club_clients`; representar múltiplas contratações; Plano A340, B280 condicionado a Prata pago/ativo/regular, sem cortesia; retorno ao plano individual só após confirmação expressa. Pagamento verificado no provedor, com idempotência, sem criar segunda pessoa ou alterar produto anterior.
3. **Contratos versionados e aceite.** Texto revisado juridicamente; dados da contratação reais e snapshot integral imutável; identidade autenticada; aceite idempotente e evidência no servidor; leitura antes do aceite; sem caixas pré-marcadas; testes de acesso cruzado e de retry.
4. **PDF e documentos.** Gerar comprovante a partir da versão aceita e mesmos dados/evidências; disponibilizar à paciente e profissional autorizado; download privado e persistente; versões antigas preservadas. Entrega completa exige teste de geração, acesso e recuperação, não apenas botão.
5. **Consentimento de gravação separado.** Definir finalidade, operadores, armazenamento, prazo e revogação; revisão jurídica; autorizar/recusar com igual clareza; bloquear gravação sem consentimento válido. Não mudar gravações existentes por presunção.
6. **Agenda e assiduidade.** Reutilizar agenda e status; prazo24h e exceções justificadas; confirmação separada do comparecimento; quatro sessões regulares, quinta elegível, perda/recuperação do bônus, correção justificada e auditoria. R$37 para quinta opcional exige consentimento, sem cobrança automática.
7. **Integração comercial entre apps.** Identidade/vínculo verificável e elegibilidade mínima; não transmitir dados clínicos. Contratos de cada produto permanecem no aplicativo responsável. Cancelamento do Prata só afeta renovação futura após comunicação prevista no contrato, sem retroatividade.
8. **Homologação e liberação.** Executar a matriz abaixo, apresentar relatório real e solicitar a liberação da venda. Publicar somente unidades completas, aprovadas e verificadas; registrar commit, deployment, domínio e plano de reversão.

As unidades são dependentes. Não publicar tela ou cobrança que prometa a próxima unidade ainda inexistente. A ordem poderá ser refinada após inspecionar o banco, preservando o diagnóstico antes de mudanças.

## Matriz obrigatória — ainda pendente

| Cenário | Critério de aceite | Estado nesta etapa |
| --- | --- | --- |
| Cliente nova | Um cadastro e uma contratação; retry não duplica | Não executado |
| Cliente existente | Reutiliza ID, preserva produtos anteriores | Não executado |
| Múltiplos produtos | Contratos/pagamentos distintos, pessoa única | Não executado |
| Prata pago/ativo/regular | Concede B280 com evidência verificável | Não executado |
| Cortesia | Não concede promoção por cortesia | Não executado |
| Adesão incompleta | Oferece A340, exige confirmação expressa | Não executado |
| Prata cancelado | Sem mudança retroativa; próxima renovação após aviso | Não executado |
| Duas/três sessões por faltas | Registra perda do próximo bônus elegível | Não executado |
| Quatro sessões regulares | Registra manutenção/recuperação do benefício | Não executado |
| Quinta sessão | Gratuita quando elegível; R$37 opcional quando não | Não executado |
| Remarcação autorizada realizada | Não penaliza | Não executado |
| Cancelamento pela terapeuta | Não penaliza a cliente | Não executado |
| Aceite eletrônico | Leitura anterior, identidade, versão/evidência imutáveis | Não executado |
| Recusa de gravação | Mantém acompanhamento e impede gravação | Não executado |
| PDF | Recupera documento aceito e comprovante corretos | Não executado |
| Administração | Só profissional autorizado; preview não aceita pela paciente | Não executado |
| Celular/PWA | Leitura, aceite, retorno e download funcionam | Não executado |
| Concorrência e webhook repetido | Não duplica cliente, contrato, cobrança nem evidência | Não executado |
| Isolamento | Outra paciente/profissional não lê nem aceita documento alheio | Não executado |

## Resultado da execução

- Realizado: identificação da produção, leitura de fontes canônicas, identificação das estruturas referenciadas, avaliação dos fluxos e limites, relatório e continuidade no GitHub.
- Não realizado: implementação do novo sistema, migrações, acesso ao conteúdo de produção, testes dos cenários novos, nova cobrança ou liberação de venda.
- Arquivos novos: `CONTINUIDADE_CODEX.md` e este diagnóstico. Nenhuma alteração em fontes de aplicação.
- Revisão jurídica e valor oficial do Prata permanecem pendentes. Este documento registra requisitos de negócio; não é contrato jurídico aprovado nem declaração de conformidade legal.
- Não houve build novo: mudanças são documentais; o build aprovado do deployment anterior não é apresentado como teste do novo sistema.
- Próxima ação: conferir este relatório e disponibilizar acesso de leitura de metadados ao Supabase real para completar a auditoria de banco antes de qualquer proposta executável.
