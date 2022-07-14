const procesadores = require("os").cpus().length
const cluster = require("cluster");
const modoCluster = process.argv[3] == 'CLUSTER';

if(modoCluster && cluster.isPrimary){
    for(let i=0; i<numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}else {
    const app = express()

    const PORT = parseInt(process.argv[2]) || 8080

    app.get('/datos', (req,res) => {
        res.send(`Server en PORT(${PORT}) - PID(${process.pid}) - FYH(${new Date().toLocaleString()})`)
    })

    app.listen(PORT, err => {
        if(!err) console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
    })
}