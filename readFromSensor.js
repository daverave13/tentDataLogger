const { spawn } = require('child_process');
const fs = require('fs');

const readAndWriteToFile = () => {

    const python = spawn('python3', ['temper.py']);

    python.stdout.on('data', (data) => {
        const dataArray = data.toString().split(' ');
        const response = {
            bus: dataArray[1],
            device: dataArray[3],
            temperature: dataArray[7],
            humidity: dataArray[8]
        }

        const now = new Date().toISOString();
        const dateString = now.split('T')[0];

        const responseString = `{"timestamp": "${now}", "bus": "${response.bus}","device": "${response.device}","temperature": "${response.temperature}","humidity": "${response.humidity}"}`
        console.log(responseString);
        
        if (fs.existsSync(`loggedData/${dateString}`)) {
            fs.appendFile(`loggedData/${dateString}`, `,${responseString}`, (error) => error ? console.log(error) : '');
        } else {
            fs.writeFile(`loggedData/${dateString}`, responseString, (error) => error ? console.log(error) : '');
        }
    });

    python.on('close', code => {
        if (code !== 0) {
            console.log(`Temper exited with code ${code}`);
        }
    });
}

readAndWriteToFile();
setInterval(() => readAndWriteToFile(), 1000 * 60 * 5);
