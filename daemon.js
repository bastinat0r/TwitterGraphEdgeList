var daemon = require("daemonize").setup({
    main: "server.js",
    name: "twittergraph",
    pidfile: "twittergraph.pid"
});

switch (process.argv[2]) {

    case "start": 
        daemon.start().once("started", function() {
            process.exit();
        });
        break;

    case "stop":
        daemon.stop();
        break;

    default:
        console.log("Usage: [start|stop]");
}
