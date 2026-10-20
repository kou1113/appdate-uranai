const DESTINATION='https://sp.minden.jp/lp_58/?ref=ad-afb-005';
const app=document.getElementById('app');let answers=[],step=-1,timer=null,busy=false;
const routes={
 love:{name:'恋愛',icon:'♡',q2:'今の恋愛状況に、一番近いものは？',q2opts:['気になる人がいる・相手の気持ちが分からない','パートナーとの関係・結婚について悩んでいる','別れた相手と復縁したい','良い出会いがない'],q3:'今、一番知りたいことは？',q3opts:['あの人の本当の気持ち','二人がこれからどうなるのか','関係が動くタイミング','自分からどう動けばいいのか'],q4:'その答えが分かったら、どうしたいですか？',q4opts:['二人の関係を前に進めたい','今の関係を続けるか決めたい','自分から動くタイミングを決めたい','気持ちを整理して次へ進みたい']},
 work:{name:'仕事',icon:'◇',q2:'仕事について、一番悩んでいることは？',q2opts:['今の仕事を続けるか・転職するか','自分に向いている仕事が分からない','職場の人間関係・評価について','収入を上げたい・独立したい'],q3:'もし一つだけ分かるなら？',q3opts:['今の選択をした未来','自分の強みと向いている仕事','収入が変わる可能性','動くべきタイミング'],q4:'その答えが分かったら、どうしたいですか？',q4opts:['今の仕事を続けるか決めたい','転職や新しい挑戦へ進みたい','動き出すタイミングを決めたい','自分が大切にしたいことを整理したい']},
 relation:{name:'人間関係',icon:'○',q2:'誰との関係で悩んでいますか？',q2opts:['友人・知人','職場の人','家族・親族','パートナー・その他の身近な人'],q3:'その人について、一番知りたいのは？',q3opts:['私をどう思っているか','関係を修復できるか','距離を置いた方がいいか','どう接すればうまくいくか'],q4:'その答えが分かったら、どうしたいですか？',q4opts:['相手のことをもっと理解したい','関係を修復する一歩を踏み出したい','ちょうどよい距離を決めたい','自分の気持ちを大切にしたい']},
 life:{name:'人生・将来',icon:'☾',q2:'今、一番気になっていることは？',q2opts:['将来や進む方向が分からない','大きな決断で迷っている','お金・暮らしについて不安','結婚・家庭について気になる'],q3:'未来について、一つ分かるなら？',q3opts:['これから起こる大きな変化','今の選択が正しいか','流れが変わるタイミング','自分が進むべき方向'],q4:'その答えが分かったら、どうしたいですか？',q4opts:['自分の進む方向を決めたい','迷っている選択に答えを出したい','これからの変化に備えたい','不安を整理して前向きになりたい']}
};
const keys=Object.keys(routes),common6=['迷いを断ち切れる、はっきりした答え','少し先が見える、未来へのヒント','状況を変えるための、具体的な一歩','自分の気持ちに納得できる、心の整理'];
const answerNotes=['今のあなたは、曖昧なまま待つよりも、気持ちを決められる明確な答えを求めています。','今のあなたは、すべてを決める答えよりも、少し先を見通せるヒントを求めています。','今のあなたは、知るだけではなく、状況を変えるために次に何をすればよいかを求めています。','今のあなたは、急いで結論を出すよりも、まず自分の本当の気持ちを整理したいと感じています。'];
const goalNotes={
 love:['今のあなたは、相手の気持ちを知るだけでなく、二人の関係を今より前へ進めたいと思っています。','今のあなたは、この関係を続けるかどうか、自分が納得できる答えを出したいと感じています。','今のあなたは、待ち続けるのではなく、自分から動く時期を見極めたいようです。','今のあなたは、相手への気持ちを整理し、自分らしい次の一歩を選びたいと思っています。'],
 work:['今のあなたは、今の仕事に残るかどうかを、自分の意思で決めたいと感じています。','今のあなたは、新しい環境や挑戦へ進むためのきっかけを探しています。','今のあなたは、焦って動くのではなく、自分に合うタイミングを見極めたいようです。','今のあなたは、条件だけではなく、仕事で何を大切にしたいのかを整理したいと思っています。'],
 relation:['今のあなたは、相手の考えや背景を知り、今より理解し合える関係を望んでいます。','今のあなたは、すれ違いをほどき、関係を修復するための一歩を見つけたいようです。','今のあなたは、無理をせずに付き合える、ちょうどよい距離を決めたいと感じています。','今のあなたは、相手に合わせるだけでなく、自分の気持ちも大切にしたいと思っています。'],
 life:['今のあなたは、迷いの中から自分が納得できる進む方向を見つけたいと思っています。','今のあなたは、先延ばしにしてきた選択に、自分なりの答えを出したいと感じています。','今のあなたは、これから訪れる変化を知り、落ち着いて準備したいようです。','今のあなたは、漠然とした不安を整理し、前向きな気持ちで次へ進みたいと思っています。']
};
function route(){return routes[keys[answers[0]]]}
function questions(){const r=route();return[
 {title:'今、一番大きな悩みは？',hint:'いま、心を一番占めているものをひとつ。',options:keys.map(k=>`${routes[k].icon}　${routes[k].name}`)},
 {title:r.q2,hint:'ぴったりでなくても、近いもので大丈夫。',options:r.q2opts},
 {title:r.q3,hint:'その悩みの中で、特に気になること。',options:r.q3opts},
 {title:r.q4,hint:'答えを知ったあとの気持ちに近いものをひとつ。',options:r.q4opts},
 {title:'最後に。今のあなたが、いちばん欲しい答えは？',hint:'答えを知ったあと、どうなりたいかに近いものをひとつ。',options:common6}
]}
const results={
 love:[
  {tag:'恋愛｜相手の本音',title:'あなたが今知りたいのは、\n「あの人の本当の気持ち」',intro:'関係を諦めたいのではなく、相手が自分をどう思っているのか分からないことが、一番のモヤモヤになっているようです。',topics:[['あの人の今の本音','あなたには見せていない気持ちはあるか。'],['二人の今の距離','言葉や態度をどう受け止めればよいか。'],['あなたから動くべきか','待つか、一歩踏み出すか。']],cta:'あの人の本音を占ってみる'},
  {tag:'恋愛｜二人の未来',title:'あなたが確かめたいのは、\n「この恋が向かう先」',intro:'今の関係を続けた先に何があるのか。期待と不安の間で、二人の未来を知りたい気持ちが強くなっています。',topics:[['二人のこれから','今の関係から進展する可能性。'],['関係が動くきっかけ','距離が近づくタイミングはいつか。'],['未来のためにできること','今、どう接するのがよいか。']],cta:'二人の未来を占ってみる'},
  {tag:'恋愛｜復縁',title:'心の奥にあるのは、\n「もう一度つながりたい」気持ち',intro:'忘れた方がいいと思っても気になるなら、本当に知りたいのは、もう一度可能性があるのかということかもしれません。',topics:[['あの人に気持ちは残っているか','別れたあと、相手はどう感じているか。'],['もう一度つながる可能性','二人の関係が再び動くきっかけ。'],['連絡するか待つか','今の状況に合う行動とタイミング。']],cta:'あの人との未来を占ってみる'},
  {tag:'恋愛｜結婚・将来',title:'あなたが見つめているのは、\n「二人で歩む未来」',intro:'好きという気持ちだけでなく、この人と将来を築けるのかを、きちんと確かめたい時期に来ているようです。',topics:[['相手の結婚への本音','二人の将来をどう考えているか。'],['結婚につながる可能性','価値観やタイミングは合っているか。'],['将来の話をする時期','どう切り出せば気持ちが伝わるか。']],cta:'二人の結婚運を占ってみる'},
  {tag:'恋愛｜新しい出会い',title:'あなたが求めているのは、\n「自分らしく始まる恋」',intro:'ただ出会いたいのではなく、自然体で向き合える相手や、未来につながる恋を求めているようです。',topics:[['次の出会いのきっかけ','どこで、どんな流れから始まるか。'],['あなたに合う相手','心地よく関係を育てられる人の特徴。'],['今からできること','新しい恋を迎えるための一歩。']],cta:'これからの出会いを占ってみる'}
 ],
 work:[
  {tag:'仕事｜続ける・変える',title:'あなたは今、\n「働き方の分岐点」にいる',intro:'今の場所に残る安心と、新しい環境へ進む期待。その両方を比べながら、後悔のない選択をしたいと感じています。',topics:[['今の仕事を続けた未来','今の環境で得られるものは何か。'],['環境を変えた未来','転職や異動で流れはどう変わるか。'],['決断するタイミング','今動くか、準備を続けるか。']],cta:'仕事の選択を占ってみる'},
  {tag:'仕事｜適職・才能',title:'あなたが探しているのは、\n「自分を活かせる仕事」',intro:'頑張り方が足りないのではなく、力を発揮しやすい場所や役割を知りたい気持ちが強くなっています。',topics:[['あなたの強みと適性','自然に力を発揮できる分野。'],['相性のよい働き方','組織・役割・環境の向き不向き。'],['才能を活かす一歩','今から伸ばすこと、始めること。']],cta:'自分に合う仕事を占ってみる'},
  {tag:'仕事｜評価・職場',title:'あなたが望んでいるのは、\n「努力が報われる環境」',intro:'仕事そのものより、評価のされ方や周囲との関係が、今の働きづらさにつながっているのかもしれません。',topics:[['周囲からどう見られているか','強みや努力は伝わっているか。'],['今の職場との相性','この環境で力を発揮できるか。'],['評価を変えるきっかけ','伝え方や動く時期をどう選ぶか。']],cta:'仕事と職場の流れを占ってみる'},
  {tag:'仕事｜収入・金運',title:'あなたが確かめたいのは、\n「収入が変わる可能性」',intro:'このままの収入でよいのか、何を変えれば流れが動くのか。現実的な不安と将来への期待が重なっています。',topics:[['収入の流れが変わる時期','今後、変化につながる機会はあるか。'],['収入を上げる選択','転職・昇進・副業のどこに可能性があるか。'],['今準備しておくこと','機会をつかむために必要な一歩。']],cta:'仕事とお金の未来を占ってみる'},
  {tag:'仕事｜独立・挑戦',title:'あなたの中で育っているのは、\n「自分の力で進みたい」気持ち',intro:'安定を手放す不安があっても、新しい挑戦を現実にできるか確かめたい気持ちが強くなっています。',topics:[['独立に向くタイミング','今動くか、準備期間を取るか。'],['挑戦した先の可能性','選んだ道でどんな力を活かせるか。'],['成功のための準備','人・資金・経験で整えるべきこと。']],cta:'新しい仕事の未来を占ってみる'}
 ],
 relation:[
  {tag:'人間関係｜相手の本音',title:'あなたが知りたいのは、\n「あの人が考えていること」',intro:'言葉と態度が一致しない、理由が分からない。相手の本音が見えないことが、一番のモヤモヤになっています。',topics:[['相手の今の気持ち','あなたとの関係をどう捉えているか。'],['態度の裏にある理由','なぜ今の接し方になっているのか。'],['あなたへの期待','相手はどんな関係を望んでいるか。']],cta:'あの人の本音を占ってみる'},
  {tag:'人間関係｜関係修復',title:'あなたが望んでいるのは、\n「もう一度、分かり合うこと」',intro:'関係を終わらせたいのではなく、すれ違いをほどいて、以前のように話せる状態を取り戻したいようです。',topics:[['すれ違いの原因','どこから関係が変わったのか。'],['関係を戻せる可能性','相手にも歩み寄る気持ちはあるか。'],['最初に伝えること','修復につながる言葉とタイミング。']],cta:'関係修復のヒントを占ってみる'},
  {tag:'人間関係｜距離の取り方',title:'今のあなたに必要なのは、\n「心を守る距離」',intro:'無理に関係を良くしようとするより、自分が疲れない距離を見つけたい気持ちが強くなっています。',topics:[['今の関係が与える影響','この人といるとき、何を感じているか。'],['距離を置いた場合の変化','関係や気持ちはどう変わるか。'],['自分を守る接し方','どこまで関わり、何を手放すか。']],cta:'あの人との距離を占ってみる'},
  {tag:'人間関係｜接し方',title:'あなたが探しているのは、\n「関係を楽にする接し方」',intro:'相手を変えたいというより、どう話せば伝わるのか、どう接すれば疲れないのかを知りたいようです。',topics:[['相手に伝わりやすい言葉','どんな話し方が合っているか。'],['避けた方がよい対応','すれ違いを大きくしないための注意点。'],['心地よい関係の作り方','無理なく付き合うための工夫。']],cta:'あの人との接し方を占ってみる'},
  {tag:'人間関係｜今後の関係',title:'あなたが確かめたいのは、\n「あの人との関係の行方」',intro:'今の関係がこのまま続くのか、それとも変化するのか。先が見えないことに不安を感じています。',topics:[['これからの二人の関係','今の距離感はどう変わっていくか。'],['関係が動くきっかけ','変化につながる出来事や会話。'],['あなたが選べる未来','続ける・変えるためにできること。']],cta:'あの人との今後を占ってみる'}
 ],
 life:[
  {tag:'人生｜進む方向',title:'あなたは今、\n「自分の道」を探している',intro:'何を選ぶべきかより、自分は本当はどう生きたいのか。その軸を見つけたい時期に来ています。',topics:[['本当に大切にしたいこと','今後の選択で守りたい価値観。'],['あなたに合う方向','力を注ぐべき場所やテーマ。'],['最初の一歩','迷いの中でも始められること。']],cta:'自分の進む道を占ってみる'},
  {tag:'人生｜大きな決断',title:'あなたは今、\n「後悔しない選択」を求めている',intro:'答えがないのではなく、どちらを選んでも何かを失いそうで、一歩を決めきれずにいるのかもしれません。',topics:[['それぞれを選んだ未来','二つの道の先に何があるか。'],['今の自分に合う選択','気持ちと状況のどちらを優先するか。'],['決断するタイミング','今決めるか、待つべきか。']],cta:'今の選択を占ってみる'},
  {tag:'人生｜お金・暮らし',title:'あなたが求めているのは、\n「これからの安心」',intro:'お金そのものだけでなく、将来も安心して暮らせるのかという不安を整理したい気持ちが強くなっています。',topics:[['これからのお金の流れ','生活や収入に変化が訪れる時期。'],['安定につながる選択','仕事・住まい・使い方で見直すこと。'],['今からできる備え','不安を小さくする具体的な一歩。']],cta:'お金と暮らしの未来を占ってみる'},
  {tag:'人生｜結婚・家庭',title:'あなたが描きたいのは、\n「大切な人と築く未来」',intro:'結婚や家庭について、周囲の基準ではなく、自分にとっての幸せな形を確かめたいようです。',topics:[['あなたが望む家庭の形','どんな日々を大切にしたいか。'],['大切な人との未来','関係や出会いがどう動いていくか。'],['未来に近づくための選択','今、整えておきたい気持ちや環境。']],cta:'結婚と家庭の未来を占ってみる'},
  {tag:'人生｜転機・運気',title:'あなたは今、\n「流れが変わる予感」を感じている',intro:'うまくいかない時期が続いていても、心のどこかで、ここから何かが変わるのではと感じています。',topics:[['次に訪れる大きな変化','どんな出来事が転機になるか。'],['流れが変わるタイミング','停滞から抜けるきっかけはいつか。'],['転機を活かすために','今、手放すこと・始めること。']],cta:'これからの転機を占ってみる'}
 ]
};
function resultIndex(){const g=answers[0],q2=answers[1],q3=answers[2];if(g===0){if(q2===2)return 2;if(q2===1)return 3;if(q2===3)return 4;return q3===0?0:1}if(g===1){if(q2===1)return 1;if(q2===2)return 2;if(q2===3)return q3===2?3:4;return 0}if(g===2){if(q3===0&&q2===3)return 4;return [0,1,2,3][q3]}if(q2===1)return 1;if(q2===2)return 2;if(q2===3)return 3;if(q3===0||q3===2)return 4;return 0}
function offerTheme(r){return r.tag.split('｜')[1]||r.tag}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function update(html){app.innerHTML=html;app.style.animation='none';void app.offsetWidth;app.style.animation=''}
function crystal(content='',count=0,mode=''){
 return `<div class="crystal-stage ${mode}" id="crystal-stage" style="--charge:${count/5};--charge-level:${count*20}%"><div class="crystal-halo" aria-hidden="true"></div><div class="celestial-ring" aria-hidden="true"></div><div class="crystal-ball"><span class="orb-energy" aria-hidden="true"><span class="energy-surface"></span><span class="energy-dots"><i></i><i></i><i></i><i></i><i></i></span></span><span class="orb-nebula" aria-hidden="true"></span><span class="orb-mist mist-one" aria-hidden="true"></span><span class="orb-mist mist-two" aria-hidden="true"></span><span class="orb-stars" aria-hidden="true">${Array.from({length:14},(_,i)=>`<i style="--star-x:${12+(i*31)%77}%;--star-y:${12+(i*23)%74}%;--star-delay:${i*.31}s"></i>`).join('')}</span><span class="orb-reflection" aria-hidden="true"></span><div class="orb-message">${content}</div><span class="orb-flash" aria-hidden="true"></span></div><div class="crystal-stand" aria-hidden="true"><span class="stand-crown"></span><span class="stand-neck"></span><span class="stand-foot"></span></div><div class="gem-progress" role="progressbar" aria-label="回答済みの質問数" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${count}">${Array.from({length:5},(_,i)=>`<span class="gem ${i<count?'lit':''}" aria-hidden="true"></span>`).join('')}</div><span class="orbit-spark spark-left" aria-hidden="true">✧</span><span class="orbit-spark spark-right" aria-hidden="true">✦</span></div>`;
}
function topView(){
 clearTimeout(timer);busy=false;step=-1;answers=[];document.body.classList.remove('compact','is-absorbing','result-view');
 update(`<section class="crystal-intro"><span class="eyebrow">THE ANSWER WITHIN YOU</span><h1>いま、あなたの心が<br>求める答えは？</h1><p class="intro-lead">ひとりで考えても、答えが出ないときに。<br>今の気持ちを、少しだけ見つめてみませんか。</p>${crystal('<span class="orb-inner-light" aria-hidden="true"></span><span class="orb-intro-label">LISTEN TO YOUR HEART</span>',0,'intro-orb')}<p class="intro-prompt">5つの質問で読み解く、今のあなた。<br>水晶が映し出すメッセージを受け取ってみませんか。</p><button class="primary" id="start">今の気持ちを読み解く<span class="arrow">✧</span></button><div class="intro-assurances"><span>約1分・全5問</span><span>無料・名前の入力なし</span></div><p class="intro-categories">恋愛 / 仕事 / 人間関係 / 人生・将来</p></section>`);
 document.getElementById('start').onclick=()=>{if(busy)return;step=0;answers=[0];renderQuestion()};
 window.scrollTo({top:0,behavior:'instant'});
}
function renderQuestionView(html){
 // Keep the crystal and progress bar mounted between questions.
 if(!app.querySelector('.question-orb')){update(html);return}
 const next=document.createElement('div');next.innerHTML=html;
 for(const selector of ['.step-line','.journey-caption','.question-heading','.options','.navigation','.absorption-particles']){
  app.querySelector(selector).replaceWith(next.querySelector(selector));
 }
 const progress=app.querySelector('.journey-progress');
 progress.style.setProperty('--journey-fill',`${step*20}%`);
 progress.setAttribute('aria-valuenow',String(step));progress.classList.remove('is-filling');
 const stage=document.getElementById('crystal-stage');
 stage.style.setProperty('--charge',String(step/5));stage.style.setProperty('--charge-level',`${step*20}%`);stage.classList.remove('energy-added');
 app.querySelectorAll('.gem').forEach((gem,i)=>gem.classList.toggle('lit',i<step));
 app.querySelector('.gem-progress').setAttribute('aria-valuenow',String(step));
}
function renderQuestion(){
 clearTimeout(timer);busy=false;document.body.classList.remove('is-absorbing','result-view');document.body.classList.add('compact');
 const q=questions()[step];
 renderQuestionView(`<div class="step-line"><span>QUESTION <strong>${String(step+1).padStart(2,'0')}</strong> / 05</span><span id="remaining-questions">あと${5-step}問</span></div><div class="journey-progress" role="progressbar" aria-label="診断の回答済み質問数" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${step}" style="--journey-fill:${step*20}%"><span class="journey-liquid"><span class="journey-wave"></span></span><span class="journey-ticks" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><div class="journey-caption"><span>水晶に、あなたの想いを集めています</span><span id="answered-count">${step} / 5 回答</span></div><div class="question-heading"><h2 class="question" tabindex="-1">${esc(q.title)}</h2><p class="subtext">${q.hint}</p></div>${crystal('<span class="orb-inner-light" aria-hidden="true"></span>',step,'question-orb')}<div class="options">${q.options.map((v,i)=>`<button class="option" data-choice="${i}"><span class="answer-gem" aria-hidden="true"></span><span class="answer-text">${esc(v)}</span><span class="chevron" aria-hidden="true">›</span></button>`).join('')}</div><div class="navigation"><button class="back" id="back">← ${step?'前の質問へ':'はじめに戻る'}</button><span class="nav-note">ひとつ選ぶと次へ進みます</span></div><div class="absorption-particles" id="absorption-particles" aria-hidden="true">${Array.from({length:9},(_,i)=>`<i style="--particle-delay:${i*40}ms;--particle-spread:${(i%3-1)*13}px"></i>`).join('')}</div>`);
 app.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>choose(+button.dataset.choice));
 document.getElementById('back').onclick=()=>{if(busy)return;step===0?topView():(step--,renderQuestion())};
 app.querySelector('h2').focus({preventScroll:true});
}
function choose(n){
 if(busy)return;busy=true;
 const cards=app.querySelectorAll('[data-choice]');cards.forEach(b=>{b.disabled=true;b.classList.toggle('unpicked',+b.dataset.choice!==n)});cards[n].classList.add('chosen');
 const source=cards[n].getBoundingClientRect(),target=app.querySelector('.crystal-ball').getBoundingClientRect();
 const particles=document.getElementById('absorption-particles');
 particles.style.setProperty('--from-x',`${source.left+source.width/2}px`);particles.style.setProperty('--from-y',`${source.top+source.height/2}px`);
 particles.style.setProperty('--travel-x',`${target.left+target.width/2-source.left-source.width/2}px`);particles.style.setProperty('--travel-y',`${target.top+target.height/2-source.top-source.height/2}px`);
 document.body.classList.add('is-absorbing');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const stage=document.getElementById('crystal-stage');
 stage.classList.remove('energy-added');void stage.offsetWidth;stage.classList.add('energy-added');
 stage.style.setProperty('--charge',String((step+1)/5));stage.style.setProperty('--charge-level',`${(step+1)*20}%`);
 app.querySelectorAll('.gem')[step].classList.add('lit');
 app.querySelector('.gem-progress').setAttribute('aria-valuenow',String(step+1));
 const progress=app.querySelector('.journey-progress');
 progress.style.setProperty('--journey-fill',`${(step+1)*20}%`);progress.setAttribute('aria-valuenow',String(step+1));progress.classList.add('is-filling');
 document.getElementById('answered-count').textContent=`${step+1} / 5 回答`;
 document.getElementById('remaining-questions').textContent=step===4?'すべて回答しました':`あと${4-step}問`;
 timer=setTimeout(()=>{
  if(answers[step]!==n)answers=answers.slice(0,step);
  answers[step]=n;step++;busy=false;step===5?loading():renderQuestion();
 },reduced?50:400);
}

function loading(){
 const result=results[keys[answers[0]]][resultIndex()];
 document.body.classList.remove('is-absorbing');
 update(`<section class="crystal-reading" role="status" aria-live="polite"><span class="eyebrow">A MOMENT FOR YOUR HEART</span><h2>あなたの回答から、<br>今の気持ちを整理しています。</h2>${crystal(`<span class="result-sphere-label">YOUR MESSAGE</span><p class="sphere-result-title">${esc(result.title).replace(/\n/g,'<br>')}</p>`,5,'revelation-orb')}<p>もうすぐ、あなたへのメッセージが届きます。</p></section>`);
 timer=setTimeout(renderResult,window.matchMedia('(prefers-reduced-motion: reduce)').matches?100:700);
}
function renderResult(){
 step=5;document.body.classList.add('result-view');document.body.classList.remove('is-absorbing');
 const k=keys[answers[0]],r=results[k][resultIndex()],q=questions();
 const selected=q.map((x,i)=>x.options[answers[i]]);
 update(`<div class="result-crystal-top">${crystal('<span class="reveal-sigil">✧</span>',5,'revealed-orb')}</div><article class="crystal-result"><section class="result-chapter chapter-theme" aria-labelledby="theme-heading"><div class="chapter-label"><span>01</span> YOUR THEME</div><span class="eyebrow">A MESSAGE FOR YOU</span><p class="quiet" style="text-align:left;margin:8px 0 16px">5つの回答から見えてきたこと</p><span class="result-tag">${r.tag}</span><h2 class="result-heading" id="theme-heading" tabindex="-1">${r.title.replace(/\n/g,'<br>')}</h2><p class="summary">${r.intro}</p></section><section class="result-chapter chapter-feelings" aria-labelledby="feelings-heading"><div class="chapter-label"><span>02</span> YOUR HEART</div><h3 class="chapter-heading" id="feelings-heading">回答から見えた、今の気持ち</h3><div class="quote"><small>答えが分かったあと、あなたが望んでいること</small><strong>「${esc(selected[3])}」</strong></div><p class="summary">「${esc(selected[1])}」という悩みの中で、<br>「${esc(selected[2])}」が気になっているのですね。<span class="answer-interpretation">${goalNotes[k][answers[3]]}</span></p><div class="quote"><small>あなたが答えに求めていること</small><strong>「${esc(selected[4])}」</strong></div><p class="summary">${answerNotes[answers[4]]}</p></section><section class="result-chapter chapter-topics" aria-labelledby="topics-heading"><div class="chapter-label"><span>03</span> YOUR NEXT HINT</div><h3 class="topic-title" id="topics-heading">今のあなたが知りたい3つのこと</h3>${r.topics.map((t,i)=>`<div class="topic"><span class="number">0${i+1}</span><div><strong>${t[0]}</strong><p>${t[1]}</p></div></div>`).join('')}</section><div class="consult"><span class="offer-kicker">この結果が出たあなたへ</span><h3>「${esc(offerTheme(r))}」について、<br>もう少し深く知りたいと思ったら。</h3><p>自分だけでは答えが見つからないことも、誰かに話すことで気持ちや次の一歩が見えてくることがあります。占い師に相談しながら、今の悩みを整理する方法もあります。</p><div class="coupon glass-gift" aria-label="初回登録限定3000円OFFクーポン"><div class="coupon-exclusive"><span>はじめて相談するあなたへ</span><b>初回登録限定の特典</b></div><span>みんなの電話占い</span><strong><small>初回登録限定</small><b><span class="coupon-amount">3,000</span><span class="coupon-unit">円OFF</span></b><em>クーポン</em></strong><p>今の悩みを、もう一歩深く相談したい方へ。</p></div><a class="primary" href="${DESTINATION}" target="_blank" rel="noopener sponsored">${r.cta}<span class="arrow">↗</span></a></div><div class="result-actions"><button class="text-button" id="edit">← 回答を見直す</button><button class="text-button" id="restart">もう一度診断する</button></div></article>`);
 document.getElementById('edit').onclick=()=>{step=4;renderQuestion()};
 document.getElementById('restart').onclick=topView;
 app.querySelector('h2').focus({preventScroll:true});
 window.scrollTo({top:0,behavior:'instant'});
}
topView();
