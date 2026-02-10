const btnAdd = document.getElementById("addMarcacao");
const lista = document.getElementById("listaMarcacao");
const tpl = document.getElementById("tplMarcacao");
const btnEnviarTudo = document.getElementById("enviarTudo");

let contador = 0;

/* ========= REGRAS DE UI (NÃO QUEBRA NADA) ========= */
function atualizarUI() {
  const forms = lista.querySelectorAll("form.marcacao");

  // 1) Botão "Enviar tudo" só aparece se tiver pelo menos 1 marcação
  if (btnEnviarTudo) {
    btnEnviarTudo.style.display = forms.length > 0 ? "block" : "none";
  }

  // 2) Botão "Remover" some só na primeira marcação
  forms.forEach((form, index) => {
    const btnRemover = form.querySelector(".remover");
    if (!btnRemover) return;
    btnRemover.style.display = index === 0 ? "none" : "inline-block";
  });
}
/* ================================================ */

/* ======= AQUI: função que aplica regras em 1 form ======= */
function ligarRegrasDoForm(form) {
  // --- regra: transporte -> ativa/desativa nome do navio
  const transporte = form.querySelector('select[name="transporte"]');
  const nomeNavio = form.querySelector('input[name="nomeNavio"]');

  function atualizarTransporte() {
    if (!transporte || !nomeNavio) return;
    const maritimo = transporte.value === "t1";
    nomeNavio.disabled = !maritimo;
    if (!maritimo) nomeNavio.value = "";
  }

  if (transporte) {
    transporte.addEventListener("change", atualizarTransporte);
    atualizarTransporte(); // já ajusta quando cria a marcação
  }

  // deixa os radios independentes por marcação
  form.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.name = `${r.name}_${contador}`;
  });

  // auto-preencher data/hora do momento
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");

  const dataMarc = form.querySelector('input[name="dataMarcacao"]');
  const horaMarc = form.querySelector('input[name="horaMarcacao"]');
  if (dataMarc) dataMarc.value = `${yyyy}-${mm}-${dd}`;
  if (horaMarc) horaMarc.value = `${hh}:${min}`;

  // botão remover
  form.querySelector(".remover")?.addEventListener("click", () => {
    form.remove();
    atualizarUI();
  });

  // submit do form
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const dados = Object.fromEntries(fd.entries());
    console.log("SALVAR MARCAÇÃO:", dados);
    alert("Marcação salva (veja no console).");
  });
}
/* ======================================================= */

function addMarcacao() {
  contador++;

  // clona o template
  const frag = tpl.content.cloneNode(true);
  const form = frag.querySelector("form.marcacao");

  // aplica todas as regras no form recém-criado
  ligarRegrasDoForm(form);

  lista.appendChild(frag); // (melhor anexar o fragmento todo)
  atualizarUI();
}

/* se você tiver o botão +Nova Marcação */
btnAdd?.addEventListener("click", addMarcacao);

// inicia UI (se não tiver nenhuma marcação no começo)
addMarcacao();

atualizarUI();
