# Plano de Pesquisa: Conteúdo para Aplicativo de Italiano "14 DAYS - CIP"

## Objetivos
- Coletar, analisar e estruturar um corpus completo de conteúdo de aprendizado de italiano, focado em levar um iniciante ao nível A2-B1 em 14 dias.
- Aplicar o princípio de Pareto (80/20) para focar nos elementos de linguagem mais impactantes e de alta frequência para um aprendizado acelerado.

## Detalhamento da Pesquisa
- **Fase 1: Extração de Conteúdo Bruto**
  - Sub-tarefa 1.1: Extrair sistematicamente o conteúdo textual dos 5 sites de referência fornecidos.
  - Sub-tarefa 1.2: Salvar os dados extraídos em arquivos individuais para referência e análise.
- **Fase 2: Análise e Síntese de Conteúdo (Princípio de Pareto)**
  - Sub-tarefa 2.1: Analisar o conteúdo extraído para identificar os 20% de vocabulário, gramática e frases que cobrem 80% das situações de comunicação diária (níveis A1-B1).
  - Sub-tarefa 2.2: Organizar o conteúdo principal por tópicos: cumprimentos, dias da semana, artigos, os 25 verbos mais importantes, horas, conectivos, advérbios de tempo, frases do dia a dia.
- **Fase 3: Desenvolvimento de Materiais de Aprendizagem**
  - Sub-tarefa 3.1: Criar uma estrutura de 20 perguntas para um teste de nivelamento progressivo (A1 a B1).
  - Sub-tarefa 3.2: Desenvolver um banco de exercícios baseado em repetição espaçada.
  - Sub-tarefa 3.3: Compilar um conjunto de frases e diálogos completos para prática de conversação.
- **Fase 4: Curadoria de Materiais Adicionais e Entrega Final**
  - Sub-tarefa 4.1: Pesquisar e selecionar links atualizados de materiais extras (podcasts, vídeos, canais do YouTube) adequados para iniciantes.
  - Sub-tarefa 4.2: Consolidar todo o conteúdo pesquisado e criado em um único arquivo Markdown bem estruturado.

## Questões Chave
1. Quais são os padrões de vocabulário e gramática mais recorrentes e úteis nos sites de referência para um aluno de nível A1-B1?
2. Como estruturar uma progressão de aprendizado lógica e diária para 14 dias que seja realista e eficaz?
3. Quais são os melhores formatos de exercício para reforçar o aprendizado de acordo com o princípio da repetição espaçada?
4. Quais recursos de mídia adicionais (áudio/vídeo) oferecem o melhor suporte para o conteúdo principal?

## Estratégia de Recursos
- Fontes de dados primárias: As 5 URLs fornecidas pelo usuário.
- Estratégias de pesquisa: Extração de conteúdo direto com `extract_content_from_websites` e `extract_pdfs_full_content`. Pesquisas na web com `batch_web_search` para encontrar páginas específicas dentro dos domínios mais amplos (ex: `site:learnamo.com vocabulário essencial`) e para encontrar materiais extras.

## Plano de Verificação
- Requisitos da fonte: O conteúdo principal será extraído das fontes fornecidas. A credibilidade será avaliada pela sobreposição de informações entre as fontes. Conceitos que aparecem em múltiplas fontes serão considerados de alta prioridade.
- Validação cruzada: As informações gramaticais e de vocabulário serão validadas cruzando o que é apresentado em pelo menos 3 das fontes de referência para garantir a precisão e a relevância.

## Entregáveis Esperados
- Um único arquivo `docs/italian_app_content.md` contendo a base de conhecimento completa, incluindo:
  1. Conteúdo Base (vocabulário, gramática, verbos)
  2. Sistema de Nivelamento (20 perguntas)
  3. Banco de Exercícios Diários
  4. Módulo de Conversação
  5. Lista de Materiais Extras

## Seleção do Fluxo de Trabalho
- Foco principal: **Pesquisa**
- Justificativa: A tarefa exige a coleta, filtragem e síntese de uma grande quantidade de informações de várias fontes, em vez de verificar um conjunto de fatos específicos. O fluxo de trabalho de pesquisa é o mais adequado para essa exploração e compilação de conhecimento em larga escala.
