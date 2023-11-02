import app from "./app";

const main = () => {
    app.listen(app.set("port"))
    console.log("El servidor escucha en el puerto ", app.set("port"));
}

main();