using System.Collections.Generic;
using Colyseus;
using UnityEngine;
using Herd;
using JetBrains.Annotations;

public class HerdManager : MonoBehaviour
{
    [SerializeField]
    private GameObject dogPrefab;
    [SerializeField]
    private GameObject sheepPrefab;

    [CanBeNull]
    private ColyseusRoom<State> room = null;
    private Dictionary<string, GameObject> gameObjects = new Dictionary<string, GameObject>();

    // Start is called before the first frame update
    async void Start()
    {
        Debug.Log("Creating client");
        ColyseusClient client = new ColyseusClient(Constants.GAME_CI_SERVER_ENDPOINT);
        Debug.Log("Connecting to room");
        // TODO: this seems to be failing on the webgl build, I couldn't find what is going on. Asked on discord.
        // TODO: best lead I could find https://forum.unity.com/threads/webgl-with-signalr-argumentnullexception-value-cannot-be-null.671926/
        room = await client.JoinOrCreate<State>("herd");
        Debug.Log("Connected to room");
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
                    gameObjects[id] = Instantiate(dogPrefab);
                }
                var dogGo = gameObjects[id];
                dogGo.transform.position = new Vector3(dog.x, 0, dog.y);
            });
            
            room.State.sheepMap.ForEach((s, sheep) =>
            {
                var id = $"sheep-{s}";
                if (!gameObjects.ContainsKey(id))
                {
                    gameObjects[id] = Instantiate(sheepPrefab);
                }
                var sheepGo = gameObjects[id];
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
