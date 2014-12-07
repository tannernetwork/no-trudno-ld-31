function HeroEntity(game)
{
	this.game = game;
	this.context = game.context;
	this.x = 4;
	this.y = 2;
	this.easystar = new EasyStar.js();
	this.dead = false;
	this.path = [];
	this.health = 120;
	this.timer = 12000; //12000
	this.flip = false;
	this.anim = {
		'idle': [0,0,0,0,0,0,0,1,1],
		'move': [0,2,3,4]
	};
	this.state = 'idle';
}

HeroEntity.prototype = {
	update: function()
	{
		this.timer -= 10;
		if(this.timer <= 0)
		{
			this.game.selectScene(WonScene);
			return;
		}
		if(this.x < 0 || this.x > this.game.scene.world.worldwalk.length-1 || this.y < 0 || this.y > this.game.scene.world.worldwalk[0].length-1 || this.dead || this.health < 1)
		{
			this.health = 0;
			this.dead = true;
			this.game.selectScene(DeadScene);
			return;
		}
		else
		{
			this.health -= 1;

		}

		var omit = 0;
		var breaks = false;
		this.easystar.setGrid(this.game.scene.world.worldwalk);
		this.easystar.setAcceptableTiles([true]);
		if(this.game.scene.items.length)
		{
			while(this.game.scene.items.length-omit > 0)
			{
				endX = this.game.scene.items[this.game.scene.items.length-1-omit][0];
				endY = this.game.scene.items[this.game.scene.items.length-1-omit][1]-1;
				if(endX >= 0 && endX <= this.game.scene.world.worldwalk.length-1 && endY >= 0 && endY <= this.game.scene.world.worldwalk[0].length-1)
				{
					this.easystar.findPath(this.y, this.x, endY, endX, function( path ) {
						if (path !== null)
						{
							if(path.length)
								this.path = path;
							else
							{
								this.path = null;
								this.game.scene.items.splice(this.game.scene.items.length-1-omit, 1);
								this.health += 60;
								if(this.health > 300)
								{
									this.health = 300;
								}
							}
							breaks = true;
						}
						else
						{
							omit++;
						}
					}.bind(this));
					this.easystar.calculate();
				}

				if(this.path !== null && this.path.length > 1)
				{
					var dir = 0;
					if(this.path[1].y - this.x < 0)
					{
						dir = 1;
					}
					else if(this.path[1].y - this.x > 0)
					{
						dir = 2;
					}
					else if(this.path[1].x - this.y > 0)
					{
						dir = 4;
					}
					else if(this.path[1].x - this.y < 0)
					{
						dir = 3;
					}
					if(dir != 0)
					{
						this.state = 'move';
						this.path.shift();
						this.move(dir);
					}
					if(breaks)
					{
						break;
					}
				}
			}
		}
		else
		{
			this.state = 'idle';
		}
	},
	render: function()
	{

		var currentFrame = this.anim[this.state][Math.floor((Date.now()/100))%this.anim[this.state].length];
		
		if(this.flip)
		{
			this.context.translate(100*this.x+this.game.scene.world.centerOffset[0]+100, 100*this.y+this.game.scene.world.centerOffset[1]-100+20);
			this.context.scale(-1, 1);

			this.context.drawImage(
				this.game.assets['assets/heroes.png'].asset,
				200*currentFrame, 0, 200, 200, //ciachanie
				0, 0,
				200, 200
			);
		}
		else
		{
			this.context.drawImage(
				this.game.assets['assets/heroes.png'].asset,
				200*currentFrame, 0, 200, 200, //ciachanie
				100*this.x+this.game.scene.world.centerOffset[0]-100, //x
				100*this.y+this.game.scene.world.centerOffset[1]-100+20, //y
				200, 200
			);
		}
		this.context.restore();
		
		this.context.save();
		this.context.shadowOffsetX = 5;
		this.context.shadowOffsetY = 5;
		this.context.shadowBlur = 0;
		this.context.shadowColor = "rgba(0,0,0,1)";
		this.context.fillStyle = "green";
		this.context.fillRect(40, 30, Math.abs(5*this.health), 20);
		this.context.restore();
		this.context.save();
	},
	move: function(dir, withoutCheck)
	{
		var x = 0, y = 0;
		switch(dir)
		{
			case 1:
				x--;
				this.flip = true;
				break;
			case 2:
				x++;
				this.flip = false;
				break;
			case 3:
				y--;
				break;
			case 4:
				y++;
				break;
		}
		if(!this.game.scene.world.worldwalk[this.x+x])
		{
			this.game.scene.world.worldwalk[this.x+x] = [];
		}
		if(this.game.scene.world.worldwalk[this.x+x][this.y+y] || withoutCheck)
		{
			this.x+=x;
			this.y+=y;
		}
	}
}