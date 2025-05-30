const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const listings = await Listing.find({});
    res.render("./listings/index.ejs", {listings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req,res,next) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for the listing !")
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req,res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for the listing !")
    // }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    };
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`The listing ${deletedListing} has been deleted !`);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
};