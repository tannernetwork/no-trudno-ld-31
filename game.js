function Game(root)
{
	this.root = root;
	this.context = root.getContext('2d');

	this.assets = {};

	this.resize();

	this.resolution = [window.innerWidth, window.innerHeight];

	window.AudioContext = window.AudioContext||window.webkitAudioContext;
    this.audiocontext = new AudioContext();

	window.onresize = this.resize.bind(this);
	window.onkeydown = this.keydown.bind(this);
	window.onkeyup = this.keyup.bind(this);

	this.root.onmousedown = this.mousedown.bind(this);
	this.root.onmouseup = this.mouseup.bind(this);
	this.root.onmousemove = this.mousemove.bind(this);

	this.selectScene(PreloaderScene);

	requestAnimationFrame(this.render.bind(this));
	this.update();
	
	this.lastfpsdelay = 0;
	this.lastfps = 0;
	this.loaded = false;

}

Game.prototype = {
	loadImage: function(assetURI)
	{
		if(this.assets[assetURI])
			return;
		this.assets[assetURI] = {};
		this.assets[assetURI].ready = false;
		this.assets[assetURI].asset = new Image();
		this.assets[assetURI].asset.src = assetURI;
		this.assets[assetURI].asset.onload = function ()
		{
			this.assets[assetURI].ready = true;
		}.bind(this);
	},

	loadAudio: function(assetURI)
	{
		if(this.assets[assetURI])
			return;
		this.assets[assetURI] = {};
		this.assets[assetURI].ready = false;
		var request = new XMLHttpRequest();
		request.open('GET', assetURI, true);
		request.responseType = 'arraybuffer';
		var game = this;
		request.onload = function() {
			game.audiocontext.decodeAudioData(request.response, function(buffer){
				game.assets[assetURI].asset = buffer;
				game.assets[assetURI].ready = true;
				console.log(assetURI+' / ready');
			});
		};
		request.send();
	},

	update: function (time)
	{
		currentTime = Date.now();
		if(this.resolution[0] != window.innerWidth || this.resolution[1] != window.innerHeight)
		{
			this.resolution = [window.innerWidth, window.innerHeight];
			this.resize();
		}
		this.scene.update(currentTime);

		//...
		nextUpdate = 100-(currentTime - time); //100ms
		if(nextUpdate < 1) nextUpdate = 1;
		setTimeout(function(){
			this.update(currentTime)
		}.bind(this), nextUpdate);
	},

	render: function (time)
	{
		currentTime = Date.now();
		this.context.clearRect(0, 0, this.root.width, this.root.height);

		this.scene.render(currentTime);

		//fps
		if(this.lastfpsdelay > 10)
		{
		this.lastfps = Math.floor(1000/(currentTime - time));
		this.lastfpsdelay = 0;
		}
		this.context.font = "15px Arial";
		this.context.fillStyle = "#030";
		this.context.fillText(this.lastfps, 10, 20);
		this.lastfpsdelay++;
		//...
		requestAnimationFrame(this.render.bind(this, currentTime));
	},
	resize: function ()
	{
		if(this.scene && this.scene.resize)
			this.scene.resize()
		this.root.width = window.innerWidth;
		this.root.height = window.innerHeight - 50;
		console.log(this.root.width+':'+this.root.height);
	},

	selectScene: function (scene)
	{
		this.scene = new scene(this);
	},

	keydown: function(e)
	{
		this.scene.keydown(e);
		//e.preventDefault();
	},

	keyup: function(e)
	{
		//this.scene.keyup(e);
	},

	mousedown: function(e)
	{
		this.scene.mousedown(e);
		e.preventDefault();
	},

	mouseup: function(e)
	{
		//this.scene.mouseup(e);
		e.preventDefault();
	},

	mousemove: function(e)
	{
		this.scene.mousemove(e);
	}
};

(function (){
	window.onload = function ()
	{
		var canvas = document.getElementById('game');
		var g = new Game(canvas);
	}
})();