// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.28
// 

using Colyseus.Schema;

namespace Herd {
	public partial class State : Schema {
		[Type(0, "string")]
		public string gamestate = default(string);

		[Type(1, "map", typeof(MapSchema<Player>))]
		public MapSchema<Player> players = new MapSchema<Player>();

		[Type(2, "map", typeof(MapSchema<Sheep>))]
		public MapSchema<Sheep> sheepMap = new MapSchema<Sheep>();

		[Type(3, "map", typeof(MapSchema<Dog>))]
		public MapSchema<Dog> dogsMap = new MapSchema<Dog>();

		[Type(4, "ref", typeof(Team))]
		public Team topTeam = new Team();

		[Type(5, "ref", typeof(Team))]
		public Team bottomTeam = new Team();
	}
}
