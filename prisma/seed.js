"use strict";
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ("get" in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, "default", {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o["default"] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (
                    k !== "default" &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../src/app/shared/prisma"));
const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma_1.default.user.findFirst({
            where: {
                role: client_1.UserRole.SUPERADMIN,
            },
        });
        if (isExistSuperAdmin) {
            console.log("Super admin already exists!");
            return;
        }
        const hashedPassword = await bcrypt.hash("superadmin", 12);
        const superAdminData = await prisma_1.default.user.create({
            data: {
                email: "super@admin.com",
                password: hashedPassword,
                role: client_1.UserRole.SUPERADMIN,
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
        await prisma_1.default.$disconnect();
    }
};
seedSuperAdmin();
