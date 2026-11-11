(() => {
  'use strict';
  const catalog = window.WORKFLOW_CATALOG;
  const definitions = catalog.definitions;
  const ui = {
    ja: {skip:'本文へ移動',home:'考え方',navCatalog:'ワークフロー',title:'つくりたいものから、\n進め方を選ぶ。',lead:'ソフトウェアも、物語も、会社も。公開されている6つの定義から、あなたの仕事に合う出発点を。',factDefinitions:'公開定義',factPhases:'工程',factLicense:'自由に改良・再利用',snapshot:'公開リポジトリの定義をもとにした紹介',browse:'一覧を見る',collectionTitle:'仕事に合わせた、6つの進め方。',all:'すべて',development:'ソフトウェア',creative:'創作・デザイン',business:'事業・組織',catalogNote:'工程や成果物は仕事に合わせて調整できます。数字は定義に含まれる全項目の数で、省略可能な成果物も含みます。',detailKicker:'定義を、ひとつ深く。',choose:'ワークフローを選ぶ',source:'定義の原文を見る',when:'こんなときに',outputs:'つくるもの',shape:'進め方の構成',structureNote:'工程の前後関係と、人・AIが確かめる条件を定義。',sampleTitle:'漫画ができるまでを、制作画面で。',sampleBody:'制作画面から44秒を抜粋。地図、人物の設定画、ネーム、仕上げ、完成原稿へと、工程と成果物のつながりをたどります。',sampleNote:'提供された制作動画から、紹介に必要な場面を切り出して編集しています。',videoFallback:'動画に対応したブラウザーでご覧ください。',sampleCaption:'PaoBub · 漫画制作ワークフローのサンプル',processTitle:'工程を選んで、中身を見る。',processLead:'実際の定義に含まれるすべての工程を掲載しています。',phaseLabel:'選択中の工程',after:'先に終える工程',deliverableTitle:'この工程でつくるもの',criteriaTitle:'この工程で確かめること',definitionNote:'これは進め方の定義です。作業の実行、承認の記録、成果物の検査は、利用するツールや人が担います。',back:'一覧に戻る',closingTitle:'そのまま始めても、\nあなたのやり方に変えても。',closingBody:'工程、成果物、確かめ方。定義を読み、あなたの仕事に合うように育ててください。',closingCta:'GitHubで定義を見る',footer:'オープンな定義。自由な実装。',backHome:'トップページへ ↗',open:'工程と成果物を見る',phases:'工程',deliverables:'成果物',sections:'セクション',start:'最初の工程',video:'▶ 制作ダイジェスト 0:44',human:'人',originalNote:''},
    en: {skip:'Skip to content',home:'About',navCatalog:'Workflows',title:'Choose a way of working.\nStart with what you want to make.',lead:'Software, stories, or a new company. Find a starting point for your work in six open workflow definitions.',factDefinitions:'Open definitions',factPhases:'Phases',factLicense:'Adapt and reuse',snapshot:'An introduction to the public workflow definitions',browse:'Browse workflows',collectionTitle:'Six ways to move your work forward.',all:'All workflows',development:'Software',creative:'Creative & design',business:'Business',catalogNote:'Adapt phases and outputs to your work. Counts include every defined item, including outputs that may be omitted for a particular project.',detailKicker:'A closer look at the definition.',choose:'Choose a workflow',source:'Read the source definition',when:'When to use it',outputs:'What you create',shape:'Workflow structure',structureNote:'Explicit phase dependencies and criteria checked by people or AI.',sampleTitle:'Watch the manga-making process.',sampleBody:'A 44-second edit of the creative workspace. Follow maps, character artwork, storyboards, finishing and completed pages across the manga workflow.',sampleNote:'Selected and edited from the supplied workspace recording for this introduction.',videoFallback:'Please use a browser that supports HTML video.',sampleCaption:'PaoBub · Manga workflow sample',processTitle:'Choose a phase. See what is inside.',processLead:'Every phase in the source definition is included.',phaseLabel:'SELECTED PHASE',after:'Prerequisites',deliverableTitle:'Deliverables · original Japanese',criteriaTitle:'Acceptance criteria · original Japanese',definitionNote:'These are workflow definitions. Execution, approval records and artifact verification are responsibilities of the people and tools using them.',back:'Back to the collection',closingTitle:'Start with a definition.\nMake it your own.',closingBody:'Phases, deliverables, acceptance. Read the definitions and adapt them to the way you work.',closingCta:'Explore the definitions on GitHub',footer:'Open definitions. Freedom to implement.',backHome:'Back to the homepage ↗',open:'Explore phases & outputs',phases:'phases',deliverables:'outputs',sections:'sections',start:'Starting phase',video:'▶ Making-of digest 0:44',human:'Human',originalNote:'The phase purpose, deliverable names, outlines and criteria below are the original Japanese source. Overview copy and phase navigation are translated for this introduction.'}
  };
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let language = 'ja';
  try { if(localStorage.getItem('workflow-definitions-lang') === 'en') language = 'en'; } catch (_) {}
  if(['ja','en'].includes(params.get('lang'))) language = params.get('lang');
  let current = definitions.find(d => d.id === params.get('workflow')) || definitions[0];
  let phaseId = current.phases.some(p=>p.id===params.get('phase')) ? params.get('phase') : current.phases[0].id;
  let filter = 'all';
  const text = (ja,en) => language === 'ja' ? ja : en;
  const phaseName = (definition, phase) => text(phase.name,definition.intro.phasesEn[definition.phases.findIndex(p=>p.id===phase.id)]);
  function element(tag, cls, value) { const el=document.createElement(tag); if(cls)el.className=cls; if(value!==undefined)el.textContent=value; return el; }
  function updateURL() { const p=new URLSearchParams();p.set('workflow',current.id);p.set('lang',language);p.set('phase',phaseId);history.replaceState(null,'',location.pathname+'?'+p.toString()+location.hash); }
  function cardLink(d) { return './workflows.html?workflow='+encodeURIComponent(d.id)+'&lang='+language+'#workflow-detail'; }
  function renderCards() {
    const parent=$('workflow-cards');parent.replaceChildren();
    definitions.forEach((d,index)=>{
      if(filter!=='all' && d.intro.category!==filter)return;
      const card=element('a','workflow-card');card.href=cardLink(d);card.dataset.workflow=d.id;
      const art=element('div','card-art');art.dataset.category=d.intro.category;
      art.append(element('span','card-category mono',ui[language][d.intro.category]),element('span','card-number',String(index+1).padStart(2,'0')));
      const flow=element('div','card-mini-flow');flow.setAttribute('aria-hidden','true');d.sections.forEach((_,i)=>{if(i)flow.append(element('i'));flow.append(element('span'));});art.append(flow);
      if(d.id==='fiction-manga')art.append(element('span','sample-chip',ui[language].video));
      const content=element('div','card-content');const meta=element('div','card-meta mono');meta.append(element('span','',d.id),element('span','','v'+d.version));
      content.append(meta,element('h3','',text(d.intro.shortJa,d.intro.en)),element('p','card-summary',text(d.intro.summaryJa,d.intro.summaryEn)));
      const stats=element('div','card-stats');[[d.phases.length,'phases'],[d.deliverables.length,'deliverables']].forEach(([count,key])=>{const s=element('span');s.append(element('b','',count),document.createTextNode(ui[language][key]));stats.append(s);});
      const open=element('div','card-open');open.append(element('span','',ui[language].open),element('span','','↗'));content.append(stats,open);card.append(art,content);
      card.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();chooseWorkflow(d.id);history.replaceState(null,'',location.pathname+location.search+'#workflow-detail');$('workflow-detail').scrollIntoView({behavior:motion(),block:'start'});});parent.append(card);
    });
  }
  function motion(){return matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';}
  function chooseWorkflow(id){const next=definitions.find(d=>d.id===id);if(!next)return;if(next.id!==current.id)$('manga-video').pause();current=next;phaseId=current.phases[0].id;renderDetail();updateURL();}
  function renderDetail() {
    const m=current.intro,t=ui[language];
    $('workflow-select').replaceChildren();definitions.forEach(d=>{const option=element('option','',text(d.intro.shortJa,d.intro.en));option.value=d.id;option.selected=d.id===current.id;$('workflow-select').append(option);});
    $('detail-meta').textContent=current.id+' / v'+current.version;
    $('detail-title').textContent=text(current.title,m.en);
    $('detail-summary').textContent=text(m.leadJa,m.leadEn)+' '+text(m.summaryJa,m.summaryEn);
    $('detail-use').textContent=text(m.useJa,m.useEn);
    $('detail-counts').textContent=current.sections.length+' '+t.sections+' / '+current.phases.length+' '+t.phases+' / '+current.deliverables.length+' '+t.deliverables;
    const outputs=language==='ja' ? m.outputIds.map(id=>current.deliverables.find(d=>d.id===id).name) : m.outputsEn;
    $('detail-outputs').replaceChildren(...outputs.map(v=>element('li','',v)));
    $('source-link').href='https://github.com/ryo0221/open-workflow-definitions/blob/'+catalog.sourceCommit+'/definitions/'+current.id+'.json';
    $('manga-sample').hidden=current.id!=='fiction-manga';
    $('manga-video').setAttribute('aria-label',text('漫画ワークフローの制作サンプル','Manga workflow making-of sample'));
    const nav=$('phase-list');nav.replaceChildren();
    current.sections.forEach((s,sectionIndex)=>{
      nav.append(element('div','phase-section-label',String(sectionIndex+1).padStart(2,'0')+' / '+text(s.name,m.sectionsEn[sectionIndex])));
      s.phases.forEach(id=>{
        const p=current.phases.find(p=>p.id===id);const b=element('button','phase-button');b.type='button';b.dataset.phase=id;b.setAttribute('aria-pressed',String(id===phaseId));b.setAttribute('aria-controls','phase-detail');
        b.append(element('span','phase-step-no',String(current.phases.indexOf(p)+1).padStart(2,'0')),element('span','',phaseName(current,p)),element('span','phase-step-arrow','↗'));
        b.addEventListener('click',()=>{phaseId=id;renderPhase();updateURL();if(matchMedia('(max-width:760px)').matches)$('phase-detail').scrollIntoView({behavior:motion(),block:'start'});});nav.append(b);
      });
    });renderPhase();
  }
  function renderPhase(){
    const p=current.phases.find(p=>p.id===phaseId),t=ui[language];
    document.querySelectorAll('[data-phase]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.phase===phaseId)));
    $('phase-number').textContent=String(current.phases.indexOf(p)+1).padStart(2,'0')+' / '+String(current.phases.length).padStart(2,'0');
    $('phase-title').textContent=phaseName(current,p);$('phase-purpose').textContent=p.purpose;$('phase-original-note').hidden=language==='ja';
    const after=$('phase-after');after.replaceChildren();if(!p.after.length)after.append(element('span','',t.start));
    p.after.forEach(id=>{const prior=current.phases.find(p=>p.id===id),b=element('button','',phaseName(current,prior));b.type='button';b.addEventListener('click',()=>{phaseId=id;renderPhase();updateURL();});after.append(b);});
    const outputs=$('phase-deliverables');outputs.replaceChildren();
    p.deliverables.forEach(id=>{const d=current.deliverables.find(d=>d.id===id),detail=element('details','output-item'),summary=element('summary');summary.append(element('small','',d.form),document.createTextNode(d.name));const dl=element('dl','output-outline');d.outline.forEach(o=>dl.append(element('dt','',o.heading),element('dd','',o.describe)));detail.append(summary,dl);outputs.append(detail);});
    const criteria=$('phase-criteria');criteria.replaceChildren();p.acceptance.forEach(id=>{const a=current.acceptance.find(a=>a.id===id),li=element('li');li.append(element('span','criterion-checker',a.checkedBy==='人'?t.human:a.checkedBy),element('span','',a.text));criteria.append(li);});
  }
  function setLanguage(lang){language=lang==='en'?'en':'ja';const t=ui[language];document.documentElement.lang=language;document.title=text('ワークフローを探す — Workflow Definitions','Explore workflows — Workflow Definitions');document.querySelectorAll('[data-copy]').forEach(el=>{if(t[el.dataset.copy]!==undefined)el.textContent=t[el.dataset.copy];});document.querySelectorAll('[data-lang]').forEach(b=>{b.classList.toggle('is-active',b.dataset.lang===language);b.setAttribute('aria-pressed',String(b.dataset.lang===language));});try{localStorage.setItem('workflow-definitions-lang',language);}catch(_){}renderCards();renderDetail();updateURL();}
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(other=>{other.classList.toggle('is-active',other===b);other.setAttribute('aria-pressed',String(other===b));});renderCards();}));
  $('workflow-select').addEventListener('change',event=>chooseWorkflow(event.target.value));
  setLanguage(language);
  window.addEventListener('load', () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({behavior:'instant',block:'start'});
  }, {once:true});
})();
