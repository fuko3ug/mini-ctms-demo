var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var PrismaClient = require('@prisma/client').PrismaClient;
var prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminUser, coordinatorUser, piUser, skinStudy, dermStudy, participantsData, participants, _i, participantsData_1, pData, participant, kitsData, kits, _a, kitsData_1, kData, kit;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Starting seed...');
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'admin@example.com' },
                            update: {},
                            create: {
                                email: 'admin@example.com',
                                name: 'Admin User',
                                role: 'ADMIN',
                                password: 'admin123', // In real app, hash this
                            },
                        })];
                case 1:
                    adminUser = _b.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'coordinator@example.com' },
                            update: {},
                            create: {
                                email: 'coordinator@example.com',
                                name: 'Coordinator User',
                                role: 'COORDINATOR',
                                password: 'coord123',
                            },
                        })];
                case 2:
                    coordinatorUser = _b.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'pi@example.com' },
                            update: {},
                            create: {
                                email: 'pi@example.com',
                                name: 'PI User',
                                role: 'PI',
                                password: 'pi123',
                            },
                        })];
                case 3:
                    piUser = _b.sent();
                    return [4 /*yield*/, prisma.study.upsert({
                            where: { code: 'SKIN2026' },
                            update: {},
                            create: {
                                name: 'Skin Microbiome Study',
                                code: 'SKIN2026',
                                description: 'A study investigating the skin microbiome in patients with dermatological conditions.',
                                status: 'ACTIVE',
                            },
                        })];
                case 4:
                    skinStudy = _b.sent();
                    return [4 /*yield*/, prisma.study.upsert({
                            where: { code: 'DERM2026' },
                            update: {},
                            create: {
                                name: 'Remote Dermatology Follow-up Study',
                                code: 'DERM2026',
                                description: 'A remote follow-up study for patients with chronic skin conditions using teledermatology.',
                                status: 'ACTIVE',
                            },
                        })];
                case 5:
                    dermStudy = _b.sent();
                    participantsData = [
                        {
                            studyId: skinStudy.id,
                            participantCode: 'SKIN001',
                            firstName: 'Jane',
                            lastName: 'Doe',
                            email: 'jane.doe@example.com',
                            phone: '555-123-4567',
                            status: 'REGISTERED',
                            dateOfBirth: new Date('1990-05-15'),
                            address: '123 Main St, Anytown, USA',
                        },
                        {
                            studyId: skinStudy.id,
                            participantCode: 'SKIN002',
                            firstName: 'John',
                            lastName: 'Smith',
                            email: 'john.smith@example.com',
                            phone: '555-987-6543',
                            status: 'SCREENING',
                            dateOfBirth: new Date('1985-08-22'),
                            address: '456 Oak Ave, Somewhere, USA',
                        },
                        {
                            studyId: skinStudy.id,
                            participantCode: 'SKIN003',
                            firstName: 'Emily',
                            lastName: 'Johnson',
                            email: 'emily.johnson@example.com',
                            phone: '555-456-7890',
                            status: 'ENROLLED',
                            dateOfBirth: new Date('1992-12-03'),
                            address: '789 Pine Rd, Elsewhere, USA',
                        },
                        {
                            studyId: skinStudy.id,
                            participantCode: 'SKIN004',
                            firstName: 'Michael',
                            lastName: 'Williams',
                            email: 'michael.williams@example.com',
                            phone: '555-321-6549',
                            status: 'KIT_SENT',
                            dateOfBirth: new Date('1988-03-10'),
                            address: '321 Elm Blvd, Nowhere, USA',
                        },
                        {
                            studyId: skinStudy.id,
                            participantCode: 'SKIN005',
                            firstName: 'Sarah',
                            lastName: 'Brown',
                            email: 'sarah.brown@example.com',
                            phone: '555-654-3210',
                            status: 'KIT_ACTIVATED',
                            dateOfBirth: new Date('1995-07-19'),
                            address: '654 Maple Ln, Anywhere, USA',
                        },
                        {
                            studyId: dermStudy.id,
                            participantCode: 'DERM001',
                            firstName: 'David',
                            lastName: 'Miller',
                            email: 'david.miller@example.com',
                            phone: '555-111-2222',
                            status: 'SAMPLE_RECEIVED',
                            dateOfBirth: new Date('1980-11-30'),
                            address: '111 Cedar St, Somewhere, USA',
                        },
                        {
                            studyId: dermStudy.id,
                            participantCode: 'DERM002',
                            firstName: 'Lisa',
                            lastName: 'Davis',
                            email: 'lisa.davis@example.com',
                            phone: '555-333-4444',
                            status: 'COMPLETED',
                            dateOfBirth: new Date('1993-09-14'),
                            address: '333 Oak Dr, Elsewhere, USA',
                        },
                        {
                            studyId: dermStudy.id,
                            participantCode: 'DERM003',
                            firstName: 'Robert',
                            lastName: 'Garcia',
                            email: 'robert.garcia@example.com',
                            phone: '555-555-6666',
                            status: 'WITHDRAWN',
                            dateOfBirth: new Date('1987-02-28'),
                            address: '555 Pine Ave, Nowhere, USA',
                        },
                        {
                            studyId: dermStudy.id,
                            participantCode: 'DERM004',
                            firstName: 'Amanda',
                            lastName: 'Wilson',
                            email: 'amanda.wilson@example.com',
                            phone: '555-777-8888',
                            status: 'REGISTERED',
                            dateOfBirth: new Date('1991-05-05'),
                            address: '777 Elm Rd, Anywhere, USA',
                        },
                        {
                            studyId: dermStudy.id,
                            participantCode: 'DERM005',
                            firstName: 'Kevin',
                            lastName: 'Taylor',
                            email: 'kevin.taylor@example.com',
                            phone: '555-999-0000',
                            status: 'SCREENING',
                            dateOfBirth: new Date('1986-12-25'),
                            address: '999 Maple Ln, Somewhere, USA',
                        },
                    ];
                    participants = [];
                    _i = 0, participantsData_1 = participantsData;
                    _b.label = 6;
                case 6:
                    if (!(_i < participantsData_1.length)) return [3 /*break*/, 10];
                    pData = participantsData_1[_i];
                    return [4 /*yield*/, prisma.participant.upsert({
                            where: { participantCode: pData.participantCode },
                            update: {},
                            create: pData,
                        })];
                case 7:
                    participant = _b.sent();
                    participants.push(participant);
                    console.log("Created participant: ".concat(participant.participantCode));
                    // Create audit log for participant creation
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                actorId: adminUser.id,
                                actorRole: adminUser.role,
                                action: 'CREATE_PARTICIPANT',
                                targetType: 'PARTICIPANT',
                                targetId: participant.id,
                                studyId: participant.studyId,
                                metadata: {
                                    createdBy: adminUser.email,
                                    participantCode: participant.participantCode,
                                },
                            },
                        })];
                case 8:
                    // Create audit log for participant creation
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 6];
                case 10:
                    kitsData = [
                        {
                            participantId: participants[3].id, // SKIN004
                            kitCode: 'KIT-SKIN001',
                            status: 'SHIPPED',
                        },
                        {
                            participantId: participants[4].id, // SKIN005
                            kitCode: 'KIT-SKIN002',
                            status: 'SHIPPED',
                        },
                        {
                            participantId: participants[5].id, // DERM001
                            kitCode: 'KIT-DERM001',
                            status: 'SHIPPED',
                        },
                        {
                            participantId: participants[6].id, // DERM002
                            kitCode: 'KIT-DERM002',
                            status: 'SHIPPED',
                        },
                    ];
                    kits = [];
                    _a = 0, kitsData_1 = kitsData;
                    _b.label = 11;
                case 11:
                    if (!(_a < kitsData_1.length)) return [3 /*break*/, 15];
                    kData = kitsData_1[_a];
                    return [4 /*yield*/, prisma.kit.upsert({
                            where: { kitCode: kData.kitCode },
                            update: {},
                            create: kData,
                        })];
                case 12:
                    kit = _b.sent();
                    kits.push(kit);
                    console.log("Created kit: ".concat(kit.kitCode));
                    // Create audit log for kit creation
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                actorId: coordinatorUser.id,
                                actorRole: coordinatorUser.role,
                                action: 'CREATE_KIT',
                                targetType: 'KIT',
                                targetId: kit.id,
                                studyId: kit.participant.studyId, // We need to get the studyId from the participant
                                metadata: {
                                    createdBy: coordinatorUser.email,
                                    kitCode: kit.kitCode,
                                    participantId: kit.participantId,
                                },
                            },
                        })];
                case 13:
                    // Create audit log for kit creation
                    _b.sent();
                    _b.label = 14;
                case 14:
                    _a++;
                    return [3 /*break*/, 11];
                case 15: 
                // Update some kits to change status and create audit logs
                // Activate the kit for SKIN005
                return [4 /*yield*/, prisma.kit.update({
                        where: { id: kits[1].id },
                        data: {
                            status: 'ACTIVATED',
                            activatedAt: new Date(),
                        },
                    })];
                case 16:
                    // Update some kits to change status and create audit logs
                    // Activate the kit for SKIN005
                    _b.sent();
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                actorId: coordinatorUser.id,
                                actorRole: coordinatorUser.role,
                                action: 'ACTIVATE_KIT',
                                targetType: 'KIT',
                                targetId: kits[1].id,
                                studyId: participants[4].studyId,
                                metadata: {
                                    activatedBy: coordinatorUser.email,
                                    kitCode: kits[1].kitCode,
                                },
                            },
                        })];
                case 17:
                    _b.sent();
                    // Receive the kit for DERM001
                    return [4 /*yield*/, prisma.kit.update({
                            where: { id: kits[2].id },
                            data: {
                                status: 'RECEIVED',
                                receivedAt: new Date(),
                            },
                        })];
                case 18:
                    // Receive the kit for DERM001
                    _b.sent();
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                actorId: coordinatorUser.id,
                                actorRole: coordinatorUser.role,
                                action: 'RECEIVE_KIT',
                                targetType: 'KIT',
                                targetId: kits[2].id,
                                studyId: participants[5].studyId,
                                metadata: {
                                    receivedBy: coordinatorUser.email,
                                    kitCode: kits[2].kitCode,
                                },
                            },
                        })];
                case 19:
                    _b.sent();
                    // Update some participant statuses and create audit logs
                    // Change SKIN002 from SCREENING to ENROLLED
                    return [4 /*yield*/, prisma.participant.update({
                            where: { id: participants[1].id },
                            data: {
                                status: 'ENROLLED',
                            },
                        })];
                case 20:
                    // Update some participant statuses and create audit logs
                    // Change SKIN002 from SCREENING to ENROLLED
                    _b.sent();
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                actorId: piUser.id,
                                actorRole: piUser.role,
                                action: 'UPDATE_PARTICIPANT_STATUS',
                                targetType: 'PARTICIPANT',
                                targetId: participants[1].id,
                                studyId: participants[1].studyId,
                                metadata: {
                                    changedBy: piUser.email,
                                    previousStatus: 'SCREENING',
                                    newStatus: 'ENROLLED',
                                },
                            },
                        })];
                case 21:
                    _b.sent();
                    console.log('Seed completed successfully.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () {
    (function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.$disconnect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
