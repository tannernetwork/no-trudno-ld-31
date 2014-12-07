function GameScene (game)
{
	this.game = game;
	this.context = game.context;
	this.items = [];
	this.caves = [];

	this.world = new WorldEntity(game);
	this.heroes = new HeroEntity(game);
	this.gizmo = new GizmoEntity(game);
	this.digSpace(0, null, [2,3]);
	this.digSpace(0, null, [6,3]);
	this.digSpace(0, null, [4,3]);
	
	if(!window.source2)
	{
		window.source2 = this.game.audiocontext.createBufferSource();
		window.source2.loop = true;
		window.source2.buffer = this.game.assets['assets/music.mp3'].asset;
		window.source2.connect(this.game.audiocontext.destination);
		window.source2.start(0);
	}
}

GameScene.prototype = {
	resize: function()
	{
		this.world.resize();
	},
	update: function ()
	{
		this.heroes.update();
	},

	render: function (time)
	{
		this.world.render();

		for(var l in this.items)
		{
			this.context.save();
			this.context.shadowOffsetX = 5;
			this.context.shadowOffsetY = 5;
			this.context.shadowBlur = 0;
			this.context.shadowColor = "rgba(0,0,0,1)";
			var x = this.items[l][0];
			var y = this.items[l][1];
			this.context.drawImage(
				this.game.assets['assets/fuel.png'].asset,
				0, 0, 80, 80, //ciachanie
				100*x+this.game.scene.world.centerOffset[0]-100+60, //x
				100*y+this.game.scene.world.centerOffset[1]-100+20, //y
				80, 80
			);
			this.context.restore();
		}
		for(var l in this.caves)
		{
			var x = this.caves[l][0];
			var y = this.caves[l][1];
			this.context.drawImage(
				this.game.assets['assets/cave.png'].asset,
				0, 0, 600, 100, //ciachanie
				100*x+this.game.scene.world.centerOffset[0]-100, //x
				100*y+this.game.scene.world.centerOffset[1]-100, //y
				600, 100
			);
		}

		this.heroes.render();
		this.gizmo.render();
		
		for(i = 0; i < 1000; i++)
		{
			var number = Math.floor( Math.random() * 128 );
			var x = Math.floor(Math.random()*this.game.root.width);
			var y = Math.floor(Math.random()*this.game.root.height);
			this.context.fillStyle = "rgba(" + number + "," + number + "," + number + ",0.6)";
			this.context.fillRect(1*x,1*y,1,1);
		}

	},

	keydown: function(e)
	{
		switch(e.which)
		{
			case 37:
				this.world.move('l');
				break;
			case 38:
				this.world.move('t');
				break;
			case 39:
				this.world.move('r');
				break;
			case 40:
				this.world.move('b');
				break;
			case 49:
				this.gizmo.selectItem(0);
				break;
			case 50:
				this.gizmo.selectItem(1);
				break;
		}
	},

	digSpace: function(item, e, tiles)
	{
		if(e != null)
			tile = this.world.mouseToWorldTile([e.clientX, e.clientY]);
		else
			tile = tiles;

		if(item == 0 && Math.abs(tile[0] - Math.abs(tile[0])%2)%4 + Math.abs(tile[1] - Math.abs(tile[1])%2)%4 != 0)
		{
			tile[0] = tile[0]-Math.abs(tile[0])%2;
			tile[1] = tile[1]-Math.abs(tile[1])%2;
			this.world.editPoint(tile[0], tile[1], false);
			this.world.editPoint(tile[0]+1, tile[1], false);
			this.world.editPoint(tile[0], tile[1]+1, false);
			this.world.editPoint(tile[0]+1, tile[1]+1, false);
			if(this.items && Math.floor(Math.random()*10) > 5)
			{
				this.items.push([tile[0]-this.world.startX, tile[1]-tile[1]%2+1-this.world.startY]);
			}
		}

		if(item == 1 && Math.abs(tile[0] - Math.abs(tile[0])%2)%4 + (Math.abs(tile[1]-2-Math.abs(tile[1])%2))%4 == 0)
		{
			tile[0] = tile[0]-Math.abs(tile[0])%2;
			tile[1] = tile[1]-Math.abs(tile[1])%2;
			for(j = 0; j < 6; j++)
			{
				for(k = 0; k < 4; k++)
				{
					this.world.editPoint(tile[0]+j-2, tile[1]+k-2, false);
					if(k < 2 && j != 5)
						this.world.setRestricted(tile[0]+j-2, tile[1]+k-2);
				}
			}
			this.caves.push([tile[0]-2-this.world.startX, tile[1]-2-this.world.startY]);
		}
	},

	mousedown: function(e)
	{
		this.digSpace(this.gizmo.item, e);
	},

	mousemove: function(e)
	{
		this.clientX = e.clientX;
		this.clientY = e.clientY;
	}
}