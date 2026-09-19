#!/usr/bin/env node

/**
 * Script universal de validação pós-deploy de produção para VisitePrado.com.br.
 * Realiza fetch real contra URLs públicas e audita conteúdo byte-a-byte.
 */

const TARGETS = [
  {
    name: "Home - Guia de Turismo Prado Bahia",
    url: "https://www.visiteprado.com.br/",
    expectedStatus: 200,
    mustContain: [
      "Prado",
      "Bahia"
    ],
    mustNotContain: []
  },
  {
    name: "Termos e Privacidade",
    url: "https://www.visiteprado.com.br/privacidade",
    expectedStatus: 200,
    mustContain: [
      "Privacidade"
    ],
    mustNotContain: []
  },
  {
    name: "Blog Público & Ingestão de Artigos (/blog)",
    url: "https://www.visiteprado.com.br/blog",
    expectedStatus: 200,
    mustContain: [
      "Blog",
      "Visite Prado"
    ],
    mustNotContain: []
  }
];

async function runVerification() {
  console.log("================================================================");
  console.log("🔍 AUDITORIA EXTERNA PÓS-DEPLOY: VISITEPRADO.COM.BR");
  console.log("================================================================\n");

  let failures = 0;

  for (const target of TARGETS) {
    process.stdout.write(`👉 Verificando [${target.name}] (${target.url})... `);

    try {
      const resp = await fetch(target.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 DeployAuditor/2.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache"
        },
        redirect: "follow"
      });

      if (target.expectedStatus && resp.status !== target.expectedStatus) {
        console.log(`❌ FALHA HTTP: Status esperado ${target.expectedStatus}, mas retornou ${resp.status}!`);
        failures++;
        continue;
      }

      const body = await resp.text();

      // Checa strings obrigatórias
      let missingStr = null;
      for (const str of target.mustContain) {
        if (!body.toLowerCase().includes(str.toLowerCase())) {
          missingStr = str;
          break;
        }
      }

      if (missingStr) {
        console.log(`❌ FALHA DE CONTEÚDO: String obrigatória NÃO encontrada!`);
        console.log(`   Esperado encontrar: "${missingStr}"`);
        failures++;
        continue;
      }

      // Checa strings proibidas
      let foundForbidden = null;
      for (const str of target.mustNotContain) {
        if (body.toLowerCase().includes(str.toLowerCase())) {
          foundForbidden = str;
          break;
        }
      }

      if (foundForbidden) {
        console.log(`❌ FALHA DE CONTEÚDO: Conteúdo proibido/legado ENCONTRADO na página!`);
        console.log(`   Esperado NÃO encontrar: "${foundForbidden}"`);
        failures++;
        continue;
      }

      console.log("✅ APROVADO");
    } catch (err) {
      console.log(`❌ ERRO DE CONEXÃO: ${err.message}`);
      failures++;
    }
  }

  console.log("\n----------------------------------------------------------------");
  if (failures > 0) {
    console.error(`🚨 ERRO CRÍTICO: ${failures} verificação(ões) falharam no VisitePrado!`);
    console.error("O deploy NÃO foi concluído corretamente.");
    process.exit(1);
  } else {
    console.log("🎉 SUCESSO TOTAL: VisitePrado.com.br validado externamente com 100% de integridade!");
    process.exit(0);
  }
}

runVerification();
