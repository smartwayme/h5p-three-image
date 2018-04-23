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
      initSceneFromImage(H5P.getPath(parameters.file.path, contentId), function (scene) {
        var firstSceneNavButton1 = document.createElement('div');
        firstSceneNavButton1.classList.add('nav-button');
        firstSceneNavButton1.innerText = '+';
        firstSceneNavButton1.addEventListener('click', function () {goToScene(self.secondScene)});
        scene.add(firstSceneNavButton1, {yaw: -5.290342653589794, pitch: 0.25875}, false);

        // Initial setup of scenes
        var firstScene = scene;
        wrapper.appendChild(firstScene.element);
        scene.resize();
        threeSixty = scene;
        threeSixty.startRendering();
        self.firstScene = scene;
      });

      initSceneFromImage(H5P.getPath(parameters.file2.path, contentId), function (scene) {
        var secondScene = scene;

        var secondSceneNavButton1 = document.createElement('div');
        secondSceneNavButton1.classList.add('nav-button');
        secondSceneNavButton1.innerText = '+';
        secondSceneNavButton1.addEventListener('click', function () {goToScene(self.firstScene)});
        secondScene.add(secondSceneNavButton1, {yaw: -5.254092653589793, pitch: -0.39875}, false);

        var secondSceneImageButton = document.createElement('div');
        secondSceneImageButton.classList.add('image-button');
        secondSceneImageButton.innerText = '+';
        secondSceneImageButton.addEventListener('click', function () {
          var img = document.createElement('img');
          img.classList.add('h5p-image-popup');
          img.src = H5P.getPath(parameters.file2image1.path, contentId);
          wrapper.appendChild(img);

          var closeButton = document.createElement('div');
          closeButton.classList.add('h5p-close-button');
          closeButton.innerText = 'X';
          wrapper.appendChild(closeButton);

          closeButton.addEventListener('click', function () {
            wrapper.removeChild(img);
            wrapper.removeChild(closeButton);
          });
        });
        secondScene.add(secondSceneImageButton, {yaw: -8.456592653589793, pitch: -0.04}, false);

        self.secondScene = secondScene;
      });
      initSceneFromImage(H5P.getPath(parameters.file3.path, contentId), function (scene) {
        self.thirdScene = scene;
      });
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
