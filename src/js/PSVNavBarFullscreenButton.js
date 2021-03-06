/**
 * Navigation bar fullscreen button class
 * @param navbar (PSVNavBar) A PSVNavBar object
 */
function PSVNavBarFullscreenButton(navbar) {
  PSVNavBarButton.call(this, navbar);

  this.create();
}

PSVNavBarFullscreenButton.prototype = Object.create(PSVNavBarButton.prototype);
PSVNavBarFullscreenButton.prototype.constructor = PSVNavBarFullscreenButton;

PSVNavBarFullscreenButton.className = 'psv-button fullscreen-button';

/**
 * Creates the button
 * @return (void)
 */
PSVNavBarFullscreenButton.prototype.create = function() {
  PSVNavBarButton.prototype.create.call(this);

  this.container.title = this.psv.config.lang.fullscreen;

  this.container.appendChild(document.createElement('div'));
  this.container.appendChild(document.createElement('div'));

  this.container.addEventListener('click', this.psv.toggleFullscreen.bind(this.psv));

  this.psv.on('fullscreen-updated', this);
};

/**
 * Destroys the button
 */
PSVNavBarFullscreenButton.prototype.destroy = function() {
  this.psv.off('fullscreen-updated', this);

  PSVNavBarButton.prototype.destroy.call(this);
};

/**
 * Handle events
 * @param e (Event)
 */
PSVNavBarFullscreenButton.prototype.handleEvent = function(e) {
  switch (e.type) {
    // @formatter:off
    case 'psv:fullscreen-updated': this.toggleActive(); break;
    // @formatter:on
  }
};
