class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.setupHoverBehavior();
  }

  setupHoverBehavior() {
    const isDesktop = window.matchMedia('(min-width: 990px)');
    
    const enableHover = () => {
      this.addEventListener('mouseenter', this.onMouseEnter.bind(this));
      this.addEventListener('mouseleave', this.onMouseLeave.bind(this));
      this.mainDetailsToggle.querySelector('summary').addEventListener('click', this.onSummaryClick.bind(this));
    };

    const disableHover = () => {
      this.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
      this.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
    };

    if (isDesktop.matches) enableHover();
    
    isDesktop.addEventListener('change', (e) => {
      if (e.matches) enableHover();
      else disableHover();
    });
  }

  onMouseEnter() {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    this.mainDetailsToggle.setAttribute('open', '');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', 'true');
    this.onToggle();
  }

  onMouseLeave() {
    // Retardo suave de 400ms para evitar cierres accidentales al mover el mouse
    this.hoverTimeout = setTimeout(() => {
      this.close();
    }, 400);
  }

  onSummaryClick(event) {
    if (window.matchMedia('(min-width: 990px)').matches) {
      event.preventDefault(); // Evita que el click cierre abruptamente el menú en desktop si ya está abierto
    }
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
