/**
 * Seed script — populates MongoDB with demo data.
 * Run: npm run seed
 *
 * WARNING: Clears all existing data before seeding.
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Goal from "../models/Goal.js";
import CheckIn from "../models/CheckIn.js";
import GoalCycle from "../models/GoalCycle.js";
import AuditLog from "../models/AuditLog.js";
import Notification from "../models/Notification.js";

const QUARTER = "Q2 2026";

async function seed() {
  await connectDB();
  console.log("Connected. Clearing existing data...");

  await Promise.all([
    User.deleteMany(),
    Goal.deleteMany(),
    CheckIn.deleteMany(),
    GoalCycle.deleteMany(),
    AuditLog.deleteMany(),
    Notification.deleteMany(),
  ]);

  // ─── Users ──────────────────────────────────────────────────────────────────
  console.log("Seeding users...");

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

  console.log(`Created ${8} users`);

  // ─── Goal Cycles ────────────────────────────────────────────────────────────
  console.log("Seeding goal cycles...");

  const [cycleQ1, cycleQ2, cycleQ3] = await GoalCycle.create([
    {
      name: "Q1 2026",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-03-31"),
      status: "closed",
      participants: 235,
      createdBy: admin._id,
    },
    {
      name: "Q2 2026",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-30"),
      status: "active",
      participants: 248,
      createdBy: admin._id,
    },
    {
      name: "Q3 2026",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-09-30"),
      status: "upcoming",
      participants: 0,
      createdBy: admin._id,
    },
  ]);

  // ─── Goals for Sarah Chen ───────────────────────────────────────────────────
  console.log("Seeding goals...");

  const sarahGoals = await Goal.create([
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
      quarter: QUARTER,
    },
    {
      employeeId: emp1._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Ship design system v2",
      description: "Complete component library and documentation",
      uomType: "%",
      target: 100,
      actual: 75,
      weightage: 30,
      status: "on_track",
      quarter: QUARTER,
    },
    {
      employeeId: emp1._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Reduce design review cycle",
      description: "Streamline feedback loops with engineering",
      uomType: "Days",
      target: 3,
      actual: 4,
      weightage: 20,
      status: "draft",
      quarter: QUARTER,
    },
    {
      employeeId: emp1._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Mentor junior designers",
      description: "Conduct bi-weekly coaching sessions",
      uomType: "Sessions",
      target: 12,
      actual: 5,
      weightage: 25,
      status: "on_track",
      quarter: QUARTER,
    },
  ]);

  // Goals for Alex Kim
  const alexGoals = await Goal.create([
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
      quarter: QUARTER,
    },
    {
      employeeId: emp2._id,
      managerId: manager2._id,
      cycleId: cycleQ2._id,
      title: "Improve test coverage",
      description: "Increase unit test coverage to 80%",
      uomType: "%",
      target: 80,
      actual: 62,
      weightage: 30,
      status: "on_track",
      quarter: QUARTER,
    },
    {
      employeeId: emp2._id,
      managerId: manager2._id,
      cycleId: cycleQ2._id,
      title: "Reduce page load time",
      description: "Optimize bundle size and lazy loading",
      uomType: "Seconds",
      target: 2,
      actual: 2.8,
      weightage: 30,
      status: "draft",
      quarter: QUARTER,
    },
  ]);

  // Goals for Maria Santos
  await Goal.create([
    {
      employeeId: emp3._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Reduce churn rate",
      description: "Implement retention initiatives",
      uomType: "%",
      target: 5,
      actual: 3.2,
      weightage: 40,
      status: "approved",
      quarter: QUARTER,
    },
    {
      employeeId: emp3._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Grow email subscriber base",
      description: "Increase newsletter subscribers by 20%",
      uomType: "Subscribers",
      target: 5000,
      actual: 3800,
      weightage: 35,
      status: "on_track",
      quarter: QUARTER,
    },
    {
      employeeId: emp3._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Launch Q2 campaign",
      description: "Execute product launch campaign",
      uomType: "Campaigns",
      target: 3,
      actual: 2,
      weightage: 25,
      status: "on_track",
      quarter: QUARTER,
    },
  ]);

  // Goals for David Park
  await Goal.create([
    {
      employeeId: emp4._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Close enterprise deals",
      description: "Sign 5 new enterprise contracts",
      uomType: "Deals",
      target: 5,
      actual: 3,
      weightage: 50,
      status: "on_track",
      quarter: QUARTER,
    },
    {
      employeeId: emp4._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Expand pipeline",
      description: "Add 20 qualified leads to pipeline",
      uomType: "Leads",
      target: 20,
      actual: 14,
      weightage: 30,
      status: "on_track",
      quarter: QUARTER,
    },
    {
      employeeId: emp4._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Improve win rate",
      description: "Increase deal win rate to 35%",
      uomType: "%",
      target: 35,
      actual: 28,
      weightage: 20,
      status: "draft",
      quarter: QUARTER,
    },
  ]);

  // Goals for Lisa Wong
  await Goal.create([
    {
      employeeId: emp5._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Ship roadmap features",
      description: "Deliver 90% of Q2 roadmap items",
      uomType: "%",
      target: 90,
      actual: 82,
      weightage: 40,
      status: "approved",
      quarter: QUARTER,
    },
    {
      employeeId: emp5._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Improve sprint velocity",
      description: "Increase team velocity by 15%",
      uomType: "%",
      target: 15,
      actual: 12,
      weightage: 35,
      status: "on_track",
      quarter: QUARTER,
    },
    {
      employeeId: emp5._id,
      managerId: manager1._id,
      cycleId: cycleQ2._id,
      title: "Stakeholder satisfaction",
      description: "Achieve 4.5/5 stakeholder satisfaction score",
      uomType: "Score",
      target: 4.5,
      actual: 4.2,
      weightage: 25,
      status: "on_track",
      quarter: QUARTER,
    },
  ]);

  console.log("Goals seeded");

  // ─── Check-ins ──────────────────────────────────────────────────────────────
  console.log("Seeding check-ins...");

  await CheckIn.create([
    {
      goalId: sarahGoals[0]._id,
      employeeId: emp1._id,
      plannedValue: 72,
      actualValue: 68,
      status: "on_track",
      comment: "Good progress, targeting 70 by end of quarter",
      quarter: QUARTER,
    },
    {
      goalId: sarahGoals[1]._id,
      employeeId: emp1._id,
      plannedValue: 100,
      actualValue: 75,
      status: "on_track",
      comment: "Core components done, documentation in progress",
      quarter: QUARTER,
    },
    {
      goalId: alexGoals[0]._id,
      employeeId: emp2._id,
      plannedValue: 100,
      actualValue: 45,
      status: "at_risk",
      comment: "Backend integration delayed, need support",
      quarter: QUARTER,
    },
  ]);

  // ─── Audit Logs ─────────────────────────────────────────────────────────────
  console.log("Seeding audit logs...");

  await AuditLog.create([
    {
      action: "GOAL_APPROVED",
      changedBy: manager1._id,
      targetType: "Goal",
      targetId: sarahGoals[0]._id,
      oldValue: { status: "pending_approval" },
      newValue: { status: "approved" },
      details: `Goal "Increase NPS score" approved by James Mitchell`,
    },
    {
      action: "CYCLE_CREATED",
      changedBy: admin._id,
      targetType: "GoalCycle",
      targetId: cycleQ2._id,
      details: "Q2 2026 cycle created with 248 participants",
    },
    {
      action: "USER_UPDATED",
      changedBy: admin._id,
      targetType: "User",
      targetId: emp2._id,
      oldValue: { role: "employee" },
      newValue: { role: "employee" },
      details: "Alex Kim profile updated",
    },
  ]);

  // ─── Notifications ──────────────────────────────────────────────────────────
  console.log("Seeding notifications...");

  await Notification.create([
    {
      userId: emp1._id,
      title: "Goal Approved",
      message: 'Your goal "Increase NPS score" has been approved.',
      type: "approval",
      isRead: false,
      relatedId: sarahGoals[0]._id,
    },
    {
      userId: emp2._id,
      title: "Goal Pending Review",
      message: 'Your goal "Launch mobile app beta" is pending manager approval.',
      type: "approval",
      isRead: false,
      relatedId: alexGoals[0]._id,
    },
    {
      userId: manager1._id,
      title: "New Goal Submission",
      message: 'Alex Kim submitted "Launch mobile app beta" for approval.',
      type: "approval",
      isRead: false,
      relatedId: alexGoals[0]._id,
    },
    {
      userId: emp1._id,
      title: "Q2 2026 Cycle Active",
      message: "The Q2 2026 goal cycle is now active. Submit your goals.",
      type: "system",
      isRead: true,
    },
  ]);

  console.log("\n✅ Seed complete!\n");
  console.log("Demo accounts (password: demo123):");
  console.log("  Admin:    elena.rodriguez@company.com");
  console.log("  Manager:  james.mitchell@company.com");
  console.log("  Manager:  priya.sharma@company.com");
  console.log("  Employee: sarah.chen@company.com");
  console.log("  Employee: alex.kim@company.com");
  console.log("  Employee: maria.santos@company.com");
  console.log("  Employee: david.park@company.com");
  console.log("  Employee: lisa.wong@company.com\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
