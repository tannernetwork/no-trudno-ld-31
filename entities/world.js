function WorldEntity(game)
{
	this.game = game;
	this.context = game.context;

	this.world = [];
	this.screenSize = [
		Math.floor(this.game.root.width/100)+2,
		Math.floor(this.game.root.height/100)+2,
	];
	this.offsetScreen = [0,0];
	this.startX = 0;
	this.startY = 0;
	this.centerOffset = [
		Math.floor((this.game.root.width/100-Math.floor(this.game.root.width/100))*50),
		Math.floor((this.game.root.height/100-Math.floor(this.game.root.height/100))*50),
	];
	for(x = this.startX; x < this.startX+this.screenSize[0]; x++)
	{
		if(!this.world[x])
			this.world[x] = [];
		for(y = this.startY; y < this.startY+this.screenSize[1]; y++)
		{
			this.world[x][y] = true;
		}
	}
	this.worldwalk = [];
	this.worldrestricted = [];
	for(var x = 0; x < this.screenSize[0]+1; x++)
	{
		if(!this.worldrestricted[x])
			this.worldrestricted[x] = [];
		for(var y = 0; y < this.screenSize[1]-1; y++)
		{
			this.worldrestricted[x][y] = false;
		}
	}
	this.recalculateWalkable();
}

WorldEntity.prototype = {
	resize: function()
	{
		this.centerOffset = [
			Math.floor((this.game.root.width/100-Math.floor(this.game.root.width/100))*50),
			Math.floor((this.game.root.height/100-Math.floor(this.game.root.height/100))*50),
		];
		this.screenSize = [
			Math.floor(this.game.root.width/100)+2,
			Math.floor(this.game.root.height/100)+2,
		];

		for(x = this.startX; x < this.startX+this.screenSize[0]; x++)
		{
			if(!this.world[x])
				this.world[x] = [];
			for(y = this.startY; y < this.startY+this.screenSize[1]; y++)
			{
				if(this.world[x][y] == null)
					this.world[x][y] = true;
			}
		}
	},
	render: function()
	{

		this.renderWorld();
		/*for(x = 0; x < this.screenSize[0]-1; x++)
		{
			for(y = 0; y < this.screenSize[1]-1; y++)
			{
				if(!this.worldwalk[x])
					this.worldwalk[x] = [];
				if(this.worldwalk[x][y])
				{
					this.context.fillStyle = "rgba(110,220,250,0.6)";
					this.context.fillRect(50+100*x+this.centerOffset[0]-100, 50+100*y+this.centerOffset[1]-100, 100, 100);

					this.context.font = "bold 12px Arial";
					this.context.fillStyle = "red";
					this.context.fillText(x+":"+y, 50+100*x+this.centerOffset[0]-100, 50+100*y+this.centerOffset[1]);
				}
			}
		}
		for(i = 0; i < this.screenSize[0]-1; i++)
		{
			for(j = 0; j < this.screenSize[1]-1; j++)
			{
				if(!this.worldrestricted[i])
					this.worldres[i] = [];
				if(this.worldrestricted[i][j])
				{
					this.context.fillStyle = "rgba(250,20,25,0.6)";
					this.context.fillRect(50+100*i+this.centerOffset[0]-100, 50+100*j+this.centerOffset[1]-100, 100, 100);
					this.context.font = "bold 12px Arial";
					this.context.fillStyle = "blue";
					this.context.fillText(i+":"+j, 50+100*i+this.centerOffset[0]-100, 50+100*j+this.centerOffset[1]);
				}
			}
		}*/
	},
	move: function(dir)
	{
		switch(dir)
		{
			case 'l':
				this.game.scene.heroes.move(2, true);
				this.offsetScreen[0]++;
				for(y = this.startY; y < this.startY+this.screenSize[1]; y++)
				{
					x = -this.offsetScreen[0];
					if(!this.world[x])
					{
						this.world[x] = [];
						this.world[x-1] = [];
					}
					this.startX = x;
					this.editPoint(x, y);
				}
				this.recalculateRestricted(2);
				break;
			case 'r':
				this.offsetScreen[0]--;
				this.game.scene.heroes.move(1, true);
				for(y = this.startY; y < this.startY+this.screenSize[1]; y++)
				{
					x = this.screenSize[0]-this.offsetScreen[0]-1;
					if(!this.world[x])
					{
						this.world[x] = [];
						this.world[x+1] = [];
					}
					this.startX = -this.offsetScreen[0];
					this.editPoint(x, y);
				}
				this.recalculateRestricted(1);
				break;
			case 't':
				this.offsetScreen[1]++;
				this.game.scene.heroes.move(4, true);
				for(x = this.startX; x < this.startX+this.screenSize[0]; x++)
				{
					y = -this.offsetScreen[1];
					if(!this.world[x])
					{
						this.world[x] = [];
						this.world[x-1] = [];
					}
					this.startY = y;
					this.editPoint(x, y);
				}
				this.recalculateRestricted(4);
				break;
			case 'b':
				this.offsetScreen[1]--;
				this.game.scene.heroes.move(3, true);
				for(x = this.startX; x < this.startX+this.screenSize[0]; x++)
				{
					y = this.screenSize[1]-this.offsetScreen[1]-1;
					if(!this.world[x])
					{
						this.world[x] = [];
						this.world[x+1] = [];
					}
					this.startY = -this.offsetScreen[1];
					this.editPoint(x, y);
				}
				this.recalculateRestricted(3);
				break;
		}

		//walkable
		this.recalculateWalkable();
	},
	renderWorld: function()
	{
		//tiles
		for(x = this.startX; x < this.startX+this.screenSize[0]; x++)
		{
			for(y = this.startY; y < this.startY+this.screenSize[1]; y++)
			{
				if(!this.world[x][y])
				{
					tile = 2;
					this.context.drawImage(this.game.assets['assets/tileset.png'].asset, 100*tile, 0, 100, 100, 100*x+this.centerOffset[0]-100+this.offsetScreen[0]*100, 100*y+this.centerOffset[1]-100+this.offsetScreen[1]*100, 100, 100);
				}

				/*this.context.font = "bold 16px Arial";
				this.context.fillStyle = "white";
				this.context.fillText(x+":"+y, 100*x+this.centerOffset[0]-100+this.offsetScreen[0]*100, 100*y+this.centerOffset[1]-100+this.offsetScreen[1]*100);*/
			}
		}
		for(x = this.startX; x < this.startX+this.screenSize[0]; x++)
		{
			for(y = this.startY; y < this.startY+this.screenSize[1]; y++)
			{

				this.context.save();
				this.context.shadowOffsetX = 5;
				this.context.shadowOffsetY = 5;
				this.context.shadowBlur = 0;
				this.context.shadowColor = "rgba(0,0,0,1)";
				if(this.world[x][y])
				{
					if(!this.world[x][y-1] && y!=0)
						tile = 0;
					else
						tile = 1;
					this.context.drawImage(this.game.assets['assets/tileset.png'].asset, 100*tile, 0, 100, 100, 100*x+this.centerOffset[0]-100+this.offsetScreen[0]*100, 100*y+this.centerOffset[1]-100+this.offsetScreen[1]*100, 100, 100);
				}
				this.context.restore();

				/*this.context.font = "bold 16px Arial";
				this.context.fillStyle = "white";
				this.context.fillText(x+":"+y, 100*x+this.centerOffset[0]-100+this.offsetScreen[0]*100, 100*y+this.centerOffset[1]-100+this.offsetScreen[1]*100);*/
			}
		}
	},
	//helpers
	mouseToWorldTile: function(p)
	{
		x = Math.floor((p[0]-this.centerOffset[0]+100-this.offsetScreen[0]*100)/100);
		y = Math.floor((p[1]-this.centerOffset[1]+100-this.offsetScreen[1]*100)/100);
		return [x,y];
	},
	//generate
	editPoint: function(x, y, state)
	{
		if(!this.world[x])
			this.world[x] = [];
		this.world[x][y] = state!=null?state:true;
		this.recalculateWalkable();
	},

	recalculateWalkable: function()
	{
		for(var x = 0; x < this.screenSize[0]+1; x++)
		{
			if(!this.worldwalk[x])
				this.worldwalk[x] = [];
			var xMoved = x+this.startX;
			for(var y = 0; y < this.screenSize[1]+1; y++)
			{
				var yMoved = y+this.startY;
				if(!this.worldrestricted[x])
					this.worldrestricted[x] = [];
				if(!this.world[xMoved])
					this.world[xMoved] = [];
				if(!this.world[xMoved+1])
					this.world[xMoved+1] = [];
				if(!this.world[xMoved][yMoved] && !this.world[xMoved+1][yMoved]
					&& !this.world[xMoved][yMoved+1] && !this.world[xMoved+1][yMoved+1]
					&& !this.worldrestricted[x][y] && !this.worldrestricted[x][y+1]
				)
					this.worldwalk[x][y] = true;
				else
					this.worldwalk[x][y] = false;
			}
		}
	},

	recalculateRestricted: function(dir){
		var sideX = 0;
		var sideY = 0;
		switch(dir)
		{
			case 1: //prawo
				this.worldrestricted.shift();
				this.worldrestricted.push([]);
				for(i in this.game.scene.items)
				{
					this.game.scene.items[i][0]--;
				}
				for(i in this.game.scene.caves)
				{
					this.game.scene.caves[i][0]--;
				}
				break;
			case 2: //lewo
				this.worldrestricted.pop();
				this.worldrestricted.reverse();
				this.worldrestricted.push([]);
				this.worldrestricted.reverse();
				for(i in this.game.scene.items)
				{
					this.game.scene.items[i][0]++;
				}
				for(i in this.game.scene.caves)
				{
					this.game.scene.caves[i][0]++;
				}
				break;
			case 3: //dół
				for(var x = 0; x < this.screenSize[0]+1; x++)
				{
					this.worldrestricted[x].shift();
					this.worldrestricted[x].push(false);
				}
				for(i in this.game.scene.items)
				{
					this.game.scene.items[i][1]--;
				}
				for(i in this.game.scene.caves)
				{
					this.game.scene.caves[i][1]--;
				}
				break;
			case 4:
				for(var x = 0; x < this.screenSize[0]+1; x++)
				{
					this.worldrestricted[x].pop();
					this.worldrestricted[x].reverse();
					this.worldrestricted[x].push(false);
					this.worldrestricted[x].reverse();
				}
				for(i in this.game.scene.items)
				{
					this.game.scene.items[i][1]++;
				}
				for(i in this.game.scene.caves)
				{
					this.game.scene.caves[i][1]++;
				}
				break;
		}

		for(var x = 0; x < this.screenSize[0]; x++)
		{
			var xMoved = x+this.startX;
			for(var y = 0; y < this.screenSize[1]; y++)
			{
				var yMoved = y+this.startY;
				if(!this.world[xMoved])
					this.world[xMoved] = [];
				if(!this.world[xMoved+1])
					this.world[xMoved+1] = [];
				if(this.world[xMoved][yMoved] && this.world[xMoved+1][yMoved]
					&& this.world[xMoved][yMoved+1] && this.world[xMoved+1][yMoved+1] && x > 0
				)
					this.worldrestricted[x-1][y] = false;
			}
		}
	},

	setRestricted: function(x, y)
	{
		x-=this.startX;
		y-=this.startY;
		if(!this.worldrestricted[x])
			this.worldrestricted[x] = [];
		this.worldrestricted[x][y] = true;
	}
};