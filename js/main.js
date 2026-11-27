(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Menú móvil accesible.
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', open);
    });
    $$('a', navLinks).forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('menu-open');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Año del pie de página.
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Aparición discreta al desplazarse; se desactiva si el usuario prefiere movimiento reducido.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    $$('.reveal').forEach(element => observer.observe(element));
  } else {
    $$('.reveal').forEach(element => element.classList.add('is-visible'));
  }

  // Galería: abre únicamente fotografías que existan realmente.
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  const closeLightbox = () => {
    if (lightbox?.open) lightbox.close();
    if (lightboxImage) lightboxImage.src = '';
  };
  $$('.gallery-item').forEach(item => item.addEventListener('click', () => {
    const image = $('img', item);
    if (!image || image.hidden || !image.complete || image.naturalWidth === 0 || !lightbox) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = item.dataset.galleryAlt || image.alt;
    lightboxCaption.textContent = item.dataset.galleryAlt || image.alt;
    lightbox.showModal();
  }));
  $('#lightboxClose')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });

  // Formulario de cotización en cuatro pasos. No almacena ni transmite datos a un servidor.
  const form = $('#quoteForm');
  if (!form) return;
  const steps = $$('.form-step', form);
  const nextButton = $('#nextStep');
  const prevButton = $('#prevStep');
  const sendButton = $('#sendQuote');
  const progressFill = $('#progressFill');
  const stepCount = $('#stepCount');
  const errorBox = $('#formError');
  const dynamicFields = $('#dynamicFields');
  const reviewSummary = $('#reviewSummary');
  let currentStep = 0;

  const fieldTemplates = {
    'Mousepads': [
      ['dimensiones', 'Dimensiones aproximadas', 'text', 'Ej. 20 x ata 30 cm'],
      ['tipo', 'Forma o tipo', 'select', ['Selecciona una opción', 'Cuadrado', 'Rectangular', 'Redondo', 'Ergonómico / con apoyo', 'Otro / No estoy seguro']],
      ['cantidad', 'Cantidad aproximada', 'number', 'Ej. 50'],
      ['detalles', 'Diseño o detalles de personalización', 'textarea', 'Cuéntanos cómo lo imaginas']
    ],
    'Stickers': [
      ['dimensiones', 'Dimensiones aproximadas', 'text', 'Ej. 5 x 5 cm'],
      ['corte', 'Tipo de corte (si lo conoces)', 'select', ['Selecciona una opción', 'Troquelado / forma personalizada', 'Cuadrado o rectangular', 'Circular', 'No lo sé']],
      ['cantidad', 'Cantidad aproximada', 'number', 'Ej. 100'],
      ['detalles', 'Diseño o detalles', 'textarea', 'Cuéntanos sobre el diseño']
    ],
    'Medallas': [
      ['evento', 'Tipo de evento o reconocimiento', 'text', 'Ej. Evento deportivo'],
      ['cantidad', 'Cantidad aproximada', 'number', 'Ej. 30'],
      ['cinta', '¿Requiere cinta?', 'select', ['Selecciona una opción', 'Sí', 'No', 'Por definir']],
      ['detalles', 'Texto o diseño', 'textarea', 'Información que debería llevar']
    ],
    'Estampillas y distintivos': [
      ['tipo', 'Tipo de distintivo', 'text', 'Ej. Insignia, pin o escudo'],
      ['cantidad', 'Cantidad aproximada', 'number', 'Ej. 25'],
      ['detalles', 'Texto, diseño o uso', 'textarea', 'Cuéntanos lo que necesitas']
    ],
    'Estampado textil': [
      ['prenda', 'Tipo de prenda', 'text', 'Ej. Camiseta, buzo, gorra'],
      ['cantidad', 'Cantidad aproximada', 'number', 'Ej. 20'],
      ['tallas', 'Tallas (si aplica)', 'text', 'Ej. S: 5, M: 10, L: 5'],
      ['arte', '¿Ya tienes el diseño o arte?', 'select', ['Selecciona una opción', 'Sí, lo tengo', 'No, necesito orientación', 'Está en proceso']],
      ['detalles', 'Detalles adicionales', 'textarea', 'Cuéntanos sobre tu idea']
    ],
    'Placas y trofeos': [
      ['reconocimiento', 'Tipo de reconocimiento', 'text', 'Ej. Placa o trofeo'],
      ['cantidad', 'Cantidad aproximada', 'number', 'Ej. 10'],
      ['nombres', 'Nombres o texto que debe llevar', 'textarea', 'Puedes escribir los nombres o textos'],
      ['detalles', 'Diseño o detalles', 'textarea', 'Cuéntanos lo que tienes en mente']
    ],
    'Cintas para carné': [
      ['tipo', 'Tipo de cinta', 'text', 'Describe el tipo si lo conoces'],
      ['cantidad', 'Cantidad aproximada', 'number', 'Ej. 100'],
      ['personalizacion', 'Personalización requerida', 'textarea', 'Logos, texto, colores u otros detalles']
    ],
    'Otro / Tengo una idea': [
      ['idea', '¿Qué quieres crear?', 'textarea', 'Describe tu idea'],
      ['cantidad', 'Cantidad aproximada', 'number', 'Si tienes una cantidad estimada'],
      ['dimensiones', 'Dimensiones (si las conoces)', 'text', 'Medidas aproximadas'],
      ['detalles', 'Otros detalles', 'textarea', 'Cuéntanos cualquier otra información']
    ]
  };

  const makeField = ([name, label, type, extra]) => {
    const wrapper = document.createElement('label');
    wrapper.className = `field ${type === 'textarea' ? 'field-full' : ''}`;
    const title = document.createElement('span');
    title.textContent = label;
    wrapper.append(title);
    let control;
    if (type === 'select') {
      control = document.createElement('select');
      extra.forEach((value, index) => {
        const option = document.createElement('option');
        option.value = index === 0 ? '' : value;
        option.textContent = value;
        control.append(option);
      });
    } else if (type === 'textarea') {
      control = document.createElement('textarea');
      control.rows = 3;
      control.maxLength = 600;
      control.placeholder = extra;
    } else {
      control = document.createElement('input');
      control.type = type;
      control.maxLength = type === 'number' ? 8 : 120;
      control.placeholder = extra;
      if (type === 'number') { control.min = '1'; control.step = '1'; }
    }
    control.name = `detalle_${name}`;
    control.dataset.label = label;
    control.autocomplete = 'off';
    wrapper.append(control);
    return wrapper;
  };

  const renderDynamicFields = () => {
    const category = form.elements.categoria.value;
    dynamicFields.replaceChildren();
    (fieldTemplates[category] || fieldTemplates['Otro / Tengo una idea']).forEach(field => dynamicFields.append(makeField(field)));
  };
  $$('input[name="categoria"]', form).forEach(input => input.addEventListener('change', renderDynamicFields));

  const validateStep = () => {
    errorBox.textContent = '';
    if (currentStep === 0) {
      const name = form.elements.nombre;
      const phone = form.elements.telefono;
      const email = form.elements.correo;
      if (!name.value.trim() || !phone.value.trim()) {
        errorBox.textContent = 'Completa tu nombre y tu teléfono o WhatsApp para continuar.';
        (!name.value.trim() ? name : phone).focus();
        return false;
      }
      if (email.value.trim() && !email.checkValidity()) {
        errorBox.textContent = 'Revisa el formato del correo electrónico.';
        email.focus();
        return false;
      }
    }
    if (currentStep === 1 && !form.elements.categoria.value) {
      errorBox.textContent = 'Selecciona una categoría para continuar.';
      $('input[name="categoria"]', form)?.focus();
      return false;
    }
    if (currentStep === 3 && !$('#dataConsent').checked) {
      errorBox.textContent = 'Debes aceptar el uso de tus datos para continuar.';
      $('#dataConsent').focus();
      return false;
    }
    return true;
  };

  const getFormData = () => {
    const data = new FormData(form);
    const details = [];
    $$('[name^="detalle_"]', form).forEach(control => {
      if (control.value.trim()) details.push([control.dataset.label || control.name, control.value.trim()]);
    });
    return {
      nombre: (data.get('nombre') || '').trim(), telefono: (data.get('telefono') || '').trim(),
      correo: (data.get('correo') || '').trim(), empresa: (data.get('empresa') || '').trim(),
      categoria: (data.get('categoria') || '').trim(), details
    };
  };

  const renderReview = () => {
    const data = getFormData();
    reviewSummary.replaceChildren();
    const rows = [
      ['Nombre', data.nombre], ['Teléfono / WhatsApp', data.telefono], ['Correo', data.correo],
      ['Empresa', data.empresa], ['Categoría', data.categoria]
    ].filter(([, value]) => value);
    const section = document.createElement('div');
    section.className = 'review-group';
    rows.forEach(([label, value]) => {
      const row = document.createElement('p');
      const strong = document.createElement('b'); strong.textContent = `${label}: `;
      row.append(strong, document.createTextNode(value)); section.append(row);
    });
    if (data.details.length) {
      const detailTitle = document.createElement('h5'); detailTitle.textContent = 'Detalles del producto'; section.append(detailTitle);
      data.details.forEach(([label, value]) => {
        const row = document.createElement('p'); const strong = document.createElement('b'); strong.textContent = `${label}: `;
        row.append(strong, document.createTextNode(value)); section.append(row);
      });
    }
    reviewSummary.append(section);
  };

  const showStep = step => {
    currentStep = Math.max(0, Math.min(step, steps.length - 1));
    steps.forEach((section, index) => {
      const active = index === currentStep;
      section.hidden = !active;
      section.classList.toggle('is-active', active);
    });
    prevButton.hidden = currentStep === 0;
    nextButton.hidden = currentStep === steps.length - 1;
    sendButton.hidden = currentStep !== steps.length - 1;
    stepCount.innerHTML = `${String(currentStep + 1).padStart(2, '0')} <i>/ 04</i>`;
    progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    errorBox.textContent = '';
    if (currentStep === 3) renderReview();
  };

  nextButton.addEventListener('click', () => { if (validateStep()) showStep(currentStep + 1); });
  prevButton.addEventListener('click', () => showStep(currentStep - 1));
  form.addEventListener('change', () => { if (currentStep === 3) renderReview(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateStep()) return;
    const data = getFormData();
    const lines = [
      'Hola, Lacia Puntocom. Quiero solicitar una cotización.', '',
      '*DATOS DE CONTACTO*', `Nombre: ${data.nombre}`, `Teléfono: ${data.telefono}`,
      data.correo ? `Correo: ${data.correo}` : '', data.empresa ? `Empresa: ${data.empresa}` : '', '',
      '*PRODUCTO O CATEGORÍA*', data.categoria, '', '*DETALLES*',
      ...(data.details.length ? data.details.map(([label, value]) => `${label}: ${value}`) : ['Aún no tengo detalles adicionales.'])
    ].filter(line => line !== undefined);
    const url = `https://wa.me/573162854493?text=${encodeURIComponent(lines.join('\n'))}`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow) window.location.href = url;
  });

  // Los enlaces de categoría precargan la selección en el paso 2.
  $$('.quote-category').forEach(link => link.addEventListener('click', () => {
    const category = link.dataset.category;
    showStep(1);
    const matching = $$('input[name="categoria"]', form).find(input => input.value === category);
    if (matching) { matching.checked = true; renderDynamicFields(); }
  }));

  showStep(0);
})();
