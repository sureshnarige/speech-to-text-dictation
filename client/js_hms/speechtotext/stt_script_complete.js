(function () {
    'use strict';

    // ─── CORRECTIONS DICTIONARY ────────────────────────────────────
    const CORRECTIONS = {

        // ── PHONETIC MISHEARS (General Medical) ──────────────────────────────
        "high per tension": "Hypertension",
        "high pertension": "Hypertension",
        "die a beats": "Diabetes",
        "die a betes": "Diabetes",
        "new monia": "Pneumonia",
        "new monya": "Pneumonia",
        "end a carditis": "Endocarditis",
        "peri carditis": "Pericarditis",
        "s t elevation": "ST-elevation",
        "n stemi": "NSTEMI",
        "h b a 1 c": "HbA1c",
        "myocardial in fraction": "Myocardial Infarction",
        "myocardial infraction": "Myocardial Infarction",
        "my oh card eel": "Myocardial",
        "tacky cardia": "Tachycardia",
        "brady cardia": "Bradycardia",
        "a rith me a": "Arrhythmia",
        "angio plasty": "Angioplasty",
        "endo tracheal": "Endotracheal",
        "septi seemia": "Septicaemia",
        "sep to seemia": "Septicaemia",
        "hypo glycemia": "Hypoglycaemia",
        "hyper glycemia": "Hyperglycaemia",
        "haemo globin": "Haemoglobin",
        "thrombo cytopenia": "Thrombocytopenia",
        "thrombo sis": "Thrombosis",
        "embol ism": "Embolism",
        "per fusion": "Perfusion",
        "echo cardio gram": "Echocardiogram",
        "electro cardio gram": "Electrocardiogram",
        "cerebro vascular": "Cerebrovascular",
        "intra venous": "Intravenous",
        "sub cutaneous": "Subcutaneous",
        "intra muscular": "Intramuscular",
        "anti coagulant": "Anticoagulant",
        "anti biotic": "Antibiotic",
        "anti hypertensive": "Antihypertensive",
        "pro phylaxis": "Prophylaxis",
        "histo path ology": "Histopathology",
        "dys pnea": "Dyspnoea",
        "dis pnea": "Dyspnoea",
        "or thop nea": "Orthopnoea",
        "hema turia": "Haematuria",
        "pro tein uria": "Proteinuria",
        "gluco suria": "Glucosuria",
        "oligo uria": "Oliguria",
        "poly uria": "Polyuria",
        "an uria": "Anuria",
        "dys uria": "Dysuria",

        // ── GENERAL ABBREVIATIONS ────────────────────────────────────────────
        "bp": "BP", "hr": "HR", "rr": "RR", "spo2": "SpO2",
        "o2 sat": "O2 Saturation", "hba1c": "HbA1c", "gcs": "GCS (Glasgow Coma Scale)",
        "tia": "TIA", "cva": "CVA", "cvs": "CVS",
        "ekg": "ECG", "ecg": "ECG", "mri": "MRI",
        "x ray": "X-ray", "x-ray": "X-ray",
        "usg": "USG", "cxr": "CXR", "abg": "ABG",
        "pft": "PFT", "echo": "Echocardiogram",

        // ── CARDIOLOGY ───────────────────────────────────────────────────────
        "stemi": "STEMI", "nstemi": "NSTEMI",
        "a fib": "Atrial Fibrillation", "af": "Atrial Fibrillation",
        "v fib": "Ventricular Fibrillation",
        "chf": "Congestive Heart Failure", "cad": "Coronary Artery Disease",
        "cabg": "Coronary Artery Bypass Graft",
        "pci": "Percutaneous Coronary Intervention",
        "bnp": "BNP", "ef": "Ejection Fraction",
        "tachycardia": "Tachycardia", "bradycardia": "Bradycardia",
        "arrhythmia": "Arrhythmia",

        // ── RESPIRATORY ──────────────────────────────────────────────────────
        "copd": "COPD", "pe": "Pulmonary Embolism",
        "dvt": "Deep Vein Thrombosis", "gerd": "GERD",

        // ── NEPHROLOGY ───────────────────────────────────────────────────────
        "ckd": "Chronic Kidney Disease", "aki": "Acute Kidney Injury",

        // ── ENDOCRINOLOGY ────────────────────────────────────────────────────
        "dm": "Diabetes Mellitus", "pcos": "PCOS",
        "dm2": "Type 2 Diabetes Mellitus", "dm1": "Type 1 Diabetes Mellitus",
        "t2dm": "Type 2 Diabetes Mellitus", "t1dm": "Type 1 Diabetes Mellitus",

        // ── VITALS / SYMPTOMS ────────────────────────────────────────────────
        "sob": "Shortness of Breath", "ht": "Hypertension", "htn": "Hypertension",
        "mi": "Myocardial Infarction", "uti": "Urinary Tract Infection",

        // ── LABS ─────────────────────────────────────────────────────────────
        "wbc": "WBC", "rbc": "RBC", "plt": "Platelets",
        "hb": "Haemoglobin", "esr": "ESR", "crp": "CRP",
        "lft": "LFT", "rft": "RFT", "tsh": "TSH",
        "s creatinine": "Serum Creatinine", "s sodium": "Serum Sodium",
        "s potassium": "Serum Potassium", "s urea": "Serum Urea",
        "pt inr": "PT/INR", "aptt": "APTT",

        // ── MEDICATION ROUTES / FREQUENCIES ──────────────────────────────────
        "npo": "NPO (Nothing by Mouth)", "prn": "PRN (As Needed)",
        "bd": "Twice Daily", "tds": "Three Times Daily", "od": "Once Daily",
        "qid": "Four Times Daily", "hs": "At Bedtime",
        "iv": "IV", "im": "IM", "po": "PO", "sc": "SC", "sl": "SL",
        "tabs": "Tablets", "cap": "Capsule", "inj": "Injection",
        "doi": "Date of Injury",
        "mg": "mg", "mcg": "mcg", "ml": "mL", "dl": "dL",

        // ── MEDICATION CORRECTIONS ──────────────────────────────────────────
        "met for min": "Metformin",
        "met formin": "Metformin",
        "metformin": "Metformin",
        "met oh pro lol": "Metoprolol",
        "met pro lol": "Metoprolol",
        "metoprolol": "Metoprolol",
        "met o prolol": "Metoprolol",
        "at enol ol": "Atenolol",
        "atenolol": "Atenolol",
        "ate nolol": "Atenolol",
        "am lo di pine": "Amlodipine",
        "am low di pine": "Amlodipine",
        "amlodipine": "Amlodipine",
        "am lod i pine": "Amlodipine",
        "nor vasc": "Norvasc (Amlodipine)",
        "ram i pril": "Ramipril",
        "rami pril": "Ramipril",
        "ramipril": "Ramipril",
        "enal a pril": "Enalapril",
        "enalapril": "Enalapril",
        "lisin o pril": "Lisinopril",
        "lisinopril": "Lisinopril",
        "lysin o pril": "Lisinopril",
        "losartan": "Losartan",
        "lo sartan": "Losartan",
        "telmi sartan": "Telmisartan",
        "telmisartan": "Telmisartan",
        "val sartan": "Valsartan",
        "valsartan": "Valsartan",
        "cand e sartan": "Candesartan",
        "candesartan": "Candesartan",
        "di go xin": "Digoxin",
        "digo xin": "Digoxin",
        "digoxin": "Digoxin",
        "furose mide": "Furosemide",
        "furo semide": "Furosemide",
        "furosemide": "Furosemide",
        "lasix": "Lasix (Furosemide)",
        "spiro no lactone": "Spironolactone",
        "spironolactone": "Spironolactone",
        "bisoprolol": "Bisoprolol",
        "biso prolol": "Bisoprolol",
        "carve dilol": "Carvedilol",
        "carvedilol": "Carvedilol",
        "hydra lazine": "Hydralazine",
        "hydralazine": "Hydralazine",
        "nitro glycerin": "Nitroglycerin",
        "nitroglycerin": "Nitroglycerin",
        "isosor bide": "Isosorbide Dinitrate",
        "isosorbide": "Isosorbide Dinitrate",
        "amio darone": "Amiodarone",
        "amiodarone": "Amiodarone",
        "vera pamil": "Verapamil",
        "verapamil": "Verapamil",
        "dil tia zem": "Diltiazem",
        "diltiazem": "Diltiazem",
        "warfa rin": "Warfarin",
        "warfarin": "Warfarin",
        "war fa rin": "Warfarin",
        "heparin": "Heparin",
        "hepa rin": "Heparin",
        "enox a parin": "Enoxaparin",
        "enoxaparin": "Enoxaparin",
        "clopi dogrel": "Clopidogrel",
        "clopidogrel": "Clopidogrel",
        "clopi do grel": "Clopidogrel",
        "aspirin": "Aspirin",
        "atorva statin": "Atorvastatin",
        "atorvastatin": "Atorvastatin",
        "ator va statin": "Atorvastatin",
        "rosuva statin": "Rosuvastatin",
        "rosuvastatin": "Rosuvastatin",
        "simva statin": "Simvastatin",
        "simvastatin": "Simvastatin",
        "prava statin": "Pravastatin",
        "pravastatin": "Pravastatin",
        "fenofibrate": "Fenofibrate",
        "feno fi brate": "Fenofibrate",
        "ezetimibe": "Ezetimibe",
        "eze timi be": "Ezetimibe",
        "dabi ga tran": "Dabigatran",
        "dabigatran": "Dabigatran",
        "ri varo xaban": "Rivaroxaban",
        "rivaroxaban": "Rivaroxaban",
        "api xaban": "Apixaban",
        "apixaban": "Apixaban",

        // ── Diabetes Drugs ────────────────────────────────────────────────────
        "glib en clamide": "Glibenclamide",
        "glibenclamide": "Glibenclamide",
        "gli pi zide": "Glipizide",
        "glipizide": "Glipizide",
        "gliclazide": "Gliclazide",
        "gli cla zide": "Gliclazide",
        "gli me piride": "Glimepiride",
        "glimepiride": "Glimepiride",
        "sitagliptin": "Sitagliptin",
        "sita gliptin": "Sitagliptin",
        "vildagliptin": "Vildagliptin",
        "vil da gliptin": "Vildagliptin",
        "saxa gliptin": "Saxagliptin",
        "saxagliptin": "Saxagliptin",
        "empa gli flozin": "Empagliflozin",
        "empagliflozin": "Empagliflozin",
        "dapa gli flozin": "Dapagliflozin",
        "dapagliflozin": "Dapagliflozin",
        "cana gli flozin": "Canagliflozin",
        "canagliflozin": "Canagliflozin",
        "lira glutide": "Liraglutide",
        "liraglutide": "Liraglutide",
        "sema glutide": "Semaglutide",
        "semaglutide": "Semaglutide",
        "dula glutide": "Dulaglutide",
        "dulaglutide": "Dulaglutide",
        "exena tide": "Exenatide",
        "exenatide": "Exenatide",
        "insulin": "Insulin",
        "insulin glargine": "Insulin Glargine",
        "insulin lispro": "Insulin Lispro",
        "insulin aspart": "Insulin Aspart",
        "insulin demir": "Insulin Detemir",
        "insulin determir": "Insulin Detemir",
        "pioglitazone": "Pioglitazone",
        "pio gli ta zone": "Pioglitazone",
        "acarbose": "Acarbose",
        "aca r bose": "Acarbose",

        // ── Antibiotics ───────────────────────────────────────────────────────
        "amox i cillin": "Amoxicillin",
        "amoxicillin": "Amoxicillin",
        "augmentin": "Augmentin (Amoxicillin-Clavulanate)",
        "aug men tin": "Augmentin (Amoxicillin-Clavulanate)",
        "amox i clav": "Amoxicillin-Clavulanate",
        "ampicillin": "Ampicillin",
        "ampi cillin": "Ampicillin",
        "piper a cillin": "Piperacillin-Tazobactam",
        "piperacillin": "Piperacillin-Tazobactam",
        "pip tazo": "Piperacillin-Tazobactam",
        "van co mycin": "Vancomycin",
        "vancomycin": "Vancomycin",
        "metro nida zole": "Metronidazole",
        "metronidazole": "Metronidazole",
        "met ro nida zole": "Metronidazole",
        "flagyl": "Flagyl (Metronidazole)",
        "cipro floxacin": "Ciprofloxacin",
        "ciprofloxacin": "Ciprofloxacin",
        "levo floxacin": "Levofloxacin",
        "levofloxacin": "Levofloxacin",
        "moxi floxacin": "Moxifloxacin",
        "moxifloxacin": "Moxifloxacin",
        "doxycy cline": "Doxycycline",
        "doxycycline": "Doxycycline",
        "azithy romycin": "Azithromycin",
        "azithromycin": "Azithromycin",
        "azi throw my cin": "Azithromycin",
        "erythromycin": "Erythromycin",
        "ery thro mycin": "Erythromycin",
        "clari thro mycin": "Clarithromycin",
        "clarithromycin": "Clarithromycin",
        "ceftriaXone": "Ceftriaxone",
        "cef tri axone": "Ceftriaxone",
        "ceftriaxone": "Ceftriaxone",
        "cefo taxime": "Cefotaxime",
        "cefotaxime": "Cefotaxime",
        "cefo perazone": "Cefoperazone-Sulbactam",
        "cefoperazone": "Cefoperazone-Sulbactam",
        "cefe pime": "Cefepime",
        "cefepime": "Cefepime",
        "genta mycin": "Gentamicin",
        "gentamicin": "Gentamicin",
        "amika cin": "Amikacin",
        "amikacin": "Amikacin",
        "mero penem": "Meropenem",
        "meropenem": "Meropenem",
        "imipe nem": "Imipenem-Cilastatin",
        "imipenem": "Imipenem-Cilastatin",
        "ertape nem": "Ertapenem",
        "ertapenem": "Ertapenem",
        "co trim oxazole": "Co-trimoxazole (Trimethoprim-Sulfamethoxazole)",
        "cotrimoxazole": "Co-trimoxazole",
        "trimetho prim": "Trimethoprim",
        "linezolid": "Linezolid",
        "line zolid": "Linezolid",
        "colistin": "Colistin",
        "col is tin": "Colistin",
        "polymyxin": "Polymyxin B",
        "poly myxin": "Polymyxin B",
        "tigecycline": "Tigecycline",
        "tige cy cline": "Tigecycline",
        "fluconazole": "Fluconazole",
        "fluco nazole": "Fluconazole",
        "fluco na zole": "Fluconazole",
        "vori cona zole": "Voriconazole",
        "voriconazole": "Voriconazole",
        "ampho te ricin": "Amphotericin B",
        "amphotericin": "Amphotericin B",
        "caspo fun gin": "Caspofungin",
        "caspofungin": "Caspofungin",
        "acy clovir": "Acyclovir",
        "acyclovir": "Acyclovir",
        "acy clo vir": "Acyclovir",

        // ── Antihypertensives / Diuretics ─────────────────────────────────────
        "amlodipine": "Amlodipine",
        "hydro chloro thiazide": "Hydrochlorothiazide",
        "hydrochlorothiazide": "Hydrochlorothiazide",
        "hydro chloe roh thiazide": "Hydrochlorothiazide",
        "chlor thali done": "Chlorthalidone",
        "chlorthalidone": "Chlorthalidone",
        "inda pamide": "Indapamide",
        "indapamide": "Indapamide",
        "man ni tol": "Mannitol",
        "mannitol": "Mannitol",

        // ── GI Drugs ──────────────────────────────────────────────────────────
        "ome pra zole": "Omeprazole",
        "omeprazole": "Omeprazole",
        "pan to pra zole": "Pantoprazole",
        "pantoprazole": "Pantoprazole",
        "esome pra zole": "Esomeprazole",
        "esomeprazole": "Esomeprazole",
        "rabe pra zole": "Rabeprazole",
        "rabeprazole": "Rabeprazole",
        "lansa pra zole": "Lansoprazole",
        "lansoprazole": "Lansoprazole",
        "rani ti dine": "Ranitidine",
        "ranitidine": "Ranitidine",
        "domperi done": "Domperidone",
        "domperidone": "Domperidone",
        "meto clo pramide": "Metoclopramide",
        "metoclopramide": "Metoclopramide",
        "ondan setron": "Ondansetron",
        "ondansetron": "Ondansetron",
        "panto prazole": "Pantoprazole",
        "lactu lose": "Lactulose",
        "lactulose": "Lactulose",
        "bi sa co dyl": "Bisacodyl",
        "bisacodyl": "Bisacodyl",

        // ── Pain / NSAIDs / Analgesics ────────────────────────────────────────
        "para cetamol": "Paracetamol",
        "paracetamol": "Paracetamol",
        "aceta minophen": "Acetaminophen (Paracetamol)",
        "acetaminophen": "Acetaminophen",
        "ibu profen": "Ibuprofen",
        "ibuprofen": "Ibuprofen",
        "diclo fenac": "Diclofenac",
        "diclofenac": "Diclofenac",
        "naproxen": "Naproxen",
        "napro xen": "Naproxen",
        "indometh acin": "Indomethacin",
        "indomethacin": "Indomethacin",
        "cele coxib": "Celecoxib",
        "celecoxib": "Celecoxib",
        "tramadol": "Tramadol",
        "trama dol": "Tramadol",
        "morphine": "Morphine",
        "mor phine": "Morphine",
        "peth i dine": "Pethidine",
        "pethidine": "Pethidine",
        "fentanyl": "Fentanyl",
        "fenta nyl": "Fentanyl",
        "buprenorphine": "Buprenorphine",
        "bupre norph ine": "Buprenorphine",
        "gabapentin": "Gabapentin",
        "gaba pentin": "Gabapentin",
        "pregabalin": "Pregabalin",
        "prega balin": "Pregabalin",
        "amitriptyline": "Amitriptyline",
        "ami trip ty line": "Amitriptyline",

        // ── CNS / Neuro / Psych ───────────────────────────────────────────────
        "phenytoin": "Phenytoin",
        "phe ny toin": "Phenytoin",
        "phenobarbitone": "Phenobarbitone",
        "phenobar bi tone": "Phenobarbitone",
        "carba mazepine": "Carbamazepine",
        "carbamazepine": "Carbamazepine",
        "val pro ate": "Valproate",
        "valproate": "Valproate",
        "val proic acid": "Valproic Acid",
        "valproic acid": "Valproic Acid",
        "levetira cetam": "Levetiracetam",
        "levetiracetam": "Levetiracetam",
        "lamo tri gine": "Lamotrigine",
        "lamotrigine": "Lamotrigine",
        "diaze pam": "Diazepam",
        "diazepam": "Diazepam",
        "loraze pam": "Lorazepam",
        "lorazepam": "Lorazepam",
        "midazo lam": "Midazolam",
        "midazolam": "Midazolam",
        "clo naze pam": "Clonazepam",
        "clonazepam": "Clonazepam",
        "halo peri dol": "Haloperidol",
        "haloperidol": "Haloperidol",
        "risperidone": "Risperidone",
        "ris peri done": "Risperidone",
        "olan za pine": "Olanzapine",
        "olanzapine": "Olanzapine",
        "que tiapine": "Quetiapine",
        "quetiapine": "Quetiapine",
        "sertraline": "Sertraline",
        "sert ra line": "Sertraline",
        "fluoxetine": "Fluoxetine",
        "fluo xetine": "Fluoxetine",
        "escitalo pram": "Escitalopram",
        "escitalopram": "Escitalopram",
        "par oxetine": "Paroxetine",
        "paroxetine": "Paroxetine",
        "venla faxine": "Venlafaxine",
        "venlafaxine": "Venlafaxine",
        "donepezil": "Donepezil",
        "done pezil": "Donepezil",
        "memantine": "Memantine",
        "mem an tine": "Memantine",
        "levodopa": "Levodopa",
        "levo dopa": "Levodopa",
        "carbi dopa": "Carbidopa",
        "carbidopa": "Carbidopa",
        "pramo pexole": "Pramipexole",
        "pramipexole": "Pramipexole",

        // ── Respiratory Drugs ─────────────────────────────────────────────────
        "salbuta mol": "Salbutamol",
        "salbutamol": "Salbutamol",
        "ven to lin": "Ventolin (Salbutamol)",
        "ventolin": "Ventolin (Salbutamol)",
        "ipra tro pium": "Ipratropium",
        "ipratropium": "Ipratropium",
        "atro vent": "Atrovent (Ipratropium)",
        "tio tro pium": "Tiotropium",
        "tiotropium": "Tiotropium",
        "salmeterol": "Salmeterol",
        "salme terol": "Salmeterol",
        "formoterol": "Formoterol",
        "formo terol": "Formoterol",
        "budesonide": "Budesonide",
        "bude sonide": "Budesonide",
        "fluti casone": "Fluticasone",
        "fluticasone": "Fluticasone",
        "beclo methasone": "Beclomethasone",
        "beclomethasone": "Beclomethasone",
        "monte lukast": "Montelukast",
        "montelukast": "Montelukast",
        "theo phylline": "Theophylline",
        "theophylline": "Theophylline",
        "amino phylline": "Aminophylline",
        "aminophylline": "Aminophylline",
        "dexametha sone": "Dexamethasone",
        "dexamethasone": "Dexamethasone",
        "methyl prednisolone": "Methylprednisolone",
        "methylprednisolone": "Methylprednisolone",
        "predni solone": "Prednisolone",
        "prednisolone": "Prednisolone",
        "hydro cortisone": "Hydrocortisone",
        "hydrocortisone": "Hydrocortisone",

        // ── Thyroid Drugs ─────────────────────────────────────────────────────
        "levothy roxine": "Levothyroxine",
        "levothyroxine": "Levothyroxine",
        "carbi mazole": "Carbimazole",
        "carbimazole": "Carbimazole",
        "propyl thio uracil": "Propylthiouracil",
        "propylthiouracil": "Propylthiouracil",

        // ── Oncology / Immunosuppressants ─────────────────────────────────────
        "metho trexate": "Methotrexate",
        "methotrexate": "Methotrexate",
        "cyclo phosphamide": "Cyclophosphamide",
        "cyclophosphamide": "Cyclophosphamide",
        "aza thio prine": "Azathioprine",
        "azathioprine": "Azathioprine",
        "tacroli mus": "Tacrolimus",
        "tacrolimus": "Tacrolimus",
        "cyclo sporin": "Cyclosporin",
        "cyclosporin": "Cyclosporin",
        "myco phenolate": "Mycophenolate Mofetil",
        "mycophenolate": "Mycophenolate Mofetil",
        "ritux i mab": "Rituximab",
        "rituximab": "Rituximab",
        "imatinib": "Imatinib",
        "ima ti nib": "Imatinib",
        "hydroxy chloroquine": "Hydroxychloroquine",
        "hydroxychloroquine": "Hydroxychloroquine",
        "plaque nil": "Plaquenil (Hydroxychloroquine)",
        "plaquenil": "Plaquenil (Hydroxychloroquine)",

        // ── Vitamins / Supplements ────────────────────────────────────────────
        "calcium carbon ate": "Calcium Carbonate",
        "calcium carbonate": "Calcium Carbonate",
        "calci tri ol": "Calcitriol",
        "calcitriol": "Calcitriol",
        "ferro sulf ate": "Ferrous Sulphate",
        "ferrous sulphate": "Ferrous Sulphate",
        "folic acid": "Folic Acid",
        "cyano cobalamin": "Cyanocobalamin (Vitamin B12)",
        "cyanocobalamin": "Cyanocobalamin (Vitamin B12)",
        "thiamine": "Thiamine (Vitamin B1)",
        "pyridoxine": "Pyridoxine (Vitamin B6)",
        "vitamin d": "Vitamin D",
        "vitamin b12": "Vitamin B12",
        "vitamin k": "Vitamin K",
        "zinc": "Zinc",

        // ── Anticoagulants / Haematology ─────────────────────────────────────
        "trans examic acid": "Tranexamic Acid",
        "tranexamic acid": "Tranexamic Acid",
        "vitamin k antagonist": "Vitamin K Antagonist",
        "pro tamine": "Protamine Sulphate",
        "protamine": "Protamine Sulphate",
    };

    // ─── STATE ──────────────────────────────────────────────────────
    let ws = null;
    let isRecording = false;
    let isConnecting = false;
    let committedText = '';
    let baseText = '';
    let lastServerRawText = '';
    let reconnectTimer = null;
    let heartbeatTimer = null;
    let editorDiv = null;
    let textBox = null;

    // Browser Speech Recognition for partials
    let recognition = null;
    let browserPartial = '';
    let wsPartial = '';
    
    // ─── DOM HELPERS ──────────────────────────────────────────────────

    function getEditorDiv() {
        if (editorDiv) return editorDiv;
        var editors = document.querySelectorAll('.ajax__html_editor_extender_texteditor');
        editorDiv = editors.length > 0 ? editors[0] : null;
        return editorDiv;
    }

    function getTextBox() {
        if (textBox) return textBox;
        var inputs = document.querySelectorAll('input[type="hidden"]');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].id && inputs[i].id.indexOf('TxtEditor') !== -1) {
                textBox = inputs[i];
                return textBox;
            }
        }
        textBox = document.getElementById('TxtEditor');
        return textBox;
    }

    function setEditorHTML(html) {
        var div = getEditorDiv();
        if (div) {
            div.innerHTML = html;
        }
        var tb = getTextBox();
        if (tb) {
            tb.value = div ? div.innerHTML : html;
        }
    }

    function getEditorText() {
        var div = getEditorDiv();
        if (div) {
            return div.innerText || '';
        }
        var tb = getTextBox();
        return tb ? tb.value : '';
    }
    function mergeTranscript(oldText, newText) {
        if (!newText) return oldText;                 // empty final → keep old, don't wipe
        if (!oldText) return newText;

        var oldWords = oldText.trim().split(/\s+/);
        var newWords = newText.trim().split(/\s+/);

        // Find the largest overlap between the END of oldWords and the START of newWords.
        // This covers: exact cumulative continuation, cumulative with small edits,
        // and fresh restarts (overlap = 0, so we just append).
        var maxOverlap = Math.min(oldWords.length, newWords.length);
        var overlap = 0;

        for (var len = maxOverlap; len > 0; len--) {
            var tail = oldWords.slice(oldWords.length - len).join(' ').toLowerCase();
            var head = newWords.slice(0, len).join(' ').toLowerCase();
            if (tail === head) {
                overlap = len;
                break;
            }
        }

        if (overlap === newWords.length) {
            // newText is fully contained in oldText already (stray duplicate/late final) — ignore
            return oldText;
        }

        if (overlap > 0) {
            // newText continues oldText — replace overlapping tail, append the rest
            var remainder = newWords.slice(overlap).join(' ');
            return oldWords.slice(0, oldWords.length - overlap).concat(newWords).join(' ');
            // (keeps oldWords intact, replaces only the tail with newWords which already includes the overlap)
        }

        // No overlap at all → treat as a brand-new segment (e.g. after a reset) → append
        return oldText + ' ' + newText;
    }
    function applyCorrections(text) {
        if (!text) return text;
        var result = text;
        for (var wrong in CORRECTIONS) {
            if (CORRECTIONS.hasOwnProperty(wrong)) {
                var regex = new RegExp('\\b' + wrong + '\\b', 'gi');
                result = result.replace(regex, CORRECTIONS[wrong]);
            }
        }
        return result;
    }


    // ─── UPDATE EDITOR WITH HYBRID DISPLAY ──────────────────────────

    function updateEditorDisplay() {
        var displayHTML = '';

        var fullCommitted = baseText + committedText;
        if (fullCommitted.trim()) {
            var committedLines = fullCommitted.split('\n').filter(function (p) { return p.trim(); });
            displayHTML = committedLines.map(function (p) {
                return '<p style="color:#000000; margin:0 0 4px 0;">' + p + '</p>';
            }).join('');
        }

        // Only ever one partial source active at a time now: browser (preferred)
        // or whisper-as-fallback (only when browser STT unsupported).
        var partialText = browserPartial || wsPartial;

        if (partialText && partialText.trim()) {
            var correctedPartial = applyCorrections(partialText);
            displayHTML += '<p style="color:#a0a0a0; font-style:italic; margin:0; opacity:0.7;">' + correctedPartial + '</p>';

            var liveText = document.getElementById('sttLiveText');
            if (liveText) liveText.textContent = correctedPartial;
        } else {
            var liveText2 = document.getElementById('sttLiveText');
            if (liveText2) liveText2.textContent = 'Listening…';
        }

        setEditorHTML(displayHTML);
    }

    // ─── BROWSER SPEECH RECOGNITION (for partial/light grey) ────────

    function startBrowserRecognition() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Browser SpeechRecognition not supported, using only WebSocket');
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';
        recognition.maxAlternatives = 1;

        recognition.onresult = function (event) {
            var interim = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                if (!event.results[i].isFinal) {
                    interim += event.results[i][0].transcript;
                }
            }

            if (interim.trim()) {
                browserPartial = interim;
                updateEditorDisplay();
            }
        };

        recognition.onerror = function (event) {
            console.warn('Browser STT error:', event.error);
            if (isRecording && event.error !== 'aborted' && event.error !== 'no-speech') {
                try {
                    recognition.stop();
                    setTimeout(function () {
                        if (isRecording) {
                            recognition.start();
                        }
                    }, 300);
                } catch (e) { }
            }
        };

        recognition.onend = function () {
            if (isRecording) {
                try {
                    recognition.start();
                } catch (e) {
                    console.warn('Failed to restart browser STT:', e);
                }
            }
        };

        try {
            recognition.start();
            console.log('Browser SpeechRecognition started');
        } catch (e) {
            console.warn('Failed to start browser STT:', e);
        }
    }

    function stopBrowserRecognition() {
        if (recognition) {
            try {
                recognition.stop();
            } catch (e) { }
            recognition = null;
        }
        browserPartial = '';
    }

    // ─── WEBSOCKET CONNECTION (for final/black text) ────────────────

    function getWebSocketUrl() {
        var langValue =  'en-IN';
        var host = window.location.hostname;
        var isLocal = (host === 'localhost' || host === '127.0.0.1');
        var proto = (window.location.protocol === 'https:' && !isLocal) ? 'wss' : 'ws';
        return proto + '://' + host + ':8765?lang=' + encodeURIComponent(langValue);
    }

    //function getWebSocketUrl() {
    //    var langValue =  'en-IN';
    //    // No port needed; ngrok maps this domain to localhost:8765 for you.
    //    return 'wss://taekwondo-starch-luxury.ngrok-free.dev?lang=' + encodeURIComponent(langValue);
    //}

    function connectWebSocket() {
        if (isConnecting || (ws && ws.readyState === WebSocket.OPEN)) return;
        isConnecting = true;
        setStatus('Connecting…', 'stt-dot-idle');
        try {
            ws = new WebSocket(getWebSocketUrl());
            ws.binaryType = 'arraybuffer';
            ws.onopen = function () {
                isConnecting = false;
                setStatus('Connected ✓', 'stt-dot-ok');
                startMicrophone();
                startBrowserRecognition();
            };

            ws.onmessage = function (event) {
                try {
                    var msg = JSON.parse(event.data);
                    handleWebSocketMessage(msg);
                } catch (e) {
                    console.warn('STT: Failed to parse message', e);
                }
            };

            ws.onerror = function (error) {
                console.error('STT WebSocket error:', error);
                isConnecting = false;
                setStatus('Connection error', 'stt-dot-idle');
            };

            ws.onclose = function () {
                isConnecting = false;
                if (isRecording) {
                    setStatus('Disconnected, reconnecting…', 'stt-dot-idle');
                    scheduleReconnect();
                } else {
                    setStatus('Ready', 'stt-dot-idle');
                }
            };

        } catch (e) {
            isConnecting = false;
            setStatus('Failed to connect', 'stt-dot-idle');
            console.error('STT: Connection failed', e);
        }
    }

    function scheduleReconnect() {
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(function () {
            if (isRecording && (!ws || ws.readyState !== WebSocket.OPEN)) {
                connectWebSocket();
            }
        }, 2000);
    }

    function handleWebSocketMessage(msg) {
        console.log('[ws message]', msg.type, msg.text);
        if (msg.type === 'partial') {
            // Whisper partials are NOT shown — browser SpeechRecognition already
            // gives instant (zero-latency) partials. Whisper is only used to
            // produce the corrected FINAL text once you pause.
            // Fallback: only use it if browser STT isn't running at all.
            if (!recognition) {
                wsPartial = msg.text;
                updateEditorDisplay();
            }
            return;
        } 
        else if (msg.type === 'final') {
            committedText = applyCorrections(msg.text);
            browserPartial = '';
            wsPartial = '';
            updateEditorDisplay();
            setStatus('Committed ✓', 'stt-dot-ok');
            if (msg.done) {
                stopRecording();
            }
        }
    }


    let audioContext = null;
    let audioProcessor = null;
    let micStream = null;

    function startMicrophone() {
        if (!navigator.mediaDevices || !window.AudioContext) {
            setStatus('Mic not supported', 'stt-dot-idle');
            return;
        }

        if (audioContext && audioContext.state === 'running') {
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                micStream = stream;
                audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                var source = audioContext.createMediaStreamSource(stream);
                audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);

                source.connect(audioProcessor);
                audioProcessor.connect(audioContext.destination);

                audioProcessor.onaudioprocess = function (e) {
                    if (!ws || ws.readyState !== WebSocket.OPEN) return;
                    var input = e.inputBuffer.getChannelData(0);
                    var pcm16 = new Int16Array(input.length);
                    for (var i = 0; i < input.length; i++) {
                        var s = Math.max(-1, Math.min(1, input[i]));
                        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    }
                    ws.send(pcm16.buffer);
                };

                setStatus('Recording…', 'stt-dot-active');
                isRecording = true;
                setButtons(true);

                // Show live bar
                var bar = document.getElementById('sttLiveBar');
                if (bar) bar.classList.add('active');
            })
            .catch(function (err) {
                console.error('STT: Mic access denied', err);
                setStatus('Mic permission denied', 'stt-dot-idle');
                stopRecording();
            });
    }

    function stopMicrophone() {
        if (audioProcessor) {
            audioProcessor.disconnect();
            audioProcessor = null;
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(function () { });
            audioContext = null;
        }
        if (micStream) {
            micStream.getTracks().forEach(function (t) { t.stop(); });
            micStream = null;
        }
    }

    // ─── UI HELPERS ──────────────────────────────────────────────────

    function setStatus(text, dotClass) {
        var statusText = document.getElementById('sttStatusText');
        if (statusText) statusText.innerText = text;
        var dot = document.getElementById('sttDot');
        if (dot) {
            dot.className = 'stt-dot ' + (dotClass || 'stt-dot-idle');
        }
    }

    function setButtons(recording) {
        var startBtn = document.getElementById('sttBtnStart');
        var stopBtn = document.getElementById('sttBtnStop');
        var badge = document.getElementById('sttRecordingBadge');
        if (startBtn) startBtn.disabled = recording;
        if (stopBtn) stopBtn.disabled = !recording;
        if (badge) {
            if (recording) {
                badge.classList.add('active');
            } else {
                badge.classList.remove('active');
            }
        }
        // Hide/show live bar
        var bar = document.getElementById('sttLiveBar');
        if (bar) {
            if (recording) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        }
    }


    // ─── PUBLIC API ──────────────────────────────────────────────────

    window.stt_start = function () {
        if (isRecording) return;

        // Clear state
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
        ws = null;
        browserPartial = '';
        wsPartial = '';
        lastServerRawText = '';

        // Get existing text as committed base
        baseText = getEditorText();
        if (baseText && !baseText.endsWith('\n')) {
            baseText += '\n';
        }
        committedText = ''; 

        setButtons(true);
        setStatus('Connecting…', 'stt-dot-idle');
        connectWebSocket();

        // Heartbeat
        clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(function () {
            if (ws && ws.readyState === WebSocket.OPEN) {
                try {
                    ws.send(JSON.stringify({ cmd: 'ping' }));
                } catch (e) { }
            }
        }, 5000);
    };

    window.stt_stop = function () {
        stopRecording();
    };

    function stopRecording() {
        isRecording = false;
        clearInterval(heartbeatTimer);
        clearTimeout(reconnectTimer);
        stopMicrophone();
        stopBrowserRecognition();

        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify({ cmd: 'stop' }));
            } catch (e) { }
            setTimeout(function () {
                if (ws) {
                    ws.close();
                    ws = null;
                }
            }, 500);
        } else {
            ws = null;
        }

        // Clear partials and update
        browserPartial = '';
        wsPartial = '';
        updateEditorDisplay();

        setButtons(false);
        setStatus('Ready', 'stt-dot-idle');
        isConnecting = false;

        // Hide live bar
        var bar = document.getElementById('sttLiveBar');
        if (bar) bar.classList.remove('active');
    }

    window.stt_clear = function () {
        committedText = '';
        baseText = '';
        browserPartial = '';
        wsPartial = '';
        lastServerRawText = '';   // NEW
        setEditorHTML('');
        setStatus('Ready', 'stt-dot-idle');
    };

    window.stt_getText = function () {
        return getEditorText();
    };

    window.stt_setText = function (text) {
        committedText = text + '\n';
        setEditorHTML(text);
    };


    // ─── INIT ────────────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', function () {
        if (!window.WebSocket) {
            var warn = document.getElementById('sttNoSupport');
            if (warn) {
                warn.style.display = 'block';
                warn.textContent = '⚠ Your browser does not support WebSockets.';
            }
            document.getElementById('sttBtnStart').disabled = true;
            return;
        }

        setStatus('Ready', 'stt-dot-idle');
        setButtons(false);
    });

})();
