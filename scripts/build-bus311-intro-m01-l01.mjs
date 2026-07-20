import fs from 'node:fs/promises';
import path from 'node:path';

import { introM01L01Deck } from './decks/bus311-intro-m01-l01-content.mjs';
import { deckRuntime } from './deck-runtime.mjs';


const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, '01-INTRO', 'M01', 'bus311-intro-m01-l01-slides.html');
const legacyPilotOutput = path.join(root, '01-INTRO', 'M01', 'bus311-intro-m01-l01-canva-pilot-slides.html');
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const slides = introM01L01Deck.slides.map((slide, index) => {
  const number = String(index + 1).padStart(2, '0');
  return `<section class="slide ${slide.classes}" data-label="${number} ${esc(slide.label)}" data-source-slides="${esc(slide.slides)}">${slide.body}</section>`;
});
const notes = introM01L01Deck.slides.map((slide) => slide.note);

const css = `
:root{
  --navy:#0A2540;--navy-2:#12304A;--steel:#2D7DD2;--steel-dark:#175FA9;--teal:#1B998B;--gold:#E6A817;
  --ink:#243746;--slate:#586B7A;--muted:#7C8D9A;--line:#D8E3E8;--sky:#EDF5FB;--pale:#EAF5F4;--paper:#FFFFFF;--white:#FFFFFF;
  --terra:#9C4A2B;--risk:var(--terra);--text:var(--ink);--text-soft:var(--slate);--border:var(--line);--paper-2:var(--sky);--source-blue:var(--steel-dark);--source-blue-light:var(--sky);--danger:#B92F2F;
  --accent:var(--steel);--gradient:linear-gradient(90deg,var(--steel) 0%,var(--teal) 58%,var(--gold) 100%);
  --font-display:'Instrument Serif';--font-body:'Geist';--font-mono:'JetBrains Mono';
  --type-display:112px;--type-title:72px;--type-subtitle:44px;--type-lead:34px;--type-body:28px;--type-small:24px;--type-eyebrow:24px;--type-mono:24px;--type-stat:190px;
  --pad-x:128px;--pad-top:120px;--pad-bottom:88px;
}
*{box-sizing:border-box}
html,body{margin:0;background:#061A2C;overflow:hidden}
.slide{width:1920px;height:1080px;overflow:hidden;flex-direction:column;padding:var(--pad-top) var(--pad-x) var(--pad-bottom);font-family:var(--font-body)}
.slide::before{content:'';position:absolute;top:48px;left:64px;right:64px;height:2px;background:var(--line);z-index:3}
.slide::after{content:'BUS311 · FALL 2026';position:absolute;top:60px;left:64px;color:var(--muted);font:700 24px/1 var(--font-body);letter-spacing:.08em;text-transform:uppercase;z-index:3}
.slide.dark{background:radial-gradient(circle at 84% 24%,rgba(45,125,210,.20),transparent 34%),linear-gradient(135deg,var(--navy) 0%,#0C3154 100%);color:var(--white)}
.slide.dark::before{background:rgba(183,215,242,.55)}
.slide.dark::after{color:#9AB6CD}
.slide.cream{background:var(--paper);color:var(--text)}
h1,h2,h3,p,blockquote,figure{margin:0}
h1{font:650 var(--type-display)/.93 var(--font-body);letter-spacing:-.045em;max-width:1520px}
h2{font:620 var(--type-title)/1.04 var(--font-body);letter-spacing:-.03em;color:var(--navy)}
.dark h2{color:var(--white)}
h3{font:600 var(--type-lead)/1.12 var(--font-body)}
p,li{font-size:var(--type-body);line-height:1.38}
a{color:inherit;text-underline-offset:6px;text-decoration-thickness:2px}
.subtitle{font:500 var(--type-subtitle)/1.2 var(--font-body);color:var(--text-soft)}
.dark .subtitle{color:var(--paper-2)}
.eyebrow{font:700 var(--type-eyebrow)/1.2 var(--font-body);letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
.dark .eyebrow{color:#7DC3FF}
.gradient-bar{height:10px;background:var(--gradient);width:420px;border-radius:10px}
.header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:64px}
.header-row h2{max-width:1380px}
.rule{height:1px;background:var(--border);margin:30px 0 46px}
.dark-rule{background:rgba(255,255,255,.22)}
.title-slide,.section,.statement-slide,.center-slide{justify-content:center;gap:38px}
.title-slide h1{margin-top:16px}
.section h2,.statement-slide h2{max-width:1500px}
.section p,.statement-slide p{font-size:var(--type-subtitle);line-height:1.2;color:var(--paper-2);max-width:1450px}
.center-slide{align-items:center;text-align:center}
.center-slide h2{font-size:96px}
.center-slide .subtitle{max-width:1250px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;flex:1}
.two-card{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:stretch}
.card{background:var(--white);border:2px solid var(--border);border-radius:22px;padding:40px;display:grid;align-content:start;gap:24px}
.card p{font-size:var(--type-lead);line-height:1.28;color:var(--text-soft)}
.card .meta,.meta{font:500 var(--type-small)/1.4 var(--font-mono);color:var(--accent);margin-top:8px}
.prompt-card{background:var(--navy);color:var(--white);border-radius:24px;padding:56px;display:grid;gap:32px;min-height:480px;align-content:center}
.prompt-mark{font:italic 400 var(--type-stat)/1 var(--font-display);color:var(--gold)}
.clean-list{list-style:none;padding:0;margin:0;display:grid;gap:24px;align-content:center}
.clean-list li{position:relative;padding-left:42px}
.clean-list li::before{content:'◆';position:absolute;left:0;color:var(--accent);font-size:var(--type-small)}
.profile-grid,.tool-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
blockquote{font:500 var(--type-subtitle)/1.2 var(--font-body);margin-top:40px;padding:34px 42px;background:var(--source-blue-light);border-radius:20px}
blockquote cite{display:block;margin-top:18px;font:500 var(--type-small)/1.4 var(--font-mono);color:var(--muted)}
.photo-slide{position:relative;isolation:isolate;justify-content:center}
.photo-fill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.photo-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,24,40,.98) 0%,rgba(10,37,64,.92) 43%,rgba(10,37,64,.48) 70%,rgba(10,37,64,.12) 100%);z-index:-1}
.photo-content{width:960px;display:grid;gap:38px}
.photo-content .quote-text{font-size:68px;line-height:1.1;letter-spacing:-.025em}
.quote-source{font:500 var(--type-small)/1.4 var(--font-mono);color:#C8D9E6;max-width:820px}
.media-split{display:grid;grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr);gap:72px;align-items:center;flex:1;min-height:0}
.media-copy{display:grid;gap:32px;align-content:center}
.media-copy h2{font-size:96px;line-height:.98}
.media-frame{height:680px;overflow:hidden;border-radius:28px;background:var(--sky);box-shadow:0 24px 70px rgba(10,37,64,.18);position:relative}
.media-frame img{width:100%;height:100%;object-fit:cover;display:block}
.media-frame figcaption{position:absolute;left:24px;bottom:24px;padding:14px 20px;border-radius:999px;background:rgba(10,37,64,.9);color:var(--white);font:600 var(--type-small)/1 var(--font-body);letter-spacing:.04em}
.insight-tag{padding:24px 28px;border-left:8px solid var(--teal);background:var(--pale);font-size:var(--type-body);line-height:1.3;color:var(--text)}
.company-chip{display:grid;place-items:center;width:180px;height:112px;border-radius:18px;background:var(--navy);color:var(--gold);font:700 60px/1 var(--font-body)}
.leadership-split{grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr)}
.leadership-split .media-frame{height:640px}
.role-stack{display:grid;gap:14px;width:100%;max-width:650px}
.role-stack span,.role-stack strong{padding:22px 28px;border-radius:14px;font-size:var(--type-body)}
.role-stack span{background:var(--source-blue-light);color:var(--text)}
.role-stack strong{background:var(--navy);color:var(--white);font-size:var(--type-lead)}
.number-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.numbered{background:var(--white);border:2px solid var(--border);border-radius:20px;padding:34px 38px;display:flex;gap:26px;min-height:230px}
.numbered .n{font:700 52px/1 var(--font-body);color:var(--accent);flex:0 0 auto}
.numbered>div:last-child{font-size:var(--type-lead);line-height:1.22;display:grid;gap:16px;align-content:start}
.numbered strong{font-weight:600}
.numbered span{font-size:var(--type-body);color:var(--text-soft)}
.wide-callout{margin-top:36px;padding:28px 38px;background:var(--navy);color:var(--white);border-radius:18px;font-size:var(--type-lead);line-height:1.25}
.grade-grid{display:grid;grid-template-columns:600px 1fr;gap:72px;align-items:center}
.donut{width:500px;height:500px;border-radius:50%;background:conic-gradient(var(--navy) 0 40%,var(--steel) 40% 65%,var(--teal) 65% 85%,var(--gold) 85% 100%);display:grid;place-items:center}
.donut::before{content:'';width:300px;height:300px;border-radius:50%;background:var(--paper);grid-area:1/1}
.donut>div{grid-area:1/1;z-index:1;text-align:center;display:grid}
.donut strong{font:italic 400 92px/1 var(--font-display)}
.donut span{font:500 var(--type-small)/1.2 var(--font-mono);color:var(--muted)}
.grade-legend{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.grade-legend .numbered{min-height:190px;padding:28px}
.timeline{display:grid;gap:24px;position:relative;margin-top:80px}
.timeline.four{grid-template-columns:repeat(4,1fr)}
.timeline::before{content:'';position:absolute;left:4%;right:4%;top:18px;height:4px;background:var(--accent)}
.timeline>div{padding-top:62px;display:grid;gap:16px;text-align:center;position:relative}
.timeline>div::before{content:'';position:absolute;top:0;left:calc(50% - 20px);width:40px;height:40px;border-radius:50%;background:var(--accent);border:8px solid var(--paper)}
.timeline time{font:500 var(--type-small)/1 var(--font-mono);color:var(--accent)}
.timeline strong{font-size:var(--type-lead)}
.timeline span{font-size:var(--type-body);color:var(--text-soft)}
.source-note{margin-top:34px;font:500 var(--type-small)/1.4 var(--font-mono);color:var(--muted)}
.dark-note{color:var(--paper-2)}
.tool-grid .card{min-height:450px}
.pemdas{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;flex:1;align-content:center}
.pemdas>div{display:flex;align-items:center;gap:28px;background:var(--white);border:1px solid var(--border);padding:24px;border-radius:14px}
.pemdas b{display:grid;place-items:center;width:96px;height:96px;border-radius:14px;background:var(--accent);color:var(--white);font:500 54px/1 var(--font-mono)}
.pemdas span{font-size:var(--type-lead)}
.data-slide{padding-top:72px}
.terminal{border:1px solid rgba(255,255,255,.22);border-radius:20px;overflow:hidden;flex:1}
.terminal-top{padding:22px 28px;background:var(--steel-dark);font:500 var(--type-small)/1 var(--font-mono)}
.terminal-grid{padding:42px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.terminal .numbered{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);color:var(--white)}
.terminal .numbered span{color:var(--paper-2)}
.dark-panel{background:var(--navy);color:var(--white);border-radius:20px;padding:54px;display:grid;align-content:center;gap:26px}
.dark-panel .mono{font:500 var(--type-small)/1 var(--font-mono);color:var(--gold)}
.dark-panel a{font-size:var(--type-subtitle);line-height:1.25;overflow-wrap:anywhere}
.roadmap{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.roadmap .numbered{min-height:210px;padding:28px}
.big-number{font:italic 400 300px/1 var(--font-display);color:var(--accent);text-align:center}
.chips{display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:center}
.chips span{padding:22px 34px;border-radius:999px;background:var(--white);border:1px solid var(--border);font-size:var(--type-lead);color:var(--text)}
.dark .chips span{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:var(--white)}
.finance-areas-slide .rule{margin-bottom:24px}
.finance-map-wrap{display:grid;grid-template-columns:1fr 420px;gap:32px;align-items:center;flex:1;min-height:0}
.finance-map{width:100%;height:650px;overflow:visible}
.finance-link{fill:none;stroke-width:8;stroke-linecap:round}
.finance-link.investments{stroke:var(--steel)}
.finance-link.institutions{stroke:var(--teal)}
.finance-link.international{stroke:var(--gold)}
.finance-link.fintech{stroke:var(--terra)}
.finance-orbit{fill:none}
.finance-orbit.outer{stroke:var(--line);stroke-width:4;stroke-dasharray:12 16}
.finance-orbit.inner{stroke:var(--teal);stroke-width:5;opacity:.55}
.finance-hub circle{fill:var(--navy)}
.finance-hub text{fill:var(--white);font:650 46px/1 var(--font-body);text-anchor:middle}
.finance-hub .hub-label{fill:var(--gold);font:700 24px/1 var(--font-mono);letter-spacing:.08em}
.finance-node rect{fill:var(--white);stroke:var(--line);stroke-width:3}
.finance-node text{fill:var(--text);font:600 32px/1.1 var(--font-body);text-anchor:middle}
.node-dot.investments{fill:var(--steel)}
.node-dot.institutions{fill:var(--teal)}
.node-dot.international{fill:var(--gold)}
.node-dot.fintech{fill:var(--terra)}
.finance-map-caption{align-self:center;background:var(--navy);color:var(--white);padding:40px 36px;border-radius:22px;display:grid;gap:18px}
.finance-map-caption strong{font-size:var(--type-lead);line-height:1.15;color:var(--gold)}
.finance-map-caption span{font-size:var(--type-body);line-height:1.35;color:var(--paper-2)}
.three-questions-slide .rule{margin-bottom:20px}
.decision-radial{position:relative;flex:1;min-height:0}
.decision-radial-links{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.decision-radial-links path{fill:none;stroke-width:10;stroke-linecap:round}
.decision-radial-links .invest{stroke:var(--steel);fill:var(--steel)}
.decision-radial-links .finance{stroke:var(--gold);fill:var(--gold)}
.decision-radial-links .manage{stroke:var(--teal);fill:var(--teal)}
.decision-hub{position:absolute;z-index:2;left:calc(50% - 190px);top:220px;width:380px;height:190px;border-radius:50%;background:var(--navy);color:var(--white);display:grid;place-content:center;text-align:center;gap:18px;border:10px solid var(--sky)}
.decision-hub span{font:700 var(--type-small)/1.2 var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:#8EC8F6}
.decision-hub strong{font-size:var(--type-lead);line-height:1.12;color:var(--gold)}
.decision-node{position:absolute;z-index:1;background:var(--white);border:2px solid var(--border);border-radius:24px;padding:32px;display:grid;grid-template-columns:150px 1fr;gap:30px;align-items:center}
.decision-node.investment{left:0;top:50px;width:530px;height:250px}
.decision-node.financing{right:0;top:50px;width:530px;height:250px}
.decision-node.management{left:calc(50% - 390px);top:430px;width:780px;height:208px;padding:28px 32px}
.decision-node-copy{display:grid;gap:12px}
.decision-domain{font:700 var(--type-small)/1.2 var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.decision-node.investment .decision-domain{color:var(--steel)}
.decision-node.financing .decision-domain{color:#B47D00}
.decision-node.management .decision-domain{color:var(--teal)}
.decision-node h3{font-size:34px;line-height:1.12;color:var(--navy)}
.decision-node p{font-size:var(--type-body);line-height:1.2;color:var(--text-soft)}
.decision-node-icon{position:relative;width:140px;height:140px;border-radius:28px;background:var(--sky)}
.investment-icon{display:flex;align-items:flex-end;justify-content:center;gap:12px;padding:34px 26px}
.investment-icon span{width:20px;border-radius:8px 8px 0 0;background:var(--steel)}
.investment-icon span:nth-child(1){height:34px}.investment-icon span:nth-child(2){height:58px}.investment-icon span:nth-child(3){height:82px}
.investment-icon i{position:absolute;left:30px;top:28px;width:72px;height:48px;border-top:8px solid var(--steel);border-right:8px solid var(--steel);transform:skewY(-25deg)}
.financing-icon{display:grid;place-items:center;background:conic-gradient(var(--navy) 0 56%,var(--gold) 56% 100%);border-radius:50%}
.financing-icon span{width:68px;height:68px;border-radius:50%;background:var(--white)}
.management-icon{border-radius:50%;border:10px solid var(--teal);background:var(--pale)}
.management-icon span{position:absolute;width:24px;height:24px;border-radius:50%;background:var(--teal)}
.management-icon span:nth-child(1){left:12px;top:50px}.management-icon span:nth-child(2){right:20px;top:18px}.management-icon span:nth-child(3){right:18px;bottom:18px}
.management-icon b{position:absolute;inset:0;display:grid;place-items:center;color:var(--teal);font:600 72px/1 var(--font-body)}
.topic-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.topic-grid.three{grid-template-columns:repeat(3,1fr)}
.topic-grid .card{min-height:270px}
.course-map-slide .rule{margin-bottom:28px}
.course-map-flow{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:26px;align-items:stretch;flex:1;min-height:0;padding-top:14px}
.course-map-flow.three-stage{grid-template-columns:repeat(3,1fr);gap:32px}
.course-map-track{position:absolute;left:8%;right:8%;top:66px;height:12px;border-radius:999px;background:var(--gradient);opacity:.82}
.course-map-step{position:relative;z-index:1;display:grid;grid-template-rows:auto 116px auto auto 1fr;gap:18px;align-content:start;padding:0 30px 30px;background:var(--white);border:2px solid var(--border);border-radius:24px;text-align:center}
.course-map-marker{justify-self:center;display:grid;place-items:center;width:104px;height:104px;border-radius:50%;background:var(--navy);color:var(--white);border:12px solid var(--paper);font:700 32px/1 var(--font-mono);margin-top:0}
.course-map-step.time .course-map-marker{background:var(--steel)}
.course-map-step.projects .course-map-marker{background:var(--teal)}
.course-map-step.risk .course-map-marker{background:var(--terra)}
.course-map-step.markets .course-map-marker{background:var(--steel)}
.course-map-step.structure .course-map-marker{background:var(--gold)}
.course-map-step.security .course-map-marker{background:var(--teal)}
.three-stage .course-map-step{padding-left:48px;padding-right:48px}
.course-map-icon{align-self:center;justify-self:center;width:120px;height:92px;border-radius:20px;background:var(--sky);display:grid;align-content:center;gap:12px;padding:20px 24px}
.course-map-icon>span{height:8px;background:var(--steel);border-radius:999px}
.course-map-icon.clock{position:relative;width:92px;height:92px;border-radius:50%;border:8px solid var(--steel);background:var(--white);padding:0}
.course-map-icon.clock span{position:absolute;width:8px;height:30px;left:34px;top:14px;background:var(--steel);transform-origin:bottom center;transform:rotate(-35deg)}
.course-map-icon.bars{display:flex;align-items:flex-end;justify-content:center;gap:12px;background:var(--pale)}
.course-map-icon.bars span{width:18px;height:36px;background:var(--teal)}
.course-map-icon.bars span:nth-child(2){height:58px}.course-map-icon.bars span:nth-child(3){height:76px}
.course-map-icon.balance{position:relative;display:flex;align-items:end;justify-content:space-between;background:#F8EEE9}
.course-map-icon.balance::before{content:'';position:absolute;left:22px;right:22px;top:28px;height:8px;border-radius:999px;background:var(--terra)}
.course-map-icon.balance::after{content:'';position:absolute;left:54px;top:28px;width:8px;height:52px;background:var(--terra)}
.course-map-icon.balance span{width:30px;height:30px;border-radius:50%;background:var(--terra)}
.course-map-icon.bank{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:12px;padding:32px 22px 16px;background:var(--sky)}
.course-map-icon.bank::before{content:'';position:absolute;left:18px;right:18px;top:12px;border-left:42px solid transparent;border-right:42px solid transparent;border-bottom:24px solid var(--steel)}
.course-map-icon.bank::after{content:'';position:absolute;left:14px;right:14px;bottom:12px;height:8px;border-radius:999px;background:var(--steel)}
.course-map-icon.bank span{width:14px;height:42px;border-radius:4px;background:var(--steel)}
.course-map-icon.mix{width:92px;height:92px;border-radius:50%;background:conic-gradient(var(--navy) 0 58%,var(--gold) 58% 100%);display:grid;place-items:center;padding:0}
.course-map-icon.mix span{width:44px;height:44px;border-radius:50%;background:var(--white)}
.course-map-icon.analysis{position:relative;background:var(--pale)}
.course-map-icon.analysis span{position:absolute;left:20px;top:26px;width:58px;height:34px;border-top:8px solid var(--teal);border-right:8px solid var(--teal);transform:skewY(-22deg)}
.course-map-icon.analysis i{position:absolute;right:14px;bottom:12px;width:44px;height:44px;border-radius:50%;border:8px solid var(--teal)}
.course-map-icon.analysis i::after{content:'';position:absolute;width:28px;height:8px;border-radius:999px;background:var(--teal);right:-24px;bottom:-12px;transform:rotate(45deg)}
.step-kicker{font:700 var(--type-small)/1.2 var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.course-map-step h3{font-size:32px;color:var(--navy)}
.three-stage .course-map-step h3{font-size:36px}
.course-map-step p{font-size:var(--type-body);line-height:1.3;color:var(--text-soft)}
.course-map-ribbon{margin:28px 0 32px;padding:24px 32px;border-radius:18px;background:var(--navy);color:var(--white);display:flex;align-items:center;justify-content:center;gap:24px;font-size:var(--type-body)}
.course-map-ribbon b{color:var(--gold);font-size:var(--type-lead)}
.history-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.history-grid>div{display:grid;grid-template-columns:170px 1fr;gap:18px;align-items:center;padding:18px 22px;background:var(--white);border:1px solid var(--border);border-radius:12px}
.history-grid time{font:500 var(--type-small)/1 var(--font-mono);color:var(--accent)}
.history-grid span{font-size:var(--type-body);line-height:1.2}
.three-lines{display:grid;gap:24px;margin-top:30px}
.three-lines span{font-size:var(--type-lead);padding:24px 30px;background:rgba(255,255,255,.06);border-radius:12px}
.org-chart,.cash-cycle{width:100%;height:650px}
.svg-line{fill:none;stroke:var(--muted);stroke-width:6}
.svg-node rect,.svg-node circle,.cycle-node rect,.cycle-node circle{fill:var(--white);stroke:var(--border);stroke-width:3}
.svg-node.primary rect,.cycle-node.accent rect,.cycle-node.accent circle{fill:var(--navy);stroke:var(--navy)}
.svg-node.accent rect{fill:var(--steel);stroke:var(--steel)}
.svg-node.light rect,.cycle-node.light rect{fill:var(--source-blue-light);stroke:var(--steel)}
.svg-node text,.cycle-node text{font:600 30px var(--font-body);fill:var(--text);text-anchor:middle}
.svg-node.primary text,.svg-node.accent text,.cycle-node.accent text{fill:var(--white)}
.flow-arrow{fill:none;stroke:var(--teal);stroke-width:7;stroke-linecap:round;marker-end:url(#cash-arrow)}
.flow-label{font:500 24px var(--font-mono);fill:var(--accent);text-anchor:middle}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.stat{background:var(--navy);color:var(--white);padding:52px;border-radius:18px;display:grid;gap:24px}
.stat strong{font:700 112px/1 var(--font-body);color:var(--gold)}
.stat span{font-size:var(--type-lead);line-height:1.2}
.stat small{font:500 var(--type-small)/1.4 var(--font-mono);color:var(--paper-2)}
.quote-stack{display:grid;gap:28px}
.quote-stack blockquote{margin:0;background:var(--white);border:1px solid var(--border)}
.scenario-list{margin:0;padding-left:58px;display:grid;gap:22px}
.scenario-list li{font-size:var(--type-body);line-height:1.3;padding-left:16px}
.answer-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.answer-grid>div{padding:28px 34px;background:var(--white);border:1px solid var(--border);border-radius:14px;display:flex;justify-content:space-between;gap:30px;font-size:var(--type-body)}
.answer-grid b{font-weight:600}.answer-grid span{color:var(--accent);font-weight:600}
.structure-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.structure-grid .card{min-height:330px;align-content:center;text-align:center}
.venn{width:1320px;height:650px;margin:auto;position:relative}
.venn .left,.venn .right{position:absolute;top:15px;width:620px;height:620px;border-radius:50%;display:grid;align-items:center;text-align:center;font-size:var(--type-subtitle);line-height:1.1;color:var(--white)}
.venn .left{left:190px;padding-right:260px;background:rgba(45,125,210,.82)}
.venn .right{right:190px;padding-left:260px;background:rgba(27,153,139,.78)}
.venn strong{position:absolute;left:50%;top:50%;width:260px;transform:translate(-50%,-50%);text-align:center;font-size:var(--type-lead);line-height:1.05;color:var(--navy);z-index:2}
.car-example-slide h2{font-size:64px;max-width:1420px}
.car-example{display:grid;grid-template-columns:620px 1fr;gap:80px;align-items:center;flex:1;min-height:0}
.car-graphic{width:620px;height:auto;overflow:visible}.car-shadow{fill:rgba(10,37,64,.14)}.car-body{fill:#C83A32;stroke:var(--navy);stroke-width:8;stroke-linejoin:round}.car-roof{fill:#E2544B;stroke:var(--navy);stroke-width:8;stroke-linejoin:round}.car-window{fill:#DCEEF8;stroke:var(--navy);stroke-width:6}.car-detail{fill:none;stroke:var(--navy);stroke-width:6;stroke-linecap:round}.car-handle{fill:var(--gold)}.car-light{fill:#FFF2B7;stroke:var(--navy);stroke-width:5}.car-wheel{fill:var(--navy);stroke:#061A2C;stroke-width:8}.car-hub{fill:var(--paper-2);stroke:var(--steel);stroke-width:8}
.choice{display:flex;align-items:center;gap:28px;margin:38px 0}
.choice span{padding:24px 34px;border:1px solid var(--border);border-radius:14px;background:var(--white);font-size:var(--type-subtitle)}
.choice b{font:italic 400 var(--type-subtitle)/1 var(--font-display);color:var(--accent)}
.prompt{font-weight:600;color:var(--accent)}
.car-scenario{display:grid;gap:24px}.sale-assumptions{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.sale-assumptions>span{grid-column:1/-1;font:700 24px/1 var(--font-body);letter-spacing:.1em;text-transform:uppercase;color:var(--teal)}.sale-assumptions>div{padding:20px 16px;border:2px solid var(--border);border-radius:16px;background:var(--white);display:grid;gap:8px;text-align:center}.sale-assumptions small{font-size:24px;color:var(--text-soft)}.sale-assumptions strong{font:700 32px/1 var(--font-mono);color:var(--navy)}
.numeric-choice{margin:4px 0}.numeric-choice span{min-width:230px;display:grid;gap:10px;text-align:center}.numeric-choice small{font:700 24px/1 var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--text-soft)}.numeric-choice strong{font:700 46px/1 var(--font-mono);color:var(--navy)}
.car-calc{display:grid;grid-template-columns:480px 1fr;grid-template-rows:auto 1fr;gap:28px 38px;align-items:stretch;flex:1;min-height:0}.calc-formula,.calc-takeaway{padding:34px;border-radius:24px;display:grid;align-content:center;gap:18px}.calc-formula{background:var(--navy);color:var(--white)}.calc-formula.percent{background:var(--teal)}.calc-formula>span,.calc-takeaway>span{font:700 24px/1 var(--font-body);letter-spacing:.1em}.calc-formula>span{color:var(--gold)}.calc-formula.percent>span{color:#D9FFF8}.calc-formula strong{font-size:34px;line-height:1.15}.calc-formula p{font-size:24px;color:var(--paper-2)}
.calc-table{grid-column:2;grid-row:1/3;width:100%;border-collapse:separate;border-spacing:0;align-self:center;background:var(--white);border:2px solid var(--border);border-radius:24px;overflow:hidden;font-size:27px}.calc-table caption{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.calc-table th,.calc-table td{padding:25px 28px;border-bottom:1px solid var(--border);text-align:right}.calc-table thead th{background:var(--sky);font:700 24px/1.15 var(--font-body);letter-spacing:.06em;text-transform:uppercase;color:var(--navy)}.calc-table thead th:first-child,.calc-table tbody th{text-align:left}.calc-table tbody th{font:700 28px/1 var(--font-mono);color:var(--navy)}.calc-table tbody td{font:600 29px/1 var(--font-mono)}.calc-table tr:last-child th,.calc-table tr:last-child td{border-bottom:0}.calc-table .target th,.calc-table .target td{background:#FFF7D8}.calc-table.percent thead th{background:var(--pale)}
.calc-takeaway{background:var(--sky);border-left:10px solid var(--steel)}.calc-takeaway.percent{background:var(--pale);border-left-color:var(--teal)}.calc-takeaway>span{color:var(--accent)}.calc-takeaway strong{font-size:29px;line-height:1.2;color:var(--navy)}.calc-takeaway p{font-size:24px;line-height:1.3;color:var(--text-soft)}.calc-takeaway .calc-example{padding-top:14px;border-top:2px solid rgba(27,153,139,.25);font-weight:700;color:var(--navy)}
.pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.pros-cons>div{padding:42px;background:var(--white);border:1px solid var(--border);border-radius:18px}
.pros-cons h3{margin-bottom:30px;color:var(--accent)}
.stacked-statements{display:grid;gap:18px}
.stacked-statements .numbered{min-height:130px;padding:24px 32px;align-items:center}
.four-grid{grid-template-columns:1fr 1fr}
.four-grid .numbered{min-height:190px}
.scandal-names{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;align-items:center;flex:1}
.scandal-names figure{height:330px;margin:0;padding:42px;border:1px solid rgba(255,255,255,.22);border-radius:24px;background:var(--white);display:grid;place-items:center;box-shadow:0 22px 50px rgba(0,0,0,.16)}
.scandal-names img{display:block;max-width:82%;max-height:190px;object-fit:contain}.scandal-names .enron-logo{max-height:230px}
.worldcom-wordmark{display:flex;align-items:center;gap:14px;color:#123D8E}.worldcom-wordmark strong{font:700 58px/1 var(--font-body);letter-spacing:-.05em}.worldcom-wordmark i{position:relative;width:72px;height:72px;border:8px solid #2D7DD2;border-radius:50%}.worldcom-wordmark i::before,.worldcom-wordmark i::after{content:'';position:absolute;left:50%;top:50%;width:92px;height:8px;border-radius:999px;background:#2D7DD2;transform:translate(-50%,-50%) rotate(45deg)}.worldcom-wordmark i::after{transform:translate(-50%,-50%) rotate(-45deg)}
.video-card{display:flex;align-items:center;gap:42px;background:var(--navy);color:var(--white);padding:44px;border-radius:20px;text-decoration:none;margin-bottom:32px}
.video-card .play{display:grid;place-items:center;width:120px;height:120px;border-radius:50%;background:var(--steel);font-size:54px;padding-left:8px}
.video-card div{display:grid;gap:18px}.video-card strong{font-size:var(--type-subtitle)}.video-card small{font:500 var(--type-small)/1.4 var(--font-mono);color:var(--paper-2)}
.question-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.question-grid .card{min-height:210px}

/* Pilot-wide graphical delivery system */
.photo-content h2{max-width:900px;font-size:82px;line-height:1.02}
.photo-content>p{max-width:850px;font-size:var(--type-lead);line-height:1.3;color:var(--paper-2)}

.visual-intro .rule,.profile-path-slide .rule,.skill-path-slide .rule,.success-map-slide .rule,.tool-system-slide .rule,.project-roadmap-slide .rule,.company-filter-slide .rule,.action-flow-slide .rule,.outcome-orbit-slide .rule,.history-timeline-slide .rule,.cfo-wheel-slide .rule,.scenario-slide .rule,.scenario-answer-slide .rule,.structure-branch-slide .rule,.tradeoff-slide .rule,.agency-chain-slide .rule,.scandal-chain-slide .rule,.sox-shield-slide .rule{margin-bottom:24px}

.intro-instruction{align-self:center;display:flex;align-items:center;justify-content:center;gap:24px;width:720px;min-height:86px;padding:18px 34px;border-radius:999px;background:var(--navy);color:var(--white)}
.intro-instruction span{font:700 var(--type-small)/1 var(--font-body);letter-spacing:.1em;text-transform:uppercase;color:#8EC8F6}
.intro-instruction strong{font-size:var(--type-lead);line-height:1.1}
.intro-sequence{display:grid;grid-template-columns:240px 44px 260px 44px 280px 44px 290px 44px 310px;align-items:center;justify-content:center;flex:1;min-height:0}
.intro-sequence>i{font:600 46px/1 var(--font-body);font-style:normal;color:var(--muted);text-align:center}
.sequence-step{display:grid;place-items:center;justify-self:center;text-align:center;color:var(--white)}
.sequence-step>div{display:grid;place-items:center;gap:18px;padding:26px}
.sequence-step b{font:700 38px/1 var(--font-mono)}
.sequence-step span{font-size:26px;line-height:1.2;max-width:230px}
.step-circle{width:232px;height:232px;border-radius:50%;background:var(--navy)}
.step-circle b{color:var(--gold)}
.step-rounded{width:252px;height:210px;border-radius:48px;background:var(--steel)}
.step-hex{width:272px;height:226px;background:var(--teal);clip-path:polygon(18% 0,82% 0,100% 50%,82% 100%,18% 100%,0 50%)}
.step-slant{width:282px;height:214px;background:var(--gold);color:var(--navy);clip-path:polygon(12% 0,100% 0,88% 100%,0 100%)}
.step-slant>div{padding-left:42px;padding-right:42px}
.step-pill{width:304px;height:188px;border-radius:999px;background:var(--terra)}

.profile-path{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:34px;align-items:start;flex:1;padding-top:90px}
.profile-path::before{content:'';position:absolute;left:14%;right:14%;top:148px;height:8px;border-radius:999px;background:var(--gradient);opacity:.7}
.profile-path article{position:relative;z-index:1;display:grid;grid-template-rows:124px 1fr;gap:26px;text-align:center;justify-items:center}
.profile-symbol{display:grid;place-items:center;width:124px;height:124px;border-radius:50%;background:var(--navy);color:var(--gold);border:12px solid var(--paper);font:700 42px/1 var(--font-body)}
.profile-symbol.credentials{background:var(--steel);color:var(--white)}.profile-symbol.bridge{background:var(--teal);color:var(--white);font-size:64px}
.profile-path article>div:last-child{width:100%;min-height:290px;padding:34px;background:var(--white);border:2px solid var(--border);border-radius:22px;display:grid;align-content:start;gap:16px}
.profile-path article span{font:700 var(--type-small)/1.1 var(--font-body);letter-spacing:.09em;text-transform:uppercase;color:var(--accent)}
.profile-path article h3{color:var(--navy)}.profile-path article p{font-size:26px;line-height:1.32;color:var(--text-soft)}

.skill-bridge{display:grid;grid-template-columns:1fr 54px 1fr 54px 1fr 54px 1.08fr;gap:18px;align-items:center;flex:1}
.skill-bridge>article{height:440px;padding:34px 26px;border:2px solid var(--border);border-radius:28px;background:var(--white);display:grid;align-content:center;justify-items:center;text-align:center;gap:18px}
.skill-bridge>article.skill-result{background:var(--navy);color:var(--white);border-color:var(--navy)}
.skill-bridge>b{font-size:52px;color:var(--muted);text-align:center}
.skill-node{display:grid;place-items:center;width:142px;height:142px;border-radius:36px;background:var(--sky);color:var(--steel);font:700 42px/1 var(--font-mono)}
.skill-node.time{border-radius:50%;background:var(--pale);color:var(--teal)}.skill-node.project{background:#FFF5D8;color:#A76F00}.skill-node.result{background:var(--steel);color:var(--white);border-radius:50%}
.skill-bridge article>span{font:700 24px/1.2 var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.skill-result>span{color:#8EC8F6!important}.skill-bridge h3{font-size:30px}.skill-result h3{color:var(--white)}

.success-map{position:relative;flex:1;min-height:0}
.success-map::before{content:'';position:absolute;left:360px;right:360px;top:90px;bottom:80px;background:linear-gradient(135deg,rgba(45,125,210,.14),rgba(27,153,139,.10));clip-path:polygon(50% 0,100% 100%,0 100%)}
.success-center{position:absolute;left:calc(50% - 170px);top:230px;width:340px;height:210px;border-radius:50%;background:var(--navy);color:var(--white);display:flex;align-items:center;justify-content:center;gap:16px;z-index:2;border:12px solid var(--sky)}
.success-center strong{font-size:36px}.success-center span{font-size:44px;color:var(--gold)}
.success-map article{position:absolute;width:430px;min-height:190px;padding:28px 34px;background:var(--white);border:2px solid var(--border);border-radius:22px;display:grid;grid-template-columns:72px 1fr;gap:10px 18px;align-content:center}
.success-map article b{grid-row:1/3;font:700 44px/1 var(--font-mono);color:var(--accent)}.success-map article h3{font-size:32px}.success-map article p{font-size:24px;color:var(--text-soft)}
.success-map .prepare{left:calc(50% - 215px);top:0}.success-map .tools{left:70px;bottom:22px}.success-map .participate{right:70px;bottom:22px}

.tool-system{display:grid;grid-template-columns:1fr 90px 1fr 90px 1fr;gap:22px;align-items:center;flex:1}
.tool-system>article{height:490px;padding:36px;background:var(--white);border:2px solid var(--border);border-radius:26px;display:grid;align-content:center;justify-items:center;text-align:center;gap:16px}
.tool-system>b{font-size:64px;color:var(--muted);text-align:center}
.tool-action{font:700 24px/1 var(--font-body);letter-spacing:.14em;color:var(--accent)}.tool-system h3{font-size:36px;color:var(--navy)}.tool-system p{font-size:25px;line-height:1.3;color:var(--text-soft)}
.tool-glyph{position:relative;width:150px;height:126px;border-radius:26px;background:var(--sky)}
.tool-glyph.book::before,.tool-glyph.book::after{content:'';position:absolute;top:26px;width:54px;height:72px;background:var(--white);border:6px solid var(--steel)}
.tool-glyph.book::before{left:17px;border-radius:12px 0 0 12px}.tool-glyph.book::after{right:17px;border-radius:0 12px 12px 0}
.tool-glyph.sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:28px}.tool-glyph.sheet span{background:var(--teal);border-radius:6px}
.tool-glyph.data{display:flex;align-items:flex-end;justify-content:center;gap:14px;padding:28px}.tool-glyph.data span{width:22px;border-radius:8px 8px 0 0;background:var(--gold)}.tool-glyph.data span:nth-child(1){height:38px}.tool-glyph.data span:nth-child(2){height:68px}.tool-glyph.data span:nth-child(3){height:92px}

.visual-roadmap{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:34px 52px;flex:1;align-content:center}
.visual-roadmap::before{content:'';position:absolute;left:7%;right:7%;top:50%;height:10px;background:var(--gradient);border-radius:999px;opacity:.5}
.visual-roadmap article{position:relative;z-index:1;min-height:230px;padding:30px 30px 28px 104px;background:var(--white);border:2px solid var(--border);border-radius:24px;display:grid;align-content:center;gap:12px}
.visual-roadmap article b{position:absolute;left:22px;top:calc(50% - 36px);display:grid;place-items:center;width:72px;height:72px;border-radius:50%;background:var(--navy);color:var(--white);font:700 25px/1 var(--font-mono)}
.visual-roadmap .r2 b,.visual-roadmap .r5 b{background:var(--steel)}.visual-roadmap .r3 b,.visual-roadmap .r4 b{background:var(--teal)}.visual-roadmap .r6 b{background:var(--terra)}
.visual-roadmap h3{font-size:28px;color:var(--navy)}.visual-roadmap span{font-size:24px;color:var(--text-soft)}

.company-filter{display:grid;grid-template-columns:1fr 360px 1fr;gap:54px;align-items:center;flex:1}
.filter-side{min-height:400px;padding:38px;background:var(--white);border:2px solid var(--border);border-radius:26px;display:grid;align-content:center;gap:26px}
.filter-side strong{padding:24px 28px;border-radius:14px;background:var(--pale);font-size:30px;color:var(--navy)}
.filter-side.avoid strong{background:#F8EEE9;color:var(--terra)}
.filter-label{font:700 24px/1 var(--font-body);letter-spacing:.14em;color:var(--teal)}.avoid .filter-label{color:var(--terra)}
.filter-funnel{position:relative;height:430px;display:grid;place-content:center;text-align:center;gap:14px}
.filter-funnel>span{position:absolute;left:25px;right:25px;top:20px;height:330px;background:linear-gradient(180deg,var(--steel),var(--teal));clip-path:polygon(0 0,100% 0,62% 55%,62% 100%,38% 100%,38% 55%);opacity:.22}
.filter-funnel b{font:700 76px/1 var(--font-body);color:var(--navy);z-index:1}.filter-funnel small{font:650 26px/1.2 var(--font-body);color:var(--text-soft);z-index:1}

.action-flow{display:grid;grid-template-columns:1fr 100px 1fr;align-items:center;gap:34px;flex:1}
.action-flow>article{position:relative;height:500px;padding:46px;background:var(--white);border:2px solid var(--border);border-radius:28px;display:grid;align-content:center;justify-items:center;text-align:center;gap:20px}
.action-flow>b{font-size:72px;color:var(--gold);text-align:center}.action-number{position:absolute;left:30px;top:30px;font:700 46px/1 var(--font-mono);color:var(--accent)}
.action-icon{position:relative;width:164px;height:140px;border-radius:28px;background:var(--sky)}
.action-icon.data{display:flex;align-items:flex-end;justify-content:center;gap:16px;padding:28px}.action-icon.data span{width:24px;border-radius:8px 8px 0 0;background:var(--steel)}.action-icon.data span:nth-child(1){height:38px}.action-icon.data span:nth-child(2){height:72px}.action-icon.data span:nth-child(3){height:96px}
.action-icon.reading::before,.action-icon.reading::after{content:'';position:absolute;top:30px;width:60px;height:82px;background:var(--white);border:7px solid var(--teal)}.action-icon.reading::before{left:16px;border-radius:12px 0 0 12px}.action-icon.reading::after{right:16px;border-radius:0 12px 12px 0}
.action-flow h3{font-size:38px;color:var(--navy)}.action-flow p{font-size:26px;line-height:1.35;color:var(--text-soft);max-width:590px}

.outcome-orbit{position:relative;flex:1;min-height:0}
.outcome-orbit::before{content:'';position:absolute;left:220px;right:220px;top:280px;height:8px;background:var(--gradient);border-radius:999px;opacity:.5}
.outcome-center{position:absolute;left:calc(50% - 170px);top:180px;width:340px;height:220px;border-radius:50%;background:var(--navy);color:var(--white);display:grid;place-content:center;text-align:center;gap:14px;z-index:2;border:12px solid var(--sky)}
.outcome-center span{font:700 24px/1 var(--font-mono);color:var(--gold)}.outcome-center strong{font-size:38px;max-width:260px;line-height:1.05}
.outcome-orbit article{position:absolute;width:410px;min-height:220px;padding:32px;background:var(--white);border:2px solid var(--border);border-radius:24px;display:grid;grid-template-columns:70px 1fr;gap:10px 18px;align-content:center}
.outcome-orbit article b{grid-row:1/3;font:700 44px/1 var(--font-mono);color:var(--accent)}.outcome-orbit article h3{font-size:32px;color:var(--navy)}.outcome-orbit article p{font-size:24px;color:var(--text-soft)}
.outcome-orbit .value{left:0;top:180px}.outcome-orbit .performance{right:0;top:180px}.outcome-orbit .valuation{left:calc(50% - 205px);bottom:10px}

.history-timeline{position:relative;display:grid;gap:24px 18px;align-content:center;flex:1}
.history-timeline.early{grid-template-columns:repeat(5,1fr)}.history-timeline.modern{grid-template-columns:repeat(7,1fr)}
.history-timeline::before{content:'';position:absolute;left:3%;right:3%;top:50%;height:8px;background:var(--gradient);border-radius:999px;opacity:.45}
.history-timeline article{position:relative;z-index:1;min-height:150px;padding:24px 18px;background:var(--white);border:2px solid var(--border);border-radius:18px;display:grid;align-content:center;gap:12px;text-align:center}
.history-timeline article::before{content:'';position:absolute;left:calc(50% - 10px);top:-12px;width:20px;height:20px;border-radius:50%;background:var(--steel);border:5px solid var(--paper)}
.history-timeline article:nth-child(3n)::before{background:var(--teal)}.history-timeline article:nth-child(3n+2)::before{background:var(--gold)}
.history-timeline time{font:700 24px/1.2 var(--font-mono);color:var(--accent)}.history-timeline span{font-size:24px;line-height:1.2;color:var(--text)}
.history-timeline.modern article{min-height:160px;padding:20px 12px}.history-timeline.modern span{font-size:24px}.history-timeline.modern time{font-size:24px}

.cfo-wheel{position:relative;flex:1;min-height:0}
.cfo-wheel::before,.cfo-wheel::after{content:'';position:absolute;background:var(--gradient);border-radius:999px;opacity:.45}
.cfo-wheel::before{left:260px;right:260px;top:50%;height:8px}
.cfo-wheel::after{left:calc(50% - 4px);top:15px;bottom:15px;width:8px}
.cfo-hub{position:absolute;left:calc(50% - 260px);top:calc(50% - 135px);width:520px;height:270px;border-radius:50%;background:var(--navy);color:var(--white);display:grid;place-content:center;text-align:center;gap:16px;z-index:2;border:12px solid var(--sky)}
.cfo-hub span{font:700 24px/1 var(--font-body);letter-spacing:.1em;text-transform:uppercase;color:#8EC8F6}.cfo-hub strong{font-size:38px;line-height:1.08;max-width:420px}
.cfo-wheel article{position:absolute;width:500px;min-height:210px;padding:28px 32px;background:var(--white);border:2px solid var(--border);border-radius:22px;display:grid;gap:12px;align-content:center}
.cfo-wheel article b{font:700 24px/1 var(--font-body);letter-spacing:.12em;color:var(--accent)}.cfo-wheel article span{font-size:24px;line-height:1.25;color:var(--text)}
.cfo-wheel .fund{left:0;top:0}.cfo-wheel .steward{right:0;top:0}.cfo-wheel .report{left:0;bottom:0}.cfo-wheel .value{right:0;bottom:0}

.decision-system-slide .rule{margin-bottom:24px}
.decision-system{display:grid;grid-template-columns:590px 82px 430px 82px 350px;grid-template-rows:1fr 1fr;gap:28px 16px;align-items:center;justify-content:center;flex:1;min-height:0}
.decision-lane{height:260px;padding:32px 36px;background:var(--white);border:2px solid var(--border);border-radius:24px;display:grid;grid-template-columns:92px 1fr;gap:24px;align-items:center}
.decision-lane.investment{grid-column:1;grid-row:1;border-left:12px solid var(--steel)}
.decision-lane.financing{grid-column:1;grid-row:2;border-left:12px solid var(--gold)}
.lane-number{display:grid;place-items:center;width:82px;height:82px;border-radius:50%;background:var(--steel);color:var(--white);font:700 30px/1 var(--font-mono)}
.decision-lane.financing .lane-number{background:var(--gold);color:var(--navy)}
.decision-lane>div:last-child{display:grid;gap:14px}
.decision-lane span{font:700 24px/1.2 var(--font-body);letter-spacing:.09em;text-transform:uppercase;color:var(--accent)}
.decision-lane.financing span{color:#A76F00}
.decision-lane h3{font-size:34px;color:var(--navy)}
.lane-tags{display:flex;flex-wrap:wrap;gap:12px}
.lane-tags b{padding:12px 18px;border-radius:999px;background:var(--sky);color:var(--steel-dark);font-size:24px;font-weight:650}
.financing-tags b{background:#FFF5D8;color:#8A6000}
.lane-arrow,.value-arrow{display:grid;place-items:center;width:78px;height:78px;border-radius:50%;color:var(--white);font:700 42px/1 var(--font-body);justify-self:center}
.lane-arrow.investment{grid-column:2;grid-row:1;background:var(--steel)}
.lane-arrow.financing{grid-column:2;grid-row:2;background:var(--gold);color:var(--navy)}
.firm-decision-node{grid-column:3;grid-row:1/3;align-self:center;width:420px;height:420px;border-radius:50%;background:var(--navy);color:var(--white);display:grid;place-content:center;text-align:center;gap:18px;padding:52px;border:12px solid var(--sky)}
.firm-decision-node span,.firm-value-node span{font:700 24px/1.1 var(--font-body);letter-spacing:.1em;text-transform:uppercase;color:#8EC8F6}
.firm-decision-node strong{font-size:39px;line-height:1.08}
.firm-decision-node p{font-size:24px;line-height:1.3;color:var(--paper-2)}
.value-arrow{grid-column:4;grid-row:1/3;background:var(--teal)}
.firm-value-node{grid-column:5;grid-row:1/3;align-self:center;width:350px;min-height:360px;padding:46px 40px;border-radius:32px;background:var(--teal);color:var(--white);display:grid;place-content:center;text-align:center;gap:22px}
.firm-value-node span{color:#D6FFF9}
.firm-value-node strong{font-size:46px;line-height:1.02}
.firm-value-node p{font-size:26px;line-height:1.3;color:var(--white)}

.scenario-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:22px;align-items:center;flex:1}
.scenario-grid article{position:relative;height:380px;padding:34px 26px;background:var(--white);border:2px solid var(--border);border-radius:24px;display:grid;align-content:center;justify-items:center;text-align:center;gap:28px}
.scenario-grid article>b{display:grid;place-items:center;width:110px;height:110px;border-radius:28px;background:var(--navy);color:var(--gold);font:700 32px/1 var(--font-mono)}
.scenario-grid article:nth-child(2)>b,.scenario-grid article:nth-child(4)>b{background:var(--steel);color:var(--white)}.scenario-grid article:nth-child(3)>b{background:var(--teal);color:var(--white)}
.scenario-grid article>span{font-size:25px;line-height:1.25}
.scenario-kicker{font-size:34px}
.partner-prompt{display:flex;align-items:center;justify-content:center;gap:24px;min-height:74px;margin-bottom:18px;padding:16px 28px;border-radius:18px;background:var(--pale);color:var(--navy)}
.partner-prompt span{padding:12px 18px;border-radius:999px;background:var(--teal);color:var(--white);font:700 24px/1 var(--font-body);letter-spacing:.1em;text-transform:uppercase}
.partner-prompt strong{font-size:28px;line-height:1.2}
.decision-key{display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:4px}.decision-key span{padding:16px 28px;border-radius:999px;background:var(--navy);color:var(--white);font:700 24px/1 var(--font-body);letter-spacing:.08em}.decision-key span:last-child{background:var(--gold);color:var(--navy)}.decision-key b{font:italic 400 30px/1 var(--font-display);color:var(--muted)}

.answer-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;align-items:center;flex:1}
.answer-column{height:470px;padding:42px;background:var(--white);border:3px solid var(--steel);border-radius:28px;display:grid;align-content:center;gap:20px}.answer-column.both{border-color:var(--teal)}.answer-column.financing{border-color:var(--gold)}
.answer-column h3{font-size:28px;letter-spacing:.08em;color:var(--steel)}.answer-column.both h3{color:var(--teal)}.answer-column.financing h3{color:#A76F00}.answer-column span{padding:20px;border-radius:14px;background:var(--sky);font-size:26px}.answer-column.both span{background:var(--pale)}.answer-column.financing span{background:#FFF5D8}

.structure-branches{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;align-items:end;flex:1;padding-top:180px}
.structure-branches::before{content:'';position:absolute;left:11%;right:11%;top:235px;height:8px;background:var(--gradient);border-radius:999px;opacity:.55}
.structure-root{position:absolute;left:calc(50% - 260px);top:0;width:520px;height:150px;padding:28px;border-radius:24px;background:var(--navy);color:var(--white);display:grid;place-content:center;text-align:center;gap:12px;z-index:2}
.structure-root span{font:700 24px/1 var(--font-body);letter-spacing:.12em;color:var(--gold)}.structure-root strong{font-size:30px}
.structure-branches article{position:relative;z-index:1;min-height:380px;padding:36px;background:var(--white);border:2px solid var(--border);border-radius:24px;display:grid;align-content:start;gap:22px}.structure-branches article.corporation{border-color:var(--teal);box-shadow:0 18px 40px rgba(27,153,139,.12)}
.structure-branches h3{text-align:center;color:var(--navy);min-height:76px}.structure-branches article>div{display:grid;gap:8px;padding:20px;border-radius:14px;background:var(--sky)}.structure-branches .corporation>div{background:var(--pale)}
.structure-branches article b{font:700 24px/1 var(--font-body);letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}.structure-branches article span{font-size:25px;line-height:1.25}
.structure-branch-slide>.source-note{margin-top:16px}

.tradeoff-scale{position:relative;display:grid;grid-template-columns:1fr 300px 1fr;gap:28px;align-items:end;flex:1;padding-bottom:70px}
.tradeoff-scale::before{content:'';position:absolute;left:170px;right:170px;bottom:172px;height:14px;border-radius:999px;background:var(--navy);transform:rotate(-2deg)}
.tradeoff-scale.percent::before{transform:rotate(2deg)}
.scale-pan{position:relative;z-index:1;min-height:430px;padding:38px;background:var(--white);border:2px solid var(--border);border-radius:28px;display:grid;align-content:center;gap:18px}.scale-pan.pros{border-top:12px solid var(--teal)}.scale-pan.cons{border-top:12px solid var(--terra)}
.scale-pan>b{font:700 50px/1 var(--font-body);color:var(--teal)}.scale-pan.cons>b{color:var(--terra)}.scale-pan h3{font-size:34px;color:var(--navy)}.scale-pan span{font-size:25px;line-height:1.25;padding-left:24px;position:relative}.scale-pan span::before{content:'•';position:absolute;left:0;color:var(--accent)}
.scale-pivot{position:relative;z-index:2;width:260px;height:260px;border-radius:50%;background:var(--navy);color:var(--white);display:grid;place-items:center;text-align:center;margin:0 auto;font:700 34px/1.05 var(--font-body);border:14px solid var(--sky)}

.agency-chain{display:grid;grid-template-columns:1fr 130px 1fr 130px 1fr 130px 1fr;gap:16px;align-items:center;flex:1}
.agency-chain article{height:430px;padding:32px 24px;background:var(--white);border:2px solid var(--border);border-radius:24px;display:grid;align-content:center;justify-items:center;text-align:center;gap:16px}.agency-chain>b{font-size:24px;line-height:1.3;color:var(--accent);text-align:center}
.agency-symbol{display:grid;place-items:center;width:116px;height:116px;border-radius:50%;background:var(--navy);color:var(--gold);font:700 54px/1 var(--font-body)}.agency-symbol.agent{background:var(--steel);color:var(--white)}.agency-symbol.pay{background:var(--teal);color:var(--white)}.agency-symbol.horizon{background:var(--terra);color:var(--white)}
.agency-chain article>span{font:700 24px/1 var(--font-body);letter-spacing:.1em;color:var(--accent)}.agency-chain h3{font-size:31px;color:var(--navy)}.agency-chain p{font-size:24px;line-height:1.3;color:var(--text-soft)}

.governance-photo-slide .photo-content{width:1020px}.governance-elements{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:950px}.governance-elements span{padding:22px 26px;border-radius:14px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.24);font-size:27px;color:var(--white);backdrop-filter:blur(8px)}

.scandal-chain{display:grid;grid-template-columns:1fr 70px 1fr 90px 1.15fr;gap:22px;align-items:center;flex:1}
.scandal-chain article{height:420px;padding:38px;background:var(--white);border:2px solid var(--border);border-radius:26px;display:grid;align-content:center;justify-items:center;text-align:center;gap:22px}.scandal-chain article.response{background:var(--navy);color:var(--white);border-color:var(--navy)}
.scandal-chain>b{font-size:60px;text-align:center;color:var(--muted)}.failure-symbol{display:grid;place-items:center;width:112px;height:112px;border-radius:30px;background:var(--terra);color:var(--white);font:700 34px/1 var(--font-mono)}.failure-symbol.audit{background:var(--gold);color:var(--navy)}.failure-symbol.sox{background:var(--teal);font-family:var(--font-body)}
.scandal-chain article>span{font:700 24px/1 var(--font-body);letter-spacing:.1em;color:var(--accent)}.scandal-chain h3{font-size:29px;line-height:1.2;color:var(--navy)}.scandal-chain .response h3{color:var(--white)}.scandal-chain .response>span{color:#8EC8F6}

.sox-shield{position:relative;flex:1;min-height:0}
.shield-core{position:absolute;left:calc(50% - 180px);top:135px;width:360px;height:390px;background:linear-gradient(180deg,var(--navy),var(--steel-dark));color:var(--white);clip-path:polygon(50% 0,92% 15%,82% 72%,50% 100%,18% 72%,8% 15%);display:grid;place-content:center;text-align:center;gap:18px;z-index:2}
.shield-core span{font:700 64px/1 var(--font-body);color:var(--gold)}.shield-core strong{font-size:34px;line-height:1.08}
.sox-shield article{position:absolute;width:470px;min-height:210px;padding:30px 34px;background:var(--white);border:2px solid var(--border);border-radius:22px;display:grid;grid-template-columns:70px 1fr;gap:10px 18px;align-content:center}
.sox-shield article b{grid-row:1/3;font:700 42px/1 var(--font-mono);color:var(--accent)}.sox-shield article h3{font-size:30px;color:var(--navy)}.sox-shield article p{font-size:24px;line-height:1.28;color:var(--text-soft)}
.sox-shield .certify{left:0;top:30px}.sox-shield .controls{right:0;top:30px}.sox-shield .audit{left:calc(50% - 235px);bottom:0}
.sox-shield-slide>.source-note{margin-top:18px}

.sox-balance-slide{justify-content:center}.sox-balance-slide h2{max-width:1200px}.sox-balance{display:grid;grid-template-columns:1fr 280px 1fr;gap:44px;align-items:center;margin-top:44px}
.sox-balance>div:not(.balance-beam){min-height:420px;padding:48px;border-radius:28px;background:rgba(255,255,255,.09);border:2px solid rgba(255,255,255,.18);display:grid;grid-template-columns:86px 1fr;gap:14px 22px;align-content:center}.sox-balance .confidence{border-left:12px solid var(--teal)}.sox-balance .cost{border-right:12px solid var(--gold)}
.sox-balance>div>b{grid-row:1/5;display:grid;place-items:center;width:76px;height:76px;border-radius:50%;background:rgba(118,217,206,.14);font:700 52px/1 var(--font-body);color:#76D9CE}.sox-balance .cost>b{background:rgba(230,168,23,.14);color:var(--gold)}.sox-balance h3{font-size:34px;color:var(--white);margin-bottom:10px}.sox-balance>div:not(.balance-beam)>span{font-size:28px;color:var(--paper-2);padding-left:26px;position:relative}.sox-balance>div:not(.balance-beam)>span::before{content:'•';position:absolute;left:0;color:#76D9CE}.sox-balance .cost>span::before{color:var(--gold)}
.balance-beam{position:relative;width:250px;height:250px;margin:auto;border-radius:50%;background:linear-gradient(145deg,var(--steel),var(--steel-dark));color:var(--white);display:grid;place-content:center;text-align:center;gap:12px;border:14px solid rgba(255,255,255,.18);box-shadow:0 20px 44px rgba(0,0,0,.2)}.balance-beam::before{content:'↔';font:700 60px/1 var(--font-body);color:var(--gold)}.balance-beam span{font:700 54px/1 var(--font-body)}.balance-beam strong{font:700 28px/1 var(--font-body);letter-spacing:.12em;text-transform:uppercase;color:#CDE7FA}
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Editable Fall 2026 BUS311 presenter deck rebuilt from a 46-slide Canva/PPTX source and styled from the BUS209 FactSet deck system.">
  <title>BUS311 · Fall 2026 · Corporate Finance: Course Introduction and Chapter 1</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script type="application/json" id="speaker-notes">${JSON.stringify(notes).replaceAll('</', '<\\/')}</script>
  <style>${css}</style>
</head>
<body>
  <!-- Source: Canva design ${esc(introM01L01Deck.sourceDesignId)} and supplied PPTX export. Rebuilt read-only; the original Canva design and PPTX were not modified. Visual reference: BUS209 FactSet decks. -->
  <deck-stage width="1920" height="1080" no-rail>${slides.join('')}</deck-stage>
  <script>${deckRuntime()}</script>
</body>
</html>`;

await fs.writeFile(output, html);
await fs.writeFile(legacyPilotOutput, html);
console.log(`Built ${path.relative(root, output)} (${slides.length} slides from 46 Canva source slides) and refreshed the legacy pilot alias.`);
