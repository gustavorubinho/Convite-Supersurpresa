/* ========================================
   CONVITE ROMÂNTICO — Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Referências DOM ----
  const screenQuestion = document.getElementById('screen-question');
  const screenCalendar = document.getElementById('screen-calendar');
  const screenFinal    = document.getElementById('screen-final');
  const btnYes         = document.getElementById('btn-yes');
  const btnNo          = document.getElementById('btn-no');
  const calendarTitle  = document.getElementById('calendar-title');
  const calendarGrid   = document.getElementById('calendar-grid');
  const prevMonth      = document.getElementById('prev-month');
  const nextMonth      = document.getElementById('next-month');
  const timeSection    = document.getElementById('time-section');
  const timeInput      = document.getElementById('time-input');
  const btnConfirm     = document.getElementById('btn-confirm');
  const finalText      = document.getElementById('final-text');
  const finalDetail    = document.getElementById('final-detail');

  // ---- Estado ----
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear  = today.getFullYear();
  let selectedDate = null;

  /* =============================================
     1. BOTÃO "NÃO" — Comportamento de fuga
     ============================================= */

  /**
   * Move o botão NÃO para uma posição aleatória
   * garantindo que fique totalmente visível.
   */
  function runAway() {
    // Na primeira interação, travar o SIM no lugar e tirar o NÃO do fluxo
    if (!btnNo.classList.contains('escaping')) {
      const buttonsDiv = btnNo.parentElement;
      const containerRect = buttonsDiv.getBoundingClientRect();
      // Travar dimensões do container para o SIM não se mover
      buttonsDiv.style.width  = `${containerRect.width}px`;
      buttonsDiv.style.height = `${containerRect.height}px`;
      btnNo.classList.add('escaping');
    }

    const margin = 10;
    const rect = btnNo.getBoundingClientRect();
    const btnW = rect.width;
    const btnH = rect.height;
    const maxX = window.innerWidth  - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;
    const newX = Math.random() * Math.max(maxX, 0) + margin / 2;
    const newY = Math.random() * Math.max(maxY, 0) + margin / 2;

    btnNo.style.left = `${newX}px`;
    btnNo.style.top  = `${newY}px`;
  }

  // Mouse: mover ao entrar (hover)
  btnNo.addEventListener('mouseenter', runAway);

  // Mouse: segurança — mover também no mouseover
  btnNo.addEventListener('mouseover', runAway);

  // Touch: interceptar antes do toque completar
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    runAway();
  }, { passive: false });

  // Reposicionar em resize
  window.addEventListener('resize', () => {
    if (screenQuestion.classList.contains('active')) {
      // Garantir que o botão não fique fora da tela após resize
      const rect = btnNo.getBoundingClientRect();
      const maxX = window.innerWidth  - rect.width  - 10;
      const maxY = window.innerHeight - rect.height - 10;
      if (rect.left > maxX || rect.top > maxY) {
        runAway();
      }
    }
  });

  /* =============================================
     2. BOTÃO "SIM" — Transição para calendário
     ============================================= */

  btnYes.addEventListener('click', () => {
    switchScreen(screenQuestion, screenCalendar);
    renderCalendar();
    updateNavButtons();
  });

  /* =============================================
     3. CALENDÁRIO INTERATIVO
     ============================================= */

  const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  function renderCalendar() {
    calendarTitle.textContent = `${MESES[currentMonth]} ${currentYear}`;

    // Limpar grid e adicionar cabeçalho de dias da semana
    calendarGrid.innerHTML = '';
    DIAS_SEMANA.forEach(d => {
      const el = document.createElement('span');
      el.className = 'day-name';
      el.textContent = d;
      calendarGrid.appendChild(el);
    });

    const firstDay  = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Espaços em branco antes do dia 1
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'day empty';
      calendarGrid.appendChild(empty);
    }

    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('span');
      dayEl.className = 'day';
      dayEl.textContent = d;

      const thisDate = new Date(currentYear, currentMonth, d);
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Desabilitar datas passadas
      if (thisDate < todayMidnight) {
        dayEl.classList.add('disabled');
      } else {
        // Marcar hoje
        if (thisDate.getTime() === todayMidnight.getTime()) {
          dayEl.classList.add('today');
        }

        // Marcar selecionado
        if (selectedDate &&
            selectedDate.getDate() === d &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear) {
          dayEl.classList.add('selected');
        }

        dayEl.addEventListener('click', () => selectDate(d, dayEl));
      }

      calendarGrid.appendChild(dayEl);
    }
  }

  function selectDate(day, el) {
    selectedDate = new Date(currentYear, currentMonth, day);

    // Remover seleção anterior
    calendarGrid.querySelectorAll('.day.selected').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');

    // Mostrar seção de horário
    timeSection.style.display = 'block';
    timeSection.style.animation = 'fadeInUp 0.5s ease both';

    // Mostrar botão confirmar
    btnConfirm.style.display = 'inline-block';
    btnConfirm.style.animation = 'fadeInUp 0.5s 0.15s ease both';
  }

  // Limites do calendário: setembro e outubro de 2026
  const MIN_MONTH = 8;  // Setembro (0-indexed)
  const MAX_MONTH = 9;  // Outubro
  const CAL_YEAR  = 2026;

  function updateNavButtons() {
    prevMonth.style.visibility = (currentMonth <= MIN_MONTH && currentYear <= CAL_YEAR) ? 'hidden' : 'visible';
    nextMonth.style.visibility = (currentMonth >= MAX_MONTH && currentYear >= CAL_YEAR) ? 'hidden' : 'visible';
  }

  // Navegação entre meses (limitada)
  prevMonth.addEventListener('click', () => {
    if (currentMonth > MIN_MONTH || currentYear > CAL_YEAR) {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar();
      updateNavButtons();
    }
  });

  nextMonth.addEventListener('click', () => {
    if (currentMonth < MAX_MONTH || currentYear < CAL_YEAR) {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar();
      updateNavButtons();
    }
  });

  /* =============================================
     4. CONFIRMAÇÃO — Tela final
     ============================================= */

  btnConfirm.addEventListener('click', () => {
    if (!selectedDate) return;

    const hora = timeInput.value || '19:00';
    const dataFormatada = selectedDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Capitalizar primeira letra
    const dataCapitalized = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

    finalText.textContent = 'Encontro marcado!';
    finalDetail.textContent = `${dataCapitalized} às ${hora}`;

    // Montar link do WhatsApp
    const telefone = '5511986798351';
    const mensagem = encodeURIComponent(`Aceito sair com você! Nosso encontro: ${dataCapitalized} às ${hora}`);
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    btnWhatsapp.href = `https://wa.me/${telefone}?text=${mensagem}`;

    switchScreen(screenCalendar, screenFinal);
  });

  /* =============================================
     5. TRANSIÇÃO ENTRE TELAS
     ============================================= */

  function switchScreen(from, to) {
    from.classList.remove('active');
    // Pequeno delay para a saída acontecer antes da entrada
    setTimeout(() => to.classList.add('active'), 100);
  }

  /* =============================================
     6. CONFETES / CORAÇÕES
     ============================================= */

  function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const symbols = ['♥', '♡', '•', '✦', '✧'];
    const total = 50;

    for (let i = 0; i < total; i++) {
      const el = document.createElement('span');
      el.className = 'confetti';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
      el.style.animationDuration = `${Math.random() * 2 + 2}s`;
      el.style.animationDelay = `${Math.random() * 1.5}s`;
      container.appendChild(el);

      // Remover após animação
      setTimeout(() => el.remove(), 5000);
    }

    // Segunda onda de confetes
    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        const el = document.createElement('span');
        el.className = 'confetti';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = `${Math.random() * 100}%`;
        el.style.fontSize = `${Math.random() * 1.2 + 0.8}rem`;
        el.style.animationDuration = `${Math.random() * 2 + 2}s`;
        el.style.animationDelay = `${Math.random() * 0.8}s`;
        container.appendChild(el);
        setTimeout(() => el.remove(), 5000);
      }
    }, 1500);
  }

  /* =============================================
     7. CORAÇÕES FLUTUANTES NO FUNDO
     ============================================= */

  function createBgHeart() {
    const container = document.getElementById('bg-hearts');
    const el = document.createElement('span');
    el.className = 'bg-heart';
    el.textContent = '♥';
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
    el.style.animationDuration = `${Math.random() * 8 + 8}s`;
    el.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(el);

    // Reciclar
    setTimeout(() => {
      el.remove();
      createBgHeart();
    }, 18000);
  }

  // Iniciar alguns corações de fundo
  for (let i = 0; i < 8; i++) {
    setTimeout(createBgHeart, i * 1200);
  }
});
