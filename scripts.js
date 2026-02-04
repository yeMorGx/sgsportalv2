const btnAdd = document.getElementById("addMarcacao");
const lista = document.getElementById("listaMarcacao");
const tpl = document.getElementById("tplMarcacao");


let contador = 0;

function addMarcacao() {
  contador++;

  // clona o template
  const frag = tpl.content.cloneNode(true);
  const form = frag.querySelector("form.marcacao");

  // deixa os radios "independentes" por marcação
  // (se não fizer isso, marcar "Manual" em um form pode desmarcar no outro)
  form.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.name = `${r.name}_${contador}`;
  });

  // opcional: auto-preencher data/hora do momento
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
  });

  // submit do form (pra não recarregar a página)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // pega tudo do form
    const fd = new FormData(form);
    const dados = Object.fromEntries(fd.entries());

    console.log("SALVAR MARCAÇÃO:", dados);
    alert("Marcação salva (veja no console).");
  });

  lista.appendChild(form);
}

btnAdd.addEventListener("click", addMarcacao);

// já cria a primeira marcação ao abrir (opcional)
addMarcacao();

const btnEnviarTudo = document.getElementById("enviarTudo");

btnEnviarTudo.addEventListener("click", () => {
  const forms = document.querySelectorAll("form.marcacao");

  if (forms.length === 0) {
    alert("Nenhuma marcação para enviar.");
    return;
  }

  const todasMarcacoes = [];

  forms.forEach((form, index) => {
    const fd = new FormData(form);
    const dados = Object.fromEntries(fd.entries());

    // validação simples
    if (!dados.pontoMarcacao || !dados.dataMarcacao) {
      alert(`Marcação ${index + 1} incompleta`);
      throw new Error("Validação falhou");
    }

    todasMarcacoes.push({
      numero: index + 1,
      ...dados
    });
  });

  console.log("DADOS PARA ENVIO:", todasMarcacoes);

  // 🔥 AQUI você envia pro backend
  /*
  fetch("/api/marcacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todasMarcacoes)
  })
  .then(r => r.json())
  .then(res => {
    alert("Marcações enviadas com sucesso!");
  })
  .catch(err => {
    alert("Erro ao enviar");
  });
  */

  alert("Todas as marcações prontas para envio (veja o console).");
});