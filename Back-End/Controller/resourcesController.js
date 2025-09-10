const AsyncErrorHandler = require('../Utils/AsyncErrorHandler');
const Resources = require('./../Models/Resources');

exports.createResources=AsyncErrorHandler(async(req,res) => {
    const Resourcess = await Resources.create(req.body);
    res.status(201).json({
        status:'success',
        data:
            Resourcess
    })

})


exports.DisplayResources = AsyncErrorHandler(async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";
        const status = req.query.status; // optional filter

        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        // Optional search by name (or any other field)
        if (search) {
            filter.resource_name = { $regex: search, $options: "i" }; // case-insensitive
        }

        // Optional status filter (example only if your schema has status)
        if (status) {
            filter.status = status;
        }

        // Query resources with pagination and filtering
        const resources = await Resources.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // optional sorting

        const total = await Resources.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: resources
        });
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong while fetching resources',
            error: error.message
        });
    }
});


exports.UpdateResources =AsyncErrorHandler(async (req,res,next) =>{
console.log(req.body)
    const updateResources=await Resources.findByIdAndUpdate(req.params.id,req.body,{new: true});
     res.status(200).json({
        status:'success',
        data:
            updateResources
     }); 
  })

  exports.deleteResources = AsyncErrorHandler(async(req,res,next)=>{

      const hasResources = await Resources.exists({ Resources: req.params.id });
    
      if (hasResources) {
        return res.status(400).json({
          status: "fail",
          message: "Cannot delete Resources: there are existing related records.",
        });
      }
    await Resources.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status:'success',
        data:
            null
        
     });
  })


exports.DisplayResourcesDropdown = AsyncErrorHandler(async (req, res) => {
    const { showAll } = req.query; // kunin ang query param

    const filter = { availability: true }; // only available resources

    let query = Resources.find(filter).sort({ createdAt: -1 });

    // --- Apply default limit 5 unless showAll=true ---
    const defaultLimit = 5;
    if (!showAll || showAll.toLowerCase() !== "true") {
        query = query.limit(defaultLimit);
    }

    const resources = await query;
    const total = await Resources.countDocuments(filter);

    res.status(200).json({
        status: 'success',
        totalItems: total,
        data: resources
    });
});


