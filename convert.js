
// This takes the osu! hitobjects from hitobjects.js and converts them to notes for off-the-stage beatmap format.

const hitobjects = require('./hitobjects.js');

let objects = hitobjects.split(/\r?\n/);

let finalObjects = [];

objects.forEach(obj => {
    let parts = obj.split(':')[0].split(',');
    let newObj = {
        note: Math.floor(parts[0] * 4 / 512),
        time: parseInt(parts[2])
    };
    parts[5] = parseInt(parts[5]);
    if (parts[5] > 0) {
        newObj.endTime = parts[5];
    }
    finalObjects.push(newObj);
    console.log(newObj);
});

console.log(JSON.stringify(finalObjects));