// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.28
// 

using Colyseus.Schema;

namespace Herd {
	public partial class Player : Schema {
		[Type(0, "boolean")]
		public bool ready = default(bool);

		[Type(1, "ref", typeof(Team))]
		public Team team = new Team();
	}
}
