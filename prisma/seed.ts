import { UserRole } from "@prisma/client";

import * as bcrypt from "bcrypt";
import prisma from "../src/app/shared/prisma";

const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPERADMIN,
            },
        });

        if (isExistSuperAdmin) {
            console.log("Super admin already exists!");
            return;
        }

        const hashedPassword = await bcrypt.hash("superadmin", 12);

        const superAdminData = await prisma.user.create({
            data: {
                email: "super@admin.com",
                password: hashedPassword,
                role: UserRole.SUPERADMIN,
                admin: {
                    create: {
                        name: "Super Admin",
                        //email: "super@admin.com",
                        contactNumber: "01234567890",
                    },
                },
            },
        });

        console.log("Super Admin Created Successfully!", superAdminData);
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
};

seedSuperAdmin();
