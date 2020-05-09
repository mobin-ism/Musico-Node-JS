class Artist {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        this.res.locals.userdata = this.req.user;
    }

    index() {
        this.res.render('backend/index', {
            userType : this.req.user.type,
            pageName: "artist",
            pageTitle: "Artist"
        });
    }

    add() {
        console.log("I am here");
        this.res.render('backend/index', {
            userType : this.req.user.type,
            pageName: "add_artist",
            pageTitle: "Add Artist"
        });
    }
}

module.exports = Artist;