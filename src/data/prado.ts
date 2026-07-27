/**
 * Conteúdo editorial do portal.
 * Regra: nada de preço, vaga ou data inventada. Quando o número não for
 * verificável, descreva a experiência em vez de cravar número.
 */

/* Sem canal de contato pessoal por decisão do Allan (2026-07-27).
   O site é guia de referência; a relação com o leitor é pela newsletter. */

/* ---------------- Praias e destinos ---------------- */

export interface Destino {
  slug: string;
  nome: string;
  chapeu: string;
  distancia: string;
  texto: string;
  destaques: string[];
}

export const DESTINOS: Destino[] = [
  {
    slug: "falesias-do-prado",
    nome: "Falésias do Prado",
    chapeu: "O cartão-postal",
    distancia: "Centro de Prado",
    texto:
      "O paredão de areia colorida que deu fama à cidade. As camadas vão do creme ao vermelho-tijolo e mudam de tom conforme o sol gira — no fim da tarde ficam alaranjadas. A caminhada pela base só é possível na maré baixa, o que torna a tábua de marés parte do passeio.",
    destaques: ["Melhor luz ao entardecer", "Acesso pela maré baixa", "Caminhada de areia"],
  },
  {
    slug: "cumuruxatiba",
    nome: "Cumuruxatiba",
    chapeu: "Vila de pescadores",
    distancia: "Cerca de 25 km ao norte",
    texto:
      "Distrito de Prado que manteve o ritmo de vila: ruas de areia, barracas simples e mar calmo protegido por recifes. É a base preferida de quem quer ficar mais de um dia na região norte do município, e o ponto de partida natural para Corumbau.",
    destaques: ["Mar protegido por recifes", "Estrutura de pousadas", "Base para o norte"],
  },
  {
    slug: "corumbau",
    nome: "Ponta do Corumbau",
    chapeu: "Banco de areia",
    distancia: "Extremo norte do município",
    texto:
      "Na maré baixa, uma língua de areia avança mar adentro e some algumas horas depois. Em dias claros dá para ver o Monte Pascoal no horizonte — o mesmo monte avistado pela esquadra de Cabral. É um dos trechos mais preservados do litoral baiano, com acesso por estrada de terra.",
    destaques: ["Aparece só na maré baixa", "Vista do Monte Pascoal", "Acesso por estrada de terra"],
  },
  {
    slug: "tororao",
    nome: "Praia do Tororão",
    chapeu: "Água doce na areia",
    distancia: "Sul do centro",
    texto:
      "Uma queda d'água doce desce a falésia e corre pela areia até o mar. A combinação de cachoeira, paredão colorido e praia aberta não se repete em nenhum outro ponto da costa. Vale chegar cedo, antes do sol alto e antes de a maré cobrir o trecho de caminhada.",
    destaques: ["Cachoeira sobre a praia", "Ir cedo", "Paredão colorido"],
  },
];

/* ---------------- Experiências ---------------- */

export interface Experiencia {
  nome: string;
  chapeu: string;
  texto: string;
  epoca: string;
}

export const EXPERIENCIAS: Experiencia[] = [
  {
    nome: "Observação de baleias-jubarte",
    chapeu: "Costa das Baleias",
    texto:
      "Entre julho e novembro as jubartes usam as águas quentes do extremo sul baiano como área de reprodução e cria. Saídas embarcadas acompanhadas de condutor credenciado, com regras de aproximação que protegem os animais.",
    epoca: "Julho a novembro",
  },
  {
    nome: "Travessia das falésias",
    chapeu: "Caminhada guiada",
    texto:
      "Percurso pela base do paredão colorido, ajustado à tábua de marés do dia. Dá para encaixar as piscinas naturais que se formam entre os recifes quando a água recua.",
    epoca: "O ano todo, conforme a maré",
  },
  {
    nome: "Corumbau e Monte Pascoal",
    chapeu: "Bate-volta",
    texto:
      "Dia inteiro subindo o litoral até a ponta, com parada nas vilas do caminho. Transporte adequado à estrada de terra e tempo calculado para pegar a maré baixa na ponta.",
    epoca: "Melhor na estação seca",
  },
  {
    nome: "Arquipélago de Abrolhos",
    chapeu: "Parque Nacional Marinho",
    texto:
      "O maior banco de corais do Atlântico Sul. As embarcações para o parque partem de Caravelas, ao sul de Prado — o passeio costuma ocupar o dia inteiro ou virar bate-volta com pernoite.",
    epoca: "Mar mais calmo entre dezembro e março",
  },
];

/* ---------------- Planejamento ---------------- */

export interface ItemPratico {
  pergunta: string;
  resposta: string;
}

export const PRATICO: ItemPratico[] = [
  {
    pergunta: "Como chegar",
    resposta:
      "O aeroporto mais prático é o de Porto Seguro, ao norte, seguido de cerca de duas horas de carro pela BR-498 e BR-101. Quem vem de carro do sul entra pela BR-101 na altura de Itamaraju ou Teixeira de Freitas.",
  },
  {
    pergunta: "Quando ir",
    resposta:
      "De julho a novembro para ver baleias, com dias mais secos e temperatura amena. De dezembro a março para mar mais calmo e quente, ideal para mergulho e para Abrolhos — é também a alta temporada, então reserve com antecedência.",
  },
  {
    pergunta: "Onde ficar",
    resposta:
      "O centro de Prado concentra a maior estrutura de pousadas, restaurantes e serviços. Cumuruxatiba é a escolha de quem quer vila tranquila e proximidade do norte. Corumbau é o mais isolado e pede pelo menos uma diária no local.",
  },
  {
    pergunta: "Quanto tempo ficar",
    resposta:
      "Três dias cobrem o centro, as falésias e o Tororão. Cinco a sete dias permitem incluir Cumuruxatiba, Corumbau e uma saída embarcada sem correria — as distâncias em estrada de terra consomem mais tempo do que o mapa sugere.",
  },
  {
    pergunta: "A maré importa mesmo?",
    resposta:
      "Muito. O banco de areia de Corumbau, a caminhada sob as falésias e as piscinas naturais só existem na maré baixa. Vale montar o roteiro do dia em torno da tábua de marés, e não do relógio.",
  },
];
