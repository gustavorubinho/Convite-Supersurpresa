# Botão fujão - Convite Interativo

Um site interativo criado para convidar uma pessoa para sair de forma criativa e divertida.

## Sobre o Projeto

Este projeto e uma aplicacao web simples de pagina unica com interacoes dinamicas. Ele guia o usuario por tres etapas:
1. Tela inicial com a pergunta principal. O botao "Nao" possui uma logica de fuga, movendo-se pela tela quando o usuario tenta clicar ou tocar nele, garantindo uma resposta positiva.
2. Tela de agendamento com um calendario interativo (limitado a meses especificos) e um seletor de horario.
3. Tela de confirmacao final exibindo os detalhes escolhidos e um botao de redirecionamento para o WhatsApp com uma mensagem pre-formatada.

## Funcionalidades

- Botao de recusa evasivo (foge do cursor do mouse e de toques em telas mobile).
- Calendario interativo e seletor de horario feitos do zero.
- Estrutura pronta para receber imagens e GIFs personalizados.
- Link direto para enviar a resposta pelo WhatsApp.
- Design responsivo (funciona bem em celulares e computadores).

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)

## Como Customizar

1. Para alterar as imagens, adicione seus arquivos na pasta `img/` e atualize os nomes nos atributos `src` das tags `<img>` no arquivo `index.html`.

<img width="876" height="55" alt="image" src="https://github.com/user-attachments/assets/6990b937-3b31-4fc9-a84a-8382b919a48a" />

3. Para alterar o numero de WhatsApp que recebera a confirmacao, edite a variavel `telefone` no arquivo `script.js`.

<img width="948" height="77" alt="image" src="https://github.com/user-attachments/assets/2fd6cabb-94ab-4738-b196-39b26c8f3e15" />
 
5. Para mudar as cores, edite as variaveis ou as regras de estilizacao no arquivo `style.css`.

## Como Executar

Basta abrir o arquivo `index.html` em qualquer navegador web moderno. Para compartilhar com outra pessoa, e recomendado hospedar a pasta do projeto em servicos gratuitos como GitHub Pages, Netlify ou Vercel.
