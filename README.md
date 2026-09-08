# 🎮 Jogo Mobile — Controle por Acelerômetro

Aplicativo mobile desenvolvido em **React Native** utilizando **Expo**, no qual o jogador controla uma esfera por meio da inclinação do celular.

O objetivo do jogo é movimentar o personagem pelo cenário e **coletar os orbes** que aparecem em posições aleatórias. A cada orbe coletado, a pontuação aumenta.

---

## 📱 Sobre o projeto

Este projeto foi desenvolvido como uma aplicação mobile utilizando os sensores disponíveis no dispositivo.

O principal recurso utilizado é o **acelerômetro**, que identifica a inclinação e o movimento do celular e transforma essas informações em movimentação dentro do jogo.

O jogo possui um sistema de física para tornar o movimento mais natural, utilizando:

- Aceleração baseada na inclinação;
- Inércia;
- Atrito;
- Limite de velocidade;
- Zona morta para reduzir ruídos do sensor;
- Colisão com as bordas da tela;
- Pequeno efeito de quique nas paredes.

---

## 🎯 Objetivo

O objetivo do jogador é controlar a esfera utilizando a inclinação do celular e coletar o maior número possível de orbes.

A cada coleta:

- O jogador recebe **+1 ponto**;
- O orbe desaparece;
- Um novo orbe é criado em uma posição aleatória;
- O placar recebe uma animação de feedback;
- O novo orbe também possui uma animação.

---

## 🕹️ Como jogar

1. Abra o aplicativo em um dispositivo mobile.
2. Incline o celular para movimentar a esfera.
3. Direcione a esfera até o orbe azul.
4. Ao encostar no orbe, ele será coletado.
5. A pontuação aumentará em 1 ponto.
6. Continue coletando os orbes para aumentar sua pontuação.
7. Utilize o botão **REINICIAR** para começar novamente.

> **Importante:** como o jogo utiliza o acelerômetro, ele deve ser executado em um dispositivo que possua esse sensor.

---

## ⚙️ Especificações do jogo

### Jogador

- Tamanho: **44px**
- Forma: circular
- Controle: acelerômetro
- Velocidade máxima: **14**
- Possui colisão com as bordas da tela
- Possui efeito visual de brilho

### Orbe

- Tamanho: **28px**
- Posição gerada aleatoriamente
- Reposicionado após ser coletado
- Possui animação de coleta
- Possui efeito visual de brilho

### Sistema de pontuação

O jogo possui um contador de pontuação iniciado em **0**.

Cada colisão entre o jogador e o orbe adiciona:

```text
+1 ponto
```

O placar possui uma animação de escala para fornecer feedback visual ao jogador.

---

## 📱 Plataforma

O projeto foi desenvolvido para:

- 📱 **Dispositivos móveis**
- Android
- iOS

A aplicação utiliza recursos específicos de dispositivos móveis, principalmente o **acelerômetro**.

---

## 🛠️ Tecnologias utilizadas

### React Native

Framework utilizado para o desenvolvimento da interface e da aplicação mobile.

### Expo

Utilizado para facilitar o desenvolvimento e acesso aos recursos nativos do dispositivo.

### Expo Sensors

Biblioteca utilizada para acessar o acelerômetro do celular.

```tsx
import { Accelerometer } from "expo-sensors";
```

### TypeScript

Utilizado para tipagem e desenvolvimento do código.

### Animated API

Utilizada para criar os efeitos de animação presentes no jogo.

### React Hooks

Foram utilizados hooks como:

- `useState`
- `useEffect`
- `useRef`

---

## 📦 Principais dependências

Exemplo das principais bibliotecas utilizadas:

```json
{
  "react": "React",
  "react-native": "React Native",
  "expo": "Expo",
  "expo-sensors": "Expo Sensors"
}
```

---

## 🧠 Funcionamento do acelerômetro

O acelerômetro fornece valores relacionados ao movimento e à inclinação do dispositivo.

O projeto atualiza a leitura do sensor aproximadamente **60 vezes por segundo**:

```tsx
Accelerometer.setUpdateInterval(16);
```

Os valores recebidos são utilizados para calcular a movimentação do jogador.

O código também possui uma **dead zone**, que ignora pequenas variações do sensor para evitar que o personagem fique tremendo quando o celular está parado.

---

## ⚡ Sistema de física

Para deixar o movimento mais natural, o jogo utiliza alguns parâmetros:

```tsx
const FRICTION = 0.965;
const ACCELERATION = 3.1;
const MAX_SPEED = 14;
const DEAD_ZONE = 0.02;
```

### Aceleração

Define o quanto a inclinação do aparelho influencia na velocidade do jogador.

### Atrito

Controla quanto tempo o personagem continua se movimentando depois que o celular deixa de ser inclinado.

### Velocidade máxima

Impede que o personagem atinja velocidades muito altas e fique difícil de controlar.

### Dead Zone

Ignora pequenas alterações do acelerômetro, reduzindo movimentos indesejados.

---

## 🧱 Colisão com as bordas

O personagem não pode sair da área visível do jogo.

Quando ele atinge uma das bordas, sua posição é limitada e sua velocidade é invertida parcialmente, criando um pequeno efeito de **quique**.

Isso torna a movimentação mais fluida em vez de simplesmente parar o personagem.

---

## 🎨 Interface

A interface possui uma estética futurista e minimalista, utilizando:

- Fundo escuro;
- Esfera do jogador em rosa;
- Orbe em ciano;
- Efeitos de brilho;
- Barra superior;
- Placar;
- Instruções de controle;
- Botão para reiniciar.

### Elementos da tela

**Placar**

Exibe a pontuação atual do jogador.

**Instruções**

Exibe a mensagem:

> "Incline o celular para guiar a esfera"

**Botão Reiniciar**

Permite zerar a pontuação, reposicionar o jogador e gerar um novo orbe.

---

## 🔄 Sistema de reinício

Ao pressionar **REINICIAR**, o jogo:

1. Zera a pontuação;
2. Retorna o jogador para o centro da tela;
3. Zera a velocidade;
4. Gera um novo orbe;
5. Reinicia o estado da partida.

---

## 📂 Estrutura sugerida

Uma estrutura possível para o projeto:

```text
📦 projeto
 ┣ 📂 assets
 ┣ 📂 components
 ┣ 📂 app
 ┃ ┗ 📄 Jogo.tsx
 ┣ 📄 package.json
 ┣ 📄 tsconfig.json
 ┗ 📄 README.md
```

A estrutura pode variar de acordo com a organização utilizada no restante do aplicativo.

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/anabeatriz-mb/aula-giroscopio.git
```

### 2. Entre na pasta

```bash
cd nome-do-projeto
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o projeto

```bash
npx expo start
```

### 5. Execute no celular

Com o aplicativo **Expo Go**, escaneie o QR Code apresentado pelo Expo.

> Para testar corretamente a principal funcionalidade do projeto, recomenda-se utilizar um celular físico, pois o jogo depende do acelerômetro.

---

## 📌 Requisitos

Para executar o projeto, recomenda-se possuir:

- Node.js
- npm
- Expo
- Expo Go
- Dispositivo Android ou iOS
- Dispositivo com acelerômetro

---

## 👩‍💻 Desenvolvimento

Projeto desenvolvido como uma aplicação mobile utilizando **React Native + Expo + TypeScript**, com foco na utilização de sensores do dispositivo e desenvolvimento de uma experiência interativa baseada em movimento.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de aprendizado.
