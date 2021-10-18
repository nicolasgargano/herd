using System;

public static class Constants
{
    public static string GAME_CI_SERVER_ENDPOINT = Environment.GetEnvironmentVariable("GAME_CI_SERVER_ENDPOINT") ?? "ws://localhost:8000";
}
