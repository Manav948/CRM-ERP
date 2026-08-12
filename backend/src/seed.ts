import { prisma } from './config/prisma.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('Clearing existing database tables...');
  await prisma.challanItem.deleteMany();
  await prisma.challan.deleteMany();
  await prisma.stockLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customerNote.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating demo users for all 4 roles...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = (pw: string) => bcrypt.hashSync(pw, salt);

  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword('admin123'),
      role: 'Admin',
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      name: 'Sarah Sales Manager',
      email: 'sales@example.com',
      password: hashedPassword('sales123'),
      role: 'Sales',
    },
  });

  const warehouseUser = await prisma.user.create({
    data: {
      name: 'Walter Warehouse Keeper',
      email: 'warehouse@example.com',
      password: hashedPassword('wh123'),
      role: 'Warehouse',
    },
  });

  const accountsUser = await prisma.user.create({
    data: {
      name: 'Alice Accounts Officer',
      email: 'accounts@example.com',
      password: hashedPassword('accounts123'),
      role: 'Accounts',
    },
  });

  console.log('Creating sample customers...');
  const cust1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      mobile: '+19876543210',
      email: 'john@apexretailers.com',
      businessName: 'Apex Retailers Inc.',
      gstNumber: '29ABCDE1234F1Z5',
      customerType: 'Retail',
      address: '101 Commerce St, Tech Park, Suite 400',
      status: 'Active',
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdById: salesUser.id,
      notes: {
        create: [
          {
            text: 'Interested in bulk purchase of sensors.',
            createdById: salesUser.id,
          },
        ],
      },
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      name: 'Robert Smith',
      mobile: '+19876543211',
      email: 'robert@globallogistics.com',
      businessName: 'Global Logistics Ltd.',
      gstNumber: '27XYZAB9876C1Z3',
      customerType: 'Wholesale',
      address: '45 Freight Hub, Logistics Zone',
      status: 'Active',
      createdById: salesUser.id,
      notes: {
        create: [
          {
            text: 'Requires monthly delivery schedule.',
            createdById: salesUser.id,
          },
        ],
      },
    },
  });

  const cust3 = await prisma.customer.create({
    data: {
      name: 'Emily Davis',
      mobile: '+19876543212',
      email: 'emily@premierdist.com',
      businessName: 'Premier Distributors Co.',
      customerType: 'Distributor',
      address: '77 Industrial Avenue, Sector 5',
      status: 'Lead',
      createdById: salesUser.id,
    },
  });

  console.log('Creating sample products...');
  const prod1 = await prisma.product.create({
    data: {
      name: 'Wireless Industrial Sensor',
      sku: 'WNS-001',
      category: 'Electronics',
      unitPrice: 45.0,
      currentStock: 150,
      minStockAlert: 10,
      location: 'Rack A-12',
      createdById: warehouseUser.id,
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'High Torque Stepper Motor',
      sku: 'STM-200',
      category: 'Machinery',
      unitPrice: 120.0,
      currentStock: 25,
      minStockAlert: 5,
      location: 'Rack B-04',
      createdById: warehouseUser.id,
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: 'Industrial Power Supply 24V',
      sku: 'PWR-24V',
      category: 'Electronics',
      unitPrice: 85.0,
      currentStock: 4, // Trigger low stock alert!
      minStockAlert: 10,
      location: 'Rack A-02',
      createdById: warehouseUser.id,
    },
  });

  const prod4 = await prisma.product.create({
    data: {
      name: 'Fiber Optic Cable 50m',
      sku: 'FOC-050',
      category: 'Networking',
      unitPrice: 30.0,
      currentStock: 80,
      minStockAlert: 15,
      location: 'Rack C-09',
      createdById: warehouseUser.id,
    },
  });

  console.log('Logging initial stock entries...');
  await prisma.stockLog.createMany({
    data: [
      {
        productId: prod1.id,
        quantityChanged: 150,
        movementType: 'IN',
        reason: 'Initial Inventory Setup',
        createdById: warehouseUser.id,
      },
      {
        productId: prod2.id,
        quantityChanged: 25,
        movementType: 'IN',
        reason: 'Initial Inventory Setup',
        createdById: warehouseUser.id,
      },
      {
        productId: prod3.id,
        quantityChanged: 4,
        movementType: 'IN',
        reason: 'Initial Inventory Setup',
        createdById: warehouseUser.id,
      },
      {
        productId: prod4.id,
        quantityChanged: 80,
        movementType: 'IN',
        reason: 'Initial Inventory Setup',
        createdById: warehouseUser.id,
      },
    ],
  });

  console.log('Creating sample Sales Challan...');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const sampleChallan = await prisma.challan.create({
    data: {
      challanNumber: `CH-${dateStr}-0001`,
      customerId: cust1.id,
      customerName: cust1.name,
      customerMobile: cust1.mobile,
      customerBusiness: cust1.businessName,
      customerAddress: cust1.address,
      totalQuantity: 12,
      grandTotal: 690.0,
      status: 'Confirmed',
      createdById: salesUser.id,
      items: {
        create: [
          {
            productId: prod1.id,
            sku: prod1.sku,
            name: prod1.name,
            unitPrice: prod1.unitPrice,
            quantity: 10,
            totalAmount: 450.0,
          },
          {
            productId: prod2.id,
            sku: prod2.sku,
            name: prod2.name,
            unitPrice: prod2.unitPrice,
            quantity: 2,
            totalAmount: 240.0,
          },
        ],
      },
    },
  });

  // Deduct stock for confirmed sample challan
  await prisma.product.update({
    where: { id: prod1.id },
    data: { currentStock: { decrement: 10 } },
  });
  await prisma.stockLog.create({
    data: {
      productId: prod1.id,
      quantityChanged: 10,
      movementType: 'OUT',
      reason: `Sales Challan ${sampleChallan.challanNumber}`,
      createdById: salesUser.id,
    },
  });

  await prisma.product.update({
    where: { id: prod2.id },
    data: { currentStock: { decrement: 2 } },
  });
  await prisma.stockLog.create({
    data: {
      productId: prod2.id,
      quantityChanged: 2,
      movementType: 'OUT',
      reason: `Sales Challan ${sampleChallan.challanNumber}`,
      createdById: salesUser.id,
    },
  });

  console.log('\n======================================================');
  console.log('  PRISMA DATABASE SEEDED SUCCESSFULLY!');
  console.log('======================================================');
  console.log(' Test Login Credentials:');
  console.log(' 1. Admin:     admin@example.com     / admin123');
  console.log(' 2. Sales:     sales@example.com     / sales123');
  console.log(' 3. Warehouse: warehouse@example.com / wh123');
  console.log(' 4. Accounts:  accounts@example.com  / accounts123');
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
