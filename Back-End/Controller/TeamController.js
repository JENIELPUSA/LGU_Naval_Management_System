const AsyncErrorHandler = require('../Utils/AsyncErrorHandler');
const Team = require('./../Models/TeamSchema');
const LogInSchema = require('./../Models/LogInSchema')
const OfficerSchema = require('./../Models/OfficerSchema')



exports.BroadcastControllerEmail = AsyncErrorHandler(async (req, res) => {
  try {
    const { team_id } = req.query;

    if (!team_id) {
      return res.status(400).json({
        status: "fail",
        message: "team_id is required",
      });
    }

    const teams = await OfficerSchema.find({ team_id });

    const teamIds = teams.map(team => team._id);

    res.status(200).json({
      status: "success",
      data: teamIds, 
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});




exports.createTeam=AsyncErrorHandler(async(req,res) => {
    console.log(req.body)
    const Teams = await Team.create(req.body);
    res.status(201).json({
        status:'success',
        data:
            Teams
    })

})

exports.DisplayTeam = AsyncErrorHandler(async (req, res) => {
    try {
        const teams = await Team.find();

        res.status(200).json({
            status: 'success',
            data: teams
        });
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong while fetching teams',
            error: error.message
        });
    }
});


exports.UpdateTeam =AsyncErrorHandler(async (req,res,next) =>{
    const updateTeam=await Team.findByIdAndUpdate(req.params.id,req.body,{new: true});
     res.status(200).json({
        status:'success',
        data:
            updateTeam
        
     }); 
  })

exports.deleteTeam = AsyncErrorHandler(async (req, res, next) => {

  console.log("Trace",req.params.id)
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      status: "fail",
      message: "Team not found.",
    });
  }
  await Team.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});



