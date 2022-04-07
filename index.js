async function getData(){
    let data = await fetch("worldBound.csv")
    return data.text()
}

function filterArr(arr){
    let map = new Map();
    for (let i = 0;i <= arr.length-1;i++){
        if (!map.has(arr[i])){
            map.set(arr[i], 0)
        } else {
            map.set(arr[i], map.get(arr[i])+1)
        }
    }
    return map
}

class Country{
    constructor(name, circlePos, coords){
        this.name = name
        this.circlePos = circlePos
        this.coords = coords
    }
}

function draw(i, ctx, countries){
    let t = countries[i].coords;
    ctx.strokeStyle = `rgb(0, ${i%255}, 0)`
    ctx.fillStyle = `rgb(0, 0, ${i%255})`
    ctx.beginPath()
    for (let s = 0;s <= t.length-1;s++){
        ctx.lineTo(t[s][0], -t[s][1])
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.moveTo(countries[i+1].coords[0][0], -countries[i+1].coords[0][1])
}

async function main(){
    let canvas = document.getElementById("canvas")

    let ctx = canvas.getContext('2d')
    let width = canvas.width
    let height = canvas.height
    ctx.scale(1.3,1.3)
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.strokeStyle = 'blue';

    let data = await getData()
    let lines = data.split("\n")
    let coords = []
    let jsonCoords = []
    let names = []
    let circlePoint = []
    let countries = []
    let area = []

    for (let i = 0;i <= lines.length-1;i++){
        let t = lines[i].split(";")
        names.push(t[9])
        coords.push(t[1])
        circlePoint.push(t[0])
        area.push(t[4])
    }

    for (let i = 0;i <= lines.length-2;i++){// Can be optimized 
        jsonCoords.push(JSON.parse(coords[i].replaceAll(/"(?!")/g, ''))) // dataset is nested
    }

    for (let i = 0;i <= lines.length-2;i++){
        if (jsonCoords[i]['type'] == 'Polygon'){
            countries.push(new Country(names[i], circlePoint[i], jsonCoords[i]['coordinates'][0]))
        } else {
            let t = jsonCoords[i]['coordinates']
            for (let mp = 0; mp <= t.length-1;mp++){
                countries.push(new Country(names[i], circlePoint[i], t[mp][0]))
            }
        }
    }
    
    for (let i = 0;i <= countries.length-2;i++) {
        await setTimeout(() => {draw(i, ctx, countries)}, 2)
    }
}

main()