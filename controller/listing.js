const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: Maptoken });


const Listing=require("../models/listing");

module.exports.index=
    async (req, res) => {
        let allListings = await Listing.find({});
        res.render('listing/index', { allListings });
      }


module.exports.create=
    (req, res) => {
        res.render('listing/create');
      }

module.exports.CreateSave=async (req, res, next) => {
   
   let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
   
    

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geomatry=response.body.features[0].geometry
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect('/listings');
  };  


 module.exports.show=async (req, res) => {
    let { id } = req.params;
    let biodata = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: { path: "author" },
    })
    .populate("owner");
  
    if(!biodata){
      req.flash("error","Listing You Want To Add Does'nt Exist!");
      res.redirect("/listing");
    }
   
    res.render('listing/show', { biodata });
  }


  module.exports.edit=async (req, res) => {
    let { id } = req.params;
    let biodata = await Listing.findById(id);
    if (!biodata) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    let orignalUrl=biodata.image.url;
    orignalImageUrl=orignalUrl.replace("/upload","/upload/w_200")
    res.render('listing/edit.ejs', { biodata,orignalImageUrl });
  }

  module.exports.update=async (req, res) => {
    let { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
  }

    if (!updatedListing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroy=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect('/listings');
  }

  module.exports.send=(req, res) => {
    
    const biodata = getBiodataById(req.params.id); 

    res.render('show', {
        biodata: biodata,
        mapToken: process.env.MAP_TOKEN ,
        
    });
};



