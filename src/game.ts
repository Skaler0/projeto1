// importando css
import "./styles.css";
// Pegando o nick do player
function pegar_nick(nick: string): string | null {
  const urlnicks = new URLSearchParams(window.location.search);
  return urlnicks.get(nick);
}
//Associando o html ao TypeScript
const desenho = <HTMLCanvasElement>document.getElementById("jogo");
const son_morte = <HTMLAudioElement>document.getElementById("morte");
const son_comer = <HTMLAudioElement>document.getElementById("comer");
const son_parabens = <HTMLAudioElement>document.getElementById("parabens");
const render = <CanvasRenderingContext2D>desenho.getContext("2d");
const Nick = <HTMLElement>document.getElementById("nome");
const pontos = <HTMLElement>document.getElementById("tamanho");
//criando as cooedenadas do jogo
type coordenadas = {
  x: number;
  y: number;
};
//associando as coordenadas ao player
var player: coordenadas[] = [];
//associando as coordenadas a maçâo
var Maçã: coordenadas;
//associando as coordenadas aos obstaculos
var obstaculos: coordenadas[] = [];
//criando a velocidade e tamanho
var velocidade: coordenadas = { x: 0, y: 0 };
var velocidade_anterior: coordenadas = { x: 0, y: 0 };
var tamanho: number = 0;
// Obtém o nome do jogador da URL
var nome: string = pegar_nick("nome") || "";

// Exibir o nome do jogador na tela do jogo
Nick.textContent = `Player: ${nome}`;

//iniciando o jogo
function iniciar(): void {
  player = [{ x: 5, y: 7 }];
  velocidade = { x: 0, y: 0 };
  tamanho = 0;
  pontos.textContent = `Tamanho: ${tamanho}`;
  criarMaçã();
  criarobstaculos();
  desenhar();
  Loop();
}
//criando o loop do jogo
function Loop(): void {
  if (Atualizar()) {
    desenhar();
    setTimeout(Loop, 100);
  } else {
    alert("Game Over");
    iniciar();
  }
}

function Atualizar(): boolean {
  if (velocidade.x === 0 && velocidade.y === 0) return true;

  const cobra: coordenadas = {
    x: player[0].x + velocidade.x,
    y: player[0].y + velocidade.y,
  };

  // testar se a cobra encostou em alguma coisa exeto a maçã
  if (
    cobra.x < 0 ||
    cobra.x >= 40 ||
    cobra.y < 0 ||
    cobra.y >= 20 ||
    Impacto(cobra) ||
    pedra_Impacto(cobra)
  ) {
    //son de batida
    son_morte.play();
    // game over caso a cobra esbarre
    return false;
  }

  player.unshift(cobra);
  // caso a cobra encoste na maçâ a tamanho sobe em 1
  if (cobra.x === Maçã.x && cobra.y === Maçã.y) {
    //son de comer
    son_comer.play();
    tamanho++;
    pontos.textContent = `Tamanho: ${tamanho}`;

    // parabenização
    if (tamanho === 100) {
      son_parabens.play();
      alert(`Nem eu consegui chegar tão longe, você joga muito ${nome}`);
    }

    criarMaçã();
  } else {
    player.pop();
  }

  velocidade_anterior = velocidade;
  return true;
}
// apaga tudo da tela
function desenhar(): void {
  render.clearRect(0, 0, desenho.width, desenho.height);

  // Desenha a cobra
  render.fillStyle = "green";
  player.forEach((Seção: coordenadas) => {
    render.fillRect(Seção.x * 30, Seção.y * 30, 30, 30);
  });

  // Desenha a comida
  render.fillStyle = "red";
  render.fillRect(Maçã.x * 30, Maçã.y * 30, 30, 30);

  // Desenha os obstáculos
  render.fillStyle = "gray";
  obstaculos.forEach((pedra: coordenadas) => {
    render.fillRect(pedra.x * 30, pedra.y * 30, 30, 30);
  });
}
// definir uma posição aleatoria para a maçâ
function criarMaçã(): void {
  Maçã = {
    x: Math.floor(Math.random() * 40),
    y: Math.floor(Math.random() * 20),
  };

  // definir outra posição caso ela esteva em uma pedra
  if (
    obstaculos.some(
      (pedra: coordenadas) => pedra.x === Maçã.x && pedra.y === Maçã.y
    )
  ) {
    criarMaçã();
  }
}

function criarobstaculos(): void {
  obstaculos = [];
  const numberOfobstaculos: number = 3;

  for (let i = 0; i < numberOfobstaculos; i++) {
    let pedra: coordenadas;
    do {
      pedra = {
        x: Math.floor(Math.random() * 40),
        y: Math.floor(Math.random() * 20),
      };
    } while (
      player.some(
        (Seção: coordenadas) => Seção.x === pedra.x && Seção.y === pedra.y
      ) ||
      obstaculos.some(
        (Presente: coordenadas) =>
          Presente.x === pedra.x && Presente.y === pedra.y // Não gera em um obstáculo já existente
      ) ||
      (Maçã && Maçã.x === pedra.x && Maçã.y === pedra.y)
    );

    obstaculos.push(pedra);
  }
}

function Impacto(Seção: coordenadas): boolean {
  return player.some(
    (seguimento: coordenadas, index: number) =>
      index !== 0 && seguimento.x === Seção.x && seguimento.y === Seção.y
  );
}

function pedra_Impacto(Seção: coordenadas): boolean {
  return obstaculos.some(
    (pedra: coordenadas) => pedra.x === Seção.x && pedra.y === Seção.y
  );
}

window.addEventListener("keydown", (a: KeyboardEvent) => {
  let Velocidade_atualizada: coordenadas = { x: velocidade.x, y: velocidade.y };

  switch (a.key) {
    case "ArrowUp":
      if (velocidade_anterior.y === 0) Velocidade_atualizada = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (velocidade_anterior.y === 0) Velocidade_atualizada = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (velocidade_anterior.x === 0) Velocidade_atualizada = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (velocidade_anterior.x === 0) Velocidade_atualizada = { x: 1, y: 0 };
      break;
  }

  // Atualiza a velocidade apenas se o novo movimento não for na velocidade oposta
  if (
    Velocidade_atualizada.x !== -velocidade.x ||
    Velocidade_atualizada.y !== -velocidade.y
  ) {
    velocidade = Velocidade_atualizada;
  }
});

iniciar();
