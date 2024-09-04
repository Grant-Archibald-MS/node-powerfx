using Microsoft.PowerFx;

namespace PowerFx;

public class NodePowerFx
{
    private static RecalcEngine Engine {get;set;}
    
    public async Task<object> Init(string config)
    {
        Engine = new RecalcEngine();
        return true;
    }

    public async Task<object> Evaluate(string text)
    {
        var result = await (Engine.EvalAsync(text, CancellationToken.None));
        return result.ToObject();
    }
}
