const treinosBase = [
  {
    dia: "Segunda",
    titulo: "Pernas e glúteos",
    grupo: "forca",
    img: "./assets/img/pernas.jpg",
    video: "./assets/videos/pernas.mp4",
    tempo: 75,
    kcal: 520,
    nivel: "Intermediário",
    desc: "Leg press, extensora, posterior, glúteos, panturrilha e cardio final.",
    series: "6 a 8 exercícios + cardio 20 a 30 min",
    cuidado: "Joelhos alinhados aos pés e cardio final na esteira ou bicicleta."
  },
  {
    dia: "Terça",
    titulo: "Peito",
    grupo: "forca",
    img: "./assets/img/peito.jpg",
    video: "./assets/videos/peito.mp4",
    tempo: 65,
    kcal: 440,
    nivel: "Intermediário",
    desc: "Supinos, crossover, crucifixo, flexão técnica e cardio final.",
    series: "5 a 7 exercícios + cardio 20 a 30 min",
    cuidado: "Escápulas firmes, ombros baixos e execução controlada."
  },
  {
    dia: "Quarta",
    titulo: "Tríceps",
    grupo: "forca",
    img: "./assets/img/peito.jpg",
    video: "./assets/videos/peito.mp4",
    tempo: 60,
    kcal: 380,
    nivel: "Intermediário",
    desc: "Polia, corda, francês, coice, máquina e cardio leve.",
    series: "5 a 7 exercícios + cardio 20 min",
    cuidado: "Cotovelos estáveis e sem desconforto no ombro."
  },
  {
    dia: "Quinta",
    titulo: "Costas",
    grupo: "forca",
    img: "./assets/img/costas.jpg",
    video: "./assets/videos/costas.mp4",
    tempo: 70,
    kcal: 460,
    nivel: "Intermediário",
    desc: "Puxadas, remadas, pulldown, estabilidade escapular e cardio final.",
    series: "5 a 7 exercícios + cardio 20 a 30 min",
    cuidado: "Evite puxar com o pescoço e controle a volta do movimento."
  },
  {
    dia: "Sexta",
    titulo: "Bíceps",
    grupo: "forca",
    img: "./assets/img/costas.jpg",
    video: "./assets/videos/costas.mp4",
    tempo: 60,
    kcal: 360,
    nivel: "Intermediário",
    desc: "Roscas direta, alternada, Scott, martelo, cabo, concentrada e cardio final.",
    series: "5 a 8 exercícios + cardio 20 min",
    cuidado: "Cotovelos fixos, punhos firmes e sem balançar o tronco."
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
let videoPreviewObserver = null;
let timerAudioContext = null;

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
      },
      {
        id: "crucifixo-maquina",
        titulo: "Crucifixo na máquina",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Peito",
        series: "3 séries x 12 repetições | descanso 60s",
        desc: "Feche os braços sem bater as placas, peito alto e volta controlada para alongar sem dor."
      },
      {
        id: "supino-maquina",
        titulo: "Supino máquina",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Peito",
        series: "3 séries x 10 a 12 repetições | descanso 75s",
        desc: "Opção estável para trabalhar peito com segurança, mantendo costas apoiadas e controle na volta."
      },
      {
        id: "flexao-controlada",
        titulo: "Flexão controlada",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Peito",
        series: "3 séries x máximo técnico | descanso 60s",
        desc: "Desça com controle, mantenha corpo alinhado e pare antes de perder a postura."
      },
      {
        id: "crucifixo-inclinado",
        titulo: "Crucifixo inclinado",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Peito",
        nivelMin: "intermediario",
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Variação para parte superior do peito, abrindo os braços com cotovelos semiflexionados."
      },
      {
        id: "triceps-corda",
        titulo: "Tríceps na corda",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Tríceps",
        series: "3 séries x 12 a 15 repetições | descanso 60s",
        desc: "Abra a corda no final do movimento e mantenha os cotovelos próximos ao corpo."
      },
      {
        id: "triceps-frances-corda",
        titulo: "Tríceps francês na corda",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Tríceps",
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Cotovelos apontados para frente, estenda os braços acima da cabeça e controle a descida."
      },
      {
        id: "triceps-coice",
        titulo: "Tríceps coice",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Tríceps",
        series: "3 séries x 12 por braço | descanso 45s",
        desc: "Tronco levemente inclinado, cotovelo fixo e extensão completa sem balançar o braço."
      },
      {
        id: "triceps-maquina",
        titulo: "Tríceps máquina",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Tríceps",
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Use o apoio da máquina para isolar o tríceps e controlar a fase negativa."
      },
      {
        id: "mergulho-banco",
        titulo: "Mergulho no banco",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Tríceps",
        nivelMin: "intermediario",
        evitar: ["ombro"],
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Desça pouco, cotovelos para trás e pare se sentir desconforto no ombro."
      },
      {
        id: "supino-inclinado-halteres",
        titulo: "Supino inclinado com halteres",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Peito",
        nivelMin: "intermediario",
        experienciaMin: 6,
        series: "3 séries x 8 a 10 repetições | descanso 75s",
        desc: "Variação para parte superior do peito, com halteres descendo alinhados e sem abrir demais os cotovelos."
      },
      {
        id: "triceps-testa-controlado",
        titulo: "Tríceps testa controlado",
        video: "./assets/videos/peito.mp4",
        inicio: 0,
        grupo: "Tríceps",
        nivelMin: "avancado",
        experienciaMin: 18,
        evitar: ["ombro"],
        series: "4 séries x 8 a 10 repetições | descanso 75s",
        desc: "Exercício avançado para tríceps, priorizando cotovelos estáveis e carga sem desconforto no ombro."
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
      },
      {
        id: "pulldown-corda",
        titulo: "Pulldown na corda",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Costas",
        series: "3 séries x 12 repetições | descanso 60s",
        desc: "Braços quase estendidos, puxe a corda para baixo sentindo as dorsais sem jogar o tronco."
      },
      {
        id: "remada-maquina-neutra",
        titulo: "Remada máquina pegada neutra",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Costas",
        series: "3 séries x 10 a 12 repetições | descanso 75s",
        desc: "Apoie o peito, puxe com cotovelos e segure um segundo na contração."
      },
      {
        id: "rosca-alternada",
        titulo: "Rosca alternada",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Bíceps",
        series: "3 séries x 10 por braço | descanso 60s",
        desc: "Alterne os braços mantendo cotovelos fixos e punho firme durante toda a subida."
      },
      {
        id: "rosca-scott-maquina",
        titulo: "Rosca Scott na máquina",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Bíceps",
        nivelMin: "intermediario",
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Apoie bem o braço no banco e controle a descida para não perder tensão."
      },
      {
        id: "rosca-cabo",
        titulo: "Rosca no cabo",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Bíceps",
        series: "3 séries x 12 repetições | descanso 60s",
        desc: "Use tensão constante no cabo, cotovelos fixos e subida controlada."
      },
      {
        id: "rosca-concentrada",
        titulo: "Rosca concentrada",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Bíceps",
        series: "3 séries x 10 por braço | descanso 45s",
        desc: "Apoie o braço, suba sem pressa e controle bem a descida para isolar o bíceps."
      },
      {
        id: "rosca-inclinada",
        titulo: "Rosca inclinada",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Bíceps",
        nivelMin: "intermediario",
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Banco inclinado, braços para baixo e alongamento controlado sem forçar o ombro."
      },
      {
        id: "rosca-inversa",
        titulo: "Rosca inversa",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Bíceps",
        series: "3 séries x 12 repetições | descanso 60s",
        desc: "Pegada pronada para antebraço e braquial, punhos firmes e movimento limpo."
      },
      {
        id: "remada-unilateral",
        titulo: "Remada unilateral",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Costas",
        nivelMin: "intermediario",
        experienciaMin: 6,
        series: "3 séries x 10 a 12 por lado | descanso 60s",
        desc: "Trabalhe um lado de cada vez, mantendo tronco firme e cotovelo puxando para trás."
      },
      {
        id: "rosca-martelo",
        titulo: "Rosca martelo",
        video: "./assets/videos/costas.mp4",
        inicio: 0,
        grupo: "Bíceps",
        nivelMin: "avancado",
        experienciaMin: 18,
        series: "4 séries x 10 repetições | descanso 60s",
        desc: "Variação para bíceps e braquial, com punhos neutros e subida sem impulsionar o tronco."
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
      },
      {
        id: "agachamento-guiado",
        titulo: "Agachamento guiado",
        video: "./assets/videos/pernas.mp4",
        inicio: 0,
        grupo: "Pernas",
        nivelMin: "intermediario",
        series: "3 séries x 8 a 10 repetições | descanso 90s",
        desc: "Use o aparelho para manter trajetória estável, pés firmes e joelhos alinhados."
      },
      {
        id: "cadeira-abdutora",
        titulo: "Cadeira abdutora",
        video: "./assets/videos/pernas.mp4",
        inicio: 0,
        grupo: "Pernas",
        series: "3 séries x 12 a 15 repetições | descanso 45s",
        desc: "Abra as pernas com controle, segure no final e volte sem deixar a carga despencar."
      },
      {
        id: "gluteo-maquina",
        titulo: "Glúteo na máquina",
        video: "./assets/videos/pernas.mp4",
        inicio: 0,
        grupo: "Pernas",
        nivelMin: "intermediario",
        series: "3 séries x 10 a 12 por perna | descanso 60s",
        desc: "Empurre com o calcanhar e mantenha quadril encaixado para concentrar no glúteo."
      },
      {
        id: "cadeira-flexora",
        titulo: "Cadeira flexora",
        video: "./assets/videos/pernas.mp4",
        inicio: 0,
        grupo: "Pernas",
        nivelMin: "intermediario",
        experienciaMin: 6,
        series: "3 séries x 10 a 12 repetições | descanso 60s",
        desc: "Fortalece posterior de coxa com joelho apoiado e movimento controlado, boa opção quando precisa poupar impacto."
      },
      {
        id: "agachamento-bulgaro",
        titulo: "Agachamento búlgaro",
        video: "./assets/videos/pernas.mp4",
        inicio: 0,
        grupo: "Pernas",
        nivelMin: "avancado",
        experienciaMin: 18,
        evitar: ["joelho"],
        series: "4 séries x 8 a 10 por perna | descanso 90s",
        desc: "Variação unilateral avançada para força e estabilidade. Evite se houver dor ou lesão ativa no joelho."
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
      },
      {
        id: "bike-intervalada",
        titulo: "Bike intervalada",
        video: "./assets/videos/cardio.mp4",
        inicio: 0,
        grupo: "Cardio",
        nivelMin: "intermediario",
        experienciaMin: 6,
        series: "8 tiros x 30 segundos forte | descanso 60s",
        desc: "Opção de cardio com baixo impacto, especialmente útil para quem precisa poupar joelho."
      },
      {
        id: "esteira-inclinada",
        titulo: "Esteira inclinada",
        video: "./assets/videos/cardio.mp4",
        inicio: 0,
        grupo: "Cardio",
        series: "20 minutos | ritmo moderado",
        desc: "Caminhada firme com leve inclinação, mantendo respiração controlada e sem impacto excessivo."
      },
      {
        id: "bike-moderada",
        titulo: "Bike moderada",
        video: "./assets/videos/cardio.mp4",
        inicio: 0,
        grupo: "Cardio",
        series: "20 minutos | zona confortável",
        desc: "Alternativa para quem quer melhorar fôlego poupando joelho e lombar."
      },
      {
        id: "escada-controlada",
        titulo: "Escada controlada",
        video: "./assets/videos/cardio.mp4",
        inicio: 0,
        grupo: "Cardio",
        nivelMin: "intermediario",
        evitar: ["joelho"],
        series: "10 a 15 minutos | cadência constante",
        desc: "Use passadas curtas, postura alta e pare se o joelho incomodar."
      },
      {
        id: "mobilidade-quadril",
        titulo: "Mobilidade de quadril",
        video: "./assets/videos/cardio.mp4",
        inicio: 0,
        grupo: "Core",
        series: "2 blocos x 40 segundos por lado",
        desc: "Prepare quadril e tornozelos para melhorar amplitude nos treinos de pernas."
      },
      {
        id: "alongamento-pos-treino",
        titulo: "Alongamento pós-treino",
        video: "./assets/videos/cardio.mp4",
        inicio: 0,
        grupo: "Core",
        series: "6 minutos | respiração lenta",
        desc: "Finalize soltando cadeia posterior, peitoral e costas para melhorar recuperação."
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
      },
      {
        id: "crucifixo-inverso",
        titulo: "Crucifixo inverso",
        video: "./assets/videos/ombro.mp4",
        inicio: 0,
        grupo: "Ombros",
        series: "3 séries x 12 a 15 repetições | descanso 60s",
        desc: "Foque no posterior de ombro, braços abrindo com controle e pescoço relaxado."
      },
      {
        id: "rotacao-externa",
        titulo: "Rotação externa com cabo",
        video: "./assets/videos/ombro.mp4",
        inicio: 0,
        grupo: "Ombros",
        series: "3 séries x 12 por lado | descanso 45s",
        desc: "Movimento curto e técnico para proteger ombros e melhorar estabilidade."
      },
      {
        id: "abdominal-cabo",
        titulo: "Abdominal no cabo",
        video: "./assets/videos/ombro.mp4",
        inicio: 0,
        grupo: "Core",
        nivelMin: "intermediario",
        series: "3 séries x 12 repetições | descanso 60s",
        desc: "Flexione o tronco sem puxar com os braços, sentindo o abdômen fechar o movimento."
      },
      {
        id: "dead-bug",
        titulo: "Dead bug",
        video: "./assets/videos/ombro.mp4",
        inicio: 0,
        grupo: "Core",
        nivelMin: "iniciante",
        series: "3 séries x 8 a 10 por lado | descanso 45s",
        desc: "Core seguro para coluna, com lombar estável no chão e movimento alternado de braços e pernas."
      },
      {
        id: "elevacao-pernas-controlada",
        titulo: "Elevação de pernas controlada",
        video: "./assets/videos/ombro.mp4",
        inicio: 0,
        grupo: "Core",
        nivelMin: "avancado",
        experienciaMin: 18,
        evitar: ["coluna"],
        series: "4 séries x 10 a 12 repetições | descanso 60s",
        desc: "Exercício avançado de abdômen inferior. Use apenas se a lombar ficar estável durante toda a execução."
      }
    ]
  }
];

const planoMuscularSemanal = [
  {
    diaLabel: "Segunda-feira",
    titulo: "Pernas e glúteos",
    desc: "Dia completo de inferiores, com máquinas, posterior, glúteo, panturrilha e cardio final.",
    tags: ["Pernas", "75 min", "Força"],
    filtro: "forca",
    ids: [
      "leg-press-45",
      "cadeira-extensora",
      "levantamento-romeno",
      "panturrilha-leg",
      "avanco-halteres"
    ]
  },
  {
    diaLabel: "Terça-feira",
    titulo: "Peito",
    desc: "Foco em peito com supinos, abertura, cabo e finalização para manter gasto calórico.",
    tags: ["Peito", "65 min", "Força"],
    filtro: "forca",
    ids: [
      "supino-reto",
      "crossover-cabo"
    ]
  },
  {
    diaLabel: "Quarta-feira",
    titulo: "Tríceps e ombros",
    desc: "Tríceps na polia e movimentos guiados de ombro com execução técnica.",
    tags: ["Superiores", "55 min", "Força"],
    filtro: "forca",
    ids: [
      "triceps-polia-barra",
      "desenvolvimento-militar",
      "face-pull-corda"
    ]
  },
  {
    diaLabel: "Quinta-feira",
    titulo: "Costas",
    desc: "Puxadas e remadas para dorsal, postura e fortalecimento das escápulas.",
    tags: ["Costas", "70 min", "Força"],
    filtro: "forca",
    ids: [
      "puxada-frontal",
      "remada-baixa"
    ]
  },
  {
    diaLabel: "Sexta-feira",
    titulo: "Bíceps e core",
    desc: "Rosca direta e estabilidade abdominal para fechar a semana com execução segura.",
    tags: ["Bíceps", "45 min", "Força"],
    filtro: "forca",
    ids: [
      "rosca-direta",
      "prancha-abdominal"
    ]
  }
];

const videoRealPorExercicio = {
  "supino-reto": "./assets/videos/supino-reto.mp4",
  "crossover-cabo": "./assets/videos/crossover-cabo.mp4",
  "triceps-polia-barra": "./assets/videos/triceps-polia-barra.mp4",
  "puxada-frontal": "./assets/videos/puxada-frontal.mp4",
  "remada-baixa": "./assets/videos/remada-baixa.mp4",
  "rosca-direta": "./assets/videos/rosca-direta.mp4",
  "leg-press-45": "./assets/videos/leg-press-45.mp4",
  "cadeira-extensora": "./assets/videos/cadeira-extensora.mp4",
  "levantamento-romeno": "./assets/videos/levantamento-romeno.mp4",
  "panturrilha-leg": "./assets/videos/panturrilha-leg-press.mp4",
  "avanco-halteres": "./assets/videos/avanco-halteres.mp4",
  "prancha-cardio": "./assets/videos/prancha-abdominal.mp4",
  "prancha-abdominal": "./assets/videos/prancha-abdominal.mp4",
  "desenvolvimento-militar": "./assets/videos/desenvolvimento-militar.mp4",
  "face-pull-corda": "./assets/videos/face-pull-corda.mp4"
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

function escapeAttr(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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

function getCargaHistorico() {
  try {
    return JSON.parse(localStorage.getItem("acafCargaHistorico")) || {};
  } catch {
    return {};
  }
}

function setCargaHistorico(historico) {
  localStorage.setItem("acafCargaHistorico", JSON.stringify(historico));
}

function getRascunhosExercicios() {
  try {
    return JSON.parse(localStorage.getItem("acafRascunhosExercicios")) || {};
  } catch {
    return {};
  }
}

function setRascunhosExercicios(rascunhos) {
  localStorage.setItem("acafRascunhosExercicios", JSON.stringify(rascunhos));
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

function getSeriesProgress() {
  try {
    return JSON.parse(localStorage.getItem("acafSeriesProgress")) || {};
  } catch {
    return {};
  }
}

function setSeriesProgress(progress) {
  localStorage.setItem("acafSeriesProgress", JSON.stringify(progress));
}

function getActivityLog() {
  try {
    return JSON.parse(localStorage.getItem("acafActivityLog")) || [];
  } catch {
    return [];
  }
}

function registrarAtividade(exercicioId, tipo = "treino") {
  const hoje = dataLocalKey();
  const log = getActivityLog();
  if (!log.some((item) => item.data === hoje && item.exercicioId === exercicioId && item.tipo === tipo)) {
    log.push({ data: hoje, exercicioId, tipo, criadoEm: new Date().toISOString() });
    localStorage.setItem("acafActivityLog", JSON.stringify(log.slice(-365)));
  }
}

function quantidadeSeries(exercicio) {
  const match = String(exercicio?.series || "").match(/(\d+)\s*s[eé]ries?/i);
  return Math.max(1, safeNumber(match?.[1], 3));
}

function seriesConcluidas(id) {
  return Math.max(0, safeNumber(getSeriesProgress()[id], 0));
}

function dataLocalKey(date = new Date()) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function diasConcluidosDaSemana(historico = getHistorico()) {
  const concluidos = new Set(historico);
  return planoMuscularSemanal.map((grupo, index) => ({
    index,
    grupo,
    concluido: grupo.ids.some((id) => concluidos.has(id))
  }));
}

function progressoSemanal(ficha = getFicha(), historico = getHistorico()) {
  const dias = diasConcluidosDaSemana(historico);
  const planejados = treinosAtuais
    .map((treino, index) => treino.ativo !== false ? index : null)
    .filter((index) => index !== null);
  const concluidos = planejados.filter((index) => dias[index]?.concluido);
  return {
    dias,
    planejados,
    concluidos,
    total: Math.max(1, ficha ? Math.min(safeNumber(ficha.frequencia, 3), planejados.length || 5) : planejados.length || 5)
  };
}

function descansoDoExercicio(exercicio) {
  const texto = `${exercicio?.series || ""} ${exercicio?.desc || ""}`;
  const match = texto.match(/descanso\s*(\d+)/i);
  return match ? Math.max(15, safeNumber(match[1], 60)) : 60;
}

function calcularManutencao({ sexo, idade, peso, altura, frequencia }) {
  const alturaCm = safeNumber(altura) * 100;
  const base = 10 * safeNumber(peso) + 6.25 * alturaCm - 5 * safeNumber(idade);
  const ajusteSexo = sexo === "feminino" ? -161 : sexo === "masculino" ? 5 : -78;
  const fatorAtividade = safeNumber(frequencia, 3) >= 5 ? 1.65 : safeNumber(frequencia, 3) >= 4 ? 1.55 : 1.45;
  return Math.round((base + ajusteSexo) * fatorAtividade);
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => el.classList.remove("show"), 2600);
}

function withButtonLoading(button, loadingLabel, action) {
  if (!button || button.classList.contains("loading")) return;
  const originalText = button.dataset.originalText || button.textContent;
  button.dataset.originalText = originalText;
  button.textContent = loadingLabel;
  button.classList.add("loading");
  button.setAttribute("aria-busy", "true");

  setTimeout(() => {
    try {
      action();
    } finally {
      button.classList.remove("loading");
      button.removeAttribute("aria-busy");
      button.textContent = originalText;
    }
  }, 360);
}

function updateFileLabel(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function tagClass(text) {
  const value = String(text || "").toLowerCase();
  if (["peito", "costas", "pernas", "core", "ombros", "bíceps", "tríceps", "cardio"].some((item) => value.includes(item))) return "tag-group";
  if (["iniciante", "intermediario", "intermediário", "avancado", "avançado", "controlado", "personal"].some((item) => value.includes(item))) return "tag-level";
  if (value.includes("execução") || value.includes("guiada")) return "tag-guided";
  return "tag-plan";
}

function adjustLogValue(button, field, delta) {
  const card = button.closest(".exercise-card");
  const input = card?.querySelector(`[data-log-field="${field}"]`);
  if (!input) return;
  const step = field === "carga" ? 2.5 : 1;
  const current = safeNumber(String(input.value).replace(",", "."), 0);
  const next = Math.max(0, current + delta * step);
  input.value = field === "carga" && !Number.isInteger(next) ? next.toFixed(1) : String(next);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function salvarRascunhoExercicio(id, input) {
  const card = input.closest(".exercise-card");
  if (!card) return;
  const rascunhos = getRascunhosExercicios();
  rascunhos[id] = {
    carga: card.querySelector('[data-log-field="carga"]')?.value || "",
    reps: card.querySelector('[data-log-field="reps"]')?.value || "",
    obs: card.querySelector('[data-log-field="obs"]')?.value || ""
  };
  setRascunhosExercicios(rascunhos);
}

function registrarCargaExercicio(id, totalSeries = 1) {
  const rascunhos = getRascunhosExercicios();
  const rascunho = rascunhos[id];
  if (!rascunho || (!rascunho.carga && !rascunho.reps && !rascunho.obs)) return;
  const historico = getCargaHistorico();
  const entradas = Array.isArray(historico[id]) ? historico[id] : [];
  entradas.push({ ...rascunho, series: Math.max(1, safeNumber(totalSeries, 1)), data: new Date().toISOString() });
  historico[id] = entradas.slice(-8);
  setCargaHistorico(historico);
  delete rascunhos[id];
  setRascunhosExercicios(rascunhos);
}

function toggleSerieExercicio(id, numeroSerie, totalExibido, descansoExibido) {
  const exercicio = gruposExercicios.flatMap((grupo) => grupo.exercicios).find((item) => item.id === id);
  if (!exercicio) return;
  const total = Math.max(1, safeNumber(totalExibido, quantidadeSeries(exercicio)));
  const progress = getSeriesProgress();
  const atual = Math.max(0, safeNumber(progress[id], 0));
  const novo = numeroSerie <= atual ? numeroSerie - 1 : numeroSerie;
  progress[id] = Math.min(total, Math.max(0, novo));
  setSeriesProgress(progress);

  let historico = getHistorico();
  if (progress[id] >= total && !historico.includes(id)) {
    registrarCargaExercicio(id, total);
    historico.push(id);
    setHistorico(historico);
    registrarAtividade(id);
    toast("Todas as séries concluídas. Exercício finalizado.");
  } else if (progress[id] < total && historico.includes(id)) {
    historico = historico.filter((item) => item !== id);
    setHistorico(historico);
  } else {
    toast(`Série ${progress[id]} de ${total} concluída.`);
  }

  startTimer(Math.max(15, safeNumber(descansoExibido, descansoDoExercicio(exercicio))));
  const ficha = getFicha();
  if (ficha) atualizarInterface(ficha);
}

function carregarUltimaCarga(id, button) {
  const entradas = getCargaHistorico()[id] || [];
  const ultimo = entradas[entradas.length - 1];
  const card = button.closest(".exercise-card");
  if (!ultimo || !card) {
    toast("Ainda não existe uma carga anterior para este exercício.");
    return;
  }
  const carga = card.querySelector('[data-log-field="carga"]');
  const reps = card.querySelector('[data-log-field="reps"]');
  const obs = card.querySelector('[data-log-field="obs"]');
  if (carga) carga.value = ultimo.carga || "";
  if (reps) reps.value = ultimo.reps || "";
  if (obs) obs.value = ultimo.obs || "";
  salvarRascunhoExercicio(id, carga || reps || obs);
  toast("Último registro carregado.");
}

function limparErrosPerfil() {
  ["nome", "idade", "peso", "altura", "nivel"].forEach((id) => {
    const input = $(id);
    input?.classList.remove("field-invalid");
    input?.closest("label")?.classList.remove("label-invalid");
  });
}

function marcarErroPerfil(id) {
  const input = $(id);
  input?.classList.add("field-invalid");
  input?.closest("label")?.classList.add("label-invalid");
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

function textoObjetivo(objetivo, peso, frequencia, caloriasCalculadas = 0) {
  const pesoSeguro = safeNumber(peso, 0);
  const frequenciaSegura = Math.max(1, safeNumber(frequencia, 3));
  const calorias = Math.max(1200, safeNumber(caloriasCalculadas, Math.round(pesoSeguro * 32)));
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

function diaCompleto(dia) {
  return {
    Segunda: "Segunda-feira",
    Terça: "Terça-feira",
    Quarta: "Quarta-feira",
    Quinta: "Quinta-feira",
    Sexta: "Sexta-feira"
  }[dia] || dia;
}

function experienciaLabel(value) {
  const meses = experienciaRank(value);
  if (meses >= 18) return "mais de 18 meses de treino";
  if (meses >= 6) return "6 a 18 meses de treino";
  return "até 6 meses de treino";
}

function historicoLabel(value) {
  const meses = experienciaRank(value);
  if (meses >= 36) return "histórico de 3+ anos";
  if (meses >= 24) return "histórico de 2+ anos";
  if (meses >= 12) return "histórico de 1+ ano";
  if (meses >= 6) return "histórico de 6+ meses";
  return "sem histórico anterior";
}

function avatarMarkup(src, fallback) {
  return src ? `<img src="${src}" alt="${fallback}" />` : fallback.slice(0, 1).toUpperCase();
}

function nivelRank(nivel) {
  return { iniciante: 1, intermediario: 2, avancado: 3 }[nivel] || 0;
}

function experienciaRank(experiencia) {
  return safeNumber(experiencia, 0);
}

function historicoRank(ficha) {
  return experienciaRank(ficha?.historicoTreino);
}

function experienciaEfetiva(ficha) {
  return Math.max(experienciaRank(ficha?.experiencia), historicoRank(ficha));
}

function nivelTreinoRank(ficha) {
  const base = nivelRank(ficha?.nivel);
  const historico = historicoRank(ficha);
  if (historico >= 36) return Math.max(base, 3);
  if (historico >= 12) return Math.max(base, 2);
  return base;
}

function nivelDoAluno(ficha) {
  if (!ficha?.nivel) return "Nível a definir";
  if (ficha?.condicao && ficha.condicao !== "sem_restricao") return "Controlado";
  if (experienciaRank(ficha.experiencia) < 6 && historicoRank(ficha) >= 12) return "Retorno";
  if (ficha?.nivel === "avancado") return "Avancado";
  if (ficha?.nivel === "intermediario") return "Intermediario";
  return "Iniciante";
}

function exercicioBloqueado(exercicio, ficha) {
  if (!ficha) return false;
  if (exercicio.nivelMin && nivelTreinoRank(ficha) < nivelRank(exercicio.nivelMin)) return true;
  if (exercicio.experienciaMin && experienciaEfetiva(ficha) < exercicio.experienciaMin) return true;
  if (exercicio.evitar?.includes(ficha.condicao)) return true;
  if (ficha.nivel === "iniciante" && historicoRank(ficha) < 12 && ["levantamento-romeno", "desenvolvimento-militar"].includes(exercicio.id)) return true;
  if (ficha.condicao === "ombro" && ["desenvolvimento-militar", "face-pull-corda"].includes(exercicio.id)) return true;
  if (ficha.condicao === "coluna" && ["levantamento-romeno"].includes(exercicio.id)) return true;
  return false;
}

function adaptarExercicio(exercicio, ficha) {
  if (!ficha) return { ...exercicio, dificuldade: "Personal" };
  const item = { ...exercicio, dificuldade: nivelDoAluno(ficha) };
  if (item.grupo === "Cardio") {
    item.series = ficha.objetivo === "emagrecer" || ficha.objetivo === "definir" ? "25 a 30 minutos | ritmo moderado" : "20 minutos | ritmo moderado";
    if (ficha.objetivo === "resistencia") item.series = "25 a 30 minutos | zona confortável";
    item.desc = `${item.desc} Finalizador do treino para sair do papel e acompanhar condicionamento no app.`;
    if (ficha.nivel === "iniciante") item.series = "20 minutos | caminhada ou bike leve";
    if (ficha.nivel === "iniciante" && historicoRank(ficha) >= 12) item.series = "20 a 25 minutos | esteira ou bike";
    if (ficha.nivel === "avancado") item.series = "25 a 30 minutos | esteira inclinada ou bike";
    if (ficha.condicao === "joelho") item.desc = `${item.desc} Prefira bicicleta quando o joelho estiver sensível.`;
    if (ficha.condicao === "coluna") item.desc = `${item.desc} Mantenha postura alta e intensidade confortável.`;
    return item;
  }
  if (ficha.nivel === "iniciante") {
    item.series = "2 a 3 series x 10 a 12 repeticoes | descanso 60s";
    item.desc = `${item.desc} Carga leve, ritmo controlado e foco em aprender o movimento.`;
  }
  if (ficha.nivel === "iniciante" && item.grupo === "Cardio") {
    item.series = "20 minutos | caminhada ou bike leve";
  }
  if (ficha.nivel === "iniciante" && historicoRank(ficha) >= 12) {
    item.series = "3 series x 10 a 12 repeticoes | descanso 60s";
    item.desc = `${item.desc} Perfil retornando: começa controlado, mas com volume maior que iniciante absoluto.`;
  }
  if (ficha.nivel === "iniciante" && historicoRank(ficha) >= 12 && item.grupo === "Cardio") {
    item.series = "20 a 25 minutos | esteira ou bike";
  }
  if (ficha.nivel === "avancado") {
    item.series = item.series.replace(/^3/i, "4").replace(/^4/i, "5");
    item.desc = `${item.desc} Use progressao de carga sem perder amplitude e tecnica.`;
  }
  if (ficha.nivel === "avancado" && item.grupo === "Cardio") {
    item.series = "25 a 30 minutos | esteira inclinada ou bike";
  }
  if (ficha.nivel === "avancado" && experienciaEfetiva(ficha) >= 18) {
    item.desc = `${item.desc} Bloco liberado para praticante experiente, com mais volume e controle de carga.`;
  }
  if (ficha.objetivo === "ganhar") {
    item.series = ficha.nivel === "iniciante" && historicoRank(ficha) < 12 ? "3 séries x 8 a 12 repetições | descanso 75s" : "4 séries x 6 a 10 repetições | descanso 90s";
    item.desc = `${item.desc} Objetivo de ganho: priorize carga progressiva, descanso completo e execução forte.`;
  }
  if (ficha.objetivo === "definir") {
    item.series = ficha.nivel === "iniciante" && historicoRank(ficha) < 12 ? "3 séries x 10 a 12 repetições | descanso 60s" : "3 a 4 séries x 10 a 15 repetições | descanso 45 a 60s";
    item.desc = `${item.desc} Objetivo de definição: mantenha controle, cadência e pausas mais curtas.`;
  }
  if (ficha.objetivo === "emagrecer") {
    item.series = "3 séries x 12 a 15 repetições | descanso 45s";
    item.desc = `${item.desc} Objetivo de emagrecimento: ritmo constante, carga segura e pouca pausa.`;
  }
  if (ficha.objetivo === "resistencia") {
    item.series = "3 blocos x 15 a 20 repetições | descanso 30 a 45s";
    item.desc = `${item.desc} Objetivo de resistência: movimento contínuo, respiração controlada e intensidade sustentável.`;
  }
  if (ficha.condicao === "joelho" && item.grupo === "Pernas") item.desc = `${item.desc} Trabalhe sem dor no joelho e com amplitude confortavel.`;
  if (ficha.condicao === "ombro" && item.grupo !== "Cardio") item.desc = `${item.desc} Ombros baixos, escapulas controladas e sem amplitude dolorosa.`;
  if (ficha.condicao === "coluna") item.desc = `${item.desc} Coluna neutra, abdomen firme e carga conservadora.`;
  return item;
}

function volumePorPerfil(ficha) {
  if (!ficha) return 8;
  const efetiva = experienciaEfetiva(ficha);
  if (ficha.nivel === "avancado" || efetiva >= 24) return 8;
  if (ficha.nivel === "intermediario" || efetiva >= 12) return 7;
  if (ficha.nivel === "iniciante" && historicoRank(ficha) >= 12) return 6;
  return 5;
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
  const planejamento = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 2, 4],
    5: [0, 1, 2, 3, 4]
  };
  const diasPlanejados = new Set(planejamento[Math.min(diasPermitidos, 5)] || planejamento[5]);

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

    item.ativo = diasPlanejados.has(index);
    return item;
  });
}

function gerarFicha() {
  const existente = getFicha() || {};
  const tipoUsuario = $("tipoUsuario").value;
  const nome = $("nome").value.trim();
  const professorNome = $("professorNome").value.trim();
  const idade = safeNumber($("idade").value);
  const sexo = $("sexo").value;
  const peso = safeNumber(String($("peso").value).replace(",", "."));
  const altura = safeNumber(String($("altura").value).replace(",", "."));
  const pesoMeta = safeNumber(String($("pesoMeta").value).replace(",", "."), NaN);
  const objetivo = $("objetivo").value;
  const nivel = $("nivel").value;
  const experiencia = safeNumber($("experiencia").value, 0);
  const historicoTreino = safeNumber($("historicoTreino").value, 0);
  const frequencia = Math.max(1, safeNumber($("frequencia").value, 3));
  const condicao = $("condicao").value;

  limparErrosPerfil();
  const camposInvalidos = [];
  if (!nome) camposInvalidos.push("nome");
  if (idade < 10 || idade > 90) camposInvalidos.push("idade");
  if (peso < 30) camposInvalidos.push("peso");
  if (altura < 1 || altura > 2.5) camposInvalidos.push("altura");
  if (!nivel) camposInvalidos.push("nivel");

  if (camposInvalidos.length) {
    camposInvalidos.forEach(marcarErroPerfil);
    toast("Preencha nome, idade, peso, altura e nível para gerar sua ficha.");
    showScreen("perfil");
    $(camposInvalidos[0])?.focus();
    return;
  }

  const imc = altura > 0 ? peso / (altura * altura) : 0;
  const agua = peso * 0.035;
  const proteina = peso * 2;
  const calorias = calcularManutencao({ sexo, idade, peso, altura, frequencia });
  const plano = textoObjetivo(objetivo, peso, frequencia, calorias);

  const ficha = {
    nome,
    idade,
    sexo,
    peso,
    altura,
    objetivo,
    nivel,
    experiencia,
    historicoTreino,
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
    experiencia: safeNumber(ficha?.experiencia),
    historicoTreino: safeNumber(ficha?.historicoTreino),
    frequencia: Math.max(1, safeNumber(ficha?.frequencia, 3)),
    imc: safeNumber(ficha?.imc),
    agua: safeNumber(ficha?.agua),
    proteina: safeNumber(ficha?.proteina),
    calorias: safeNumber(ficha?.calorias)
  };
  const plano = textoObjetivo(ficha.objetivo, ficha.peso, ficha.frequencia, ficha.calorias);
  const historico = getHistorico();
  const semana = progressoSemanal(ficha, historico);
  const concluidos = semana.concluidos.length;
  const progresso = Math.round((concluidos / Math.max(1, ficha.frequencia)) * 100) || 0;
  const treinoHoje = treinosAtuais.find((treino, index) => treino.ativo !== false && !semana.dias[index]?.concluido) || treinosAtuais.find((treino) => treino.ativo !== false);
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
  $("mPesoMsg").textContent = `${ficha.idade} anos | ${ficha.nivel} | ${experienciaLabel(ficha.experiencia)} | ${historicoLabel(ficha.historicoTreino)}`;
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
  $("treinoHojeTitulo").textContent = treinoHoje ? `${diaCompleto(treinoHoje.dia)} · ${treinoHoje.titulo}` : "Semana concluída com sucesso.";
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
  renderConquistas();
  renderTrainingAnalytics();
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
  if (videoPreviewObserver) videoPreviewObserver.disconnect();
  const ficha = getFicha();
  const historico = getHistorico();
  if (!ficha) {
    exerciciosAtuais = [];
    $("listaTreinos").innerHTML = `
      <section class="training-empty">
        <span class="empty-icon" aria-hidden="true">+</span>
        <span class="eyebrow">Treino personalizado</span>
        <h3>Você ainda não possui um treino montado</h3>
        <p>Preencha seu perfil para o ACAF montar os dias, exercícios, descansos e metas conforme seu objetivo.</p>
        <button class="primary" type="button" onclick="showScreen('perfil')">Gerar minha ficha</button>
      </section>
    `;
    return;
  }
  const exerciciosPorId = gruposExercicios
    .flatMap((grupo) => grupo.exercicios)
    .reduce((mapa, exercicio) => {
      mapa[exercicio.id] = exercicio;
      return mapa;
    }, {});
  const grupos = planoMuscularSemanal
    .map((grupo, groupIndex) => {
      const candidatos = grupo.ids
        .map((id) => exerciciosPorId[id])
        .filter(Boolean)
        .filter((exercicio) => Boolean(videoRealPorExercicio[exercicio.id]))
        .filter((exercicio) => !exercicioBloqueado(exercicio, ficha))
        .map((exercicio) => adaptarExercicio(exercicio, ficha))
        .filter((exercicio) => {
          const passaFiltro = filtroAtual === "todos" || grupo.filtro === filtroAtual || exercicio.grupo.toLowerCase() === filtroAtual;
          return passaFiltro;
        });
      const maxMusculacao = volumePorPerfil(ficha);
      const musculacao = candidatos.filter((exercicio) => exercicio.grupo !== "Cardio").slice(0, maxMusculacao);
      const cardio = candidatos.filter((exercicio) => exercicio.grupo === "Cardio").slice(0, 1);
      const exercicios = filtroAtual === "cardio" ? cardio : [...musculacao, ...cardio];

      return {
        ...grupo,
        planejado: treinosAtuais[groupIndex]?.ativo !== false,
        exercicios
      };
    })
    .filter((grupo) => grupo.exercicios.length);

  exerciciosAtuais = grupos.flatMap((grupo) => grupo.exercicios);

  $("listaTreinos").innerHTML = grupos.map((grupo) => `
    <section class="training-section ${grupo.planejado ? "" : "training-off"}">
      <div class="training-head">
        <div>
          <span class="day-chip">${grupo.planejado ? "Planejado" : "Extra"} da semana</span>
          <h4 class="day-title">${grupo.diaLabel} · ${grupo.titulo}</h4>
          <p><strong>${grupo.titulo}</strong> · ${grupo.desc}</p>
          <small class="training-summary">${grupo.exercicios.filter((item) => item.grupo !== "Cardio").length} exercícios de musculação + ${grupo.exercicios.some((item) => item.grupo === "Cardio") ? "cardio 20 a 30 min" : "sem cardio neste filtro"}</small>
          <div class="tags">${grupo.tags.map((tag) => `<span class="${tagClass(tag)}">${tag}</span>`).join("")}</div>
        </div>
      </div>
      <div class="exercise-grid">
        ${grupo.exercicios.map((exercicio) => {
          const index = exerciciosAtuais.findIndex((item) => item.id === exercicio.id);
          const concluido = historico.includes(exercicio.id);
          const rascunho = getRascunhosExercicios()[exercicio.id] || {};
          const entradasCarga = getCargaHistorico()[exercicio.id] || [];
          const ultimaCarga = entradasCarga[entradasCarga.length - 1];
          const totalSeries = quantidadeSeries(exercicio);
          const seriesFeitas = seriesConcluidas(exercicio.id);

          const videoComTempo = `${exercicio.video}#t=${Math.max(0.15, exercicio.inicio || 0)}`;

          return `
            <article class="exercise-card ${exercicio.grupo === "Cardio" ? "cardio-finisher" : ""} ${concluido ? "done concluido" : ""}">
              <div class="completion-badge" aria-hidden="true">✓</div>
              <div class="media exercise-media">
                <video muted loop playsinline controls preload="none" poster="${posterDoVideo(exercicio.video, exercicio.grupo)}" data-start="${exercicio.inicio || 0}" data-grupo="${exercicio.grupo}" data-nome="${exercicio.video.replace("./assets/videos/", "")}" onloadedmetadata="prepararVideoTreino(this)" onerror="videoPreviewErro(this)">
                  <source src="${videoComTempo}" type="video/mp4" />
                </video>
                <span class="play-mark">▶</span>
              </div>

              <div class="exercise-body">
                <span class="exercise-day">${grupo.diaLabel}</span>
                <h4>${exercicio.titulo}</h4>
                <strong>${exercicio.series}</strong>
                <div class="tags">
                  <span class="tag-group">${exercicio.grupo}</span>
                  <span class="tag-level">${exercicio.dificuldade}</span>
                  <span class="${exercicio.grupo === "Cardio" ? "tag-plan" : "tag-guided"}">${exercicio.grupo === "Cardio" ? "Finalização 20-30 min" : "Execução guiada"}</span>
                </div>
                <p>${exercicio.desc}</p>
                <div class="series-control" aria-label="Controle rápido de séries">
                  <span>Séries</span>
                  <div>
                    ${Array.from({ length: totalSeries }, (_, serieIndex) => {
                      const numero = serieIndex + 1;
                      return `<button class="${numero <= seriesFeitas ? "series-done" : ""}" type="button" onclick="toggleSerieExercicio('${exercicio.id}', ${numero}, ${totalSeries}, ${descansoDoExercicio(exercicio)})" aria-label="Marcar série ${numero}">${numero <= seriesFeitas ? "✓" : numero}</button>`;
                    }).join("")}
                  </div>
                  <small>${seriesFeitas}/${totalSeries} concluídas</small>
                </div>
                <div class="exercise-actions">
                  <button class="watch" onclick="abrirVideo(${index})" type="button">▶ Abrir vídeo</button>
                  <button class="complete" onclick="toggleTreino('${exercicio.id}')" type="button">${concluido ? "Concluído" : "Concluir Exercício"}</button>
                </div>
                <div class="log-grid">
                  <label>CARGA
                    <span class="step-input">
                      <button type="button" onclick="adjustLogValue(this, 'carga', -1)" aria-label="Diminuir carga">−</button>
                      <input data-log-field="carga" type="number" inputmode="decimal" placeholder="kg" step="2.5" min="0" value="${escapeAttr(rascunho.carga)}" oninput="salvarRascunhoExercicio('${exercicio.id}', this)">
                      <button type="button" onclick="adjustLogValue(this, 'carga', 1)" aria-label="Aumentar carga">+</button>
                    </span>
                  </label>
                  <label>REPS
                    <span class="step-input">
                      <button type="button" onclick="adjustLogValue(this, 'reps', -1)" aria-label="Diminuir repetições">−</button>
                      <input data-log-field="reps" type="number" inputmode="numeric" placeholder="feitas" step="1" min="0" value="${escapeAttr(rascunho.reps)}" oninput="salvarRascunhoExercicio('${exercicio.id}', this)">
                      <button type="button" onclick="adjustLogValue(this, 'reps', 1)" aria-label="Aumentar repetições">+</button>
                    </span>
                  </label>
                  <label>OBS<input data-log-field="obs" type="text" placeholder="ex: fácil, pesado, dor..." value="${escapeAttr(rascunho.obs)}" oninput="salvarRascunhoExercicio('${exercicio.id}', this)"></label>
                </div>
                <button class="load-history" type="button" onclick="carregarUltimaCarga('${exercicio.id}', this)" ${ultimaCarga ? "" : "disabled"}>
                  ${ultimaCarga ? `↺ Último treino: ${escapeAttr(ultimaCarga.carga || "--")} kg · ${escapeAttr(ultimaCarga.reps || "--")} reps` : "↺ Sem carga anterior"}
                </button>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");
  requestAnimationFrame(iniciarPreviewsVisiveis);
}

function toggleTreino(dia) {
  const ficha = getFicha();
  if (!ficha) {
    showScreen("perfil");
    toast("Gere sua ficha antes de concluir exercícios.");
    return;
  }
  let historico = getHistorico();
  const exercicio = gruposExercicios.flatMap((grupo) => grupo.exercicios).find((item) => item.id === dia);

  if (historico.includes(dia)) {
    historico = historico.filter((item) => item !== dia);
    const progress = getSeriesProgress();
    progress[dia] = 0;
    setSeriesProgress(progress);
    toast("Conclusão removida.");
  } else {
    const totalSeries = quantidadeSeries(exercicio);
    registrarCargaExercicio(dia, totalSeries);
    historico.push(dia);
    const progress = getSeriesProgress();
    progress[dia] = totalSeries;
    setSeriesProgress(progress);
    registrarAtividade(dia);
    const descanso = descansoDoExercicio(exercicio);
    startTimer(descanso);
    toast(`Exercício concluído. Descanso de ${descanso}s iniciado.`);
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
  video.muted = true;
  video.playsInline = true;
  video.play().catch(() => {
    video.controls = true;
  });
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

function iniciarPreviewsVisiveis() {
  if (videoPreviewObserver) videoPreviewObserver.disconnect();
  const videos = [...document.querySelectorAll("#listaTreinos .exercise-media video")];
  if (!videos.length) return;

  videoPreviewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      video.dataset.previewVisible = entry.isIntersecting && entry.intersectionRatio >= 0.35 ? "1" : "0";
      if (video.dataset.previewVisible === "0") {
        video.pause();
        video.closest(".exercise-media")?.classList.remove("is-playing");
      }
    });
    requestAnimationFrame(() => {
      const centroTela = window.innerHeight / 2;
      const visiveis = videos
        .filter((video) => video.dataset.previewVisible === "1")
        .sort((a, b) => {
          const centroA = a.getBoundingClientRect().top + a.getBoundingClientRect().height / 2;
          const centroB = b.getBoundingClientRect().top + b.getBoundingClientRect().height / 2;
          return Math.abs(centroA - centroTela) - Math.abs(centroB - centroTela);
        });
      videos.forEach((video) => {
        if (video === visiveis[0]) {
          video.muted = true;
          video.playsInline = true;
          video.style.opacity = "1";
          video.play()
            .then(() => video.closest(".exercise-media")?.classList.add("is-playing"))
            .catch(() => {
              video.controls = true;
            });
        } else {
          video.pause();
          video.closest(".exercise-media")?.classList.remove("is-playing");
        }
      });
    });
  }, { threshold: [0, 0.35, 0.7] });

  videos.forEach((video) => videoPreviewObserver.observe(video));
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

async function abrirVideoFlutuante() {
  const video = $("videoPlayer");
  if (!document.pictureInPictureEnabled || !video.requestPictureInPicture) {
    toast("A janela flutuante não é compatível com este navegador.");
    return;
  }
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  } catch {
    toast("Inicie o vídeo e tente abrir a janela flutuante novamente.");
  }
}

function exportarRelatorio() {
  const ficha = getFicha();
  if (!ficha) {
    showScreen("perfil");
    toast("Gere sua ficha antes de exportar o relatório.");
    return;
  }
  const dados = dadosDePerformance();
  const registros = getRegistrosVisuais().sort((a, b) => new Date(a.data) - new Date(b.data));
  const melhor = dados.reduce((max, item) => item.oneRm > max.oneRm ? item : max, { oneRm: 0, titulo: "--" });
  const volume = dados.reduce((total, item) => total + item.volume, 0);
  const semana = progressoSemanal(ficha, getHistorico());
  const fotos = [registros[0], registros[registros.length - 1]].filter(Boolean);
  let report = $("printReport");
  if (!report) {
    report = document.createElement("section");
    report.id = "printReport";
    report.className = "print-report";
    document.body.appendChild(report);
  }
  report.innerHTML = `
    <header><strong>ACAF</strong><span>Relatório de performance</span></header>
    <h1>${escapeAttr(ficha.nome)}</h1>
    <p>Emitido em ${new Date().toLocaleDateString("pt-BR")} · Objetivo: ${objetivoLabel(ficha.objetivo)} · Nível: ${escapeAttr(ficha.nivel)}</p>
    <div class="print-metrics">
      <article><span>Peso atual</span><strong>${formatMetric(pesoAtualDaEvolucao(ficha), " kg", 1)}</strong></article>
      <article><span>Treinos da semana</span><strong>${semana.concluidos.length}/${semana.total}</strong></article>
      <article><span>Melhor 1RM</span><strong>${melhor.oneRm ? `${melhor.oneRm.toFixed(1)} kg` : "--"}</strong><small>${escapeAttr(melhor.titulo)}</small></article>
      <article><span>Volume registrado</span><strong>${Math.round(volume).toLocaleString("pt-BR")} kg</strong></article>
      <article><span>Sequência</span><strong>${calcularSequencia()} dias</strong></article>
    </div>
    <h2>Conquistas</h2>
    <p>${conquistasAtuais().filter((item) => item.liberada).map((item) => item.nome).join(" · ") || "Nenhuma conquista desbloqueada ainda."}</p>
    <h2>Evolução visual</h2>
    <div class="print-photos">${fotos.map((registro) => `<figure><img src="${registro.foto}" alt="Evolução"><figcaption>${formatarData(registro.data)} · ${registro.peso} kg</figcaption></figure>`).join("") || "<p>Sem fotos registradas.</p>"}</div>
    <footer>ACAF Centro de Performance · Documento de acompanhamento pessoal</footer>
  `;
  window.print();
}

function renderGrafico() {
  const ficha = getFicha();
  if (!ficha) {
    $("grafico").innerHTML = `
      <div class="chart-empty">
        <strong>Aguardando perfil</strong>
        <span>O gráfico será liberado depois que sua ficha definir os dias planejados.</span>
      </div>
    `;
    $("totalSemana").textContent = "Aguardando";
    return;
  }
  const historico = getHistorico();
  const maxKcal = Math.max(...treinosAtuais.map((t) => t.kcal), 1);
  const semana = progressoSemanal(ficha, historico);

  $("grafico").innerHTML = treinosAtuais.map((treino, index) => {
    const concluido = semana.dias[index]?.concluido;
    const altura = treino.ativo !== false ? Math.max(22, Math.round((treino.kcal / maxKcal) * 100)) : 14;
    return `
      <div class="bar ${concluido ? "bar-done" : ""} ${treino.ativo === false ? "bar-extra" : ""}" data-height="${altura}">
        <strong>${concluido ? treino.kcal : 0}</strong>
        <span>${treino.dia.slice(0, 3)}</span>
      </div>
    `;
  }).join("");
  $("grafico").querySelectorAll(".bar").forEach((bar) => {
    bar.style.height = `${bar.dataset.height}%`;
  });

  $("totalSemana").textContent = `${semana.concluidos.length}/${semana.total}`;
}

function calcularSequencia() {
  const dias = [...new Set(getActivityLog().map((item) => item.data))].sort().reverse();
  if (!dias.length) return 0;
  let cursor = new Date();
  const hoje = dataLocalKey(cursor);
  cursor.setDate(cursor.getDate() - 1);
  const ontem = dataLocalKey(cursor);
  if (!dias.includes(hoje) && !dias.includes(ontem)) return 0;
  cursor = new Date(`${dias.includes(hoje) ? hoje : ontem}T12:00:00`);
  let streak = 0;
  while (dias.includes(dataLocalKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function conquistasAtuais() {
  const cargas = Object.values(getCargaHistorico()).flat();
  const semana = progressoSemanal(getFicha(), getHistorico());
  const streak = calcularSequencia();
  return [
    { nome: "Primeiro passo", liberada: getActivityLog().length > 0 },
    { nome: "Ritmo 3 dias", liberada: streak >= 3 },
    { nome: "Clube dos 100 kg", liberada: cargas.some((item) => safeNumber(item.carga) >= 100) },
    { nome: "Semana completa", liberada: getFicha() && semana.concluidos.length >= semana.total },
    { nome: "Evolução visual", liberada: getRegistrosVisuais().length >= 2 }
  ];
}

function renderConquistas() {
  const target = $("badgeList");
  if (!target) return;
  const streak = calcularSequencia();
  $("streakValue").textContent = `${streak} ${streak === 1 ? "dia" : "dias"}`;
  $("streakIcon").textContent = streak >= 3 ? "◆" : "○";
  $("streakIcon").classList.toggle("streak-hot", streak >= 3);
  const conquistas = conquistasAtuais();
  target.innerHTML = conquistas.map((item) => `
    <span class="${item.liberada ? "earned-badge" : "locked-badge"}">${item.liberada ? "✓" : "○"} ${item.nome}</span>
  `).join("");
}

function pontosGrafico(valores, width = 600, height = 170) {
  if (!valores.length) return "";
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const range = Math.max(1, max - min);
  return valores.map((valor, index) => {
    const x = valores.length === 1 ? width / 2 : (index / (valores.length - 1)) * width;
    const y = height - 14 - ((valor - min) / range) * (height - 28);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function dadosDePerformance() {
  const catalogo = gruposExercicios.flatMap((grupo) => grupo.exercicios);
  const entradas = [];
  Object.entries(getCargaHistorico()).forEach(([id, registros]) => {
    const exercicio = catalogo.find((item) => item.id === id);
    (registros || []).forEach((registro) => {
      const carga = safeNumber(registro.carga);
      const reps = safeNumber(registro.reps);
      const series = Math.max(1, safeNumber(registro.series, quantidadeSeries(exercicio)));
      if (!carga || !reps) return;
      entradas.push({
        id,
        titulo: exercicio?.titulo || id,
        data: registro.data,
        carga,
        reps,
        series,
        oneRm: carga * (1 + reps / 30),
        volume: carga * reps * series
      });
    });
  });
  return entradas.sort((a, b) => new Date(a.data) - new Date(b.data));
}

function renderMiniChart(targetId, valores, corClass, vazio) {
  const target = $(targetId);
  if (!target) return;
  if (!valores.length) {
    target.innerHTML = `<div class="analytics-empty">${vazio}</div>`;
    return;
  }
  const recentes = valores.slice(-8);
  const pointString = pontosGrafico(recentes);
  const pointClass = corClass === "analytics-force-line" ? "analytics-force-point" : "analytics-volume-point";
  target.innerHTML = `
    <svg viewBox="0 0 600 170" role="img" aria-label="${vazio}">
      <polyline class="${corClass}" points="${pointString}"></polyline>
      ${pointString.split(" ").map((point) => {
        const [cx, cy] = point.split(",");
        return `<circle class="${pointClass}" cx="${cx}" cy="${cy}" r="7"></circle>`;
      }).join("")}
    </svg>
    <div class="analytics-values">${recentes.map((valor) => `<span>${Math.round(valor).toLocaleString("pt-BR")}</span>`).join("")}</div>
  `;
}

function renderTrainingCalendar() {
  const target = $("trainingCalendar");
  if (!target) return;
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const ativos = new Set(getActivityLog().map((item) => item.data));
  $("calendarMonth").textContent = hoje.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const celulas = [];
  for (let vazio = 0; vazio < primeiroDia; vazio += 1) celulas.push('<span class="calendar-empty"></span>');
  for (let dia = 1; dia <= totalDias; dia += 1) {
    const data = dataLocalKey(new Date(ano, mes, dia));
    const classeHoje = dia === hoje.getDate() ? "calendar-today" : "";
    const classeAtivo = ativos.has(data) ? "calendar-trained" : "";
    celulas.push(`<span class="${classeHoje} ${classeAtivo}" title="${ativos.has(data) ? "Treino realizado" : "Sem treino registrado"}">${dia}</span>`);
  }
  target.innerHTML = `
    ${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => `<strong>${dia}</strong>`).join("")}
    ${celulas.join("")}
  `;
}

function renderTrainingAnalytics() {
  const dados = dadosDePerformance();
  const melhor = dados.reduce((max, item) => item.oneRm > max.oneRm ? item : max, { oneRm: 0, titulo: "" });
  const volume = dados.reduce((total, item) => total + item.volume, 0);
  const series = dados.reduce((total, item) => total + item.series, 0);
  if ($("bestOneRm")) $("bestOneRm").textContent = melhor.oneRm ? `${melhor.oneRm.toFixed(1)} kg · ${melhor.titulo}` : "Aguardando carga";
  if ($("totalVolume")) $("totalVolume").textContent = `${Math.round(volume).toLocaleString("pt-BR")} kg`;
  if ($("totalSets")) $("totalSets").textContent = String(series);
  renderMiniChart("strengthChart", dados.map((item) => item.oneRm), "analytics-force-line", "Registre carga e repetições para acompanhar força.");
  renderMiniChart("volumeChart", dados.map((item) => item.volume), "analytics-volume-line", "Conclua séries com carga para calcular volume.");
  renderTrainingCalendar();
}

function renderMetas() {
  const ficha = getFicha();
  if (!ficha) {
    $("metasGrid").innerHTML = `
      <article class="goals-empty">
        <span class="eyebrow">Metas personalizadas</span>
        <h3>Aguardando seu perfil</h3>
        <p>Preencha peso, objetivo e frequência para calcular treinos, água, proteína e gasto calórico.</p>
        <button class="primary" type="button" onclick="showScreen('perfil')">Preencher perfil</button>
      </article>
    `;
    return;
  }
  const historico = getHistorico();
  const frequencia = Math.max(1, safeNumber(ficha?.frequencia, 5));
  const semana = progressoSemanal(ficha, historico);
  const concluidosSemana = semana.concluidos.length;
  const metaCalorias = Math.max(1, safeNumber(ficha?.calorias, 1800));
  const kcal = semana.concluidos.reduce((total, index) => total + safeNumber(treinosAtuais[index]?.kcal), 0);
  const volume = concluidosSemana * 12;
  const pesoAtual = ficha ? pesoAtualDaEvolucao(ficha) : 0;
  const pesoInicial = Number(ficha?.peso || 0);
  const pesoMeta = Number(ficha?.pesoMeta || 0);
  const deltaPeso = pesoInicial && pesoAtual ? pesoAtual - pesoInicial : 0;
  const pesoPerdido = Math.max(0, -deltaPeso);
  const pesoGanho = Math.max(0, deltaPeso);
  const pesoRestante = pesoMeta ? Math.max(0, Math.abs(pesoMeta - pesoAtual)) : 0;
  const objetivoGanho = ficha?.objetivo === "ganhar";
  const metaBatida = pesoMeta ? (ficha.objetivo === "ganhar" ? pesoAtual >= pesoMeta : pesoAtual <= pesoMeta) : false;
  const metaPesoLabel = objetivoGanho ? "meta de ganho" : "meta de peso";
  const progressoPeso = objetivoGanho
    ? { valor: `${pesoGanho.toFixed(1)} kg`, rotulo: pesoMeta && !metaBatida ? `faltam ${pesoRestante.toFixed(1)} kg` : "peso ganho", pct: pesoMeta ? Math.min((pesoGanho / Math.max(1, Math.abs(pesoMeta - pesoInicial))) * 100, 100) : 0 }
    : { valor: `${pesoPerdido.toFixed(1)} kg`, rotulo: "peso perdido", pct: Math.min((pesoPerdido / 10) * 100, 100) };
  const caminhoMeta = pesoMeta && pesoInicial !== pesoMeta ? Math.abs((pesoAtual - pesoInicial) / (pesoMeta - pesoInicial)) * 100 : 0;
  const semanaCompleta = concluidosSemana >= frequencia;
  const streak = semanaCompleta ? Number(localStorage.getItem("acafStreak") || 0) + 1 : Number(localStorage.getItem("acafStreak") || 0);
  if (semanaCompleta && localStorage.getItem("acafSemanaPremiada") !== new Date().toISOString().slice(0, 10)) {
    localStorage.setItem("acafStreak", String(streak));
    localStorage.setItem("acafSemanaPremiada", new Date().toISOString().slice(0, 10));
  }
  const streakAtual = Number(localStorage.getItem("acafStreak") || 0);

  $("metasGrid").innerHTML = [
    { valor: `${concluidosSemana}/${frequencia}`, rotulo: "treinos semanais", pct: (concluidosSemana / frequencia) * 100 },
    { valor: formatMetric(kcal, "", 0, "0"), rotulo: `kcal de ${formatMetric(metaCalorias, "", 0, "0")}`, pct: Math.min((kcal / metaCalorias) * 100, 100) },
    { valor: `${volume}`, rotulo: "séries estimadas", pct: Math.min((volume / 60) * 100, 100) },
    { valor: ficha ? formatMetric(ficha.agua, " L", 1) : "--", rotulo: "água diária", pct: ficha ? 100 : 0 },
    { valor: pesoMeta ? `${pesoAtual.toFixed(1)}/${pesoMeta.toFixed(1)}` : "--", rotulo: metaBatida ? "meta batida" : metaPesoLabel, pct: metaBatida ? 100 : Math.min(caminhoMeta, 100) },
    progressoPeso,
    { valor: `${streakAtual}x`, rotulo: "ofensiva semanal", pct: Math.min(streakAtual * 20, 100) },
    { valor: semanaCompleta ? "ouro" : "em jogo", rotulo: "conquista da semana", pct: semanaCompleta ? 100 : (concluidosSemana / frequencia) * 100 }
  ].map((meta) => `
    <article class="goal">
      <strong>${meta.valor}</strong>
      <span>${meta.rotulo}</span>
      <div><i data-width="${Math.min(meta.pct, 100)}"></i></div>
    </article>
  `).join("");
  $("metasGrid").querySelectorAll("i").forEach((bar) => {
    bar.style.width = `${bar.dataset.width}%`;
  });
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

function prepararAvisoDescanso() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && !timerAudioContext) timerAudioContext = new AudioCtx();
    timerAudioContext?.resume?.();
  } catch {
    timerAudioContext = null;
  }
}

function avisarFimDescanso() {
  if (navigator.vibrate) navigator.vibrate([180, 100, 180]);
  try {
    if (!timerAudioContext) return;
    const oscillator = timerAudioContext.createOscillator();
    const gain = timerAudioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(740, timerAudioContext.currentTime);
    gain.gain.setValueAtTime(0.0001, timerAudioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, timerAudioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, timerAudioContext.currentTime + 0.35);
    oscillator.connect(gain);
    gain.connect(timerAudioContext.destination);
    oscillator.start();
    oscillator.stop(timerAudioContext.currentTime + 0.36);
  } catch {
    timerAudioContext = null;
  }
}

function startTimer(seconds = 60) {
  clearInterval(timerInterval);
  prepararAvisoDescanso();
  timerSeconds = Math.max(1, safeNumber(seconds, 60));
  $("restTimer").classList.add("show");
  updateTimer();
  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    updateTimer();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      $("restTimer").classList.remove("show");
      avisarFimDescanso();
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
  if (!getFicha()) {
    showScreen("perfil");
    toast("Preencha seu perfil para iniciar um treino personalizado.");
    return;
  }
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
  prepararAvisoDescanso();
  focusTimerSeconds = descansoDoExercicio(exerciciosAtuais[focusIndex]);
  updateFocusTimer();
  focusTimerInterval = setInterval(() => {
    focusTimerSeconds -= 1;
    updateFocusTimer();
    if (focusTimerSeconds <= 0) {
      clearInterval(focusTimerInterval);
      avisarFimDescanso();
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
    const totalSeries = quantidadeSeries(exercicio);
    registrarCargaExercicio(exercicio.id, totalSeries);
    historico.push(exercicio.id);
    setHistorico(historico);
    const progress = getSeriesProgress();
    progress[exercicio.id] = totalSeries;
    setSeriesProgress(progress);
    registrarAtividade(exercicio.id);
  }
  const ficha = getFicha();
  if (ficha) atualizarInterface(ficha);
  renderFocusExercise();
  startFocusRest();
  toast(`Exercício concluído. Descanso de ${descansoDoExercicio(exercicio)}s iniciado.`);
}

function carregarFicha() {
  renderTreinos();
  renderGrafico();
  renderMetas();
  renderRegistrosVisuais();
  renderConquistas();
  renderTrainingAnalytics();
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
  $("sexo").value = saved.sexo || "masculino";
  $("peso").value = saved.peso || "";
  $("altura").value = saved.altura || "";
  $("pesoMeta").value = saved.pesoMeta || "";
  $("objetivo").value = saved.objetivo || "emagrecer";
  $("nivel").value = saved.nivel || "";
  $("experiencia").value = saved.experiencia || "0";
  $("historicoTreino").value = saved.historicoTreino || "0";
  $("frequencia").value = saved.frequencia || "5";
  $("condicao").value = saved.condicao || "sem_restricao";
  if (saved.fotoPerfil) updateFileLabel("fotoPerfilTexto", "Foto do aluno salva");
  if (saved.fotoProfessor) updateFileLabel("fotoProfessorTexto", "Foto do professor salva");
  treinosAtuais = ajustarTreinos(saved.objetivo, saved.nivel, saved.frequencia, saved.condicao);
  atualizarInterface(saved);
}

document.querySelectorAll("[data-section]").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.section));
});

["nome", "idade", "peso", "altura", "nivel"].forEach((id) => {
  $(id)?.addEventListener("input", () => {
    $(id).classList.remove("field-invalid");
    $(id).closest("label")?.classList.remove("label-invalid");
  });
});

document.querySelectorAll("#filtrosTreino button").forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroAtual = btn.dataset.filter;
    document.querySelectorAll("#filtrosTreino button").forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    renderTreinos();
  });
});

$("btnGerar").addEventListener("click", () => withButtonLoading($("btnGerar"), "Gerando ficha", gerarFicha));
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
  updateFileLabel("fotoPerfilTexto", file.name);
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
  updateFileLabel("fotoProfessorTexto", file.name);
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
$("btnSalvarFoto").addEventListener("click", () => withButtonLoading($("btnSalvarFoto"), "Salvando evolução", salvarRegistroVisual));
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
function openClearConfirm() {
  $("confirmClear").classList.add("show");
  $("confirmClear").setAttribute("aria-hidden", "false");
}

function closeClearConfirm() {
  $("confirmClear").classList.remove("show");
  $("confirmClear").setAttribute("aria-hidden", "true");
}

$("btnLimpar").addEventListener("click", openClearConfirm);
$("btnCancelarLimpeza").addEventListener("click", closeClearConfirm);
$("confirmClear").addEventListener("click", (event) => {
  if (event.target.id === "confirmClear") closeClearConfirm();
});
$("btnConfirmarLimpeza").addEventListener("click", () => {
  localStorage.removeItem("acafFicha");
  localStorage.removeItem("acafHistorico");
  localStorage.removeItem("acafRegistrosVisuais");
  localStorage.removeItem("acafCargaHistorico");
  localStorage.removeItem("acafRascunhosExercicios");
  localStorage.removeItem("acafSeriesProgress");
  localStorage.removeItem("acafActivityLog");
  localStorage.removeItem("acafStreak");
  localStorage.removeItem("acafSemanaPremiada");
  location.reload();
});
$("btnSemana").addEventListener("click", () => {
  const ativos = treinosAtuais.filter((t) => t.ativo).map((t) => `${t.dia}: ${t.titulo}`).join(" | ");
  toast(ativos || "Gere sua ficha para montar a semana.");
});
$("btnResetSemana").addEventListener("click", () => {
  setHistorico([]);
  setSeriesProgress({});
  const ficha = getFicha();
  if (ficha) atualizarInterface(ficha);
  toast("Semana reiniciada.");
});
$("fecharModal").addEventListener("click", fecharVideo);
$("modalFecharBaixo").addEventListener("click", fecharVideo);
$("modalPip").addEventListener("click", abrirVideoFlutuante);
$("btnExportarRelatorio").addEventListener("click", exportarRelatorio);
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

async function instalarApp() {
  if (!deferredInstallPrompt) {
    toast("No celular, use o menu do navegador e toque em instalar app.");
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("btnInstall").hidden = true;
}

$("btnInstall").addEventListener("click", instalarApp);
$("btnInstallInline").addEventListener("click", instalarApp);

function limparCacheLocalDev() {
  const localDev = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (!localDev) return;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations?.().then((regs) => regs.forEach((reg) => reg.unregister())).catch(() => {});
  }
  if ("caches" in window) {
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key))).catch(() => {});
  }
}

limparCacheLocalDev();

if ("serviceWorker" in navigator && !["localhost", "127.0.0.1"].includes(location.hostname)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

carregarFicha();


