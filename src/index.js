const path = require('path');
const baseDll = path.join(__dirname, 'PowerFx/bin/Release/net8.0/publish/PowerFx.dll');

const localTypeName = 'PowerFx.NodePowerFx';
process.env.EDGE_USE_CORECLR = 1;
const edge = require('edge-js');

const init = edge.func({
    assemblyFile: baseDll,
    typeName: localTypeName,
    methodName: 'Init'
});
const evaluate = edge.func({
    assemblyFile: baseDll,
    typeName: localTypeName,
    methodName: 'Evaluate'
});

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

function initAsync() {
    return new Promise((resolve, reject) => {
        init(null, function(error, result) {
            if (error) {
                reject()
            } else {
                resolve();
            }
        });
    });
}

function evaluateAsync(input) {
    return new Promise((resolve, reject) => {
        evaluate(input, function(error, result) {
            if (error) {
                reject()
            } else {
                resolve(result);
            }
        });
    });
}

async function main() {
    try {
        await initAsync();
        const rl = readline.createInterface({ input, output });

        rl.on('line', async (input) => {
            if (input === 'exit' || input === '\x1A') { // '\x1A' is Control Z
                rl.close();
                process.exit(0);
            } else {
                try {
                    const result = await evaluateAsync(input);
                    console.log(result);
                } catch (innerError) {
                    console.error(innerError);
                }
            }
        });

        rl.setPrompt('> ');
        rl.prompt();
    } catch (error) {
        console.error(error);
    }
}

main();