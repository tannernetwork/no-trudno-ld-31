function GizmoEntity(game)
{
	this.game = game;
	this.context = game.context;
	this.x = this.y = 0;
	this.item = 0;
}

GizmoEntity.prototype = {
	render: function()
	{
		this.x = this.game.scene.clientX;
		this.y = this.game.scene.clientY;
		tile = this.game.scene.world.mouseToWorldTile([this.x, this.y]);
		this.context.fillStyle = "rgba(0, 200, 0, 0.6)";
		if(this.item == 0)
		{
			if(Math.abs(tile[0] - Math.abs(tile[0])%2)%4 + Math.abs(tile[1] - Math.abs(tile[1])%2)%4 != 0)
			{
				this.context.fillRect(
					-100+100*(tile[0]-Math.abs(tile[0])%2)+this.game.scene.world.centerOffset[0]+this.game.scene.world.offsetScreen[0]*100,
					-100+100*(tile[1]-Math.abs(tile[1])%2)+this.game.scene.world.centerOffset[1]+this.game.scene.world.offsetScreen[1]*100,
					200, 200
				);
			}
		}
		if(this.item == 1)
		{
			if(Math.abs(tile[0] - Math.abs(tile[0])%2)%4 + (Math.abs(tile[1]-2-Math.abs(tile[1])%2))%4 == 0)
			{
				this.context.fillRect(
					-300+100*(tile[0]-Math.abs(tile[0])%2)+this.game.scene.world.centerOffset[0]+this.game.scene.world.offsetScreen[0]*100,
					-300+100*(tile[1]-Math.abs(tile[1])%2)+this.game.scene.world.centerOffset[1]+this.game.scene.world.offsetScreen[1]*100,
					600, 400
				);
			}
		}
	},

	selectItem: function(id)
	{
		this.item = id;
	}
}