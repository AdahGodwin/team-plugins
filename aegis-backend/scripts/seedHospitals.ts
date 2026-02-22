import 'dotenv/config';
import mongoose from 'mongoose';

interface IHospital {
  name:           string;
  address:        string;
  phone:          string;
  email:          string;
  registrationNo: string;
  isActive:       boolean;
}

const HospitalSchema = new mongoose.Schema<IHospital>(
  {
    name:           { type: String, required: true, trim: true, unique: true },
    address:        { type: String, required: true },
    phone:          { type: String, required: true },
    email:          { type: String, required: true, lowercase: true, trim: true },
    registrationNo: { type: String, required: true, trim: true },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Hospital =
  mongoose.models.Hospital ??
  mongoose.model<IHospital>('Hospital', HospitalSchema);

// ── Seed data — 10 Nigerian hospitals ─────────────────────────────────────────
const hospitals: IHospital[] = [
  {
    name:           'Lagos University Teaching Hospital',
    address:        'Idi-Araba, Surulere, Lagos',
    phone:          '+234-1-774-0000',
    email:          'info@luth.gov.ng',
    registrationNo: 'LUTH-001',
    isActive:       true,
  },
  {
    name:           'University College Hospital Ibadan',
    address:        'Queen Elizabeth Road, Ibadan, Oyo State',
    phone:          '+234-2-241-0088',
    email:          'contact@uch-ibadan.edu.ng',
    registrationNo: 'UCH-002',
    isActive:       true,
  },
  {
    name:           'Obafemi Awolowo University Teaching Hospital',
    address:        'Ile-Ife, Osun State',
    phone:          '+234-36-230-384',
    email:          'info@oauthc.gov.ng',
    registrationNo: 'OAUTHC-003',
    isActive:       true,
  },
  {
    name:           'National Hospital Abuja',
    address:        'Central Business District, Abuja, FCT',
    phone:          '+234-9-523-0001',
    email:          'info@nationalhospital.gov.ng',
    registrationNo: 'NHA-004',
    isActive:       true,
  },
  {
    name:           'University of Nigeria Teaching Hospital',
    address:        'Ituku-Ozalla, Enugu State',
    phone:          '+234-42-253-100',
    email:          'info@unth.edu.ng',
    registrationNo: 'UNTH-005',
    isActive:       true,
  },
  {
    name:           'Aminu Kano Teaching Hospital',
    address:        'Zaria Road, Kano, Kano State',
    phone:          '+234-64-648-830',
    email:          'info@akth.edu.ng',
    registrationNo: 'AKTH-006',
    isActive:       true,
  },
  {
    name:           'Jos University Teaching Hospital',
    address:        'Jos, Plateau State',
    phone:          '+234-73-460-380',
    email:          'info@juth.gov.ng',
    registrationNo: 'JUTH-007',
    isActive:       true,
  },
  {
    name:           'Federal Medical Centre Umuahia',
    address:        'Umuahia, Abia State',
    phone:          '+234-88-220-102',
    email:          'fmcumuahia@health.gov.ng',
    registrationNo: 'FMC-UMU-008',
    isActive:       true,
  },
  {
    name:           'Irrua Specialist Teaching Hospital',
    address:        'Irrua, Edo State',
    phone:          '+234-55-800-200',
    email:          'info@isth.gov.ng',
    registrationNo: 'ISTH-009',
    isActive:       true,
  },
  {
    name:           'Ekiti State University Teaching Hospital',
    address:        'Ado-Ekiti, Ekiti State',
    phone:          '+234-30-250-100',
    email:          'info@eksuth.edu.ng',
    registrationNo: 'EKSUTH-010',
    isActive:       true,
  },
];

// ── Runner ────────────────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set in your environment');

  console.log('🔌 Connecting to MongoDB…');
  await mongoose.connect(uri);
  console.log('✅ Connected\n');

  let created = 0;
  let skipped = 0;

  for (const h of hospitals) {
    const exists = await Hospital.findOne({ registrationNo: h.registrationNo });
    if (exists) {
      console.log(`  ⏭  Skipped  — ${h.name} (already exists)`);
      skipped++;
    } else {
      await Hospital.create(h);
      console.log(`  ✅ Inserted — ${h.name}`);
      created++;
    }
  }

  console.log(`\n📊 Done — ${created} inserted, ${skipped} skipped`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
