using System.Collections.Generic;
using Colyseus;
using UnityEngine;
using Herd;
using JetBrains.Annotations;

public class HerdManager : MonoBehaviour
{
    [CanBeNull]
    private ColyseusRoom<State> room = null;
    private Dictionary<string, GameObject> gameObjects = new Dictionary<string, GameObject>();

    // Start is called before the first frame update
    async void Start()
    {
        ColyseusClient client = new ColyseusClient(Constants.GAME_CI_SERVER_ENDPOINT);
        room = await client.JoinOrCreate<State>("herd");
        if (room != null)
        {
            await room.Send("clientMsg", new
            {
                _type = "setReady",
                ready = true
            });
            await room.Send("clientMsg", new {_type = "start"});
        }

    }

    // Update is called once per frame
    void Update()
    {
        if (room != null)
        {
            room.State.dogsMap.ForEach((s, dog) =>
            {
                var id = $"player-{s}";
                if (!gameObjects.ContainsKey(id))
                {
                    gameObjects[id] = GameObject.CreatePrimitive(PrimitiveType.Cube);
                }
                var dogGo = gameObjects[id];
                dogGo.GetComponent<Renderer>().material.color = Color.black;
                dogGo.transform.position = new Vector3(dog.x, 0, dog.y);
            });
            
            room.State.sheepMap.ForEach((s, sheep) =>
            {
                var id = $"sheep-{s}";
                if (!gameObjects.ContainsKey(id))
                {
                    gameObjects.Add(id, GameObject.CreatePrimitive(PrimitiveType.Cube));
                }
                var sheepGo = gameObjects[id];
                sheepGo.GetComponent<Renderer>().material.color = Color.white;
                sheepGo.transform.position = new Vector3(sheep.x, 0, sheep.y);
            });

            room.Send("clientMsg", new
            {
                _type = "input", 
                playerInput = new
                {
                    up = Input.GetKey(KeyCode.W),
                    left = Input.GetKey(KeyCode.A),
                    down = Input.GetKey(KeyCode.S),
                    right = Input.GetKey(KeyCode.D),
                }
            });

        }
    }
}
