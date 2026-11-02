(function(){
  "use strict";
  /* ---- WhatsApp destino: deja "" hasta tener el número oficial.
     Formato internacional sin + ni espacios, ej: 584140000000 ---- */
  var WA_NUMBER = "584141128181";
  /* Formulario-a-correo (FormSubmit): entrega cada lead a info@carbonalcampo.com */
  var MAIL_TO = "info@carbonalcampo.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/"+MAIL_TO;

  /* ---- Chispas del hero (canvas), suaves y con respeto a reduce-motion ---- */
  var canvas = document.getElementById('spark');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d'), W=0, H=0, dpr=Math.min(window.devicePixelRatio||1,2), parts=[], raf=0;
    function resize(){
      var r = canvas.getBoundingClientRect(); W=r.width; H=r.height;
      canvas.width=W*dpr; canvas.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function mk(){ return {x:Math.random()*W, y:H+Math.random()*60, r:Math.random()*1.8+.5, s:Math.random()*.5+.2, vy:-(Math.random()*.6+.3), vx:(Math.random()-.5)*.3, life:Math.random()}; }
    function init(){ parts=[]; var n=Math.round(Math.min(48, W/22)); for(var i=0;i<n;i++){var p=mk(); p.y=Math.random()*H; parts.push(p);} }
    function tick(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<parts.length;i++){
        var p=parts[i]; p.y+=p.vy; p.x+=p.vx; p.life+=0.006;
        if(p.y< -10 || p.x<-10 || p.x>W+10){ parts[i]=mk(); continue; }
        var a=(Math.sin(p.life*6)*0.5+0.5)*0.8;
        var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        g.addColorStop(0,'rgba(255,150,70,'+a+')'); g.addColorStop(1,'rgba(255,90,35,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,6.2832); ctx.fill();
      }
      raf=requestAnimationFrame(tick);
    }
    resize(); init(); tick();
    var to; window.addEventListener('resize', function(){ clearTimeout(to); to=setTimeout(function(){resize();init();},200); });
    document.addEventListener('visibilitychange', function(){ if(document.hidden){cancelAnimationFrame(raf);} else {raf=requestAnimationFrame(tick);} });
  }

  /* ---- Movimiento: aparición al hacer scroll + parallax (respeta reduce-motion) ---- */
  if(!reduce){
    var rev=[].slice.call(document.querySelectorAll('.sec-head,.card,.stage,.calc-box,.origen .copy,.export .copy,.spec,.doc,.brand-card,.panel-form .intro,.foot-grid'));
    rev.forEach(function(el){ el.classList.add('reveal'); });
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); }, {threshold:0.1, rootMargin:'0px 0px -6% 0px'});
      rev.forEach(function(el){ io.observe(el); });
    } else { rev.forEach(function(el){ el.classList.add('in'); }); }

    var pxList=[];
    var hm=document.querySelector('.hero-media'); if(hm){ hm.classList.add('px'); pxList.push({el:hm,f:-0.05,s:0}); }
    [['.origen .media .tall img',-0.09,1.14],['.origen .media .stack img',0.07,1.14]].forEach(function(cfg){
      var el=document.querySelector(cfg[0]); if(el){ el.classList.add('px'); pxList.push({el:el,f:cfg[1],s:cfg[2]}); }
    });
    var ticking=false;
    function runPx(){ var vh=window.innerHeight||1; for(var i=0;i<pxList.length;i++){ var p=pxList[i]; var r=p.el.getBoundingClientRect(); var mid=(r.top+r.height/2)-vh/2; var ty=mid*p.f; p.el.style.transform='translate3d(0,'+ty.toFixed(1)+'px,0)'+(p.s?(' scale('+p.s+')'):''); } ticking=false; }
    window.addEventListener('scroll', function(){ if(!ticking){ ticking=true; requestAnimationFrame(runPx); } }, {passive:true});
    window.addEventListener('resize', runPx);
    runPx();
  }

  /* ---- Tabs de aliados / marca propia ---- */
  var AL_TABS={ali:{t:'al-tab-ali',p:'al-panel-ali'},mp:{t:'al-tab-mp',p:'al-panel-mp'}};
  function showAl(which){
    if(!AL_TABS[which]) which='mp';
    for(var k in AL_TABS){
      var on=k===which;
      var tb=document.getElementById(AL_TABS[k].t), pn=document.getElementById(AL_TABS[k].p);
      if(tb) tb.setAttribute('aria-selected', on?'true':'false');
      if(pn) pn.hidden=!on;
    }
  }
  Object.keys(AL_TABS).forEach(function(k){
    var tb=document.getElementById(AL_TABS[k].t);
    if(tb) tb.addEventListener('click', function(){ showAl(k); });
  });

  /* ---- Tabs de formularios (comprar / exportación / distribuidor) ---- */
  var TABS={cli:{t:'tab-cli',p:'form-cli'},exp:{t:'tab-exp',p:'form-exp'},dist:{t:'tab-dist',p:'form-dist'}};
  function show(which){
    if(!TABS[which]) which='cli';
    for(var k in TABS){
      var on=k===which;
      var tb=document.getElementById(TABS[k].t), pn=document.getElementById(TABS[k].p);
      if(tb) tb.setAttribute('aria-selected', on?'true':'false');
      if(pn) pn.hidden=!on;
    }
  }
  Object.keys(TABS).forEach(function(k){
    var tb=document.getElementById(TABS[k].t);
    if(tb) tb.addEventListener('click', function(){ show(k); });
  });
  function scrollForms(){ try{ document.getElementById('distribuidores').scrollIntoView({behavior:'smooth',block:'start'}); }catch(_){ } }
  function routeHash(){
    var h=location.hash;
    if(h==='#pedidos'){ show('cli'); }
    else if(h==='#exportar'){ show('exp'); scrollForms(); }
    else if(h==='#distribuidores'){ show('dist'); }
  }
  window.addEventListener('hashchange', routeHash); routeHash();

  function val(id){ var e=document.getElementById(id); return e?e.value.trim():''; }
  function waLink(text){ return 'https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(text); }

  function wire(formId, resId, outId, stId, waBtnId, subject, build){
    var form=document.getElementById(formId);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var text=build();
      document.getElementById(outId).value=text;
      document.getElementById(resId).hidden=false;
      var st=document.getElementById(stId);
      var waBtn=document.getElementById(waBtnId);
      if(WA_NUMBER){ waBtn.href=waLink(text); waBtn.hidden=false; } else { waBtn.hidden=true; }
      try{ document.getElementById(resId).scrollIntoView({block:'nearest',behavior:'smooth'}); }catch(_){}
      st.textContent='Enviando...';
      var payload={ _subject: subject, _template:'table', resumen:text };
      try{ new FormData(form).forEach(function(v,k){ payload[k]=v; }); }catch(_){}
      fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)})
        .then(function(r){ return r.json(); })
        .then(function(d){ st.textContent=(d&&(d.success===true||d.success==='true'))?'¡Recibido! Te contactamos pronto.':'¡Recibido! Te contactamos pronto. Si quieres, también puedes escribirnos por WhatsApp.'; })
        .catch(function(){ st.textContent='Guardado. Si no te contactamos en un rato, escríbenos por WhatsApp para asegurar tu solicitud.'; });
    });
  }

  wire('distForm','d-res','d-out','d-st','d-wa-btn','Nuevo distribuidor · Al Campo', function(){
    var L=['Solicitud de distribuidor · Al Campo',
      'Empresa: '+val('d-emp'),
      'Contacto: '+val('d-con'),
      'WhatsApp: '+val('d-wa')];
    if(val('d-email')) L.push('Correo: '+val('d-email'));
    L.push('Ciudad y estado: '+val('d-ciu'),
      'Tipo de negocio: '+val('d-tipo'),
      'Almacén seco y techado: '+val('d-alm'));
    if(val('d-msg')) L.push('Zona y volumen: '+val('d-msg'));
    return L.join('\n');
  });

  wire('cliForm','c-res','c-out','c-st','c-wa-btn','Nuevo pedido · Al Campo', function(){
    var L=['Pedido · Al Campo',
      'Nombre: '+val('c-nom'),
      'WhatsApp: '+val('c-wa')];
    if(val('c-email')) L.push('Correo: '+val('c-email'));
    L.push('Ciudad: '+val('c-ciu'),
      'Producto: '+val('c-prod'));
    if(val('c-pres')) L.push('Presentación: '+val('c-pres'));
    L.push('Cantidad: '+val('c-cant'));
    if(val('c-msg')) L.push('Comentario: '+val('c-msg'));
    return L.join('\n');
  });

  wire('expForm','e-res','e-out','e-st','e-wa-btn','Solicitud de exportación · Al Campo', function(){
    var L=['Solicitud de exportación · Al Campo',
      'Empresa: '+val('e-emp'),
      'Contacto: '+val('e-con'),
      'Correo: '+val('e-email')];
    if(val('e-wa')) L.push('Teléfono: '+val('e-wa'));
    L.push('País de destino: '+val('e-pais'));
    L.push('Producto: '+val('e-prod'));
    if(val('e-vol')) L.push('Volumen mensual: '+val('e-vol'));
    if(val('e-dest')) L.push('Puerto o destino: '+val('e-dest'));
    if(val('e-msg')) L.push('Mensaje: '+val('e-msg'));
    return L.join('\n');
  });

  /* ---- Copiar ---- */
  document.addEventListener('click', function(e){
    var b=e.target.closest('[data-copy]'); if(!b) return;
    var ta=document.getElementById(b.getAttribute('data-copy'));
    var st=b.closest('.result').querySelector('.status');
    function fallback(){ ta.focus(); ta.select(); if(st) st.textContent='Selecciona el texto y cópialo.'; }
    try{ navigator.clipboard.writeText(ta.value).then(function(){ if(st) st.textContent='Resumen copiado.'; }, fallback); }
    catch(_){ fallback(); }
  });
})();

(function(){
  var $=function(i){return document.getElementById(i)};
  var NUM='584141128181', URL='https://carbonalcampo.com/#parrillero', URL_=window.URL;
  var cur=null,cardFile=null,cardBlob=null,tmr=null,logo=new Image(),logoOk=false;
  logo.onload=function(){logoOk=true;schedule()};logo.src='assets/logo.png';
  function schedule(){clearTimeout(tmr);cardFile=null;cardBlob=null;if(dlg){dlg.remove();dlg=null}tmr=setTimeout(render,200)}
  function wrap(ctx,t,x,y,maxW,lh){
    var words=t.split(' '),line='',lines=[];
    words.forEach(function(w){var test=line?line+' '+w:w;if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=w}else{line=test}});
    if(line)lines.push(line);
    lines.forEach(function(l,i){ctx.fillText(l,x,y+i*lh)});
    return y+lines.length*lh;
  }
  function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
  function render(){
    if(!cur||!logoOk)return;
    var snap=cur;
    var go=function(){
      var W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;
      var x=cv.getContext('2d'),DISP='Anton,"Liberation Sans Narrow","DejaVu Sans Condensed",Impact,sans-serif',BODY='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',MONO='"Space Mono","DejaVu Sans Mono",monospace';
      x.fillStyle='#0C0B0A';x.fillRect(0,0,W,H);
      var g=x.createRadialGradient(880,300,0,880,300,760);g.addColorStop(0,'rgba(255,90,35,.30)');g.addColorStop(1,'rgba(255,90,35,0)');
      x.fillStyle=g;x.fillRect(0,0,W,H);
      x.strokeStyle='rgba(255,241,224,.16)';x.lineWidth=2;rr(x,30,30,W-60,H-60,36);x.stroke();
      x.textBaseline='alphabetic';
      var lh=150,lw=Math.round(logo.naturalWidth*lh/logo.naturalHeight);
      x.drawImage(logo,84,84,lw,lh);
      x.fillStyle='#F1EBE0';x.font='92px '+DISP;x.fillText('AL CAMPO',84+lw+34,168);
      x.fillStyle='#FF8A3D';x.font='700 28px '+MONO;if('letterSpacing' in x)x.letterSpacing='8px';x.fillText('LA MEJOR BRASA',84+lw+36,218);
      x.fillStyle='#A79F92';x.font='700 30px '+MONO;if('letterSpacing' in x)x.letterSpacing='6px';x.fillText('MI PRÓXIMO ASADO',84,400);
      if('letterSpacing' in x)x.letterSpacing='0px';
      var fs=124,hl=snap.pack.toUpperCase(),maxW=W-168;
      function cnt(sz){x.font=sz+'px '+DISP;var w=hl.split(' '),l='',n=1;w.forEach(function(t){var q=l?l+' '+t:t;if(x.measureText(q).width>maxW&&l){n++;l=t}else{l=q}});return n}
      while(fs>56&&cnt(fs)>2)fs-=4;
      x.fillStyle='#FF8A3D';x.font=fs+'px '+DISP;
      var y=wrap(x,hl,84,455+fs,maxW,Math.round(fs*1.1));
      x.fillStyle='#F1EBE0';x.font='500 44px '+BODY;
      var info=snap.c+(snap.c===1?' comensal':' comensales')+' · '+snap.m+' · '+snap.a;
      wrap(x,info,84,y+30,maxW,58);
      var bx=84,bw=W-168,bh=270,by=H-190-40-bh;
      x.fillStyle='#131110';rr(x,bx,by,bw,bh,24);x.fill();
      x.strokeStyle='rgba(255,241,224,.28)';x.lineWidth=2;rr(x,bx,by,bw,bh,24);x.stroke();
      x.fillStyle='#FF8A3D';x.font='700 26px '+MONO;if('letterSpacing' in x)x.letterSpacing='5px';x.fillText('VEREDICTO DEL PARRILLERO',bx+40,by+62);
      if('letterSpacing' in x)x.letterSpacing='0px';
      x.fillStyle='#F1EBE0';x.font='700 44px '+BODY;wrap(x,snap.v,bx+40,by+130,bw-80,58);
      x.strokeStyle='rgba(255,241,224,.2)';x.lineWidth=2;x.beginPath();x.moveTo(84,H-190);x.lineTo(W-84,H-190);x.stroke();
      x.fillStyle='#A79F92';x.font='400 32px '+BODY;x.fillText('Calcula el tuyo en',84,H-125);
      x.fillStyle='#F1EBE0';x.font='700 48px '+BODY;x.fillText('carbonalcampo.com/#parrillero',84,H-60);
      cv.toBlob(function(b){
        if(!b||snap!==cur)return;
        cardBlob=b;
        try{cardFile=new File([b],'mi-asado-al-campo.png',{type:'image/png'})}catch(e){cardFile=null}
      },'image/png');
    };
    if(document.fonts&&document.fonts.load){
      Promise.all([document.fonts.load('92px Anton'),document.fonts.load('700 46px "Hanken Grotesk"'),document.fonts.load('700 28px "Space Mono"')]).then(go,go);
    }else{go()}
  }
  function sel(id){var b=document.querySelector('#'+id+' button[aria-pressed="true"]');return {f:parseFloat(b.dataset.f),n:b.dataset.n}}
  function plural(n,a,b){return n+' '+(n===1?a:b)}
  function calc(){
    var c=+$('pc-c').value,h=+$('pc-h').value,m=sel('pc-carne'),a=sel('pc-apetito');
    var kg=c*a.f*m.f*(0.7+0.15*h);
    $('pc-oc').textContent=c;$('pc-oh').textContent=h;
    $('pc-kg').textContent=(Math.round(kg*2)/2).toString().replace('.',',');
    var n45=Math.floor(kg/4.5),rem=kg-n45*4.5,n3=0,n15=0;
    if(rem>3){n45++}else if(rem>1.5){n3=1}else if(rem>0.2){n15=1}
    var p=[];
    if(n45)p.push(plural(n45,'bolsa','bolsas')+' de 4,5 kg');
    if(n3)p.push('1 bolsa de 3 kg');
    if(n15)p.push('1 bolsa de 1,5 kg');
    var pack=p.join(' + ');
    var v=kg<=3?'Asado íntimo. Una bolsa y sobra brasa para el café.':kg<=9?'Parrillada seria. Nadie se va con hambre.':kg<=20?'Esto ya es un evento. Avisa a los vecinos antes de que lo hagan ellos.':'Cuñado con parrilla de dos metros detectado. Compra y reza.';
    $('pc-pack').textContent=pack;$('pc-ver').textContent=v;
    cur={pack:pack,c:c,m:m.n,a:a.n,v:v};schedule();
    var share='Mi próximo asado:\n\n'+plural(c,'comensal','comensales')+', '+m.n+', '+a.n+'.\n\nVeredicto: '+v.charAt(0).toLowerCase()+v.slice(1)+'\n\nNecesitamos '+pack+' de carbón Al Campo.\n\nCalcula el tuyo: '+URL;
    var order='Hola, quiero comprar carbón Al Campo para un asado de '+plural(c,'comensal','comensales')+': '+pack+'.';
    $('pc-share').href='https://wa.me/?text='+encodeURIComponent(share);
    $('pc-order').href='https://wa.me/'+NUM+'?text='+encodeURIComponent(order);
  }
  ['pc-carne','pc-apetito'].forEach(function(g){
    $(g).addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      [].forEach.call(document.querySelectorAll('#'+g+' button'),function(x){x.setAttribute('aria-pressed','false')});
      b.setAttribute('aria-pressed','true');calc();
    });
  });
  ['pc-c','pc-h'].forEach(function(i){$(i).addEventListener('input',calc)});
  var mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/i.test(navigator.platform));
  $('pc-share').addEventListener('click',function(e){
    if(mobile&&cardFile&&navigator.canShare&&navigator.canShare({files:[cardFile]})){
      e.preventDefault();
      navigator.share({files:[cardFile],text:'Calcula el tuyo: '+URL}).catch(function(){});
      return;
    }
    if(!mobile&&cardBlob){
      e.preventDefault();
      var copied=false;
      try{
        if(navigator.clipboard&&window.ClipboardItem){
          navigator.clipboard.write([new ClipboardItem({'image/png':cardBlob})]).then(function(){copied=true;stat.textContent='Imagen copiada'},function(){stat.textContent='No se pudo copiar. Guárdala con el botón de abajo.'});
        }
      }catch(er){}
      showDlg();
    }
  });
  var dlg=null,stat=document.createElement('p');
  function showDlg(){
    if(!dlg){
      dlg=document.createElement('div');
      dlg.style.cssText='position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(30,20,10,.55)';
      var box=document.createElement('div');
      box.style.cssText='max-width:430px;width:100%;max-height:94vh;overflow:auto;background:#FFFFFF;border:1px solid rgba(40,26,12,.22);border-radius:20px;padding:1.2rem;color:#1A1714;font-family:inherit;text-align:center';
      var im=document.createElement('img');im.alt='Tu asado';im.style.cssText='width:56%;max-width:240px;border-radius:12px;display:block;margin:0 auto .9rem';
      im.src=URL_.createObjectURL(cardBlob);
      var t=document.createElement('p');t.style.cssText='margin:0 0 .4rem;font-weight:700;font-size:1.1rem';t.textContent='Tu imagen está lista';
      stat.style.cssText='margin:0 0 .8rem;color:#C2410C;font-size:.95rem';
      var st=document.createElement('p');st.style.cssText='margin:0 0 1rem;font-size:.95rem;line-height:1.5;color:#5C554B';
      st.innerHTML='1. Abre WhatsApp.<br>2. Elige el chat.<br>3. Pega la imagen con <b style="color:#1A1714">Cmd+V</b> (Ctrl+V en Windows) y envía.';
      var go=document.createElement('a');go.className='btn btn-ember';go.target='_blank';go.rel='noopener';go.textContent='Abrir WhatsApp';
      go.href='https://wa.me/?text='+encodeURIComponent('Calcula el tuyo: '+URL);
      go.style.cssText='display:inline-block;margin:.2rem';
      var cl=document.createElement('button');cl.type='button';cl.className='btn btn-ghost';cl.textContent='Cerrar';cl.style.margin='.2rem';
      cl.onclick=function(){dlg.style.display='none'};
      dlg.onclick=function(ev){if(ev.target===dlg)dlg.style.display='none'};
      box.appendChild(im);box.appendChild(t);box.appendChild(stat);box.appendChild(st);box.appendChild(go);box.appendChild(cl);
      dlg.appendChild(box);document.body.appendChild(dlg);
    }
    dlg.style.display='flex';
  }
  $('pc-img').addEventListener('click',function(){
    if(!cardBlob)return;
    var u=URL_.createObjectURL(cardBlob),a=document.createElement('a');
    a.href=u;a.download='mi-asado-al-campo.png';document.body.appendChild(a);a.click();
    setTimeout(function(){document.body.removeChild(a);URL_.revokeObjectURL(u)},500);
  });
  calc();
})();
