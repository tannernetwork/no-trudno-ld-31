function PreloaderScene (game)
{
	this.game = game;
	this.context = game.context;

	this.game.loadImage('assets/preloaderload.png');
	this.game.loadImage('assets/tileset.png');
	this.game.loadImage('assets/heroes.png');
	this.game.loadImage('assets/fuel.png');
	this.game.loadImage('assets/cave.png');
	this.game.loadImage('assets/preloaderbg.png');
	this.game.loadAudio('assets/music.mp3');

	this.ready = false;
}

PreloaderScene.prototype = {
	update: function ()
	{
		var loaded = true;
		for(asset in this.game.assets)
		{
			if(!this.game.assets[asset].ready)
			{
				loaded = false;
				break;
			}
		}
		if(loaded)
		{
			setTimeout(function(){
				this.ready = true;
			}.bind(this), 100);
		}
	},

	render: function (time)
	{
		this.context.drawImage(this.game.assets['assets/preloaderload.png'].asset, this.game.root.width - 1400, this.game.root.height - 700)
		for(i = 0; i < 1000; i++)
		{
			var number = Math.floor( Math.random() * 128 );
			var x = Math.floor(Math.random()*this.game.root.width);
			var y = Math.floor(Math.random()*this.game.root.height);
			this.context.fillStyle = "rgba(" + number + "," + number + "," + number + ",0.6)";
			this.context.fillRect(1*x,1*y,1,1);
		}

		this.context.save();

		this.context.shadowOffsetX = 0;
		this.context.shadowOffsetY = 0;
		this.context.shadowBlur = 2;
		this.context.shadowColor = "rgba(200,200,200,"+Math.abs(Math.sin(time/2000))+")";
		if(this.ready)
		{
			//this.context.shadowColor = "rgba(255,215,0,"+Math.abs(Math.sin(time/2000))+")";
			this.context.shadowColor = "rgba(16,170,255,"+Math.abs(Math.sin(time/2000))+")";
			this.context.font = "bold 32px Arial";
			this.context.fillStyle = "rgba(23,23,23,1)";
			this.context.textAlign = 'right';
			this.context.fillText('PRESS ANY KEY.', this.game.root.width - 120, this.game.root.height - 60);
		}
		else
		{
			this.context.font = "bold 32px Arial";
			this.context.fillStyle = "rgba(23,23,23,"+Math.abs(Math.sin(time/1000))+")";
			this.context.textAlign = 'right';
			this.context.fillText('LOADING...', this.game.root.width - 120, this.game.root.height - 60);
		}

		this.context.restore();
	},

	keydown: function(e)
	{
		if(this.ready)
			this.game.selectScene(IntroScene);
	},

	mousedown: function(e)
	{
		if(this.ready)
			this.game.selectScene(IntroScene);
	},

	mousemove: function(e)
	{
		
	}
}