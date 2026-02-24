Inputmask.extendDefaults({
  placeholder: "",
  showMaskOnHover: false,
  showMaskOnFocus: false
});

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

  Inputmask("99/99.9999.9999").mask(
  form.querySelector('input[name="codLata"]')
);

Inputmask({
  placeholder: "",
  showMaskOnHover: false,
  showMaskOnFocus: false,
  rightAlign: false
}).mask(form.querySelector('input[name="volumeUtilizado"]'));



  // --- regra: transporte -> ativa/desativa nome do navio
  const transporte = form.querySelector('select[name="transporte"]');
  const nomeNavio = form.querySelector('input[name="nomeNavio"]');
  const transportadora = form.querySelector('input[name="transportadora"]');
  const placaCaminhao = form.querySelector('input[name="placaCaminhao"]');
  const placaCarreta1 = form.querySelector('input[name="placaCarreta1"]');

  function atualizarTransporte() {
    if (!transporte || !nomeNavio || !transportadora || !placaCaminhao || !placaCarreta1) return;
    const maritimo = transporte.value === "t1";
    // Navio
    nomeNavio.disabled = !maritimo;
    if (!maritimo) nomeNavio.value = "";

    // Transportadora, Carreta, Caminhão
    transportadora.disabled = maritimo;
    placaCaminhao.disabled = maritimo;
    placaCarreta1.disabled = maritimo;
    if (maritimo) {
      transportadora.value = "";
      placaCaminhao.value = "";
      placaCarreta1.value = "";
    }
  }

  if (transporte) {
    transporte.addEventListener("change", atualizarTransporte);
    atualizarTransporte(); // já ajusta quando cria a marcação
  }

  const pmcMarcado = form.querySelector('select[name="pmcMarcado"]');
  const litrosTotalMarcador = form.querySelector('input[name="litrosTotalMarcador"]');
  const tipoMarcador = form.querySelector('select[name="tipoMarcador"]');
  const motivoNaoMarcacao = form.querySelector('select[name="motivoNaoMarcacao"]');
  const obs = form.querySelector('#obs');

  function atualizarPmc() {

    if (!pmcMarcado || !litrosTotalMarcador || !tipoMarcador || !motivoNaoMarcacao || !obs) return;

    const pmcSim = pmcMarcado.value === "sim";
    const pmcNao = pmcMarcado.value === "nao";

    litrosTotalMarcador.disabled = !pmcSim;
    tipoMarcador.disabled = !pmcSim;
    motivoNaoMarcacao.disabled = !pmcNao;

    if (obs) {
      obs.classList.toggle("hidden", !pmcNao);
    }

    if (!pmcSim) {
      litrosTotalMarcador.value = "";
      tipoMarcador.value = "";
    }

    if (!pmcNao) {
      motivoNaoMarcacao.value = "";

    }
  }

  if (pmcMarcado) {
    pmcMarcado.addEventListener("change", atualizarPmc);
    atualizarPmc();
  }

  // ===== Latas =====
  const btnAdicionarLata = form.querySelector(".adicionarLata");
  const listaLatas = form.querySelector("#lista");

  let contadorLata = 0;

  function adicionar() {
    const codigo = form.querySelector('input[name="codLata"]');
    const volume = form.querySelector('input[name="volumeUtilizado"]');

    if (!codigo || !volume || !listaLatas) return;
    if (!codigo.value || !volume.value) return;

    contadorLata++;

    const item = document.createElement("div");
    item.classList.add("lataItem");

   
item.innerHTML = `

  <div class="numero">${contador}</div>

  <div class="campo">
  
    <input type="text" value="${codigo.value}" disabled>
  </div>

  <div class="campo">
    <input type="text" value="${volume.value}" disabled>
  </div>

  <button type="button" class="removerLata">X</button>
`;

    // remover lata
    item.querySelector(".removerLata").addEventListener("click", () => {
      item.remove();
    });

    // último adicionado fica em cima
    listaLatas.prepend(item);

    // limpar campos
    codigo.value = "";
    volume.value = "";
  }

  btnAdicionarLata?.addEventListener("click", adicionar);

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
