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



function addMarcacao() {
  contador++;

  // clona o template
  const frag = tpl.content.cloneNode(true);
  const form = frag.querySelector("form.marcacao");

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
    atualizarUI(); // ✅ atualiza regras após remover
  });

  // submit do form (pra não recarregar a página)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const dados = Object.fromEntries(fd.entries());

    console.log("SALVAR MARCAÇÃO:", dados);
    alert("Marcação salva (veja no console).");
  });

  lista.appendChild(form);
  atualizarUI(); // ✅ atualiza regras após adicionar
}

btnAdd.addEventListener("click", addMarcacao);

// já cria a primeira marcação ao abrir (opcional)
addMarcacao();

btnEnviarTudo.addEventListener("click", () => {
  const forms = lista.querySelectorAll("form.marcacao");

  if (forms.length === 0) {
    alert("Nenhuma marcação para enviar.");
    return;
  }

  const todasMarcacoes = [];

  // ⚠️ não use throw dentro do forEach, pode quebrar fluxo feio
  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    const fd = new FormData(form);
    const dados = Object.fromEntries(fd.entries());

    // validação simples
    if (!dados.pontoMarcacao || !dados.dataMarcacao) {
      alert(`Marcação ${i + 1} incompleta`);
      return;
    }

    todasMarcacoes.push({
      numero: i + 1,
      ...dados,
    });
  }

  console.log("DADOS PARA ENVIO:", todasMarcacoes);

  alert("Todas as marcações prontas para envio (veja o console).");
});


function cnpjMask(input) {
  input.addEventListener("input", () => {

    let v = input.value;

    // 1) remove tudo que não for número
    v = v.replace(/\D/g, "");

    // 2) limita a 14 números
    v = v.slice(0, 14);

    // 3) monta o formato do CNPJ
    if (v.length > 12) {
      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    } else if (v.length > 8) {
      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
    } else if (v.length > 5) {
      v = v.replace(/^(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d+)/, "$1.$2");
    }

    input.value = v;
  });
}

// garante o estado certo ao carregar
atualizarUI();
