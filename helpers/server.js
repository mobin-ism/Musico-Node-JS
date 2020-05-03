module.exports.start = function start(server) {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Listening to port ${port}`);
    });
}