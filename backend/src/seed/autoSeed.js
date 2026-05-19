import User from "../models/User.js";
import Goal from "../models/Goal.js";
import GoalCycle from "../models/GoalCycle.js";
import Notification from "../models/Notification.js";

export const seedDemoDataIfEmpty = async () => {
  if (process.env.NODE_ENV === "production") return false;

  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) return false;

  const [admin] = await User.create([
    {
      name: "Elena Rodriguez",
      email: "elena.rodriguez@company.com",
      password: "demo123",
      role: "admin",
      department: "Human Resources",
      title: "HR Operations Lead",
    },
  ]);

  const [manager1, manager2] = await User.create([
    {
      name: "James Mitchell",
      email: "james.mitchell@company.com",
      password: "demo123",
      role: "manager",
      department: "Product",
      title: "Director of Product",
      managerId: admin._id,
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@company.com",
      password: "demo123",
      role: "manager",
      department: "Engineering",
      title: "Engineering Manager",
      managerId: admin._id,
    },
  ]);

  const [emp1, emp2, emp3, emp4, emp5] = await User.create([
    {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      password: "demo123",
      role: "employee",
      department: "Product",
      title: "Senior Product Designer",
      managerId: manager1._id,
    },
    {
      name: "Alex Kim",
      email: "alex.kim@company.com",
      password: "demo123",
      role: "employee",
      department: "Engineering",
      title: "Frontend Engineer",
      managerId: manager2._id,
    },
    {
      name: "Maria Santos",
      email: "maria.santos@company.com",
      password: "demo123",
      role: "employee",
      department: "Marketing",
      title: "Growth Marketing Lead",
      managerId: manager1._id,
    },
    {
      name: "David Park",
      email: "david.park@company.com",
      password: "demo123",
      role: "employee",
      department: "Sales",
      title: "Account Executive",
      managerId: manager1._id,
    },
    {
      name: "Lisa Wong",
      email: "lisa.wong@company.com",
      password: "demo123",
      role: "employee",
      department: "Product",
      title: "Product Manager",
      managerId: manager1._id,
    },
  ]);

  const [cycleQ2] = await GoalCycle.create([
    {
      name: "Q2 2026",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-30"),
      status: "active",
      participants: 248,
      createdBy: admin._id,
    },
  ]);

  await Goal.create([
    {
      employeeId: emp1._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Increase NPS score",
      description: "Improve customer satisfaction through UX refinements",
      uomType: "Points",
      target: 72,
      actual: 68,
      weightage: 25,
      status: "approved",
      quarter: "Q2 2026",
    },
    {
      employeeId: emp2._id,
      managerId: manager2._id,
      cycleId: cycleQ2._id,
      title: "Launch mobile app beta",
      description: "Coordinate cross-functional beta release",
      uomType: "%",
      target: 100,
      actual: 45,
      weightage: 40,
      status: "pending_approval",
      quarter: "Q2 2026",
    },
  ]);

  await Notification.create([
    {
      userId: emp1._id,
      title: "Goal Approved",
      message: 'Your goal "Increase NPS score" has been approved.',
      type: "approval",
      isRead: false,
    },
    {
      userId: emp2._id,
      title: "Goal Pending Review",
      message: 'Your goal "Launch mobile app beta" is pending manager approval.',
      type: "approval",
      isRead: false,
    },
  ]);

  console.log("Auto-seeded demo users and sample data because the database was empty.");
  return true;
};
