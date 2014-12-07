function DeadScene (game)
{
	this.game = game;
	this.context = game.context;
	this.ready = false;
}

DeadScene.prototype = {
	update: function ()
	{
		setTimeout(function(){this.ready = true}.bind(this), 2000);
	},

	render: function (time)
	{
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
			this.context.shadowColor = "rgba(255,170,16,"+Math.abs(Math.sin(time/2000))+")";
			this.context.font = "bold 32px Arial";
			this.context.fillStyle = "rgba(23,23,23,1)";
			this.context.textAlign = 'right';
			this.context.fillText('YOU\'RE DEAD! PRESS ANY KEY.', this.game.root.width - 120, this.game.root.height - 60);

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