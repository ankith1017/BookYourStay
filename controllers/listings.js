const Listing = require("../models/listing.js");



module.exports.index = async (req,res) => {
    const alllistings = await Listing.find({});
    res.render("listing/index.ejs",{alllistings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listing/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner"); 
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});  
};

module.exports.createListing = async (req,res,next) =>{
    //let {title,description,image,price,country,location} = req.body;
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename}
        await newListing.save();
        req.flash("success","New Listing is Created!");
        res.redirect("/listings");
}; 


module.exports.editListing = async (req,res) => { 
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{listing});
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});  
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`); 
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!");
    res.redirect("/listings");
};
