// importando css
import "./styles.css";
//Associando o html ao TypeScript
const start = <HTMLButtonElement>document.getElementById("Start");
const nick = <HTMLInputElement>document.getElementById("Nick");

// configurando o botão de start
start.addEventListener("click", () => {
  const nome: string = nick.value.trim(); // Obtém o valor do input e remove espaços em branco

  if (nome) {
    // Verificar se o nick não está vazio
    // Redireciona para a página do jogo e  passar a valor do nick do player
    window.location.href = `./index.html?nome=${encodeURIComponent(nome)}`;
  } else {
    // Exibir um alerta se o nick estiver vazio
    alert("Coloque seu nick!");
  }
});
