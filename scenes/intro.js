function IntroScene (game)
{
	this.game = game;
	this.context = game.context;
	this.ready = false;

	this.lines = [
		"SORRY, YOUR SCREEN IS OUTDATED",
		"PLEASE UPGRADE",
		"LOADING VERSION 0.1 FOR RETARDED SCREENS"
	]
	this.timer = 6000;
}

IntroScene.prototype = {
	update: function ()
	{
		this.timer -= 10;
		if(this.timer <= 0)
			this.game.selectScene(GameScene);
	},

	render: function (time)
	{
		this.context.drawImage(this.game.assets['assets/preloaderbg.png'].asset, this.game.root.width - 1400, this.game.root.height - 700)
		for(i = 0; i < 1000; i++)
		{
			var number = Math.floor( Math.random() * 128 );
			var x = Math.floor(Math.random()*this.game.root.width);
			var y = Math.floor(Math.random()*this.game.root.height);
			this.context.fillStyle = "rgba(" + number + "," + number + "," + number + ",0.6)";
			this.context.fillRect(1*x,1*y,1,1);
		}

		//napisy
		this.context.save();

		this.context.shadowOffsetX = 0;
		this.context.shadowOffsetY = 0;
		this.context.shadowBlur = 2;
		this.context.shadowColor = "rgba(0,0,0,1)";
		this.context.font = "bold 32px Arial";
		this.context.fillStyle = "rgba(230,230,230,1)";
		this.context.textAlign = 'center';
		this.context.fillText(this.lines[Math.floor((Date.now()/1000))%this.lines.length], this.game.root.width/2, this.game.root.height - 60);

		this.context.restore();

	},

	keydown: function(e)
	{
		this.game.selectScene(GameScene);
	},

	mousedown: function(e)
	{
		this.game.selectScene(GameScene);
	},

	mousemove: function(e)
	{
		
	}
}