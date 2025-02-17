const User = require("../models/User");

// Update Progress
exports.updateProgress = async (req, res) => {
    try {
        const { _id, progress } = req.body;
        const updatedUser = await User.findByIdAndUpdate(_id, { progress: progress || 0 }, { new: true });

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Users by Team Name
exports.getUsersByTeam = async (req, res) => {
    try {
        const { teamname } = req.params;
        const users = await User.find({ teamname });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Average Progress
exports.getAverageProgress = async (req, res) => {
    try {
        const teamMembers = await User.find({ role: { $in: ["TeamMember", "TeamLead"] } });

        const teamProgressData = teamMembers.reduce((result, user) => {
            if (!result[user.teamname]) {
                result[user.teamname] = {
                    teamname: user.teamname,
                    projectname: user.projectname,
                    teamProgress: user.progress,
                    teamMembersCount: 1
                };
            } else {
                result[user.teamname].teamProgress += user.progress;
                result[user.teamname].teamMembersCount += 1;
                result[user.teamname].projectname = user.projectname;
            }
            return result;
        }, {});

        const averageProgress = Object.values(teamProgressData).map(team => ({
            teamname: team.teamname,
            projectname: team.projectname,
            averageProgress: team.teamMembersCount
                ? (team.teamProgress / team.teamMembersCount).toFixed(0)
                : 0,
        }));

        res.json(averageProgress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
