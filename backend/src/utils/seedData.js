// Initial compassionate seed data for Alzheimer's memory aid
// Features English and Malayalam audio prompts & warm, reassuring text

const defaultCaregiverId = '67cf00000000000000000002';

const defaultPatient = {
  _id: '67cf00000000000000000001',
  caregiverId: defaultCaregiverId,
  fullName: 'Thomas Kurian',
  preferredName: 'Grandpa Tom',
  age: 76,
  stage: 'Early',
  photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  emergencyNotes: 'Early-stage Alzheimer’s. Responds warmly to old photographs, Malayalam songs, and familiar names. Needs reminder for morning BP tablet.',
  address: 'Rose Villa, Hill View Road, Kochi, Kerala',
  primaryDoctor: {
    name: 'Dr. Elizabeth Roy (Neurologist)',
    phone: '+91 98470 12345',
    clinic: 'City Memorial Neurology Center'
  },
  preferredLanguage: 'en',
  voiceEnabled: true,
  highContrast: false,
  fontSize: 'large',
  consentGiven: true
};

const defaultCaregiver = {
  _id: '67cf00000000000000000002',
  name: 'Priya Thomas',
  email: 'priya@example.com',
  password: 'password123', // Demo login
  role: 'caregiver',
  phone: '+91 98471 23456',
  patientProfile: defaultPatient._id,
  preferredLanguage: 'en'
};

const defaultFamilyMembers = [
  {
    _id: '67cf00000000000000000011',
    patientId: defaultPatient._id,
    name: 'Priya Thomas',
    relationship: 'Daughter & Primary Caregiver',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    phoneNumber: '+91 98471 23456',
    description: 'Priya is your loving daughter who stays with you in Kochi. She prepares your morning tea and takes you for garden walks.',
    malayalamDescription: 'ഇത് നിങ്ങളുടെ മകൾ പ്രിയയാണ്. അവൾ നിങ്ങളോടൊപ്പം കൊച്ചിയിൽ താമസിക്കുന്നു. എല്ലാ ദിവസവും നിങ്ങൾക്ക് പ്രഭാത ചായ ഉണ്ടാക്കി നൽകുന്നത് പ്രിയയാണ്.',
    voicePrompt: 'This is Priya. She is your loving daughter and caregiver who is always here with you.',
    malayalamVoicePrompt: 'ഇത് പ്രിയയാണ്. നിങ്ങളുടെ സ്നേഹനിധിയായ മകൾ. അവൾ എപ്പോഴും നിങ്ങളുടെ കൂടെയുണ്ട്.',
    frequentVisitor: true,
    isEmergencyContact: true,
    notes: 'Lives in the same house; manages daily appointments.'
  },
  {
    _id: '67cf00000000000000000012',
    patientId: defaultPatient._id,
    name: 'Rahul Kurian',
    relationship: 'Son',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    phoneNumber: '+91 98472 34567',
    description: 'Rahul is your elder son. He works as an engineer in Bangalore and video-calls you every Sunday evening.',
    malayalamDescription: 'ഇത് നിങ്ങളുടെ മൂത്ത മകൻ രാഹുൽ ആണ്. രാഹുൽ ബാംഗ്ലൂരിൽ എഞ്ചിനീയറാണ്. എല്ലാ ഞായറാഴ്ചയും അവൻ വിളിക്കാറുണ്ട്.',
    voicePrompt: 'This is Rahul. He is your son who loves you very much.',
    malayalamVoicePrompt: 'ഇത് രാഹുൽ. നിങ്ങളുടെ മകനാണ്.',
    frequentVisitor: true,
    isEmergencyContact: true,
    notes: 'Visits twice every month on weekends.'
  },
  {
    _id: '67cf00000000000000000013',
    patientId: defaultPatient._id,
    name: 'Ananya Kurian',
    relationship: 'Granddaughter',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    phoneNumber: '+91 98473 45678',
    description: 'Ananya is your 8-year-old granddaughter. She loves drawing birds and listening to your bedtime stories.',
    malayalamDescription: 'ഇത് നിങ്ങളുടെ കൊച്ചുമകൾ അനന്യയാണ്. അവൾക്ക് വരയ്ക്കാനും നിങ്ങളുടെ കഥകൾ കേൾക്കാനും വളരെ ഇഷ്ടമാണ്.',
    voicePrompt: 'This is Ananya. She is your sweet granddaughter.',
    malayalamVoicePrompt: 'ഇത് അനന്യ. നിങ്ങളുടെ പ്രിയപ്പെട്ട കൊച്ചുമകൾ.',
    frequentVisitor: true,
    isEmergencyContact: false,
    notes: 'Brings her sketchbooks when she visits.'
  },
  {
    _id: '67cf00000000000000000014',
    patientId: defaultPatient._id,
    name: 'Mary Thomas',
    relationship: 'Beloved Wife',
    photoUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80',
    phoneNumber: '',
    description: 'Mary is your dear wife of 48 years. Together you raised Priya and Rahul and built your home in Kochi.',
    malayalamDescription: 'ഇത് നിങ്ങളുടെ പ്രിയ പത്നി മേരിയാണ്. 48 വർഷമായി നിങ്ങൾ ഒന്നിച്ച് ജീവിച്ചു.',
    voicePrompt: 'This is Mary. She is your beloved wife and lifelong partner.',
    malayalamVoicePrompt: 'ഇത് നിങ്ങളുടെ പ്രിയ പത്നി മേരി.',
    frequentVisitor: true,
    isEmergencyContact: false,
    notes: 'Married on May 14, 1978.'
  }
];

const defaultMemories = [
  {
    _id: '67cf00000000000000000021',
    patientId: defaultPatient._id,
    title: 'Wedding Day in Alappuzha Church',
    category: 'Special Events',
    date: 'May 14, 1978',
    location: 'St. Joseph Church, Alappuzha',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    description: 'A beautiful sunny Sunday when you and Mary exchanged rings surrounded by family and church bells. Everyone loved your white traditional suit.',
    malayalamDescription: '1978 മെയ് 14 ആലപ്പുഴ സെന്റ് ജോസഫ്സ് പള്ളിയിൽ വെച്ച് നടന്ന നിങ്ങളുടെയും മേരിയുടെയും വിവാഹം. വലിയൊരു വിരുന്നും സുഹൃത്തുക്കളുടെ സംഗമവും ഉണ്ടായിരുന്നു.',
    peopleTagged: ['Mary Thomas'],
    audioText: 'This is your wedding day in Alappuzha with Mary on May 14, 1978. It was a joyful, sunny day with all your dear ones.',
    favorite: true
  },
  {
    _id: '67cf00000000000000000022',
    patientId: defaultPatient._id,
    title: 'Rahul’s College Graduation in Bangalore',
    category: 'Education',
    date: 'July 22, 2004',
    location: 'Bangalore Institute of Technology',
    photoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: 'You were so proud when Rahul walked across the stage to receive his engineering degree with gold honors. You treated the whole family to dinner.',
    malayalamDescription: 'രാഹുൽ എഞ്ചിനീയറിംഗ് ബിരുദം നേടിയ ദിവസം. നിങ്ങൾ വളരെ സന്തോഷത്തോടും അഭിമാനത്തോടും കൂടി അവനെ കെട്ടിപ്പിടിച്ചു.',
    peopleTagged: ['Rahul Kurian', 'Priya Thomas'],
    audioText: 'Rahul’s college graduation day. You traveled to Bangalore and celebrated his engineering degree together.',
    favorite: true
  },
  {
    _id: '67cf00000000000000000023',
    patientId: defaultPatient._id,
    title: 'Childhood Home by the River',
    category: 'Childhood',
    date: 'Summer 1958',
    location: 'Pampa Riverbank, Chengannur',
    photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    description: 'The green ancestral house where you grew up swimming in the river with your brothers and climbing mango trees during summer vacation.',
    malayalamDescription: 'ചെങ്ങന്നൂരിലെ പമ്പാനദിക്കരയിലുള്ള നിങ്ങളുടെ തറവാട് വീട്. കുട്ടിക്കാലത്ത് മാങ്ങ പറിച്ചതും നീന്തിയതും ഓർക്കുന്നുണ്ടോ?',
    peopleTagged: [],
    audioText: 'Your childhood ancestral home by the Pampa river in Chengannur, surrounded by coconut palms and mango trees.',
    favorite: false
  },
  {
    _id: '67cf00000000000000000024',
    patientId: defaultPatient._id,
    title: 'Priya’s 10th Birthday Picnic',
    category: 'Family',
    date: 'December 18, 1996',
    location: 'Vembanad Lake Garden',
    photoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
    description: 'You made paper boats with Priya on the lake shore and sang Malayalam songs while watching the traditional houseboats glide by.',
    malayalamDescription: 'പ്രിയയുടെ പത്താം പിറന്നാൾ ആഘോഷം. വേമ്പനാട്ട് കായലിന്റെ തീരത്ത് നിങ്ങൾ കുടുംബത്തോടൊപ്പം ചെലവഴിച്ച മനോഹര ദിനം.',
    peopleTagged: ['Priya Thomas'],
    audioText: 'Priya’s tenth birthday celebration by Vembanad Lake. You made paper boats together.',
    favorite: true
  }
];

const defaultReminders = [
  {
    _id: '67cf00000000000000000031',
    patientId: defaultPatient._id,
    title: 'Morning Blood Pressure Medication',
    category: 'medication',
    time: '08:30',
    dosageOrInstruction: '1 Tablet (Amlodipine 5mg) with warm water after breakfast',
    audioPrompt: 'Good morning Thomas. It is 8:30 AM. Please take your blood pressure tablet with a glass of warm water.',
    malayalamAudioPrompt: 'സുപ്രഭാതം തോമസ്. രാവിലെ 8:30 ആയി. പ്രഭാതഭക്ഷണത്തിന് ശേഷം രക്തസമ്മർദ്ദത്തിനുള്ള ഗുളിക കഴിക്കുക.',
    repeat: 'daily',
    completed: false,
    date: new Date().toISOString().split('T')[0],
    missed: false,
    notes: 'Prescribed by Dr. Elizabeth Roy. Caregiver confirmed.'
  },
  {
    _id: '67cf00000000000000000032',
    patientId: defaultPatient._id,
    title: 'Drink a Glass of Fresh Water',
    category: 'water',
    time: '11:00',
    dosageOrInstruction: 'Drink 1 full tall glass of fresh water to stay hydrated',
    audioPrompt: 'It is 11:00 AM. Time to drink a nice, refreshing glass of water.',
    malayalamAudioPrompt: 'രാവിലെ 11:00 ആയി. ഒരു ഗ്ലാസ്സ് ശുദ്ധമായ വെള്ളം കുടിക്കാൻ സമയമായി.',
    repeat: 'daily',
    completed: true,
    completedAt: new Date(Date.now() - 3600000),
    date: new Date().toISOString().split('T')[0],
    missed: false,
    notes: 'Important for kidney function and alertness.'
  },
  {
    _id: '67cf00000000000000000033',
    patientId: defaultPatient._id,
    title: 'Healthy Lunch with Family',
    category: 'meals',
    time: '13:00',
    dosageOrInstruction: 'Rice, dal, steamed vegetables, and fish curry with Priya',
    audioPrompt: 'Lunch time at 1:00 PM. Priya has prepared a warm and delicious meal for you.',
    malayalamAudioPrompt: 'ഉച്ചയ്ക്ക് 1:00 ആയി. ഉച്ചഭക്ഷണം കഴിക്കാൻ സമയമായി.',
    repeat: 'daily',
    completed: false,
    date: new Date().toISOString().split('T')[0],
    missed: false,
    notes: 'Keep salt low as advised by cardiologist.'
  },
  {
    _id: '67cf00000000000000000034',
    patientId: defaultPatient._id,
    title: 'Gentle Evening Garden Walk',
    category: 'activity',
    time: '17:00',
    dosageOrInstruction: '15-minute gentle walk around the flowering garden with Priya',
    audioPrompt: 'It is 5:00 in the evening. Time for your pleasant garden stroll and fresh breeze.',
    malayalamAudioPrompt: 'വൈകുന്നേരം 5:00 ആയി. പൂന്തോട്ടത്തിൽ അല്പം നടക്കാൻ സമയമായി.',
    repeat: 'daily',
    completed: false,
    date: new Date().toISOString().split('T')[0],
    missed: false,
    notes: 'Wear comfortable walking slippers.'
  },
  {
    _id: '67cf00000000000000000035',
    patientId: defaultPatient._id,
    title: 'Evening Memory Multivitamin',
    category: 'medication',
    time: '20:30',
    dosageOrInstruction: '1 Vitamin B-Complex tablet after dinner',
    audioPrompt: 'It is 8:30 PM. Time for your evening vitamin tablet after dinner.',
    malayalamAudioPrompt: 'രാത്രി 8:30 ആയി. അത്താഴത്തിന് ശേഷം വിറ്റാമിൻ ഗുളിക കഴിക്കുക.',
    repeat: 'daily',
    completed: false,
    date: new Date().toISOString().split('T')[0],
    missed: false,
    notes: 'Caregiver verified.'
  }
];

const defaultRoutines = [
  {
    _id: '67cf00000000000000000041',
    patientId: defaultPatient._id,
    time: '07:00 AM',
    timeSlot: 'Morning',
    activity: 'Wake up, gentle stretch & fresh up',
    malayalamActivity: 'ഉണരുക, ശുചിത്വം, മൃദുവായ സ്ട്രെച്ചിംഗ്',
    icon: 'sun',
    description: 'Listen to soft devotional music while washing face and brushing teeth.',
    order: 1
  },
  {
    _id: '67cf00000000000000000042',
    patientId: defaultPatient._id,
    time: '08:00 AM',
    timeSlot: 'Morning',
    activity: 'Wholesome Breakfast & Morning Medicine',
    malayalamActivity: 'പ്രഭാതഭക്ഷണവും രാവിലെത്തെ മരുന്നും',
    icon: 'coffee',
    description: 'Idli or oatmeal with Priya, followed by blood pressure medicine.',
    order: 2
  },
  {
    _id: '67cf00000000000000000043',
    patientId: defaultPatient._id,
    time: '09:30 AM',
    timeSlot: 'Morning',
    activity: 'Memory & Photo Album Time',
    malayalamActivity: 'ഫോട്ടോ ആൽബവും ഓർമ്മപ്പെടുത്തലും',
    icon: 'book',
    description: 'Browsing through family photos or listening to favorite radio songs.',
    order: 3
  },
  {
    _id: '67cf00000000000000000044',
    patientId: defaultPatient._id,
    time: '01:00 PM',
    timeSlot: 'Afternoon',
    activity: 'Warm Family Lunch',
    malayalamActivity: 'ഉച്ചഭക്ഷണം',
    icon: 'utensils',
    description: 'Fresh warm meal in the dining room with plenty of water.',
    order: 4
  },
  {
    _id: '67cf00000000000000000045',
    patientId: defaultPatient._id,
    time: '02:00 PM',
    timeSlot: 'Afternoon',
    activity: 'Restful Afternoon Nap',
    malayalamActivity: 'ഉച്ചയുറക്കം / വിശ്രമം',
    icon: 'moon',
    description: 'Relax in the quiet bedroom with soft curtains drawn.',
    order: 5
  },
  {
    _id: '67cf00000000000000000046',
    patientId: defaultPatient._id,
    time: '04:30 PM',
    timeSlot: 'Evening',
    activity: 'Tea & Chai with Ananya',
    malayalamActivity: 'വൈകുന്നേരത്തെ ചായയും കൊച്ചുമകളുമൊത്തുള്ള സമയം',
    icon: 'coffee',
    description: 'Light tea and biscuits, looking at Ananya’s new drawings.',
    order: 6
  },
  {
    _id: '67cf00000000000000000047',
    patientId: defaultPatient._id,
    time: '05:30 PM',
    timeSlot: 'Evening',
    activity: 'Evening Garden Walk',
    malayalamActivity: 'പൂന്തോട്ടത്തിൽ സായാഹ്ന നടത്തം',
    icon: 'walk',
    description: 'Walking in the fresh air and watering the jasmine plants.',
    order: 7
  },
  {
    _id: '67cf00000000000000000048',
    patientId: defaultPatient._id,
    time: '08:00 PM',
    timeSlot: 'Night',
    activity: 'Light Dinner & Evening News',
    malayalamActivity: 'അത്താഴം, സായാഹ്ന വാർത്തകൾ',
    icon: 'utensils',
    description: 'Gentle dinner followed by your evening vitamin.',
    order: 8
  },
  {
    _id: '67cf00000000000000000049',
    patientId: defaultPatient._id,
    time: '10:00 PM',
    timeSlot: 'Night',
    activity: 'Peaceful Bedtime Routine',
    malayalamActivity: 'ഉറങ്ങാൻ തയ്യാറെടുക്കൽ',
    icon: 'moon',
    description: 'Dim night lamp, warm blanket, and restful night sleep.',
    order: 9
  }
];

const defaultEmergencyContacts = [
  {
    _id: '67cf00000000000000000051',
    patientId: defaultPatient._id,
    name: 'Priya Thomas (Daughter)',
    relationship: 'Daughter / Living in same house',
    phoneNumber: '+91 98471 23456',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    priority: 1,
    isPrimaryCaregiver: true,
    notes: 'Available immediately in person or by phone.'
  },
  {
    _id: '67cf00000000000000000052',
    patientId: defaultPatient._id,
    name: 'Rahul Kurian (Son)',
    relationship: 'Elder Son',
    phoneNumber: '+91 98472 34567',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    priority: 2,
    isPrimaryCaregiver: false,
    notes: 'Can coordinate emergency transport or backup care.'
  },
  {
    _id: '67cf00000000000000000053',
    patientId: defaultPatient._id,
    name: 'Dr. Elizabeth Roy (Neurologist)',
    relationship: 'Primary Healthcare Physician',
    phoneNumber: '+91 98470 12345',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    priority: 3,
    isPrimaryCaregiver: false,
    notes: 'City Memorial Healthcare Center - Neurology Dept.'
  },
  {
    _id: '67cf00000000000000000054',
    patientId: defaultPatient._id,
    name: 'Kochi Emergency Ambulance Services',
    relationship: 'Medical Emergency',
    phoneNumber: '108',
    photoUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&auto=format&fit=crop&q=80',
    priority: 4,
    isPrimaryCaregiver: false,
    notes: 'National 24/7 emergency medical hotline.'
  }
];

const defaultNotifications = [
  {
    _id: '67cf00000000000000000061',
    patientId: defaultPatient._id,
    caregiverId: defaultCaregiver._id,
    type: 'completed_reminder',
    title: 'Reminder Completed',
    message: 'Thomas completed "Drink a Glass of Fresh Water" at 11:00 AM.',
    severity: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    _id: '67cf00000000000000000062',
    patientId: defaultPatient._id,
    caregiverId: defaultCaregiver._id,
    type: 'general',
    title: 'Daily Schedule Loaded',
    message: '9 routine events scheduled for today.',
    severity: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 14400000)
  }
];

module.exports = {
  defaultPatient,
  defaultCaregiver,
  defaultFamilyMembers,
  defaultMemories,
  defaultReminders,
  defaultRoutines,
  defaultEmergencyContacts,
  defaultNotifications
};
