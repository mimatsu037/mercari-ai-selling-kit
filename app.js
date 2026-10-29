const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>(s||'').trim();
const yen=n=>`¥${Math.max(0,Math.round(Number(n)||0)).toLocaleString('ja-JP')}`;

const categoryHints={
  'レディースファッション':['着丈・肩幅・身幅・袖丈','素材表示タグ','前面と背面','襟・袖口・裾','傷や汚れの接写'],
  'メンズファッション':['着丈・肩幅・身幅・袖丈','素材表示タグ','前面と背面','襟・袖口・裾','傷や汚れの接写'],
  'キッズ・ベビー':['サイズ表示タグ','素材・洗濯表示','前面と背面','記名・汚れの有無','付属品'],
  'バッグ・小物':['正面・背面・底面','内部とポケット','金具・ファスナー','ブランド刻印・タグ','角スレ・傷の接写'],
  '靴':['左右の全体','靴底','つま先・かかと','サイズ表記','傷・すり減りの接写'],
  'コスメ・美容':['表面・裏面ラベル','残量がわかる写真','使用期限・製造番号','開封口・付属品','傷や汚れの接写'],
  '家電・スマホ':['正面・背面・側面','型番ラベル','電源が入った状態','端子・画面・ボタン','付属品一式'],
  '本・ゲーム':['表紙・裏表紙','背表紙','盤面・カートリッジ','付属品','傷や書き込みの接写'],
  'インテリア・生活用品':['全体像','底面・背面','サイズがわかる写真','素材・メーカー表示','傷や汚れの接写'],
  'その他':['正面・背面・側面','型番・タグ','サイズがわかる写真','付属品','傷や汚れの接写']
};

function data(){return {category:esc($('#category').value),item:esc($('#itemName').value),brand:esc($('#brand').value),color:esc($('#color').value),size:esc($('#size').value),condition:esc($('#condition').value),specs:esc($('#specs').value),flaws:esc($('#flaws').value),accessories:esc($('#accessories').value),shipping:esc($('#shipping').value),price:Number($('#price').value)||0,postage:Number($('#postage').value)||0}}
function titleFor(d){const parts=[d.brand,d.item,d.color,d.size,d.condition==='新品、未使用'?'新品':d.condition==='未使用に近い'?'美品':''].filter(Boolean);let t=parts.join(' ');return t.length<=40?t:t.slice(0,39)+'…'}
function descriptionFor(d){
  const stateDetail=d.flaws|| (d.condition.includes('傷')?'写真で状態をご確認ください。':'目立つダメージは見当たりませんが、状態は写真でご確認ください。');
  return `【商品】\n${[d.brand,d.item].filter(Boolean).join(' ')}\n\n【カラー】\n${d.color||'写真をご確認ください'}\n\n【サイズ・型番】\n${d.size||'未入力（実物をご確認のうえ追記してください）'}\n\n【仕様・採寸】\n${d.specs||'未入力（採寸・素材などを追記すると安心です）'}\n\n【状態】\n${d.condition}。${stateDetail}\n\n【付属品】\n${d.accessories||'写真に写っているものがすべてです'}\n\n【発送】\n${d.shipping}を予定しています。\n\n中古品・自宅保管にご理解のうえ、写真と説明をご確認ください。気になる点は購入前にご質問ください。`;
}
function keywordsFor(d){return [...new Set([d.brand,d.item,d.color,d.size,d.category,...d.item.split(/[\s　・]+/)].filter(Boolean))].join(' / ')}
function promptFor(d){return `この写真は、実際に手元にある「${[d.brand,d.item].filter(Boolean).join(' ')}」の商品写真です。\n\n背景だけを明るい無地のアイボリーに整え、自然な日中の光で撮影したように明るさとホワイトバランスを補正してください。\n\n【絶対に変えないもの】\n・商品の形、色、柄、素材感、ロゴ、文字、サイズ感\n・傷、汚れ、使用感、付属品の有無\n・商品に含まれない物を追加しない\n\n輪郭を不自然に切り抜かず、実物の状態が正確に伝わる自然な商品写真にしてください。仕上がりは正方形。文字、ロゴ、装飾は追加しないでください。`}
function scoreFor(d){let s=58;if(d.brand)s+=5;if(d.color)s+=5;if(d.size)s+=8;if(d.specs.length>12)s+=9;if(d.flaws.length>8)s+=8;if(d.accessories)s+=4;if(d.price)s+=3;return Math.min(100,s)}
function showToast(msg='コピーしました'){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
async function copyText(text){try{await navigator.clipboard.writeText(text);showToast()}catch{showToast('選択してコピーしてください')}}

$('#fillSample').addEventListener('click',()=>{const sample={category:'レディースファッション',itemName:'ケーブル編みカーディガン',brand:'ノーブランド',color:'アイボリー',size:'M',condition:'目立った傷や汚れなし',specs:'綿100%。着丈58cm、肩幅42cm、身幅50cm、袖丈55cm。前ボタン5個。',flaws:'3回ほど着用。右袖口に2mmほどの薄いシミがあります。毛玉はほぼありません。',accessories:'替えボタン1個',shipping:'1〜2日で発送',price:3500,postage:750};Object.entries(sample).forEach(([k,v])=>$('#'+k).value=v);$('#factCheck').checked=true;showToast('サンプルを入力しました')});

$('#itemForm').addEventListener('submit',e=>{e.preventDefault();const d=data();const title=titleFor(d),desc=descriptionFor(d),keys=keywordsFor(d),prompt=promptFor(d),score=scoreFor(d);$('#titleOut').textContent=title;$('#titleCount').textContent=`${title.length} / 40文字`;$('#descriptionOut').textContent=desc;$('#keywordsOut').textContent=keys;$('#promptOut').textContent=prompt;$('#score').textContent=score;$('#scoreMessage').textContent=score>=90?'購入判断に必要な情報がしっかり揃っています。':score>=78?'あと少し。採寸や状態を具体的にすると、さらに安心です。':'未入力の項目を実物に合わせて補うと、伝わりやすくなります。';const photos=['明るい場所で撮った全体の正面',...(categoryHints[d.category]||categoryHints['その他'])];$('#photoOut').innerHTML=photos.map((p,i)=>`<div class="photo-item"><b>${i+1}</b><span>${p}</span></div>`).join('');const checks=['商品名にブランド・品名・色・サイズが入っている','説明文のサイズ・素材・状態が実物と一致している','傷や汚れを隠さず、写真と文章の両方で示した','商品全体と細部がわかる実物写真を載せた','付属品と発送目安を確認した','無関係なキーワードを入れていない','AIで補正した場合、実物と見比べた'];$('#checkOut').innerHTML=checks.map(x=>`<label class="check-item"><input type="checkbox"><span>${x}</span></label>`).join('');const fee=Math.floor(d.price*.1),profit=d.price-fee-d.postage;$('#priceOut').textContent=yen(d.price);$('#feeOut').textContent=yen(fee);$('#postageOut').textContent=yen(d.postage);$('#profitOut').textContent=yen(profit);$('#itemForm').hidden=true;$('#results').hidden=false;$('#results').scrollIntoView({behavior:'smooth',block:'start'});try{localStorage.setItem('mercari-kit-draft',JSON.stringify(d))}catch{}});

$('#resetBtn').addEventListener('click',()=>{$('#results').hidden=true;$('#itemForm').hidden=false;$('#itemForm').scrollIntoView({behavior:'smooth',block:'start'})});
$$('.tab').forEach(btn=>btn.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.remove('active'));$$('.tab-panel').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$(`[data-panel="${btn.dataset.tab}"]`).classList.add('active')}));
$$('.copy-btn').forEach(btn=>btn.addEventListener('click',()=>copyText($('#'+btn.dataset.copy).textContent)));
$('#copyAll').addEventListener('click',()=>copyText(`【商品名】\n${$('#titleOut').textContent}\n\n【商品説明】\n${$('#descriptionOut').textContent}\n\n【関連キーワード】\n${$('#keywordsOut').textContent}\n\n【写真補正プロンプト】\n${$('#promptOut').textContent}`));

const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');io.unobserve(x.target)}}),{threshold:.08});$$('.reveal').forEach(x=>io.observe(x));
