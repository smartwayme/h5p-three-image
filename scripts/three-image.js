H5P.ThreeImage = (function (EventDispatcher, ThreeSixty) {

  /**
   * The 360 degree panorama viewer with support for virtual reality.
   *
   * @class H5P.ThreeSixty
   * @extends H5P.EventDispatcher
   * @param {DOMElement} sourceElement video or image source
   * @param {number} ratio Display ratio of the viewport
   * @param {Function} [sourceNeedsUpdate] Determines if the source texture needs to be rerendered.
   */
  function ThreeImage(parameters, contentId) {
    /** @alias H5P.ThreeImage# */
    var self = this;

    // Initialize event inheritance
    EventDispatcher.call(self);

    var wrapper, threeSixty;

    /**
     * Create the needed DOM elements
     *
     * @private
     */
    var createElements = function () {
      // Create wrapper
      wrapper = document.createElement('div');
      wrapper.classList.add('h5p-three-sixty-wrapper');

      // Create source image
      initSceneFromImage(H5P.getPath(parameters.sphere.path, contentId), function (scene) {
        addNavButtonToScene(scene, -5.290342653589794, 0.25875, function () {
          goToScene(self.secondScene);
        });

        addNavButtonToScene(scene, -2.1340926535897933, 0.375, function () {
          goToScene(self.fourthScene);
        });
        addImageButtonToScene(scene, -10.055342653589792, -0.21625, parameters.sphere1image1.path);

        // Initial setup of scenes
        wrapper.appendChild(scene.element);
        scene.resize();
        threeSixty = scene;
        threeSixty.startRendering();
        self.firstScene = scene;
      });

      initSceneFromImage(H5P.getPath(parameters.sphere2.path, contentId), function (scene) {
        addNavButtonToScene(scene, -5.254092653589793, -0.39875, function () {
          goToScene(self.firstScene);
        });

        addNavButtonToScene(scene, -5.266592653589793, -0.71625, function () {
          goToScene(self.thirdScene);
        });
        addImageButtonToScene(scene, -8.382842653589792, 1.46375, parameters.sphere2image1.path);
        addImageButtonToScene(scene, -8.416592653589793, 1.12, parameters.sphere2image2.path);
        addImageButtonToScene(scene, -8.456592653589793, -0.04, parameters.sphere2image3.path);
        self.secondScene = scene;
      });

      initSceneFromImage(H5P.getPath(parameters.sphere3.path, contentId), function (scene) {
        addNavButtonToScene(scene, -2.115342653589793, 0.42, function () {
          goToScene(self.secondScene);
        });
        addImageButtonToScene(scene, -8.525342653589792, 0.32, parameters.sphere3image1.path);
        addImageButtonToScene(scene, -8.322842653589792, -0.7275, parameters.sphere3image2.path);
        addImageButtonToScene(scene, -8.256592653589793, -0.4625, parameters.sphere3image3.path);
        self.thirdScene = scene;
      });

      initSceneFromImage(H5P.getPath(parameters.sphere4.path, contentId), function (scene) {
        addNavButtonToScene(scene, -5.2740926535897925, -0.57125, function () {
          goToScene(self.firstScene);
        });

        self.fourthScene = scene;
      });
    };

    var addImageButtonToScene = function (scene, yaw, pitch, imagePath) {
      var navButtonWrapper = document.createElement('div');
      navButtonWrapper.classList.add('nav-button-wrapper');

      var outerNavButton = document.createElement('div');
      outerNavButton.classList.add('outer-nav-button');
      navButtonWrapper.appendChild(outerNavButton);

      var navButton = document.createElement('div');
      navButton.classList.add('nav-button');
      navButtonWrapper.appendChild(navButton);

      var navButtonIcon = document.createElement('img');
      navButtonIcon.src = self.getLibraryFilePath('assets/image.svg');
      navButtonIcon.classList.add('nav-button-icon');
      navButton.appendChild(navButtonIcon);

      var navButtonPulsar = document.createElement('div');
      navButtonPulsar.classList.add('nav-button-pulsar');
      navButtonPulsar.addEventListener('click', function () {
        var popup = document.createElement('div');
        popup.classList.add('h5p-image-popup');

        var img = document.createElement('img');
        img.classList.add('h5p-image');
        img.src = H5P.getPath(imagePath, contentId);
        popup.appendChild(img);

        addCloseButton(popup);

        wrapper.appendChild(popup);
      });
      navButtonWrapper.appendChild(navButtonPulsar);

      scene.add(navButtonWrapper, {yaw: yaw, pitch: pitch}, false);
    };

    var addNavButtonToScene = function (scene, yaw, pitch, callback) {
      var navButtonWrapper = document.createElement('div');
      navButtonWrapper.classList.add('nav-button-wrapper');

      var outerNavButton = document.createElement('div');
      outerNavButton.classList.add('outer-nav-button');
      navButtonWrapper.appendChild(outerNavButton);

      var navButton = document.createElement('div');
      navButton.classList.add('nav-button');
      navButtonWrapper.appendChild(navButton);

      var navButtonIcon = document.createElement('img');
      navButtonIcon.src = self.getLibraryFilePath('assets/navigation.svg');
      navButtonIcon.classList.add('nav-button-icon');
      navButton.appendChild(navButtonIcon);

      var navButtonPulsar = document.createElement('div');
      navButtonPulsar.classList.add('nav-button-pulsar');
      navButtonPulsar.addEventListener('click', function () {callback()});
      navButtonWrapper.appendChild(navButtonPulsar);

      scene.add(navButtonWrapper, {yaw: yaw, pitch: pitch}, false);
    };

    var addCloseButton = function (popup) {
      var navButtonWrapper = document.createElement('div');
      navButtonWrapper.classList.add('nav-button-wrapper');

      var outerNavButton = document.createElement('div');
      outerNavButton.classList.add('outer-nav-button');
      navButtonWrapper.appendChild(outerNavButton);

      var navButton = document.createElement('div');
      navButton.classList.add('nav-button');
      navButtonWrapper.appendChild(navButton);

      var navButtonIcon = document.createElement('img');
      navButtonIcon.src = self.getLibraryFilePath('assets/navigation.svg');
      navButtonIcon.classList.add('nav-button-icon');
      navButton.appendChild(navButtonIcon);

      var navButtonPulsar = document.createElement('div');
      navButtonPulsar.classList.add('nav-button-pulsar');
      navButtonPulsar.addEventListener('click', function () {
        wrapper.removeChild(popup);
      });
      navButtonWrapper.appendChild(navButtonPulsar);

      navButtonWrapper.classList.add('h5p-close-button');
      popup.appendChild(navButtonWrapper);
    };

    var goToScene = function (scene) {
      // Remove all children
      while(wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
      }
      self.firstScene.stopRendering();
      self.secondScene.stopRendering();
      self.thirdScene.stopRendering();

      // Append new scene
      wrapper.appendChild(scene.element);
      scene.resize();
      scene.startRendering();
      threeSixty = scene;
    };

    var initSceneFromImage = function (imagePath, callback) {
      var imageElement = document.createElement('img');
      imageElement.addEventListener('load', function () {
        var scene = new H5P.ThreeSixty(this, 16/9);
        callback(scene);
      });
      imageElement.src = imagePath;
    };

    /**
     * Attach the image viewer to the H5P container.
     *
     * @param {H5P.jQuery} $container
     */
    self.attach = function ($container) {
      if (!wrapper) {
        createElements();
      }

      // Append elements to DOM
      $container[0].appendChild(wrapper);
      $container[0].classList.add('h5p-three-image');
    };

    // Handle resize
    self.on('resize', function () {
      wrapper.style.height = (wrapper.getBoundingClientRect().width * (9/16)) + 'px';
      if (threeSixty) {
        threeSixty.resize();
      }
    });
  }

  return ThreeImage;
})(H5P.EventDispatcher, H5P.ThreeSixty);
