/**
 * Aegis full seed script
 * ─────────────────────
 * Run:  npm run seed
 *
 * What it does (all idempotent — safe to re-run):
 *   1. Seeds 10 Nigerian hospitals
 *   2. Creates one target hospital: Lagos University Teaching Hospital
 *   3. Creates one admin user linked to that hospital
 *   4. Creates 10 patient users also linked to that hospital
 *   5. Prints login credentials at the end
 *
 * Admin login after seeding:
 *   email:    admin@luth.gov.ng
 *   password: Admin1234!
 *
 * Patient logins after seeding:
 *   email:    patient1@aegis.dev … patient10@aegis.dev
 *   password: Patient1234!
 */

import mongoose, { Schema, type Document, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Inline model definitions (avoids Next.js @/ alias issues in scripts) ─────

interface IHospital extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; address: string; phone: string;
  email: string; registrationNo: string; isActive: boolean;
}
const HospitalSchema = new Schema<IHospital>({
  name:           { type: String, required: true, trim: true, unique: true },
  address:        { type: String, required: true },
  phone:          { type: String, required: true },
  email:          { type: String, required: true, lowercase: true, trim: true },
  registrationNo: { type: String, required: true, trim: true },
  isActive:       { type: Boolean, default: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
const Hospital: Model<IHospital> =
  mongoose.models.Hospital ?? mongoose.model<IHospital>('Hospital', HospitalSchema);

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string; lastName: string;
  email: string; password: string; role: 'patient' | 'admin';
}
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['patient', 'admin'], default: 'patient' },
}, { timestamps: true });
const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);

interface IPatient extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  phoneNumber?: string; gender?: string; dateOfBirth?: Date;
  address?: string; bloodGroup?: string; allergies: string[];
  smokingStatus: 'never' | 'former' | 'current'; diabetic: boolean;
  weight?: number; height?: number;
  caregiverName?: string; caregiverEmail?: string; caregiverPhone?: string;
  consentHealth: boolean; consentTerms: boolean;
}
const PatientSchema = new Schema<IPatient>({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId:    { type: Schema.Types.ObjectId, ref: 'Hospital', default: null },
  phoneNumber:   { type: String },
  gender:        { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth:   { type: Date },
  address:       { type: String },
  bloodGroup:    { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  allergies:     { type: [String], default: [] },
  smokingStatus: { type: String, enum: ['never', 'former', 'current'], default: 'never' },
  diabetic:      { type: Boolean, default: false },
  weight:        { type: Number },
  height:        { type: Number },
  caregiverName:  { type: String },
  caregiverEmail: { type: String },
  caregiverPhone: { type: String },
  consentHealth: { type: Boolean, required: true },
  consentTerms:  { type: Boolean, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
const Patient: Model<IPatient> =
  mongoose.models.Patient ?? mongoose.model<IPatient>('Patient', PatientSchema);

interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; hospitalId: mongoose.Types.ObjectId;
  hospitalName: string; hospitalAddress: string; hospitalPhone: string;
  hospitalEmail: string; registrationNo: string; specialty: string;
  licenseNumber: string; title: string; department: string;
  jobTitle: string; isVerified: boolean;
}
const AdminSchema = new Schema<IAdmin>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId:      { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
  hospitalName:    { type: String, required: true, trim: true },
  hospitalAddress: { type: String, required: true },
  hospitalPhone:   { type: String, required: true },
  hospitalEmail:   { type: String, required: true, lowercase: true, trim: true },
  registrationNo:  { type: String, required: true, trim: true },
  specialty:       { type: String, required: true, trim: true },
  licenseNumber:   { type: String, required: true, trim: true },
  title:           { type: String, required: true, trim: true },
  department:      { type: String, required: true, trim: true },
  jobTitle:        { type: String, required: true, trim: true },
  isVerified:      { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });
const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>('Admin', AdminSchema);

// ─── Seed data ────────────────────────────────────────────────────────────────

const HOSPITALS = [
  { name: 'Lagos University Teaching Hospital',          address: 'Idi-Araba, Surulere, Lagos',                    phone: '+234-1-774-0000',  email: 'info@luth.gov.ng',               registrationNo: 'LUTH-001' },
  { name: 'University College Hospital Ibadan',          address: 'Queen Elizabeth Road, Ibadan, Oyo State',       phone: '+234-2-241-0088',  email: 'contact@uch-ibadan.edu.ng',      registrationNo: 'UCH-002'  },
  { name: 'Obafemi Awolowo University Teaching Hospital',address: 'Ile-Ife, Osun State',                           phone: '+234-36-230-384',  email: 'info@oauthc.gov.ng',             registrationNo: 'OAUTHC-003' },
  { name: 'National Hospital Abuja',                     address: 'Central Business District, Abuja, FCT',         phone: '+234-9-523-0001',  email: 'info@nationalhospital.gov.ng',   registrationNo: 'NHA-004'  },
  { name: 'University of Nigeria Teaching Hospital',     address: 'Ituku-Ozalla, Enugu State',                     phone: '+234-42-253-100',  email: 'info@unth.edu.ng',               registrationNo: 'UNTH-005' },
  { name: 'Aminu Kano Teaching Hospital',                address: 'Zaria Road, Kano, Kano State',                  phone: '+234-64-648-830',  email: 'info@akth.edu.ng',               registrationNo: 'AKTH-006' },
  { name: 'Jos University Teaching Hospital',            address: 'Jos, Plateau State',                            phone: '+234-73-460-380',  email: 'info@juth.gov.ng',               registrationNo: 'JUTH-007' },
  { name: 'Federal Medical Centre Umuahia',              address: 'Umuahia, Abia State',                           phone: '+234-88-220-102',  email: 'fmcumuahia@health.gov.ng',       registrationNo: 'FMC-UMU-008' },
  { name: 'Irrua Specialist Teaching Hospital',          address: 'Irrua, Edo State',                              phone: '+234-55-800-200',  email: 'info@isth.gov.ng',               registrationNo: 'ISTH-009' },
  { name: 'Ekiti State University Teaching Hospital',    address: 'Ado-Ekiti, Ekiti State',                        phone: '+234-30-250-100',  email: 'info@eksuth.edu.ng',             registrationNo: 'EKSUTH-010' },
];

// The one hospital patients + admin will be linked to
const TARGET_HOSPITAL_REG_NO = 'LUTH-001';

const ADMIN_CREDENTIALS = {
  email:    'admin@luth.gov.ng',
  password: 'Admin1234!',
};

const PATIENT_PASSWORD = 'Patient1234!';

// 10 realistic Nigerian patients
const PATIENT_DATA = [
  { firstName: 'Chukwuemeka', lastName: 'Obi',      gender: 'Male',   dob: '1968-03-15', bloodGroup: 'O+',  phone: '+234-801-111-0001', weight: 84, height: 172, smoking: 'never',   diabetic: true,  address: 'Surulere, Lagos' },
  { firstName: 'Ngozi',       lastName: 'Adeyemi',  gender: 'Female', dob: '1975-07-22', bloodGroup: 'A+',  phone: '+234-802-222-0002', weight: 68, height: 160, smoking: 'never',   diabetic: false, address: 'Victoria Island, Lagos' },
  { firstName: 'Babatunde',   lastName: 'Fashola',  gender: 'Male',   dob: '1962-11-04', bloodGroup: 'B+',  phone: '+234-803-333-0003', weight: 91, height: 178, smoking: 'former',  diabetic: true,  address: 'Ikeja, Lagos' },
  { firstName: 'Amaka',       lastName: 'Ezenwachi', gender: 'Female', dob: '1980-05-30', bloodGroup: 'AB+', phone: '+234-804-444-0004', weight: 72, height: 163, smoking: 'never',   diabetic: false, address: 'Enugu, Enugu State' },
  { firstName: 'Usman',       lastName: 'Garba',    gender: 'Male',   dob: '1955-01-18', bloodGroup: 'O-',  phone: '+234-805-555-0005', weight: 78, height: 169, smoking: 'current', diabetic: true,  address: 'Kano, Kano State' },
  { firstName: 'Chidinma',    lastName: 'Nwosu',    gender: 'Female', dob: '1990-08-11', bloodGroup: 'A-',  phone: '+234-806-666-0006', weight: 61, height: 158, smoking: 'never',   diabetic: false, address: 'Onitsha, Anambra State' },
  { firstName: 'Olumide',     lastName: 'Abiodun',  gender: 'Male',   dob: '1972-12-27', bloodGroup: 'B-',  phone: '+234-807-777-0007', weight: 88, height: 175, smoking: 'former',  diabetic: false, address: 'Ibadan, Oyo State' },
  { firstName: 'Fatimah',     lastName: 'Ibrahim',  gender: 'Female', dob: '1967-04-09', bloodGroup: 'O+',  phone: '+234-808-888-0008', weight: 75, height: 162, smoking: 'never',   diabetic: true,  address: 'Kaduna, Kaduna State' },
  { firstName: 'Emeka',       lastName: 'Eze',      gender: 'Male',   dob: '1958-09-03', bloodGroup: 'A+',  phone: '+234-809-999-0009', weight: 82, height: 170, smoking: 'current', diabetic: true,  address: 'Aba, Abia State' },
  { firstName: 'Blessing',    lastName: 'Okeke',    gender: 'Female', dob: '1985-02-14', bloodGroup: 'AB-', phone: '+234-810-000-0010', weight: 64, height: 155, smoking: 'never',   diabetic: false, address: 'Port Harcourt, Rivers State' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(icon: string, msg: string) { console.log(`  ${icon}  ${msg}`); }

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set in .env.local');

  console.log('\n🔌 Connecting to MongoDB…');
  await mongoose.connect(uri);
  console.log('✅ Connected\n');

  // ── 1. Seed hospitals ───────────────────────────────────────────────────────
  console.log('🏥 Seeding hospitals…');
  for (const h of HOSPITALS) {
    const exists = await Hospital.findOne({ registrationNo: h.registrationNo });
    if (exists) {
      log('⏭', `Skipped  — ${h.name}`);
    } else {
      await Hospital.create({ ...h, isActive: true });
      log('✅', `Inserted — ${h.name}`);
    }
  }

  // ── 2. Find the target hospital ─────────────────────────────────────────────
  const hospital = await Hospital.findOne({ registrationNo: TARGET_HOSPITAL_REG_NO });
  if (!hospital) throw new Error(`Target hospital ${TARGET_HOSPITAL_REG_NO} not found after seeding`);
  const hospitalId = hospital._id;
  console.log(`\n🎯 Target hospital: ${hospital.name} (${hospitalId})\n`);

  // ── 3. Seed admin ───────────────────────────────────────────────────────────
  console.log('👩‍⚕️ Seeding admin…');
  const existingAdminUser = await User.findOne({ email: ADMIN_CREDENTIALS.email });
  if (existingAdminUser) {
    log('⏭', `Admin already exists — ${ADMIN_CREDENTIALS.email}`);
  } else {
    const hashedPw = await bcrypt.hash(ADMIN_CREDENTIALS.password, 12);
    const adminUser = await User.create({
      firstName: 'Sarah',
      lastName:  'Okafor',
      email:     ADMIN_CREDENTIALS.email,
      password:  hashedPw,
      role:      'admin',
    });
    await Admin.create({
      userId:          adminUser._id,
      hospitalId,
      hospitalName:    hospital.name,
      hospitalAddress: hospital.address,
      hospitalPhone:   hospital.phone,
      hospitalEmail:   hospital.email,
      registrationNo:  hospital.registrationNo,
      title:           'Dr',
      specialty:       'Cardiology',
      licenseNumber:   'GMC-LUTH-001',
      department:      'Cardiology',
      jobTitle:        'Consultant Cardiologist',
      isVerified:      true,
    });
    log('✅', `Created admin — ${ADMIN_CREDENTIALS.email}`);
  }

  // ── 4. Seed patients ────────────────────────────────────────────────────────
  console.log('\n🧑‍🤝‍🧑 Seeding patients…');
  const hashedPatientPw = await bcrypt.hash(PATIENT_PASSWORD, 12);

  for (let i = 0; i < PATIENT_DATA.length; i++) {
    const p    = PATIENT_DATA[i];
    const email = `patient${i + 1}@aegis.dev`;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      log('⏭', `Skipped  — ${email} (${p.firstName} ${p.lastName})`);
      continue;
    }

    const user = await User.create({
      firstName: p.firstName,
      lastName:  p.lastName,
      email,
      password:  hashedPatientPw,
      role:      'patient',
    });

    await Patient.create({
      userId:        user._id,
      hospitalId,
      phoneNumber:   p.phone,
      gender:        p.gender,
      dateOfBirth:   new Date(p.dob),
      address:       p.address,
      bloodGroup:    p.bloodGroup,
      smokingStatus: p.smoking,
      diabetic:      p.diabetic,
      weight:        p.weight,
      height:        p.height,
      allergies:     [],
      caregiverName:  `${p.firstName}'s Caregiver`,
      caregiverPhone: p.phone.replace('0', '1'),
      consentHealth: true,
      consentTerms:  true,
    });

    log('✅', `Created  — ${email}  (${p.firstName} ${p.lastName}, ${p.gender}, DOB ${p.dob})`);
  }

  // ── 5. Summary ──────────────────────────────────────────────────────────────
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                     ✅  SEED COMPLETE                        ║
╠══════════════════════════════════════════════════════════════╣
║  Hospital : Lagos University Teaching Hospital               ║
║  ID       : ${hospitalId.toString().padEnd(49)}║
╠══════════════════════════════════════════════════════════════╣
║  ADMIN LOGIN                                                 ║
║  email    : admin@luth.gov.ng                                ║
║  password : Admin1234!                                       ║
╠══════════════════════════════════════════════════════════════╣
║  PATIENT LOGINS  (patient1@aegis.dev … patient10@aegis.dev) ║
║  password : Patient1234!                                     ║
╚══════════════════════════════════════════════════════════════╝
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
