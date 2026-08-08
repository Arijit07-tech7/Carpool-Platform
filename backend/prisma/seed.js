// backend/prisma/seed.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const main = async () => {
  console.log("🌱 Starting database seed...");

  // =====================================================
  // 1. CREATE ORGANIZATION
  // =====================================================

  const organization = await prisma.organization.upsert({
    where: {
      code: "TECHCORP",
    },
    update: {},
    create: {
      name: "TechCorp Solutions",
      code: "TECHCORP",
      description: "Demo organization for the Enterprise Carpooling Platform",
      email: "admin@techcorp.example",
      phone: "+91-9000000000",
      address: "Kolkata, West Bengal, India",
      isActive: true,
    },
  });

  console.log(`✅ Organization created: ${organization.name}`);

  // =====================================================
  // 2. PASSWORD
  // =====================================================

  const password = await bcrypt.hash("Password@123", 12);

  // =====================================================
  // 3. CREATE COMPANY ADMIN
  // =====================================================

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@techcorp.example",
    },
    update: {
      organizationId: organization.id,
    },
    create: {
      name: "Company Admin",
      email: "admin@techcorp.example",
      password,
      phone: "+91-9000000001",
      role: "COMPANY_ADMIN",
      status: "ACTIVE",
      organizationId: organization.id,
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  // =====================================================
  // 4. CREATE ADMIN MEMBERSHIP
  // =====================================================

  await prisma.organizationMember.upsert({
    where: {
      userId: admin.id,
    },
    update: {
      organizationId: organization.id,
      status: "ACTIVE",
    },
    create: {
      userId: admin.id,
      organizationId: organization.id,
      status: "ACTIVE",
    },
  });

  // =====================================================
  // 5. CREATE ADMIN SETTINGS
  // =====================================================

  await prisma.settings.upsert({
    where: {
      userId: admin.id,
    },
    update: {},
    create: {
      userId: admin.id,
      emailNotifications: true,
      pushNotifications: true,
      rideNotifications: true,
      paymentNotifications: true,
    },
  });

  // =====================================================
  // 6. CREATE EMPLOYEE
  // =====================================================

  const employee = await prisma.user.upsert({
    where: {
      email: "employee@techcorp.example",
    },
    update: {
      organizationId: organization.id,
    },
    create: {
      name: "Demo Employee",
      email: "employee@techcorp.example",
      password,
      phone: "+91-9000000002",
      role: "EMPLOYEE",
      status: "ACTIVE",
      organizationId: organization.id,
    },
  });

  console.log(`✅ Employee created: ${employee.email}`);

  // =====================================================
  // 7. CREATE EMPLOYEE MEMBERSHIP
  // =====================================================

  await prisma.organizationMember.upsert({
    where: {
      userId: employee.id,
    },
    update: {
      organizationId: organization.id,
      status: "ACTIVE",
    },
    create: {
      userId: employee.id,
      organizationId: organization.id,
      status: "ACTIVE",
    },
  });

  // =====================================================
  // 8. CREATE EMPLOYEE SETTINGS
  // =====================================================

  await prisma.settings.upsert({
    where: {
      userId: employee.id,
    },
    update: {},
    create: {
      userId: employee.id,
      emailNotifications: true,
      pushNotifications: true,
      rideNotifications: true,
      paymentNotifications: true,
    },
  });

  // =====================================================
  // 9. CREATE EMPLOYEE WALLET
  // =====================================================

  await prisma.wallet.upsert({
    where: {
      userId: employee.id,
    },
    update: {},
    create: {
      userId: employee.id,
      balance: 500,
    },
  });

  console.log("✅ Employee wallet created with ₹500 balance");

  // =====================================================
  // 10. CREATE DEMO VEHICLE
  // =====================================================

  const vehicle = await prisma.vehicle.upsert({
    where: {
      registrationNumber: "WB00AA0001",
    },
    update: {},
    create: {
      ownerId: employee.id,
      organizationId: organization.id,

      registrationNumber: "WB00AA0001",

      make: "Maruti Suzuki",
      model: "Baleno",
      color: "White",
      vehicleType: "Hatchback",

      seatingCapacity: 4,

      status: "VERIFIED",
    },
  });

  console.log(`✅ Vehicle created: ${vehicle.registrationNumber}`);

  // =====================================================
  // 11. ORGANIZATION SETTINGS
  // =====================================================

  await prisma.settings.upsert({
    where: {
      organizationId: organization.id,
    },
    update: {},
    create: {
      organizationId: organization.id,
      emailNotifications: true,
      pushNotifications: true,
      rideNotifications: true,
      paymentNotifications: true,
    },
  });

  // =====================================================
  // 12. SUMMARY
  // =====================================================

  console.log("\n========================================");
  console.log("🎉 DATABASE SEED COMPLETED");
  console.log("========================================");

  console.log("\nOrganization:");
  console.log("  Name: TechCorp Solutions");
  console.log("  Code: TECHCORP");

  console.log("\nCompany Admin:");
  console.log("  Email: admin@techcorp.example");
  console.log("  Password: Password@123");

  console.log("\nEmployee:");
  console.log("  Email: employee@techcorp.example");
  console.log("  Password: Password@123");

  console.log("\nEmployee Wallet:");
  console.log("  Balance: ₹500");

  console.log("\nVehicle:");
  console.log("  Registration: WB00AA0001");
  console.log("  Capacity: 4 seats");

  console.log("\n⚠️ These are development/test credentials.");
  console.log("⚠️ Do NOT use them in production.");
};

// =====================================================
// RUN SEED
// =====================================================

main()
  .catch((error) => {
    console.error("❌ Database seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });