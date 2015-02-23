(function(params){

  // init draggability
  // TO DO: add this to the base element so that everything is draggable

  Polymer('olos-oscillator', {

    oscType: 'sine',
    freq: 440,

    /**
     * color of equalizer bar in HTML color
     * @property color
     * @type {String} 
     * @default #00CCFF
     */
    color: '#00CCFF',
    /**
     * Width of equalizer
     * @property width
     * @type {Number}
     * @default 300
     */
    width: 300,
    /**
     * Height of equalizer
     * @property height
     * @type {Number}
     * @default 200
     */
    height: 100,
    playing: false,
    rootfolder: '../olos-oscillator/',

    ready: function() {
      var self = this;
      self._audioContext = audioContext;
      self.playing = false;
    },

    /**
     * Start oscillator
     */
    start: function(time) {
      var self = this;
      var t = time || self._audioContext.currentTime;
      this.$.start.src = self.rootfolder + "icons/stop.png";
      self._initOsc();
      self._osc.start(t);
    },

    stop: function(time) {
      var self = this;
      var t = time || self._audioContext.currentTime;
      self._osc.stop(t);
      this.$.start.src = self.rootfolder + "icons/play.png";
      self._osc.disconnect();
      self._osc = null;
    },

    _toggleStart: function() {
      if(!this.playing) {
        this.start();
      }
      else {
        this.stop();
      }
      this.playing = !this.playing;
    },

    setOutput: function(obj) {
      var self = this;
      self._osc.connect(obj);
      self._output = obj;
    },

    _initOsc: function() {
      var self = this;
      if (!self._osc) {
        var now = audioContext.currentTime;
        self._osc = self._audioContext.createOscillator();
        self._osc.type = this.oscType;
        self._osc.frequency.exponentialRampToValueAtTime(this.freq, now);
        // DELETE THIS
        self._output = audioContext.destination;

        if (self._output) {
          self._osc.connect(self._output);
        }
      }
    },

    setType: function(e, detail){
      console.log(this);
      if (detail.isSelected) {
        this.oscType = detail.item.innerText.toLowerCase();
        if (this._osc){
          console.log('bang!');
          this._osc.type = oscType;
        }
      }
    },

    setFreq: function(e, detail){
      var self = this;
      console.log(this);
      e.preventDefault();
      e.stopPropagation();

      this.freq = self.sliderValue;
      if (self._osc) {
        var now = audioContext.currentTime;
        self._osc.frequency.exponentialRampToValueAtTime(this.freq, now + 0.1);
      }
    },

    stopProp: function(e) {
      e.preventDefault();
      e.stopPropagation();
      // console.log('stopprop');
    }


  });

})();