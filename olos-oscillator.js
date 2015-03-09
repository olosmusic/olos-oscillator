(function(params){

  Polymer('olos-oscillator', {

    oscType: 'sine',
    freq: 440,

    // TO DO - make these work
    /**
     * color
     * @property color
     * @type {String} 
     * @default #00CCFF
     */
    color: '#00CCFF',
    /**
     * Width of module
     * @property width
     * @type {Number}
     * @default 300
     */
    width: 100,
    /**
     * Height
     * @property height
     * @type {Number}
     * @default 200
     */
    height: 100,
    playing: false,

    // inputs and outputs
    inputFreq: null,
    output: null,

    rootfolder: '../olos-oscillator/',

    ready: function() {
      var self = this;
      self._audioContext = audioContext;
      self.playing = false;

      self.inputFreq = audioContext.createGain();
      self.output = audioContext.createGain();
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
      self.output = obj;
    },

    _initOsc: function() {
      var self = this;
      if (!self._osc) {
        var now = audioContext.currentTime;
        self._osc = self._audioContext.createOscillator();
        self._osc.type = this.oscType;
        self._osc.frequency.exponentialRampToValueAtTime(this.freq, now);

        if (self.output) {
          self._osc.connect(self.output);
        }
      }
    },

    setType: function(e, detail){
      if (detail.isSelected) {
        this.oscType = detail.item.innerText.toLowerCase();
        if (this._osc){
          this._osc.type = this.oscType;
        }
      }
    },

    setFreq: function(e, detail){
      var self = this;
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      this.freq = self.sliderValue;
      if (self._osc) {
        var now = audioContext.currentTime;
        self._osc.frequency.exponentialRampToValueAtTime(this.freq, now + 0.1);
      }
    },

    stopProp: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    publicAudio: function() {
      
    },

    publicAudioChanged: function() {
      this.publicAudio();
    },

    inputFreqChanged: function() {
      for (var i = 0; i < this.inputFreq.length; i++) {
        if (this.inputFreq[i] > 0) {
          this.sliderValue = nx.mtof( this.inputFreq[i] );
          this.setFreq();
        }
      }
    },

    update: function() {
      // console.log('hi');
      this.inputFreqChanged();
    }


  });

})();