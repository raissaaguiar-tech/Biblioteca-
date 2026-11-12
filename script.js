const html = document.documentElement;
const btnTema = document.getElementById('btn-tema');
const textoTema = document.getElementById('texto-tema');

// 1. Alternância Modo Escuro / Claro
function aplicarTema(tema) {
  if (tema === 'dark') {
    html.setAttribute('data-theme', 'dark');
    textoTema.textContent = 'Claro';
  } else {
    html.removeAttribute('data-theme');
    textoTema.textContent = 'Escuro';
  }
  localStorage.setItem('senai_bib_tema', tema);
}

const temaSalvo = localStorage.getItem('senai_bib_tema') || 'light';
aplicarTema(temaSalvo);

btnTema.addEventListener('click', () => {
  const atual = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  aplicarTema(atual === 'dark' ? 'light' : 'dark');
});

// 2. Navegação entre telas
const telaBoasVindas = document.getElementById('tela-boas-vindas');
const telaFormulario = document.getElementById('tela-formulario');
const telaSucesso    = document.getElementById('tela-sucesso');

function mostrarTela(tela) {
  [telaBoasVindas, telaFormulario, telaSucesso].forEach(t => t.classList.add('oculta'));
  tela.classList.remove('oculta');
  window.scrollTo(0, 0);
}

document.getElementById('btn-ir-checkin').addEventListener('click', () => mostrarTela(telaFormulario));
document.getElementById('btn-voltar').addEventListener('click',     () => mostrarTela(telaBoasVindas));

// 3. Identificação da mesa via QR Code (?mesa=04)
const params = new URLSearchParams(window.location.search);
const mesaParam = params.get('mesa');
const localAtual = mesaParam ? `Mesa ${mesaParam}` : 'Área Geral';

document.getElementById('texto-mesa-inicio').textContent = `${localAtual} · Biblioteca`;
document.getElementById('badge-mesa-form').textContent = localAtual;

// 4. Registro e check-out
function preencherResumo(dados) {
  document.getElementById('resumo-nome').textContent      = dados.nome;
  document.getElementById('resumo-turma').textContent     = dados.turma;
  document.getElementById('resumo-local').textContent     = dados.local;
  document.getElementById('resumo-atividade').textContent = dados.motivo;
  document.getElementById('resumo-hora').textContent      = dados.hora;
}

const checkinAtivo = localStorage.getItem('senai_bib_checkin');
if (checkinAtivo) {
  preencherResumo(JSON.parse(checkinAtivo));
  mostrarTela(telaSucesso);
}

document.getElementById('form-checkin').addEventListener('submit', (e) => {
  e.preventDefault();

  const agora = new Date();
  const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const dados = {
    nome:   document.getElementById('nome').value.trim(),
    turma:  document.getElementById('turma').value,
    local:  localAtual,
    motivo: document.querySelector('input[name="motivo"]:checked').value,
    hora:   horaFormatada
  };

  localStorage.setItem('senai_bib_checkin', JSON.stringify(dados));
  preencherResumo(dados);
  mostrarTela(telaSucesso);
});

document.getElementById('btn-checkout').addEventListener('click', () => {
  localStorage.removeItem('senai_bib_checkin');
  document.getElementById('form-checkin').reset();
  mostrarTela(telaBoasVindas);
});
