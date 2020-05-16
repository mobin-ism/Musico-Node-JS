const GalleryModel = require('../../models/Gallery');
const ValidationHandler = require('../../helpers/ValidationHandler');
var validationResult = null;

class Gallery {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        this.res.locals.userdata = this.req.user;
    }

    async index() {
        validationResult = null;
        try {
            const galleryModel = new GalleryModel(this.req, this.res);
            const galleryImages = await galleryModel.getGalleryImages();

            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "gallery/index",
                pageTitle: "Gallery",
                galleryImages : galleryImages
            });
        } catch (error) {
            console.error("Error Occured: ", error.message);
        }
    }

    async create() {
        
        const galleryModel = new GalleryModel(this.req, this.res);
        const galleryImages = await galleryModel.getGalleryImages();
        this.res.render('backend/index', {
            userType : this.req.user.type,
            pageName: "gallery/create",
            pageTitle: "Add New Gallery Image",
            validate : validationResult,
            totalNumberOfGalleryImages : Object.keys(galleryImages).length
        });
    }

    async store() {
        const galleryModel = new GalleryModel(this.req, this.res);
        const inputValidationResult = galleryModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await galleryModel.addGalleryImage(this.req.body);
            } catch (error) {
                console.log("Image Adding Denied: ", error.message);
            }
        }
        console.log("Validation result",validationResult);
        this.res.redirect('/gallery/create');
    }


    async delete() {
        const galleryModel = new GalleryModel(this.req, this.res);
        try {
            await galleryModel.deleteGalleryImage(this.req.body.id);   
        } catch (error) {
            console.log("Image Deleting Denied: ", error.message);
        }
        this.res.redirect('/gallery');
    }
}

module.exports = Gallery;