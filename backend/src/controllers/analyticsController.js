import Goal from "../models/Goal.js";
import User from "../models/User.js";
import CheckIn from "../models/CheckIn.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";

// GET /api/analytics/employee  (own stats)
export const getEmployeeAnalytics = asyncHandler(async (req, res) => {
  const employeeId = req.user._id;
  const { quarter } = req.query;
  const filter = { employeeId };
  if (quarter) filter.quarter = quarter;

  const goals = await Goal.find(filter);

  const total = goals.length;
  const completed = goals.filter((g) => g.status === "completed").length;
  const onTrack = goals.filter((g) => g.status === "on_track" || g.status === "approved").length;
  const pending = goals.filter((g) => g.status === "pending_approval").length;

  const totalWeightage = goals.reduce((s, g) => s + g.weightage, 0);
  const completionPct =
    total > 0
      ? Math.round(
          goals.reduce((s, g) => {
            const pct = g.target > 0 ? (g.actual / g.target) : 0;
            return s + (pct * g.weightage) / 100;
          }, 0) * 100
        )
      : 0;

  // Quarter breakdown
  const byQuarter = await Goal.aggregate([
    { $match: { employeeId } },
    {
      $group: {
        _id: "$quarter",
        count: { $sum: 1 },
        avgCompletion: {
          $avg: {
            $multiply: [
              {
                $cond: [
                  { $gt: ["$target", 0] },
                  { $divide: ["$actual", "$target"] },
                  0,
                ],
              },
              100,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  sendResponse(res, 200, "Employee analytics", {
    total,
    completed,
    onTrack,
    pending,
    totalWeightage,
    completionPct,
    byQuarter,
    goals,
  });
});

// GET /api/analytics/team  (manager only)
export const getTeamAnalytics = asyncHandler(async (req, res) => {
  if (req.user.role === "employee") throw new AppError("Access denied.", 403);

  const managerId = req.user._id;
  const { quarter } = req.query;

  // Get all direct reports
  const teamMembers = await User.find({ managerId, isActive: true }).select("_id name department");
  const memberIds = teamMembers.map((m) => m._id);

  const filter = { employeeId: { $in: memberIds } };
  if (quarter) filter.quarter = quarter;

  const goals = await Goal.find(filter).populate("employeeId", "name department");

  // Per-member stats
  const memberStats = teamMembers.map((member) => {
    const memberGoals = goals.filter(
      (g) => g.employeeId._id.toString() === member._id.toString()
    );
    const progress =
      memberGoals.length > 0
        ? Math.round(
            memberGoals.reduce(
              (s, g) => s + ((g.target > 0 ? g.actual / g.target : 0) * g.weightage) / 100,
              0
            ) * 100
          )
        : 0;
    return {
      id: member._id,
      name: member.name,
      department: member.department,
      goalsCount: memberGoals.length,
      progress,
      pending: memberGoals.filter((g) => g.status === "pending_approval").length,
    };
  });

  const avgCompletion =
    memberStats.length > 0
      ? Math.round(memberStats.reduce((s, m) => s + m.progress, 0) / memberStats.length)
      : 0;

  sendResponse(res, 200, "Team analytics", {
    teamSize: teamMembers.length,
    avgCompletion,
    pendingApprovals: goals.filter((g) => g.status === "pending_approval").length,
    memberStats,
  });
});

// GET /api/analytics/org  (admin only)
export const getOrgAnalytics = asyncHandler(async (req, res) => {
  const { quarter } = req.query;
  const goalFilter = quarter ? { quarter } : {};

  const [goals, users, departmentStats] = await Promise.all([
    Goal.find(goalFilter),
    User.find({ isActive: true }),
    // Aggregate completion by department
    Goal.aggregate([
      ...(quarter ? [{ $match: { quarter } }] : []),
      {
        $lookup: {
          from: "users",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $group: {
          _id: "$employee.department",
          totalGoals: { $sum: 1 },
          avgCompletion: {
            $avg: {
              $multiply: [
                {
                  $cond: [
                    { $gt: ["$target", 0] },
                    { $divide: [{ $ifNull: ["$actual", 0] }, "$target"] },
                    0,
                  ],
                },
                100,
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const orgCompletion = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const statusDistribution = {
    draft: goals.filter((g) => g.status === "draft").length,
    pending_approval: goals.filter((g) => g.status === "pending_approval").length,
    approved: goals.filter((g) => g.status === "approved").length,
    completed: completedGoals,
    rejected: goals.filter((g) => g.status === "rejected").length,
  };

  sendResponse(res, 200, "Org analytics", {
    totalEmployees: users.filter((u) => u.role === "employee").length,
    totalGoals,
    orgCompletion,
    statusDistribution,
    departmentStats,
  });
});
