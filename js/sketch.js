
//create audio context
const audioContext = new AudioContext();

//setup analyser
const analyser = audioContext.createAnalyser();
analyser.fftSize = 128;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array( bufferLength );

analyser.getByteTimeDomainData( dataArray );

//setup oscillator
const oscillator = audioContext.createOscillator();
oscillator.frequency = 440;
oscillator.type = "sine";
oscillator.start();

//setup a master gain
const masterGain = audioContext.createGain();
masterGain.connect( analyser );
masterGain.connect( audioContext.destination );
oscillator.connect( masterGain );

masterGain.gain.value = 0;

//setup ADSR
const envelope = new ADSREnvelope( {audioContext: audioContext} );
envelope.attack = 3;
envelope.decay = 2;
envelope.sustain = .5;
envelope.release = 2;
envelope.connect( masterGain.gain );

const pitchEnvelope = new ADSREnvelope( {audioContext: audioContext} );
pitchEnvelope.attack = 3;
pitchEnvelope.decay = 2;
pitchEnvelope.sustain = 1;
pitchEnvelope.release = 2;
pitchEnvelope.magnitude = 1200;

pitchEnvelope.connect( oscillator.detune );


function setup() {

	const oscWaveformElement = document.querySelector( "#osc-waveform" );

	oscWaveformElement.addEventListener( "change", function( event ){

		event.preventDefault();

		oscillator.type = event.target.value;

	});


	createCanvas( windowWidth, windowHeight );

}

function mousePressed(){

	envelope.start();
	pitchEnvelope.start();

}

function mouseReleased() {

	envelope.stop();
	pitchEnvelope.stop();

}

function draw() {

	fill( 0 );
	noStroke();
	rect( 0, 0, windowWidth, windowHeight );

	noFill();
	stroke( 255, 255, 255 );

	//draw waveform
	let x = 0;
	let sliceWidth = windowWidth / bufferLength;

	analyser.getByteTimeDomainData( dataArray );

	for( var i = 0; i < bufferLength; i++ ) {

		let v = ( dataArray[ i ] / 128 );

		quad( i * sliceWidth, windowHeight * .5, windowHeight, 100 * v );

	}

	ellipse( mouseX, mouseY, 80, 80 );



}
