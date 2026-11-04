# Li Stilus | Terapia em Dia — integração de serviços

## Implementado nesta branch (não publicado)
- Personalização exclusiva da Lilian no painel: logotipo existente em `/imagens/lilian-logo.png`, cores pêssego/terracota, nome Li Stilus.
- Menu **Meus serviços** apenas para a identidade Lilian.
- Cadastro por profissional autenticado: nome, descrição, preço em centavos, sessões, duração e tipo (sessão ou pacote).
- Estados rascunho/publicado, página pública `/li-stilus`. A publicação no catálogo NÃO libera cobrança.
- SQL `supabase/007_li_stilus_services.sql` pendente de aplicação, porque o conector Supabase retorna erro de autenticação.

## Antes de produção
1. Corrigir conexão do Supabase, aplicar e verificar migração; criar serviço de teste, ler via API e confirmar que outro profissional não consegue gravar (inclusive modo de visualização).
2. Confirmar que a identidade visual da Lilian abrange sua experiência sem alterar a Ádria. O PWA instalado deve reconhecer o nome, logo, start_url e escopo apropriados; um PWA em mesmo domínio pode exigir separação por subdomínio para instalação independente.
3. Conectar Mercado Pago via **OAuth do vendedor** para split Marketplace 1:1 com Checkout Pro, obedecendo elegibilidade e permissões aprovadas. Armazenar tokens somente no backend, com criptografia, rotação e controle estrito por profissional.
4. Definir comissão do marketplace e demonstrativo financeiro, incluindo tarifas, reembolsos, estornos e saldo líquido. **Nunca simular saque no painel**: repasses e saques são feitos diretamente na conta Mercado Pago da Lilian conforme disponibilidade.
5. Criar pedidos separados por `professional_id`, `service_id`, versão do preço e contrato; preço é lido do servidor, nunca aceito do navegador.
6. Confirmar assinatura/autenticidade da notificação, pagamento aprovado, recebedor correto, valor e moeda antes de provisionar login; usar idempotência e isolamento por profissional.
7. Portal do paciente da Lilian: e-mail seguro para ativação, vínculo ao profissional, quantidade de sessões e janelas de agenda por serviço. Nunca expor dados clínicos ou misturá-los com o Clube do Tarô.
8. Testes reais de ponta a ponta em ambiente controlado: Pix, cartão, pagamento pendente/recusado, cancelamento, e-mail não entregue, usuário existente, compra repetida e conflito de agenda.

## Condição de publicação
Catálogo pode ser mostrado publicamente após banco validado; compra só pode ser habilitada após OAuth de conta vendedora, webhooks e provisionamento testados. Não reutilizar o webhook de assinaturas do Clube do Tarô.
