const treinosBase = [
  {
    dia: "Segunda",
    titulo: "Peito e tríceps",
    grupo: "forca",
    img: "./assets/img/peito.jpg",
    video: "./assets/videos/peito.mp4",
    tempo: 55,
    kcal: 420,
    nivel: "Intermediário",
    desc: "Supino reto, crossover no cabo, flexão e tríceps na polia. Foco em peito, braços e força.",
    series: "4 séries x 8 a 12 repetições",
    cuidado: "Mantenha escapulas firmes e cotovelos controlados."
  },
  {
    dia: "Terça",
    titulo: "Costas e bíceps",
    grupo: "forca",
    img: "./assets/img/costas.jpg",
    video: "./assets/videos/costas.mp4",
    tempo: 50,
    kcal: 390,
    nivel: "Intermediário",
    desc: "Puxada frontal, remada curvada, serrote e rosca direta. Foco em costas e bíceps.",
    series: "4 séries x 10 repetições",
    cuidado: "Evite puxar com o pescoço e controle a volta do movimento."
  },
  {
    dia: "Quarta",
    titulo: "Pernas e glúteos",
    grupo: "forca",
    img: "./assets/img/pernas.jpg",
    video: "./assets/videos/pernas.mp4",
    tempo: 60,
    kcal: 480,
    nivel: "Avançado",
    desc: "Agachamento, leg press, avanço e mesa flexora. Treino completo para pernas e glúteos.",
    series: "5 séries x 8 a 12 repetições",
    cuidado: "Joelhos alinhados aos pés e amplitude sem dor."
  },
  {
    dia: "Quinta",
    titulo: "Cardio HIIT",
    grupo: "cardio",
    img: "./assets/img/cardio.jpg",
    video: "./assets/videos/cardio.mp4",
    tempo: 30,
    kcal: 360,
    nivel: "Todos",
    desc: "Corrida intervalada, bike, polichinelo e burpee. Excelente para queima calórica.",
    series: "10 tiros x 40 segundos",
    cuidado: "Aquecimento obrigatorio e pausa quando a tecnica cair."
  },
  {
    dia: "Sexta",
    titulo: "Ombros e core",
    grupo: "core",
    img: "./assets/img/ombro-profissional.png",
    video: "./assets/videos/ombro.mp4",
    tempo: 45,
    kcal: 310,
    nivel: "Intermediário",
    desc: "Desenvolvimento, face pull, prancha e abdominal infra para postura e estabilidade.",
    series: "3 séries x 12 repetições",
    cuidado: "Não force a lombar durante exercícios de core."
  }
];

let treinosAtuais = [...treinosBase];
let filtroAtual = "todos";
let timerInterval = null;
let timerSeconds = 60;
let fotoSelecionada = "";
let fotoPerfilSelecionada = "";
let fotoProfessorSelecionada = "";
let deferredInstallPrompt = null;
let focusIndex = 0;
let focusTimerInterval = null;
let focusTimerSeconds = 60;

const midiasOriginais = treinosBase.reduce((mapa, treino) => {
  mapa[treino.dia] = {
    img: treino.img,
    video: treino.video
  };
  return mapa;
}, {});

const gruposExercicios = [
  {
    titulo: "Peito, ombros e tríceps",
    desc: "Força superior com execução guiada e vídeo real do movimento.",
    tags: ["Superiores", "55 min", "Força"],
    filtro: "forca",
    exercicios: [
      {
        id: "supino-reto",
        titulo: "Supino reto",
        video: "./assets/videos/supino-reto.mp4",
        inicio: 0,
        grupo: "Peito",
        series: "4 séries x 8 a 12 repetições | descanso 90s",
        desc: "Escápulas firmes, pés no chão e barra descendo controlada até a linha do peito."
      },
      {
        id: "crossover-cabo",
        titulo: "Crossover no cabo",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Peito",
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Use as polias alinhadas, abra os braços com controle e feche trazendo as mãos à frente sem bater os cabos."
      },
      {
        id: "triceps-polia-barra",
        titulo: "Tríceps na polia com barra",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Tríceps",
        series: "3 séries x 12 a 15 repetições | descanso 60s",
        desc: "Cotovelos fixos ao lado do corpo, empurre a barra para baixo e controle a volta sem balançar o tronco."
      }
    ]
  },
  {
    titulo: "Costas e bíceps",
    desc: "Remadas, puxadas e roscas para postura, força e braço.",
    tags: ["Dorsal", "50 min", "Força"],
    filtro: "forca",
    exercicios: [
      {
        id: "puxada-frontal",
        titulo: "Puxada frontal",
        video: "./assets/videos/puxada-frontal.mp4",
        inicio: 0,
        grupo: "Costas",
        series: "4 séries x 10 a 12 repetições | descanso 75s",
        desc: "Puxe com os cotovelos, mantenha peito aberto e evite jogar o tronco para trás."
      },
      {
        id: "remada-baixa",
        titulo: "Remada baixa",
        video: "./assets/videos/remada-baixa.mp4",
        inicio: 0,
        grupo: "Costas",
        series: "4 séries x 10 repetições | descanso 75s",
        desc: "Tronco firme, escápulas fechando no final e volta controlada."
      },
      {
        id: "rosca-direta",
        titulo: "Rosca direta",
        video: "./assets/videos/rosca-direta.mp4",
        inicio: 0,
        grupo: "Bíceps",
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Suba sem balançar o corpo e desça lentamente para manter tensão."
      }
    ]
  },
  {
    titulo: "Pernas + gasto calórico",
    desc: "Leg press, cadeira extensora, posterior e finalização metabólica.",
    tags: ["Inferiores", "50 min", "Metabólico"],
    filtro: "forca",
    exercicios: [
      {
        id: "leg-press-45",
        titulo: "Leg press 45",
        video: "./assets/videos/leg-press-45.mp4",
        inicio: 0,
        grupo: "Pernas",
        series: "4 séries x 10 a 12 repetições | descanso 90s",
        desc: "Pés na largura do quadril, joelhos alinhados aos pés e amplitude sem tirar o quadril do banco."
      },
      {
        id: "cadeira-extensora",
        titulo: "Cadeira extensora",
        video: "./assets/videos/cadeira-extensora.mp4",
        inicio: 0,
        grupo: "Pernas",
        series: "3 séries x 12 a 15 repetições | descanso 60s",
        desc: "Suba controlando, segure um segundo no topo e desça sem deixar o peso bater."
      },
      {
        id: "levantamento-romeno",
        titulo: "Levantamento romeno",
        video: "./assets/videos/levantamento-romeno.mp4",
        inicio: 0,
        grupo: "Pernas",
        series: "3 séries x 10 a 12 repetições | descanso 75s",
        desc: "Quadril vai para trás, coluna neutra e halteres descem próximos às pernas."
      },
      {
        id: "panturrilha-leg",
        titulo: "Panturrilha no leg press",
        video: "./assets/videos/panturrilha-leg-press.mp4",
        inicio: 0,
        grupo: "Pernas",
        series: "4 séries x 12 a 15 repetições | descanso 45s",
        desc: "Use amplitude completa, suba na ponta dos pés e desça até alongar sem perder controle."
      }
    ]
  },
  {
    titulo: "Cardio e condicionamento",
    desc: "Blocos curtos para melhorar fôlego e acelerar gasto calórico.",
    tags: ["Cardio", "30 min", "HIIT"],
    filtro: "cardio",
    exercicios: [
      {
        id: "avanco-halteres",
        titulo: "Avanço com halteres",
        video: "./assets/videos/pernas.mp4",
        inicio: 0,
        grupo: "Pernas",
        series: "3 séries x 10 passos por perna | descanso 60s",
        desc: "Passo firme, tronco ereto e joelho da frente alinhado ao pé durante toda a descida."
      },
      {
        id: "prancha-cardio",
        titulo: "Prancha abdominal",
        video: "./assets/videos/ombro.mp4",
        inicio: 0,
        grupo: "Core",
        series: "3 séries x 30 a 45 segundos | descanso 45s",
        desc: "Contraia abdômen e glúteos, mantenha o corpo em linha reta e respire com controle."
      }
    ]
  },
  {
    titulo: "Core e mobilidade",
    desc: "Prancha, estabilidade e respiração para treinar com segurança.",
    tags: ["Saúde", "25 min", "Core"],
    filtro: "core",
    exercicios: [
      {
        id: "prancha-abdominal",
        titulo: "Prancha abdominal",
        video: "./assets/videos/prancha-abdominal.mp4",
        inicio: 0,
        grupo: "Core",
        series: "3 séries x 30 a 45 segundos | descanso 45s",
        desc: "Contraia abdômen e glúteos, mantenha corpo em linha reta e respire com controle."
      },
      {
        id: "desenvolvimento-militar",
        titulo: "Desenvolvimento militar",
        video: "./assets/videos/desenvolvimento-militar.mp4",
        inicio: 0,
        grupo: "Ombros",
        series: "3 séries x 8 a 10 repetições | descanso 90s",
        desc: "Base firme, abdômen contraído e barra ou halteres subindo em linha reta acima da cabeça."
      },
      {
        id: "face-pull-corda",
        titulo: "Face pull na corda",
        video: "./assets/videos/ombro.mp4",
        inicio: 0,
        grupo: "Ombros",
        series: "3 séries x 12 a 15 repetições | descanso 60s",
        desc: "Puxe a corda em direção ao rosto, cotovelos altos e escápulas contraindo no final."
      }
    ]
  }
];

const videoRealPorExercicio = {
  "supino-reto": "https://ymove.app/api/free/d09e0ed7-21dd-4f1c-b5cf-3e345e9304ec",
  "crossover-cabo": "https://ymove.app/api/free/82760b28-30e2-4311-a4c5-42da40082079",
  "triceps-polia-barra": "https://ymove.app/api/free/9a550e2c-c55e-495d-b59e-b676c3d48a41",
  "puxada-frontal": "https://ymove.app/api/free/ed1ca95e-2642-4551-a477-17485e486bfc",
  "remada-baixa": "https://ymove.app/api/free/499ccaa4-719d-40bd-b441-511291482471",
  "rosca-direta": "https://ymove.app/api/free/998e8f21-2bda-49d8-a773-b59c316d022d",
  "leg-press-45": "https://ymove.app/api/free/3dabdcc0-8639-4868-9e57-5afc621ed50d",
  "cadeira-extensora": "https://ymove.app/api/free/3d0e78d0-1125-4d25-8bd4-9ca7ba3799e8",
  "levantamento-romeno": "https://ymove.app/api/free/b7f3df3f-7371-4d29-bc59-3227fcdaa09a",
  "panturrilha-leg": "https://ymove.app/api/free/94b73c60-81d0-4522-964e-ceacf89129cf",
  "avanco-halteres": "https://ymove.app/api/free/166bf038-1670-4c52-9f32-cf6463556d99",
  "prancha-cardio": "https://ymove.app/api/free/be8f26b0-4948-4f48-b851-1a9d2cfd953c",
  "prancha-abdominal": "https://ymove.app/api/free/be8f26b0-4948-4f48-b851-1a9d2cfd953c",
  "desenvolvimento-militar": "https://ymove.app/api/free/d725ad5a-e0dd-4fca-8b9e-0016aaa757a0",
  "face-pull-corda": "https://ymove.app/api/free/0f7cf0c4-34fe-4cb3-993e-469be8004c2c"
};

gruposExercicios.forEach((grupo) => {
  grupo.exercicios.forEach((exercicio) => {
    if (videoRealPorExercicio[exercicio.id]) exercicio.video = videoRealPorExercicio[exercicio.id];
  });
});

let exerciciosAtuais = gruposExercicios.flatMap((grupo) => grupo.exercicios);

const $ = (id) => document.getElementById(id);

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatMetric(value, suffix = "", digits = 0, fallback = "--") {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return `${number.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}${suffix}`;
}

function getFicha() {
  try {
    return JSON.parse(localStorage.getItem("acafFicha")) || null;
  } catch {
    return null;
  }
}

function getHistorico() {
  try {
    return JSON.parse(localStorage.getItem("acafHistorico")) || [];
  } catch {
    return [];
  }
}

function getRegistrosVisuais() {
  try {
    return JSON.parse(localStorage.getItem("acafRegistrosVisuais")) || [];
  } catch {
    return [];
  }
}

function setRegistrosVisuais(registros) {
  localStorage.setItem("acafRegistrosVisuais", JSON.stringify(registros));
}

function setHistorico(historico) {
  localStorage.setItem("acafHistorico", JSON.stringify(historico));
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => el.classList.remove("show"), 2600);
}

function showScreen(section) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active-screen"));
  const target = $(section);
  if (target) target.classList.add("active-screen");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === section);
  });

  const titles = {
    dashboard: "Dashboard",
    treinos: "Treinos",
    evolucao: "Evolução",
    metas: "Metas",
    perfil: "Perfil"
  };

  $("pageTitle").textContent = titles[section] || "Dashboard";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function classificarIMC(imc) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidade";
}

function textoObjetivo(objetivo, peso, frequencia) {
  const pesoSeguro = safeNumber(peso, 0);
  const frequenciaSegura = Math.max(1, safeNumber(frequencia, 3));
  const calorias = Math.round(pesoSeguro * 32);
  const textos = {
    emagrecer: {
      plano: "Déficit calórico controlado",
      texto: `Para emagrecer, mantenha alimentação com aproximadamente ${Math.max(1200, calorias - 400)} kcal por dia, priorize proteína e faça cardio ${Math.max(2, frequenciaSegura - 2)}x na semana.`,
      rec: ["Cardio HIIT com progressão", "Musculação para preservar massa", "Controle de passos diários"]
    },
    definir: {
      plano: "Definição muscular",
      texto: `Para definir, mantenha treino intenso, proteína alta e calorias próximas de ${Math.max(1200, calorias - 200)} kcal por dia.`,
      rec: ["Treino com carga", "Core 3x na semana", "Sono de 7 a 8 horas"]
    },
    ganhar: {
      plano: "Ganho de massa",
      texto: `Para ganhar massa, use superavit calorico leve: aproximadamente ${calorias + 300} kcal por dia e aumente cargas aos poucos.`,
      rec: ["Progressao de carga", "Refeicoes completas", "Descanso muscular"]
    },
    resistencia: {
      plano: "Resistência física",
      texto: `Para resistência, combine musculação moderada com treinos cardiovasculares e mantenha cerca de ${calorias} kcal por dia.`,
      rec: ["Circuitos funcionais", "Cardio progressivo", "Mobilidade semanal"]
    }
  };

  return textos[objetivo];
}

function objetivoLabel(value) {
  return {
    emagrecer: "emagrecer",
    definir: "definir corpo",
    ganhar: "ganhar massa",
    resistencia: "resistência"
  }[value] || value;
}

function avatarMarkup(src, fallback) {
  return src ? `<img src="${src}" alt="${fallback}" />` : fallback.slice(0, 1).toUpperCase();
}

function nivelDoAluno(ficha) {
  if (ficha?.condicao && ficha.condicao !== "sem_restricao") return "Controlado";
  if (ficha?.nivel === "avancado") return "Avancado";
  if (ficha?.nivel === "intermediario") return "Intermediario";
  return "Iniciante";
}

function exercicioBloqueado(exercicio, ficha) {
  if (!ficha) return false;
  if (ficha.nivel === "iniciante" && ["levantamento-romeno", "desenvolvimento-militar"].includes(exercicio.id)) return true;
  if (ficha.condicao === "ombro" && ["desenvolvimento-militar", "face-pull-corda"].includes(exercicio.id)) return true;
  if (ficha.condicao === "coluna" && ["levantamento-romeno"].includes(exercicio.id)) return true;
  return false;
}

function adaptarExercicio(exercicio, ficha) {
  if (!ficha) return { ...exercicio, dificuldade: "Personal" };
  const item = { ...exercicio, dificuldade: nivelDoAluno(ficha) };
  if (ficha.nivel === "iniciante") {
    item.series = "2 a 3 series x 10 a 12 repeticoes | descanso 60s";
    item.desc = `${item.desc} Carga leve, ritmo controlado e foco em aprender o movimento.`;
  }
  if (ficha.nivel === "avancado") {
    item.series = item.series.replace(/^3/i, "4").replace(/^4/i, "5");
    item.desc = `${item.desc} Use progressao de carga sem perder amplitude e tecnica.`;
  }
  if (ficha.condicao === "joelho" && item.grupo === "Pernas") item.desc = `${item.desc} Trabalhe sem dor no joelho e com amplitude confortavel.`;
  if (ficha.condicao === "ombro" && item.grupo !== "Cardio") item.desc = `${item.desc} Ombros baixos, escapulas controladas e sem amplitude dolorosa.`;
  if (ficha.condicao === "coluna") item.desc = `${item.desc} Coluna neutra, abdomen firme e carga conservadora.`;
  return item;
}

function posterDoVideo(url, grupo) {
  const imagens = {
    Peito: "./assets/img/peito.jpg",
    Tríceps: "./assets/img/peito.jpg",
    Costas: "./assets/img/costas.jpg",
    Bíceps: "./assets/img/costas.jpg",
    Pernas: "./assets/img/pernas.jpg",
    Cardio: "./assets/img/cardio.jpg",
    Core: "./assets/img/ombro-profissional.png",
    Ombros: "./assets/img/ombro-profissional.png"
  };
  return imagens[grupo] || "./assets/img/treino-profissional.png";
}

function ajustarTreinos(objetivo, nivel, frequencia, condicao) {
  const multiplicadorNivel = { iniciante: 0.88, intermediario: 1, avancado: 1.12 }[nivel] || 1;
  const diasPermitidos = Math.max(1, safeNumber(frequencia, 5));

  return treinosBase.map((treino, index) => {
    const item = { ...treino, ...midiasOriginais[treino.dia] };
    item.tempo = Math.round(item.tempo * multiplicadorNivel);
    item.kcal = Math.round(item.kcal * multiplicadorNivel);

    if (objetivo === "emagrecer" && item.grupo === "cardio") {
      item.tempo += 5;
      item.kcal += 90;
      item.desc = "Intervalos de alta intensidade para acelerar gasto calórico com segurança.";
    }

    if (objetivo === "ganhar" && item.grupo === "forca") {
      item.series = "5 séries x 6 a 10 repetições";
      item.desc = `${item.desc} Prioridade para carga progressiva e descanso completo.`;
    }

    if (objetivo === "resistencia") {
      item.series = "4 blocos em circuito";
      item.desc = `${item.desc} Ritmo constante e pausas curtas para melhorar condicionamento.`;
    }

    if (condicao === "joelho" && item.titulo.includes("Pernas")) {
      item.cuidado = "Troque saltos por bike e use amplitude confortável para o joelho.";
    }

    if (condicao === "ombro" && item.titulo.includes("Ombros")) {
      item.cuidado = "Use carga leve, cotovelos abaixo da linha do ombro e movimento controlado.";
    }

    if (condicao === "coluna" && item.grupo === "core") {
      item.cuidado = "Priorize prancha, dead bug e exercícios sem flexão agressiva da coluna.";
    }

    item.ativo = index < diasPermitidos;
    return item;
  });
}

function gerarFicha() {
  const existente = getFicha() || {};
  const tipoUsuario = $("tipoUsuario").value;
  const nome = $("nome").value.trim();
  const professorNome = $("professorNome").value.trim();
  const idade = safeNumber($("idade").value);
  const peso = safeNumber(String($("peso").value).replace(",", "."));
  const altura = safeNumber(String($("altura").value).replace(",", "."));
  const pesoMeta = safeNumber(String($("pesoMeta").value).replace(",", "."), NaN);
  const objetivo = $("objetivo").value;
  const nivel = $("nivel").value;
  const frequencia = Math.max(1, safeNumber($("frequencia").value, 3));
  const condicao = $("condicao").value;

  if (!nome || idade < 10 || peso < 30 || altura < 1) {
    toast("Preencha nome, idade, peso e altura para gerar sua ficha.");
    showScreen("perfil");
    return;
  }

  const imc = altura > 0 ? peso / (altura * altura) : 0;
  const agua = peso * 0.035;
  const proteina = peso * 2;
  const calorias = Math.round(peso * 32);
  const plano = textoObjetivo(objetivo, peso, frequencia);

  const ficha = {
    nome,
    idade,
    peso,
    altura,
    objetivo,
    nivel,
    frequencia,
    condicao,
    tipoUsuario,
    professorNome,
    pesoMeta: Number.isFinite(pesoMeta) && pesoMeta > 0 ? pesoMeta : "",
    fotoPerfil: fotoPerfilSelecionada || existente.fotoPerfil || "",
    fotoProfessor: fotoProfessorSelecionada || existente.fotoProfessor || "",
    imc,
    agua,
    proteina,
    calorias,
    data: new Date().toLocaleDateString("pt-BR")
  };

  localStorage.setItem("acafFicha", JSON.stringify(ficha));
  treinosAtuais = ajustarTreinos(objetivo, nivel, frequencia, condicao);
  atualizarInterface(ficha);
  showScreen("dashboard");
  toast("Ficha atualizada com sucesso.");
}

function pesoAtualDaEvolucao(ficha) {
  const registros = getRegistrosVisuais();
  const ultimo = registros.sort((a, b) => new Date(a.data) - new Date(b.data))[registros.length - 1];
  return Number(ultimo?.peso || ficha?.peso || 0);
}

function atualizarInterface(ficha) {
  ficha = {
    ...ficha,
    peso: safeNumber(ficha?.peso),
    idade: safeNumber(ficha?.idade),
    altura: safeNumber(ficha?.altura, 1),
    frequencia: Math.max(1, safeNumber(ficha?.frequencia, 3)),
    imc: safeNumber(ficha?.imc),
    agua: safeNumber(ficha?.agua),
    proteina: safeNumber(ficha?.proteina),
    calorias: safeNumber(ficha?.calorias)
  };
  const plano = textoObjetivo(ficha.objetivo, ficha.peso, ficha.frequencia);
  const historico = getHistorico();
  const concluidos = historico.length;
  const progresso = Math.round((concluidos / Math.max(1, ficha.frequencia)) * 100) || 0;
  const treinoHoje = treinosAtuais.find((treino) => treino.ativo !== false && !historico.includes(treino.dia)) || treinosAtuais.find((treino) => treino.ativo !== false);
  const professorNome = ficha.professorNome || "Responsavel tecnico";
  const pesoAtualVisual = pesoAtualDaEvolucao(ficha);
  const metaTexto = ficha.pesoMeta ? `Meta: ${Number(ficha.pesoMeta).toFixed(1)} kg | atual: ${Number(pesoAtualVisual).toFixed(1)} kg` : "Defina uma meta de peso no Perfil.";

  document.querySelector(".brand-mark").innerHTML = avatarMarkup(ficha.fotoPerfil, ficha.nome || "Aluno");
  $("alunoAvatar").innerHTML = avatarMarkup(ficha.fotoPerfil, ficha.nome || "Aluno");
  $("professorAvatar").innerHTML = avatarMarkup(ficha.fotoProfessor, professorNome);
  $("alunoNomeResumo").textContent = ficha.nome || "Perfil do aluno";
  $("professorNomeResumo").textContent = professorNome;
  $("alunoMetaResumo").textContent = metaTexto;
  $("planoSidebar").textContent = `${ficha.nome} ativo`;
  $("sidebarResumo").textContent = plano.plano;
  $("mPeso").textContent = formatMetric(ficha.peso, " kg", 1);
  $("mPesoMsg").textContent = `${ficha.idade} anos | ${ficha.nivel}`;
  $("mImc").textContent = formatMetric(ficha.imc, "", 1);
  $("mImcMsg").textContent = classificarIMC(ficha.imc);
  $("mAgua").textContent = formatMetric(ficha.agua, " L", 2);
  $("mProteina").textContent = formatMetric(ficha.proteina, " g", 0);
  $("mCalorias").textContent = formatMetric(ficha.calorias, " kcal", 0);
  $("heroCalorias").textContent = formatMetric(ficha.calorias, " kcal", 0);
  $("heroNivel").textContent = ficha.nivel;
  const tempoMedio = Math.round(treinosAtuais.filter((t) => t.ativo !== false).reduce((acc, t) => acc + safeNumber(t.tempo), 0) / Math.max(1, ficha.frequencia));
  $("heroTempo").textContent = Number.isFinite(tempoMedio) ? `${tempoMedio} min` : "-- min";
  $("resultadoTitulo").textContent = `${ficha.nome}, sua ficha ACAF está pronta.`;
  $("resultadoTexto").textContent = plano.texto;
  $("dataFicha").textContent = `Atualizada em ${ficha.data}`;
  $("treinoHojeTitulo").textContent = treinoHoje ? `${treinoHoje.dia}: ${treinoHoje.titulo}` : "Semana concluída com sucesso.";
  $("treinoHojeTexto").textContent = treinoHoje ? `${treinoHoje.series}. ${treinoHoje.cuidado}` : "Reinicie a semana para começar uma nova sequência.";

  $("recomendacoes").innerHTML = plano.rec
    .map((item) => `<div class="rec"><strong>OK</strong><p>${item}</p></div>`)
    .join("");

  $("melhorias").innerHTML = `
    <li>Plano ajustado para ${objetivoLabel(ficha.objetivo)}.</li>
    <li>Metas de água, proteína e calorias calculadas automaticamente.</li>
    <li>${concluidos} treino(s) concluído(s) nesta semana.</li>
  `;

  $("pontosMelhorar").innerHTML = `
    <li>Registrar cargas em todos os exercícios principais.</li>
    <li>Manter pelo menos ${ficha.frequencia} treinos na semana.</li>
    <li>Aumentar intensidade sem perder execução correta.</li>
  `;

  atualizarScore(progresso);
  renderTreinos();
  renderGrafico();
  renderMetas();
  renderRegistrosVisuais();
}

function atualizarScore(percent) {
  const circle = $("scoreCircle");
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.max(0, Math.min(100, safeNumber(percent)));
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference - (safePercent / 100) * circumference;
  $("scorePercent").textContent = `${safePercent}%`;
}

function renderTreinos() {
  const ficha = getFicha();
  const historico = getHistorico();
  const usados = new Set();
  const videosUsados = new Set();
  const grupos = gruposExercicios
    .map((grupo) => ({
      ...grupo,
      exercicios: grupo.exercicios
        .filter((exercicio) => !exercicioBloqueado(exercicio, ficha))
        .map((exercicio) => adaptarExercicio(exercicio, ficha))
        .filter((exercicio) => {
          const passaFiltro = filtroAtual === "todos" || grupo.filtro === filtroAtual || exercicio.grupo.toLowerCase() === filtroAtual;
          if (!passaFiltro || usados.has(exercicio.id) || videosUsados.has(exercicio.video)) return false;
          usados.add(exercicio.id);
          videosUsados.add(exercicio.video);
          return true;
        })
    }))
    .filter((grupo) => grupo.exercicios.length);

  exerciciosAtuais = grupos.flatMap((grupo) => grupo.exercicios);

  $("listaTreinos").innerHTML = grupos.map((grupo) => `
    <section class="training-section">
      <div class="training-head">
        <div>
          <h4>${grupo.titulo}</h4>
          <p>${grupo.desc}</p>
          <div class="tags">${grupo.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </div>
      </div>
      <div class="exercise-grid">
        ${grupo.exercicios.map((exercicio) => {
          const index = exerciciosAtuais.findIndex((item) => item.id === exercicio.id);
          const concluido = historico.includes(exercicio.id);

          const videoComTempo = `${exercicio.video}#t=${Math.max(0.15, exercicio.inicio || 0)}`;

          return `
            <article class="exercise-card ${concluido ? "done concluido" : ""}">
              <div class="media exercise-media" onmouseenter="previewVideo(this)" onmouseleave="pararPreview(this)">
                <video muted loop autoplay controls playsinline preload="auto" poster="${posterDoVideo(exercicio.video, exercicio.grupo)}" data-start="${exercicio.inicio || 0}" data-grupo="${exercicio.grupo}" data-nome="${exercicio.video.replace("./assets/videos/", "")}" onloadedmetadata="prepararVideoTreino(this)" onloadeddata="prepararVideoTreino(this)" oncanplay="previewVideo(this.closest('.media'))" onerror="videoPreviewErro(this)">
                  <source src="${videoComTempo}" type="video/mp4" />
                </video>
                <span class="play-mark">▶</span>
              </div>

              <div class="exercise-body">
                <button class="plus" type="button" aria-label="Adicionar registro">+</button>
                <h4>${exercicio.titulo}</h4>
                <strong>${exercicio.series}</strong>
                <div class="tags">
                  <span>${exercicio.grupo}</span>
                  <span>${exercicio.dificuldade}</span>
                  <span>Execução guiada</span>
                </div>
                <p>${exercicio.desc}</p>
                <div class="exercise-actions">
                  <button class="watch" onclick="abrirVideo(${index})" type="button">▶ Abrir vídeo</button>
                  <button class="complete" onclick="toggleTreino('${exercicio.id}')" type="button">${concluido ? "Desfazer" : "Concluir"}</button>
                </div>
                <div class="log-grid">
                  <label>CARGA<input type="text" placeholder="kg"></label>
                  <label>REPS<input type="text" placeholder="feitas"></label>
                  <label>OBS<input type="text" placeholder="ex: fácil, pesado, dor..."></label>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
}

function toggleTreino(dia) {
  const ficha = getFicha();
  let historico = getHistorico();

  if (historico.includes(dia)) {
    historico = historico.filter((item) => item !== dia);
    toast("Conclusão removida.");
  } else {
    historico.push(dia);
    toast("Treino concluído. Progresso atualizado.");
  }

  setHistorico(historico);
  if (ficha) {
    treinosAtuais = ajustarTreinos(ficha.objetivo, ficha.nivel, ficha.frequencia, ficha.condicao);
    atualizarInterface(ficha);
  } else {
    renderTreinos();
    renderGrafico();
    renderMetas();
  }
}

function previewVideo(box) {
  const video = box.querySelector("video");
  if (!video) return;
  video.style.opacity = "1";
  video.play().catch(() => {});
}

function pararPreview(box) {
  const video = box.querySelector("video");
  if (!video) return;
  video.pause();
  video.currentTime = Number(video.dataset.start || 0);
  video.style.opacity = box.classList.contains("exercise-media") ? "1" : "0";
}

function prepararVideoTreino(video) {
  const inicio = Math.max(0.15, Number(video.dataset.start || 0));
  if (Number.isFinite(inicio) && video.duration > inicio) {
    const ajustar = () => {
      if (Math.abs(video.currentTime - inicio) > 0.5) {
        video.currentTime = inicio;
      }
    };
    ajustar();
    setTimeout(ajustar, 180);
  }
}

function mediaFallback(img, texto) {
  const box = document.createElement("div");
  box.className = "fallback";
  box.textContent = `${texto} não encontrada. Coloque o arquivo certo dentro de assets/img.`;
  img.replaceWith(box);
}

function videoPreviewErro(video) {
  const media = video.closest(".media");
  const nomeArquivo = video.dataset.nome || "vídeo correto";
  video.poster = posterDoVideo("", video.dataset.grupo || "");
  video.style.display = "block";

  if (media && !media.querySelector(".video-missing")) {
    const aviso = document.createElement("div");
    aviso.className = "video-missing";
    aviso.innerHTML = `<strong>Vídeo indisponível no momento</strong><span>${nomeArquivo}</span>`;
    media.appendChild(aviso);
  }
}

function abrirVideo(index) {
  const treino = exerciciosAtuais[index] || treinosAtuais[index];
  if (!treino) return;

  $("modalTitulo").textContent = treino.dia ? `${treino.dia} - ${treino.titulo}` : treino.titulo;
  $("modalTags").innerHTML = `
    <span>${treino.grupo || treino.grupoMuscular || treino.titulo}</span>
    <span>Musculação</span>
  `;
  $("modalDescricao").textContent = `${treino.desc || ""} ${treino.cuidado || ""}`;
  $("videoPlayer").src = `${treino.video}#t=${treino.inicio || 0}`;
  $("modalVideo").classList.add("show");
  $("videoPlayer").onloadedmetadata = () => {
    const inicio = Number(treino.inicio || 0);
    if (Number.isFinite(inicio) && $("videoPlayer").duration > inicio) {
      $("videoPlayer").currentTime = inicio;
    }
  };
  $("videoPlayer").play().catch(() => {
    toast(`Vídeo indisponível no momento: ${treino.titulo}`);
  });
}

function fecharVideo() {
  $("videoPlayer").pause();
  $("videoPlayer").removeAttribute("src");
  $("modalVideo").classList.remove("show");
}

function renderGrafico() {
  const historico = getHistorico();
  const maxKcal = Math.max(...treinosAtuais.map((t) => t.kcal), 1);
  const totalAtivos = Math.max(1, treinosAtuais.filter((t) => t.ativo !== false).length);
  const concluidos = Math.min(historico.length, totalAtivos);

  $("grafico").innerHTML = treinosAtuais.map((treino, index) => {
    const concluido = historico.includes(treino.dia) || index < concluidos;
    const altura = treino.ativo !== false ? Math.max(22, Math.round((treino.kcal / maxKcal) * 100)) : 14;
    return `
      <div class="bar ${concluido ? "bar-done" : ""}" style="height:${altura}%">
        <strong>${concluido ? treino.kcal : 0}</strong>
        <span>${treino.dia.slice(0, 3)}</span>
      </div>
    `;
  }).join("");

  $("totalSemana").textContent = `${concluidos}/${totalAtivos}`;
}

function renderMetas() {
  const ficha = getFicha();
  const historico = getHistorico();
  const frequencia = Math.max(1, safeNumber(ficha?.frequencia, 5));
  const kcalPorDia = Math.round(treinosAtuais.reduce((acc, t) => acc + safeNumber(t.kcal), 0) / Math.max(1, treinosAtuais.length));
  const kcal = Math.max(
    treinosAtuais.filter((t) => historico.includes(t.dia)).reduce((acc, t) => acc + safeNumber(t.kcal), 0),
    Math.min(historico.length, frequencia) * kcalPorDia
  );
  const volume = historico.length * 12;
  const pesoAtual = ficha ? pesoAtualDaEvolucao(ficha) : 0;
  const pesoInicial = Number(ficha?.peso || 0);
  const pesoMeta = Number(ficha?.pesoMeta || 0);
  const deltaPeso = pesoInicial && pesoAtual ? pesoAtual - pesoInicial : 0;
  const pesoPerdido = Math.max(0, -deltaPeso);
  const metaBatida = pesoMeta ? (ficha.objetivo === "ganhar" ? pesoAtual >= pesoMeta : pesoAtual <= pesoMeta) : false;
  const caminhoMeta = pesoMeta && pesoInicial !== pesoMeta ? Math.abs((pesoAtual - pesoInicial) / (pesoMeta - pesoInicial)) * 100 : 0;
  const semanaCompleta = historico.length >= frequencia;
  const streak = semanaCompleta ? Number(localStorage.getItem("acafStreak") || 0) + 1 : Number(localStorage.getItem("acafStreak") || 0);
  if (semanaCompleta && localStorage.getItem("acafSemanaPremiada") !== new Date().toISOString().slice(0, 10)) {
    localStorage.setItem("acafStreak", String(streak));
    localStorage.setItem("acafSemanaPremiada", new Date().toISOString().slice(0, 10));
  }
  const streakAtual = Number(localStorage.getItem("acafStreak") || 0);

  $("metasGrid").innerHTML = [
    { valor: `${historico.length}/${frequencia}`, rotulo: "treinos semanais", pct: (historico.length / frequencia) * 100 },
    { valor: formatMetric(kcal, "", 0, "0"), rotulo: "kcal realizadas", pct: Math.min((kcal / 1800) * 100, 100) },
    { valor: `${volume}`, rotulo: "séries estimadas", pct: Math.min((volume / 60) * 100, 100) },
    { valor: ficha ? formatMetric(ficha.agua, " L", 1) : "--", rotulo: "água diária", pct: ficha ? 100 : 0 },
    { valor: pesoMeta ? `${pesoAtual.toFixed(1)}/${pesoMeta.toFixed(1)}` : "--", rotulo: metaBatida ? "meta batida" : "meta de peso", pct: metaBatida ? 100 : Math.min(caminhoMeta, 100) },
    { valor: `${pesoPerdido.toFixed(1)} kg`, rotulo: "peso perdido", pct: Math.min((pesoPerdido / 10) * 100, 100) },
    { valor: `${streakAtual}x`, rotulo: "ofensiva semanal", pct: Math.min(streakAtual * 20, 100) },
    { valor: semanaCompleta ? "ouro" : "em jogo", rotulo: "conquista da semana", pct: semanaCompleta ? 100 : (historico.length / frequencia) * 100 }
  ].map((meta) => `
    <article class="goal">
      <strong>${meta.valor}</strong>
      <span>${meta.rotulo}</span>
      <div><i style="width:${Math.min(meta.pct, 100)}%"></i></div>
    </article>
  `).join("");
}

function formatarData(data) {
  if (!data) return "--";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function diffNumero(atual, inicial) {
  const a = Number(atual);
  const i = Number(inicial);
  if (!Number.isFinite(a) || !Number.isFinite(i)) return null;
  return a - i;
}

function textoDiferenca(valor, unidade = "") {
  if (valor === null) return "sem dados";
  const sinal = valor > 0 ? "+" : "";
  return `${sinal}${valor.toFixed(1)}${unidade}`;
}

function analisarEvolucaoVisual(registros) {
  if (registros.length < 2) {
    return {
      titulo: "Aguardando comparação",
      texto: "Cadastre pelo menos duas fotos em meses diferentes para o app comparar o começo com o estágio atual."
    };
  }

  const primeiro = registros[0];
  const ultimo = registros[registros.length - 1];
  const peso = diffNumero(ultimo.peso, primeiro.peso);
  const cintura = diffNumero(ultimo.cintura, primeiro.cintura);
  const peito = diffNumero(ultimo.peito, primeiro.peito);
  const braco = diffNumero(ultimo.braco, primeiro.braco);

  let pontos = 0;
  const ficha = getFicha();
  if (ficha?.objetivo === "emagrecer" || ficha?.objetivo === "definir") {
    if (peso !== null && peso < 0) pontos += 1;
    if (cintura !== null && cintura < 0) pontos += 2;
    if (braco !== null && braco >= -1) pontos += 1;
  } else if (ficha?.objetivo === "ganhar") {
    if (peso !== null && peso > 0) pontos += 1;
    if (peito !== null && peito > 0) pontos += 1;
    if (braco !== null && braco > 0) pontos += 2;
  } else {
    if (registros.length >= 2) pontos += 1;
    if (Math.abs(peso || 0) <= 3) pontos += 1;
    if (cintura !== null && cintura <= 0) pontos += 1;
  }

  const titulo = pontos >= 3 ? "Evolução positiva" : pontos >= 1 ? "Evolução moderada" : "Precisa melhorar";
  const meta = Number(ficha?.pesoMeta || 0);
  const metaBatida = meta ? (ficha.objetivo === "ganhar" ? Number(ultimo.peso) >= meta : Number(ultimo.peso) <= meta) : false;
  const textoMeta = meta ? ` Meta de peso: ${metaBatida ? "batida" : "em andamento"} (${Number(ultimo.peso).toFixed(1)} kg de ${meta.toFixed(1)} kg).` : "";
  const texto = `Do primeiro ao último registro: peso ${textoDiferenca(peso, " kg")}, cintura ${textoDiferenca(cintura, " cm")}, peito ${textoDiferenca(peito, " cm")} e braço ${textoDiferenca(braco, " cm")}.${textoMeta} Compare também as fotos lado a lado para avaliar postura, definição e volume muscular.`;
  return { titulo, texto };
}

function montarFoto(registro, label, id) {
  if (!registro?.foto) return `<div id="${id}" class="photo-preview empty">Sem foto</div>`;
  return `
    <div id="${id}" class="photo-preview">
      <img src="${registro.foto}" alt="${label}" />
      <div>
        <strong>${formatarData(registro.data)}</strong>
        <span>${registro.peso || "--"} kg</span>
      </div>
    </div>
  `;
}

function renderRegistrosVisuais() {
  const registros = getRegistrosVisuais().sort((a, b) => new Date(a.data) - new Date(b.data));
  const primeiro = registros[0];
  const ultimo = registros[registros.length - 1];
  const analise = analisarEvolucaoVisual(registros);

  $("fotoInicial").outerHTML = montarFoto(primeiro, "Primeira foto de evolução", "fotoInicial");
  $("fotoAtual").outerHTML = montarFoto(ultimo, "Foto mais recente de evolução", "fotoAtual");
  $("analiseImagemTitulo").textContent = analise.titulo;
  $("analiseImagemTexto").textContent = analise.texto;
  renderEvolutionChart(registros);

  if (!registros.length) {
    $("linhaFotos").innerHTML = `
      <article class="timeline-empty">
        <strong>Nenhum registro visual ainda</strong>
        <span>Cadastre uma foto no Perfil para começar sua evolução anual.</span>
      </article>
    `;
    return;
  }

  $("linhaFotos").innerHTML = registros.map((registro, index) => {
    const trimestre = `${index + 1}º registro`;
    return `
      <article class="timeline-item">
        <img src="${registro.foto}" alt="Registro visual ${trimestre}" />
        <div>
          <strong>${trimestre}</strong>
          <span>${formatarData(registro.data)}</span>
        </div>
        <ul>
          <li>Peso: ${registro.peso || "--"} kg</li>
          <li>Cintura: ${registro.cintura || "--"} cm</li>
          <li>Peito: ${registro.peito || "--"} cm</li>
          <li>Braço: ${registro.braco || "--"} cm</li>
          <li>Quadril: ${registro.quadril || "--"} cm</li>
        </ul>
        <p>${registro.obs || "Sem observação."}</p>
      </article>
    `;
  }).join("");
}

function renderEvolutionChart(registros) {
  const target = $("evolutionChart");
  if (!target) return;
  if (registros.length < 2) {
    target.innerHTML = `<article><strong>Gráfico de evolução</strong><span>Salve pelo menos 2 registros para ver peso e cintura mudando com o tempo.</span></article>`;
    return;
  }
  const pesos = registros.map((r) => safeNumber(r.peso, NaN)).filter(Number.isFinite);
  const cinturas = registros.map((r) => safeNumber(r.cintura, NaN)).filter(Number.isFinite);
  const labels = registros.map((r) => formatarData(r.data).slice(0, 5));
  const all = [...pesos, ...cinturas];
  if (!all.length) {
    target.innerHTML = `<article><strong>Gráfico de evolução</strong><span>Registre peso ou cintura para ativar o gráfico.</span></article>`;
    return;
  }
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = Math.max(1, max - min);
  const width = 640;
  const height = 190;
  const points = (values) => values.map((value, index) => {
    const x = registros.length === 1 ? width / 2 : (index / (registros.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 24) - 12;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  target.innerHTML = `
    <article>
      <div class="chart-title"><strong>Gráfico real de evolução</strong><span>Peso e cintura por registro</span></div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico de peso e cintura">
        <polyline class="line-weight" points="${points(pesos)}"></polyline>
        <polyline class="line-waist" points="${points(cinturas)}"></polyline>
      </svg>
      <div class="chart-legend"><span>Peso</span><span>Cintura</span></div>
      <div class="chart-labels">${labels.map((label) => `<small>${label}</small>`).join("")}</div>
    </article>
  `;
}

function salvarRegistroVisual() {
  const ficha = getFicha();
  const data = $("dataRegistro").value;
  const peso = Number(String($("pesoRegistro").value).replace(",", "."));

  if (!fotoSelecionada) {
    toast("Escolha uma foto para salvar a evolução.");
    return;
  }

  if (!data || !peso) {
    toast("Informe a data e o peso do registro.");
    return;
  }

  const registros = getRegistrosVisuais();
  const registro = {
    id: Date.now(),
    nome: ficha?.nome || $("nome").value.trim() || "Atleta",
    data,
    foto: fotoSelecionada,
    peso,
    cintura: Number(String($("cinturaRegistro").value).replace(",", ".")) || "",
    peito: Number(String($("peitoRegistro").value).replace(",", ".")) || "",
    braco: Number(String($("bracoRegistro").value).replace(",", ".")) || "",
    quadril: Number(String($("quadrilRegistro").value).replace(",", ".")) || "",
    obs: $("obsRegistro").value.trim()
  };

  registros.push(registro);
  setRegistrosVisuais(registros);
  fotoSelecionada = "";
  $("fotoRegistro").value = "";
  $("fotoUploadTexto").textContent = "Escolher foto";
  $("fotoPreview").removeAttribute("src");
  $("fotoPreview").classList.remove("show");
  ["pesoRegistro", "cinturaRegistro", "peitoRegistro", "bracoRegistro", "quadrilRegistro", "obsRegistro"].forEach((id) => {
    $(id).value = "";
  });
  renderRegistrosVisuais();
  renderMetas();
  if (ficha) atualizarInterface(ficha);
  showScreen("evolucao");
  toast("Registro visual salvo na evolução.");
}

function comprimirImagem(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxSize = 900;
        const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function startTimer() {
  clearInterval(timerInterval);
  timerSeconds = 60;
  $("restTimer").classList.add("show");
  updateTimer();
  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    updateTimer();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      $("restTimer").classList.remove("show");
      toast("Descanso finalizado. Pode voltar para a próxima série.");
    }
  }, 1000);
}

function updateTimer() {
  const min = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const sec = String(timerSeconds % 60).padStart(2, "0");
  $("timerValue").textContent = `${min}:${sec}`;
}

function updateFocusTimer() {
  const min = String(Math.floor(focusTimerSeconds / 60)).padStart(2, "0");
  const sec = String(focusTimerSeconds % 60).padStart(2, "0");
  $("focusTimerValue").textContent = `${min}:${sec}`;
}

function renderFocusExercise() {
  if (!exerciciosAtuais.length) renderTreinos();
  const exercicio = exerciciosAtuais[focusIndex];
  if (!exercicio) return;

  const video = $("focusVideo");
  const inicio = Math.max(0.15, safeNumber(exercicio.inicio, 0));
  $("focusCounter").textContent = `Exercício ${focusIndex + 1} de ${exerciciosAtuais.length}`;
  $("focusTitle").textContent = exercicio.titulo;
  $("focusSeries").textContent = exercicio.series;
  $("focusDesc").textContent = exercicio.desc;
  video.poster = posterDoVideo(exercicio.video, exercicio.grupo);
  video.src = `${exercicio.video}#t=${inicio}`;
  video.onloadedmetadata = () => {
    if (Number.isFinite(inicio) && video.duration > inicio) video.currentTime = inicio;
  };
  video.play().catch(() => {
    toast(`Abra o vídeo para conferir: ${exercicio.titulo}`);
  });
  updateFocusTimer();
}

function openFocusMode(index = 0) {
  renderTreinos();
  if (!exerciciosAtuais.length) {
    toast("Gere sua ficha para abrir o modo treino.");
    return;
  }
  focusIndex = Math.max(0, Math.min(index, exerciciosAtuais.length - 1));
  $("focusMode").classList.add("show");
  $("focusMode").setAttribute("aria-hidden", "false");
  renderFocusExercise();
}

function closeFocusMode() {
  clearInterval(focusTimerInterval);
  const video = $("focusVideo");
  video.pause();
  video.removeAttribute("src");
  $("focusMode").classList.remove("show");
  $("focusMode").setAttribute("aria-hidden", "true");
}

function moveFocus(delta) {
  if (!exerciciosAtuais.length) return;
  focusIndex = (focusIndex + delta + exerciciosAtuais.length) % exerciciosAtuais.length;
  renderFocusExercise();
}

function startFocusRest() {
  clearInterval(focusTimerInterval);
  focusTimerSeconds = 60;
  updateFocusTimer();
  focusTimerInterval = setInterval(() => {
    focusTimerSeconds -= 1;
    updateFocusTimer();
    if (focusTimerSeconds <= 0) {
      clearInterval(focusTimerInterval);
      toast("Descanso finalizado. Próximo exercício liberado.");
      moveFocus(1);
    }
  }, 1000);
}

function concluirFocusAtual() {
  const exercicio = exerciciosAtuais[focusIndex];
  if (!exercicio) return;
  const historico = getHistorico();
  if (!historico.includes(exercicio.id)) {
    historico.push(exercicio.id);
    setHistorico(historico);
  }
  const ficha = getFicha();
  if (ficha) atualizarInterface(ficha);
  renderFocusExercise();
  toast("Exercício concluído no modo treino.");
  moveFocus(1);
}

function carregarFicha() {
  renderTreinos();
  renderGrafico();
  renderMetas();
  renderRegistrosVisuais();
  $("dataRegistro").valueAsDate = new Date();

  const saved = getFicha();
  if (!saved) {
    $("alunoAvatar").textContent = "A";
    $("professorAvatar").textContent = "P";
    return;
  }

  $("tipoUsuario").value = saved.tipoUsuario || "aluno";
  $("nome").value = saved.nome || "";
  $("professorNome").value = saved.professorNome || "";
  $("idade").value = saved.idade || "";
  $("peso").value = saved.peso || "";
  $("altura").value = saved.altura || "";
  $("pesoMeta").value = saved.pesoMeta || "";
  $("objetivo").value = saved.objetivo || "emagrecer";
  $("nivel").value = saved.nivel || "iniciante";
  $("frequencia").value = saved.frequencia || "5";
  $("condicao").value = saved.condicao || "sem_restricao";
  treinosAtuais = ajustarTreinos(saved.objetivo, saved.nivel, saved.frequencia, saved.condicao);
  atualizarInterface(saved);
}

document.querySelectorAll("[data-section]").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.section));
});

document.querySelectorAll("#filtrosTreino button").forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroAtual = btn.dataset.filter;
    document.querySelectorAll("#filtrosTreino button").forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    renderTreinos();
  });
});

$("btnGerar").addEventListener("click", gerarFicha);
$("fotoPerfil").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Escolha uma imagem para a foto do aluno.");
    return;
  }
  fotoPerfilSelecionada = await comprimirImagem(file);
  $("alunoAvatar").innerHTML = avatarMarkup(fotoPerfilSelecionada, $("nome").value || "Aluno");
  document.querySelector(".brand-mark").innerHTML = avatarMarkup(fotoPerfilSelecionada, $("nome").value || "Aluno");
  toast("Foto do aluno carregada.");
});
$("fotoProfessor").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Escolha uma imagem para a foto do professor.");
    return;
  }
  fotoProfessorSelecionada = await comprimirImagem(file);
  $("professorAvatar").innerHTML = avatarMarkup(fotoProfessorSelecionada, $("professorNome").value || "Professor");
  toast("Foto do professor carregada.");
});
$("fotoRegistro").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Escolha um arquivo de imagem.");
    return;
  }

  try {
    fotoSelecionada = await comprimirImagem(file);
    $("fotoUploadTexto").textContent = file.name;
    $("fotoPreview").src = fotoSelecionada;
    $("fotoPreview").classList.add("show");
    toast("Foto carregada. Agora salve o registro.");
  } catch {
    toast("Não foi possível carregar essa foto.");
  }
});
$("btnSalvarFoto").addEventListener("click", salvarRegistroVisual);
$("btnIrTreinos").addEventListener("click", () => {
  showScreen("treinos");
  openFocusMode(0);
});
$("btnDescanso").addEventListener("click", startTimer);
$("btnPararTimer").addEventListener("click", () => {
  clearInterval(timerInterval);
  $("restTimer").classList.remove("show");
});
$("focusClose").addEventListener("click", closeFocusMode);
$("focusPrev").addEventListener("click", () => moveFocus(-1));
$("focusNext").addEventListener("click", () => moveFocus(1));
$("focusRest").addEventListener("click", startFocusRest);
$("focusDone").addEventListener("click", concluirFocusAtual);
$("focusMode").addEventListener("click", (event) => {
  if (event.target.id === "focusMode") closeFocusMode();
});
$("btnLimpar").addEventListener("click", () => {
  localStorage.removeItem("acafFicha");
  localStorage.removeItem("acafHistorico");
  localStorage.removeItem("acafRegistrosVisuais");
  location.reload();
});
$("btnSemana").addEventListener("click", () => {
  const ativos = treinosAtuais.filter((t) => t.ativo).map((t) => `${t.dia}: ${t.titulo}`).join(" | ");
  toast(ativos || "Gere sua ficha para montar a semana.");
});
$("btnResetSemana").addEventListener("click", () => {
  setHistorico([]);
  const ficha = getFicha();
  if (ficha) atualizarInterface(ficha);
  toast("Semana reiniciada.");
});
$("fecharModal").addEventListener("click", fecharVideo);
$("modalFecharBaixo").addEventListener("click", fecharVideo);
$("modalPersonalizar").addEventListener("click", () => {
  toast("Exercício pronto para personalizar na ficha.");
});
$("modalVideo").addEventListener("click", (e) => {
  if (e.target.id === "modalVideo") fecharVideo();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("btnInstall").hidden = false;
});

$("btnInstall").addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    toast("No celular, use o menu do navegador e toque em instalar app.");
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("btnInstall").hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

carregarFicha();


