(() => {
  "use strict";

  const strings = {
    ja: {
      pageTitle: "Workflow Definitions — AIと人に、共有できる進め方を。",
      description: "人とAIの仕事を、工程・成果物・引用・達成条件で記述するオープンなワークフロー定義。",
      skip: "本文へ移動", navWhy: "考え方", navExplore: "体験する", navInside: "定義の中身",
      heroEyebrow: "OPEN WORKFLOW LANGUAGE · MIT LICENSE",
      heroTitle1: "人とAIに、", heroTitle2: "共有できる", heroTitle3: "「進め方」を。",
      heroBody: "何を作り、どうつなぎ、何をもって完了とするか。仕事の進め方を、特定のツールに閉じ込めず、読める・検査できる定義にする。",
      heroCta1: "動くデモを見る", heroCta2: "GitHubで見る",
      heroFootnote: "人の判断を残す。AIの作業をつなぐ。道具は自由に選ぶ。",
      graphBadge: "接続された定義", graphHint: "ノードを選ぶと、役割を確認できます。図は説明用の模式図です。",
      nodeIntent: "目的", nodePhase: "工程", nodeOutput: "成果物", nodeRules: "引用関係", nodeVerify: "達成条件",
      whyKicker: "WHY IT MATTERS", whyTitle: "「やり方」を、\n誰かの頭の中だけに置かない。",
      whyLead: "仕事は指示文だけでは進みません。順序があり、成果物があり、参照する情報があり、人が受け入れる条件がある。その構造を共通言語として扱います。",
      feature1Title: "工程を定義する", feature1Body: "何をどの順に行うか。工程ごとの目的、前後関係、必要な成果物を明示する。",
      feature2Title: "成果物を定義する", feature2Body: "文書、図、表、コード。何を残し、どんな項目を持たせるかを共有する。",
      feature3Title: "つながりを定義する", feature3Body: "どの情報が何を根拠としているか。引用と網羅の規則を明示する。",
      feature4Title: "完了を定義する", feature4Body: "誰が何を確かめるのか。機械で検査する条件と人が判断する条件を分ける。",
      exploreKicker: "INTERACTIVE TOUR", playBadge: "SELECT A WORKFLOW",
      exploreTitle: "仕事が違えば、\n進め方も変わる。",
      exploreLead: "共通の形式を使いながら、工程と成果物は自由に組み替えられる。サンプルを選び、各工程に触れてみてください。",
      tabSoftware: "ソフトウェア開発", tabManga: "漫画制作", tabIdentity: "ロゴ制作",
      demoSelected: "SELECTED PHASE", demoOutputLabel: "主な成果物", demoAcceptanceLabel: "確認すること",
      demoCaption: "操作できる説明用デモです。実際のワークフロー実行・承認・成果物検査を行うものではありません。",
      impactKicker: "TRACEABLE BY DESIGN",
      impactTitle: "変わったところから、\nつながりをたどる。",
      impactLead: "成果物の項目間の関係を、文章から推測するのではなく明示的な参照として定義する。だから、どこを見る必要があるかを追いやすくなります。",
      impactButton1: "要件が変わったら", impactButton2: "画面が変わったら",
      impactDisclaimer: "これは関係の表現例です。実際の影響分析・承認の失効・再検証は、定義を利用するシステム側の責務です。",
      impactSignal: "関係を表示中",
      impactNode1: "要件", impactNode2: "画面設計", impactNode3: "実装", impactNode4: "試験",
      impactRequirement: "要件から、画面設計・実装・試験への参照をたどる模式図。",
      impactDesign: "画面設計から、実装・試験への参照をたどる模式図。",
      insideKicker: "OPEN BY DESIGN", insidePill: "JUST JSON. NOT A PLATFORM.",
      insideTitle: "定義は、\nあなたのもの。",
      insideLead: "ワークフローはJSONで記述し、Schemaと検査スクリプトで基本的な整合性を確かめられる。特定のAI、エディタ、サービスに依存しない設計です。",
      inside1: "明示的なIDと工程間の参照",
      inside2: "成果物・引用・網羅・達成条件の規則",
      inside3: "Gitによる版固定と変更の管理",
      inside4: "MITライセンスで改良・再利用可能",
      insideLink: "仕様と使い方を見る",
      codeCaption: "公開定義の一部を短くした説明用コード",
      ecoKicker: "THE ECOSYSTEM", ecoDef: "仕事の工程と規則を定義する",
      ecoEditor: "成果物をつくり、編集する", ecoPao: "人とAIの協働を運用する",
      ecoFoot: "それぞれ役割が異なる、組み合わせ可能な構成です。",
      closingTitle: "仕事の進め方を、\nみんなで育てる。",
      closingLead: "定義を読み、試し、あなたの仕事に合わせて変えていく。まずは公開リポジトリから。",
      closingButton: "GitHubで始める", footerLine: "オープンな定義。自由な実装。",
      stages: [
        ["目的を定める", "誰に、何のために、どこまで行うのかを明確にする。"],
        ["工程を組み立てる", "順序・依存関係・各工程の目的を定義する。"],
        ["成果物を決める", "何を残し、どの項目を含めるかを決める。"],
        ["関係を明示する", "項目間の引用・網羅のルールを定める。"],
        ["達成条件を定める", "機械で確かめること、人が判断することを分ける。"]
      ],
      demos: {
        software: {
          id: "software-product", version: "PUBLIC EXAMPLE · SIMPLIFIED",
          source: "公開定義を参考にした簡略例", title: "ソフトウェアをつくる",
          phases: [
            ["進め方", "工程の順序と責任を明確にする。", "工程マップ", "進め方を人が確認する"],
            ["目的と範囲", "誰にどんな価値を届けるか、対象外も含めて決める。", "スコープ文書", "範囲と成功条件が明確"],
            ["ストーリー", "利用者の行動と受入条件を言語化する。", "ストーリー一覧", "受入条件が検証可能"],
            ["画面", "ストーリーに沿った画面と遷移を設計する。", "画面マップ・画面デザイン", "操作可能な試作を確認"],
            ["状態", "データと画面の状態遷移を整理する。", "状態遷移表", "状態の漏れを点検"]
          ]
        },
        manga: {
          id: "fiction-manga", version: "CONCEPTUAL EXAMPLE",
          source: "適用イメージ（公開定義ではありません）", title: "漫画をつくる",
          phases: [
            ["構想", "主題・読者・作品の狙いを整理する。", "企画概要", "作品の狙いが共有されている"],
            ["物語", "展開と人物の選択を組み立てる。", "プロット", "出来事と因果関係に整合性がある"],
            ["ネーム", "ページ・コマ・台詞・視線の流れを設計する。", "ネーム", "読み順と情報が伝わる"],
            ["作画", "ラフから線画、仕上げへ段階的に進める。", "原稿ページ", "絵と演出の一貫性を確認"],
            ["確認", "作品全体の連続性と表記を確認する。", "校正記録", "人が最終的に受け入れる"]
          ]
        },
        identity: {
          id: "visual-identity", version: "CONCEPTUAL EXAMPLE",
          source: "適用イメージ（公開定義ではありません）", title: "ロゴをつくる",
          phases: [
            ["方向性", "ブランドの価値・用途・制約を整理する。", "制作ブリーフ", "方向性を合意する"],
            ["探索", "比喩・形・文字の方向を広く試す。", "探索ボード", "候補の比較軸がある"],
            ["候補", "有望案を絞り込み比較する。", "ロゴ候補", "複数の利用条件で検証する"],
            ["採用", "人が採用案を判断して決める。", "採用記録", "採用理由が説明できる"],
            ["展開", "サイズ・色・媒体別に仕上げる。", "マスター・用途別データ", "利用条件を満たす"]
          ]
        }
      }
    },
    en: {
      pageTitle: "Workflow Definitions — A shared way of working.",
      description: "An open, tool-independent language for defining phases, deliverables, references, and acceptance criteria.",
      skip: "Skip to content", navWhy: "Why it matters", navExplore: "Explore", navInside: "Under the hood",
      heroEyebrow: "OPEN WORKFLOW LANGUAGE · MIT LICENSE",
      heroTitle1: "A shared", heroTitle2: "way of working", heroTitle3: "for people + AI.",
      heroBody: "Define what gets made, how things connect, and what counts as done. Make the way work happens readable, inspectable and independent of any one tool.",
      heroCta1: "Explore the live demo", heroCta2: "View on GitHub",
      heroFootnote: "Keep human judgment. Connect AI work. Choose your own tools.",
      graphBadge: "Connected definition", graphHint: "Select a node to inspect its role. This is an illustrative diagram.",
      nodeIntent: "Intent", nodePhase: "Phase", nodeOutput: "Deliverable", nodeRules: "References", nodeVerify: "Acceptance",
      whyKicker: "WHY IT MATTERS", whyTitle: "The way you work\nshouldn't live in one person's head.",
      whyLead: "A prompt is not a process. Work has an order, tangible deliverables, source relationships and conditions people must accept. Describe that structure in a shared language.",
      feature1Title: "Define the phases", feature1Body: "Specify the purpose of each phase, its prerequisites and the deliverables it produces.",
      feature2Title: "Define the outputs", feature2Body: "Documents, diagrams, tables, code. Describe what must exist and what it contains.",
      feature3Title: "Define connections", feature3Body: "Make citations and coverage explicit, instead of inferring dependencies from prose.",
      feature4Title: "Define done", feature4Body: "Separate machine-checkable criteria from decisions that require human review.",
      exploreKicker: "INTERACTIVE TOUR", playBadge: "SELECT A WORKFLOW",
      exploreTitle: "Different work.\nDifferent workflows.",
      exploreLead: "Use one common format while tailoring phases and outputs for every domain. Pick a scenario, then select a phase.",
      tabSoftware: "Software", tabManga: "Comics", tabIdentity: "Visual identity",
      demoSelected: "SELECTED PHASE", demoOutputLabel: "Primary deliverable", demoAcceptanceLabel: "Acceptance focus",
      demoCaption: "Interactive illustration only. This page does not execute workflows, record approvals or validate project artifacts.",
      impactKicker: "TRACEABLE BY DESIGN",
      impactTitle: "When something changes,\nfollow the connections.",
      impactLead: "Relationships between items are declared explicitly rather than inferred from text. That makes it possible for host tools to determine where follow-up work may be needed.",
      impactButton1: "Change a requirement", impactButton2: "Change a design",
      impactDisclaimer: "Illustrative graph only. Actual impact analysis, approval invalidation and re-verification are responsibilities of the system that uses the definitions.",
      impactSignal: "Showing connections",
      impactNode1: "Requirement", impactNode2: "UI design", impactNode3: "Implementation", impactNode4: "Test",
      impactRequirement: "Illustrative path from a requirement to design, implementation and tests.",
      impactDesign: "Illustrative path from a UI design to implementation and tests.",
      insideKicker: "OPEN BY DESIGN", insidePill: "JUST JSON. NOT A PLATFORM.",
      insideTitle: "Your workflow.\nYour definition.",
      insideLead: "Workflows live in JSON, with a schema and scripts for basic consistency checks. They are not tied to one AI model, editor or service.",
      inside1: "Stable IDs and explicit phase references",
      inside2: "Deliverable, citation, coverage and acceptance rules",
      inside3: "Version pinning and change history with Git",
      inside4: "Reuse and adapt under the MIT License",
      insideLink: "Read the specification",
      codeCaption: "A shortened excerpt of a public definition",
      ecoKicker: "THE ECOSYSTEM", ecoDef: "Define phases and rules",
      ecoEditor: "Create and edit artifacts", ecoPao: "Orchestrate people and AI",
      ecoFoot: "Different responsibilities. Composable building blocks.",
      closingTitle: "Make the way of working\nsomething we can share.",
      closingLead: "Read the definitions, experiment, and adapt them to your own work. Start with the public repository.",
      closingButton: "Explore on GitHub", footerLine: "Open definitions. Freedom to implement.",
      stages: [
        ["Set the intent", "Clarify the audience, purpose and boundaries of the work."],
        ["Compose the phases", "Describe sequence, dependencies and the purpose of each phase."],
        ["Specify outputs", "Define what remains and which items belong to each output."],
        ["Express references", "Describe citation and coverage rules between items."],
        ["Define acceptance", "Separate automated checks from human decisions."]
      ],
      demos: {
        software: {
          id: "software-product", version: "PUBLIC EXAMPLE · SIMPLIFIED",
          source: "Simplified from a public definition", title: "Build software",
          phases: [
            ["Process", "Agree on phase order and responsibilities.", "Process map", "Human review of the process"],
            ["Scope", "Set goals, boundaries and measures of success.", "Scope document", "Clear scope and success criteria"],
            ["Stories", "Describe user journeys and testable acceptance criteria.", "Story set", "Verifiable acceptance criteria"],
            ["Screens", "Design screens and navigation around the stories.", "Screen map and designs", "Review an interactive prototype"],
            ["States", "Describe application state and transitions.", "State tables", "Check transitions and coverage"]
          ]
        },
        manga: {
          id: "fiction-manga", version: "CONCEPTUAL EXAMPLE",
          source: "Concept only (not in public release)", title: "Create comics",
          phases: [
            ["Concept", "Define the theme, reader and creative intent.", "Creative brief", "Shared creative direction"],
            ["Story", "Structure events and character decisions.", "Plot outline", "Coherent events and causality"],
            ["Storyboard", "Plan pages, panels, dialogue and reading order.", "Storyboards", "Readable visual flow"],
            ["Artwork", "Move from roughs to linework and finishing.", "Pages", "Consistent art and direction"],
            ["Review", "Check continuity and language across the work.", "Review notes", "Human final acceptance"]
          ]
        },
        identity: {
          id: "visual-identity", version: "CONCEPTUAL EXAMPLE",
          source: "Concept only (not in public release)", title: "Design a visual identity",
          phases: [
            ["Direction", "Define brand values, uses and constraints.", "Creative brief", "Direction is agreed"],
            ["Explore", "Explore forms, metaphors and typography.", "Exploration board", "Comparison criteria"],
            ["Candidates", "Develop and compare promising routes.", "Design candidates", "Test across contexts"],
            ["Select", "Choose a direction with human review.", "Decision record", "Rationale is explicit"],
            ["Deliver", "Prepare sizes, colors and context variants.", "Masters and variants", "Meets usage constraints"]
          ]
        }
      }
    }
  };

  const nodes = Array.from(document.querySelectorAll(".graph-node"));
  const languageButtons = Array.from(document.querySelectorAll("[data-lang]"));
  const demoButtons = Array.from(document.querySelectorAll("[data-demo]"));
  const impactButtons = Array.from(document.querySelectorAll("[data-impact]"));
  const impactNodes = Array.from(document.querySelectorAll("[data-impact-node]"));
  const demoTrack = document.getElementById("demo-track");
  let lang = "ja";
  let stage = 0;
  let demo = "software";
  let demoPhase = 0;
  let impact = "requirement";
  let userSelectedStage = false;

  function byId(id) { return document.getElementById(id); }

  function setHeroStage(index) {
    stage = index;
    nodes.forEach((node, i) => {
      const active = i === stage;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
    });
    const step = strings[lang].stages[stage];
    byId("hero-inspector-index").textContent = String(stage + 1).padStart(2, "0") + " / 05";
    byId("hero-inspector-title").textContent = step[0];
    byId("hero-inspector-body").textContent = step[1];
  }

  function setDemoPhase(index) {
    demoPhase = index;
    const d = strings[lang].demos[demo];
    const selected = d.phases[index];
    const buttons = Array.from(demoTrack.querySelectorAll(".demo-step"));
    buttons.forEach((button, i) => {
      const active = i === index;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    byId("demo-detail-title").textContent = selected[0];
    byId("demo-detail-description").textContent = selected[1];
    byId("demo-detail-output").textContent = selected[2];
    byId("demo-detail-acceptance").textContent = selected[3];
  }

  function renderDemo() {
    const d = strings[lang].demos[demo];
    demoButtons.forEach(button => {
      const selected = button.dataset.demo === demo;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    byId("demo-id").textContent = d.id;
    byId("demo-title").textContent = d.title;
    byId("demo-version").textContent = d.version;
    byId("demo-source-label").textContent = d.source;
    demoTrack.replaceChildren();
    d.phases.forEach((phase, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "demo-step";
      button.dataset.index = String(index);
      button.setAttribute("aria-label", (index + 1) + ". " + phase[0]);
      const small = document.createElement("small");
      small.textContent = String(index + 1).padStart(2, "0") + " / 05";
      const strong = document.createElement("strong");
      strong.textContent = phase[0];
      button.append(small, strong);
      button.addEventListener("click", () => setDemoPhase(index));
      demoTrack.append(button);
    });
    setDemoPhase(demoPhase);
  }

  function renderImpact() {
    impactButtons.forEach(button => {
      const active = button.dataset.impact === impact;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    impactNodes.forEach(node => {
      const linked = impact === "requirement" || node.dataset.impactNode !== "requirement";
      node.classList.toggle("is-linked", linked);
      node.classList.toggle("is-muted", !linked);
    });
    byId("impact-result-text").textContent = strings[lang][impact === "requirement" ? "impactRequirement" : "impactDesign"];
  }

  function setLanguage(next) {
    lang = next === "en" ? "en" : "ja";
    document.documentElement.lang = lang;
    document.title = strings[lang].pageTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", strings[lang].description);
    languageButtons.forEach(button => {
      const active = button.dataset.lang === lang;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const value = strings[lang][el.dataset.i18n];
      if (typeof value === "string") el.textContent = value;
    });
    setHeroStage(stage);
    renderDemo();
    renderImpact();
    try { localStorage.setItem("workflow-definitions-lang", lang); } catch (_) { /* storage optional */ }
  }

  nodes.forEach((node, index) => {
    node.addEventListener("click", () => {
      userSelectedStage = true;
      setHeroStage(index);
    });
  });
  languageButtons.forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  demoButtons.forEach(button => button.addEventListener("click", () => {
    demo = button.dataset.demo;
    demoPhase = 0;
    renderDemo();
  }));
  impactButtons.forEach(button => button.addEventListener("click", () => {
    impact = button.dataset.impact;
    renderImpact();
  }));

  document.querySelectorAll('[role="tablist"]').forEach(tablist => {
    tablist.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const current = demoButtons.findIndex(button => button.dataset.demo === demo);
      const delta = event.key === "ArrowRight" ? 1 : -1;
      demoButtons[(current + delta + demoButtons.length) % demoButtons.length].click();
      demoButtons[(current + delta + demoButtons.length) % demoButtons.length].focus();
      event.preventDefault();
    });
  });

  let initialLang = "ja";
  try {
    const stored = localStorage.getItem("workflow-definitions-lang");
    if (stored === "en") initialLang = "en";
  } catch (_) { /* storage optional */ }
  const explicitLang = new URLSearchParams(window.location.search).get("lang");
  if (explicitLang === "ja" || explicitLang === "en") initialLang = explicitLang;
  setLanguage(initialLang);

  document.documentElement.classList.add("js");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px 40px 0px" });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      if (!userSelectedStage && !document.hidden) setHeroStage((stage + 1) % nodes.length);
    }, 4300);
  }
})();