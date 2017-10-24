class ADSREnvelope {
    
  constructor( options ) {

    this.magnitude = options.magnitude || 1;

    this.audioContext = options.audioContext;
    this.attack = options.attack || 0;
    this.decay = options.decay || 1;
    this.sustain = options.sustain || 1;
    this.release = options.release || 0;

    this.paramMap = new Map();

  }

  start( time = this.audioContext.currentTime ) {


    // console.log( this.param.value )

    this.paramMap.forEach( ( param ) => {

      //pin value
      param.cancelAndHoldAtTime( time );

      // param.cancelScheduledValues( time );

      param.setValueAtTime( 0, time );

      //attack
      if( this.attack > 0 )
        param.linearRampToValueAtTime( this.magnitude, time + this.attack );
      else
        param.setValueAtTime( this.magnitude, time );


      //decay
      if( this.decay > 0 )
        param.exponentialRampToValueAtTime( ( this.sustain * this.magnitude ), time + this.attack + this.decay );
      else
        param.setValueAtTime( ( this.sustain * this.magnitude ), time + this.attack  );

    } );

    

  }

  stop( time = this.audioContext.currentTime ) {

    this.paramMap.forEach( ( param ) => {

      //release
      param.cancelAndHoldAtTime( param.value, time );
      param.linearRampToValueAtTime( 0.0, time + this.release );

    } );

  }

  connect( param ) {

    this.paramMap.set( this.paramMap.size, param );

  }

  disconnect( param ) {

    param.cancelScheduledValues( this.audioContext.currentTime );

  }

}