import base64
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.request
import urllib.error

DATA = {
    "en": {
        "setupTitle": "Let's Get To Know You",
        "setupSubtitle": "Please tell us a bit about yourself",
        "language": "Preferred Language",
        "speak": "Listen",
        "changeLanguage": "Change language",
        "wellDone": "Well done!",
        "nice": "That's the one",
        "tryAgain": "Let's try that again",
        "allFound": "You found them all",
        "back": "Back",
        "home": "Home",
        "english": "English",
        "breatheIn": "Breathe in",
        "breatheHold": "Hold",
        "breatheOut": "Breathe out",
        "breathingInstruction": "Sit comfortably and relax your shoulders.\nBreathe in gently through your nose for 4 seconds.\nHold your breath gently for 4 seconds, without straining.\nThen breathe out slowly through your mouth for 8 seconds.\nBreathe at your own comfortable pace.\nIf you feel dizzy, uncomfortable, or unwell, please stop and rest.",
        "breathingCompletedMessage": "You have completed your breathing exercise.",
        "patternHelp": "Tap two cards to find a matching pair",
        "facePromptWho": "Who is this?",
        "facePromptWhoRelated": "Who is this? How is this person related to you?",
        "facePromptRelated": "How is this person related to you?",
        "shapeInstCircle": "Tap all the circles",
        "shapeInstSquare": "Tap all the squares",
        "shapeInstTriangle": "Tap all the triangles",
        "shapeInstRectangle": "Tap all the rectangles",
        "shapeInstStar": "Tap all the stars",
        "shapeInstPentagon": "Tap all the pentagons",
        "rel_mother": "Mother",
        "rel_father": "Father",
        "rel_daughter": "Daughter",
        "rel_son": "Son",
        "rel_sister": "Sister",
        "rel_brother": "Brother",
        "rel_spouse": "Spouse",
        "rel_neighbor": "Neighbor",
        "rel_nurse": "Nurse",
        "rel_doctor": "Doctor",
        "rel_granddaughter": "Granddaughter",
        "rel_grandson": "Grandson",
        "rel_friend": "Friend",
    },
    "hi": {
        "setupTitle": "आइए आपको जाने",
        "setupSubtitle": "कृपया अपने बारे में थोड़ा बताएं",
        "language": "पसंदीदा भाषा",
        "speak": "सुनें",
        "changeLanguage": "भाषा बदलें",
        "wellDone": "बहुत बढ़िया!",
        "nice": "बिल्कुल सही",
        "tryAgain": "आइए एक बार फिर कोशिश करते हैं",
        "allFound": "आपने सभी जोड़ियाँ ढूंढ लीं",
        "back": "वापस जाएं",
        "home": "होम",
        "hindi": "हिन्दी",
        "breatheIn": "अंदर सांस लें",
        "breatheHold": "रोकें",
        "breatheOut": "बाहर सांस छोड़ें",
        "breathingInstruction": "आराम से बैठें और अपने कंधों को ढीला छोड़ें।\nअपनी नाक से धीरे-धीरे 4 सेकंड तक सांस अंदर लें।\n4 सेकंड तक धीरे से सांस रोकें, बिना ज़ोर लगाए।\nफिर 8 सेकंड तक अपने मुँह से धीरे-धीरे सांस छोड़ें।\nअपनी सुविधा के अनुसार आराम से सांस लें।\nअगर आपको चक्कर, बेचैनी या तबीयत ठीक न लगे, तो रुक जाएँ और आराम करें।",
        "breathingCompletedMessage": "आपने अपना सांस अभ्यास पूरा कर लिया है।",
        "patternHelp": "मिलती-जुलती जोड़ी ढूंढने के लिए दो कार्ड पर टैप करें",
        "facePromptWho": "यह कौन हैं?",
        "facePromptWhoRelated": "यह कौन हैं? इनका आपसे क्या रिश्ता है?",
        "facePromptRelated": "इनका आपसे क्या रिश्ता है?",
        "shapeInstCircle": "सभी गोल आकार छुएँ",
        "shapeInstSquare": "सभी वर्ग छुएँ",
        "shapeInstTriangle": "सभी त्रिभुज छुएँ",
        "shapeInstRectangle": "सभी आयत छुएँ",
        "shapeInstStar": "सभी तारे छुएँ",
        "shapeInstPentagon": "सभी पंचभुज छुएँ",
        "rel_mother": "माता जी",
        "rel_father": "पिता जी",
        "rel_daughter": "बेटी",
        "rel_son": "बेटा",
        "rel_sister": "बहन",
        "rel_brother": "भाई",
        "rel_spouse": "जीवनसाथी",
        "rel_neighbor": "पड़ोसी",
        "rel_nurse": "नर्स",
        "rel_doctor": "डॉक्टर",
        "rel_granddaughter": "पोती / नातिन",
        "rel_grandson": "पोता / नाती",
        "rel_friend": "मित्र",
    },
    "bn": {
        "setupTitle": "আসুন আপনাকে জানি",
        "setupSubtitle": "আপনার সম্পর্কে কিছু বলুন",
        "language": "পছন্দের ভাষা",
        "speak": "শুনুন",
        "changeLanguage": "ভাষা পরিবর্তন করুন",
        "wellDone": "খুব সুন্দর!",
        "nice": "একদম ঠিক",
        "tryAgain": "চলুন আরেকবার চেষ্টা করি",
        "allFound": "আপনি সবগুলো খুঁজে পেয়েছেন",
        "back": "ফিরে যান",
        "home": "হোম",
        "bengali": "বাংলা",
        "breatheIn": "শ্বাস নিন",
        "breatheHold": "ধরে রাখুন",
        "breatheOut": "শ্বাস ছাড়ুন",
        "breathingInstruction": "আরামে বসুন এবং আপনার কাঁধ শিথিল করুন।\nনাক দিয়ে ধীরে ধীরে ৪ সেকেন্ড শ্বাস নিন।\n৪ সেকেন্ড ধরে আলতোভাবে শ্বাস ধরে রাখুন, জোর না দিয়ে।\nতারপর ৮ সেকেন্ড ধরে মুখ দিয়ে ধীরে ধীরে শ্বাস ছাড়ুন।\nআপনার আরামদায়ক গতিতে শ্বাস নিন।\nযদি মাথা ঘোরে, অস্বস্তি হয়, বা ভালো না লাগে, থামুন এবং বিশ্রাম নিন।",
        "breathingCompletedMessage": "আপনি আপনার শ্বাসের ব্যায়াম সম্পন্ন করেছেন।",
        "patternHelp": "মেলে এমন জোড়া খুঁজতে দুটি কার্ডে ট্যাপ করুন",
        "facePromptWho": "ইনি কে?",
        "facePromptWhoRelated": "ইনি কে? আপনার সাথে এনার সম্পর্ক কী?",
        "facePromptRelated": "আপনার সাথে এনার সম্পর্ক কী?",
        "shapeInstCircle": "সব বৃত্তগুলো স্পর্শ করুন",
        "shapeInstSquare": "সব বর্গক্ষেত্রগুলো স্পর্শ করুন",
        "shapeInstTriangle": "সব ত্রিভুজগুলো স্পর্শ করুন",
        "shapeInstRectangle": "সব আয়তক্ষেত্রগুলো স্পর্শ করুন",
        "shapeInstStar": "সব তারাগুলো স্পর্শ করুন",
        "shapeInstPentagon": "সব পঞ্চভুজগুলো স্পর্শ করুন",
        "rel_mother": "মা",
        "rel_father": "বাবা",
        "rel_daughter": "মেয়ে",
        "rel_son": "ছেলে",
        "rel_sister": "বোন",
        "rel_brother": "ভাই",
        "rel_spouse": "জীবনসঙ্গী",
        "rel_neighbor": "প্রতিবেশী",
        "rel_nurse": "নার্স",
        "rel_doctor": "ডাক্তার",
        "rel_granddaughter": "নাতনি",
        "rel_grandson": "নাতি",
        "rel_friend": "বন্ধু",
    },
    "as": {
        "setupTitle": "আপোনাক জনিবলৈ আহক",
        "setupSubtitle": "আপোনাৰ বিষয়ে অলপ কওক",
        "wellDone": "ভাল কৰিলে!",
        "nice": "ঠিকেই আছে",
        "tryAgain": "আকৌ এবাৰ চেষ্টা কৰোঁ আহক",
        "allFound": "আপুনি সকলো বিচাৰি পালে",
        "breatheIn": "উশাহ লওক",
        "breatheHold": "ধৰি ৰাখক",
        "breatheOut": "উশাহ এৰি দিয়ক",
        "breathingInstruction": "আৰামেৰে বহক আৰু কান্ধ শিথিল কৰক।\nনাকেদি ধীৰে ধীৰে ৪ ছেকেণ্ড উশাহ লওক।\n৪ ছেকেণ্ড জোৰ নকৰাকৈ উশাহ ধৰি ৰাখক।\nতাৰপিছত মুখেদি ৮ ছেকেণ্ড ধীৰে উশাহ এৰি দিয়ক।\nনিজৰ নিৰাপদ গতিত উশাহ লওক।\nযদি মূৰ ঘূৰায়, অস্বস্তি হয় নাইবা ভাল নালাগে, তেন্তে ৰৈ বিশ্ৰাম লওক।",
        "breathingCompletedMessage": "আপুনি নিজৰ উশাহৰ ব্যায়াম সম্পূৰ্ণ কৰিলে।",
        "patternHelp": "মিল থকা যোৰা বিচৰাৰ বাবে দুটা কাৰ্ডত টিপক",
        "facePromptWho": "এওঁ কোন?",
        "facePromptWhoRelated": "এওঁ কোন? আপোনাৰ লগত এওঁৰ সম্পৰ্ক কি?",
        "facePromptRelated": "আপোনাৰ লগত এওঁৰ সম্পৰ্ক কি?",
        "shapeInstCircle": "সকলো বৃত্ত স্পৰ্শ কৰক",
        "shapeInstSquare": "সকলো বৰ্গক্ষেত্ৰ স্পৰ্শ কৰক",
        "shapeInstTriangle": "সকলো ত্ৰিভুজ স্পৰ্শ কৰক",
        "shapeInstRectangle": "সকলো আয়তক্ষেত্ৰ স্পৰ্শ কৰক",
        "shapeInstStar": "সকলো তৰা স্পৰ্শ কৰক",
        "shapeInstPentagon": "সকলো পঞ্চভুজ স্পৰ্শ কৰক",
        "assamese": "অসমীয়া",
        "rel_mother": "আই / মা",
        "rel_father": "দেউতা",
        "rel_daughter": "জী",
        "rel_son": "ল’ৰা",
        "rel_sister": "ভনী / বাইদেউ",
        "rel_brother": "ভাই / ককাইদেউ",
        "rel_spouse": "জীৱনসংগী",
        "rel_neighbor": "চুবুৰীয়া",
        "rel_nurse": "নাৰ্ছ",
        "rel_doctor": "ডাক্তৰ",
        "rel_granddaughter": "নাতিনী",
        "rel_grandson": "নাতি",
        "rel_friend": "বন্ধু",
    },
    "mni": {
        "setupTitle": "নহাক খঙনহনগনী",
        "setupSubtitle": "চানবীদুনা নহগী মরক্তা খরদি হায়রো",
        "wellDone": "য়াম্না ফজবা!",
        "nice": "অচুম্বনি",
        "tryAgain": "অমুক্ হন্না হোৎনৌ",
        "allFound": "নহাক্না পুম্নমক ফংখি",
        "breatheIn": "সাথাই লোও",
        "breatheHold": "থেম্না য়ুংগদুনো",
        "breatheOut": "থাদ্রং ওখ্রো",
        "breathingInstruction": "আরাম্না ফম্মু অমসুং নহগী হায়াখৌ শিথিল খল্লু।\nনাকদগী থাদ্রংসে ৪ সেকেংদা সাথাই লোও।\n৪ সেকেং থেম্না, জোড় তৌদ্রনা, থাদ্রং য়ুংগদুনো।\nঅদুদগী চীনদা ৮ সেকেংদা ধরং থাদ্রং ওখ্রো।\nনহগী মজৌ-মজৌ গতিদা সাথাই লোও।\nখুদঙ্গদা খুদোং লৈদ্রে, খ্বাইদরবা আফাবা মথকতা লৈদ্রে, থোরু অমসুং পোতম্নি।",
        "breathingCompletedMessage": "নহাকে নহগী সাথাই লোওবগী অভ্যাস লোইশিল্লে।",
        "patternHelp": "মতেং চাইরবা জোড়া ফংনো কার্দ অনি টেপ তৌ",
        "facePromptWho": "মসি সানা?",
        "facePromptWhoRelated": "মসি সানা? নহাক্তগা মসিগী মরিগী মা?",
        "facePromptRelated": "নহাক্তগা মসিগী মরিগী মা?",
        "shapeInstCircle": "তেম্পাক পুম্নমক নাম্মু",
        "shapeInstSquare": "চাং চারি পুম্নমক নাম্মু",
        "shapeInstTriangle": "ত্রিকোণ পুম্নমক নাম্মু",
        "shapeInstRectangle": "আয়ত পুম্নमक নাম্মু",
        "shapeInstStar": "থৌৱাল পুম্নমক নাম্মু",
        "shapeInstPentagon": "পঞ্চভুজ পুম্নমক নাম্মু",
        "manipuri": "মৈতৈলোন",
        "rel_mother": "ইমা",
        "rel_father": "ইপা",
        "rel_daughter": "ইচা নুপী",
        "rel_son": "ইচা নুপা",
        "rel_sister": "ইচে / ইচল",
        "rel_brother": "ইনাও / ইদাউদো",
        "rel_spouse": "পুনশি মারুপ",
        "rel_neighbor": "য়ুমলোন-কৈলোন",
        "rel_nurse": "নার্স",
        "rel_doctor": "দোক্তর",
        "rel_granddaughter": "ইশু নুপী",
        "rel_grandson": "ইশু নুপা",
        "rel_friend": "মরুপ",
    },
    "brx": {
        "setupTitle": "नोंथांखौ मिथिनो हागोन नामा",
        "setupSubtitle": "अननानै नोंथांनि बागै एसेल' खिन्था",
        "wellDone": "गोजौ खालाम!",
        "nice": "बेयो गोजौ",
        "tryAgain": "फिन खेबसे नाजा",
        "allFound": "नोंथांनि बेसोलथिखौ मोनजाबाय",
        "breatheIn": "हावा ला",
        "breatheHold": "हावाखौ रायथि",
        "breatheOut": "हावा जोंख",
        "breathingInstruction": "आरामसे बुंसि आरो नोंथांनि हायाखौ आराम खालाम।\nनाकजों थदमसे ४ सेकेंद हावा ला।\n४ सेकेंद जोरखाँ गैया हावाखौ रायथि।\nउनाव मुखजों ८ सेकेंद हावा जोंख।\nनोंथांनि मोजां गतियाव हावा ला।\nजेबो नोंथांनि साला खुद्रां, नाया मोजां गैया नाबा बेबायनाय जायो, बुंसि आरो आराम खालाम।",
        "breathingCompletedMessage": "नोंथां हावा लानायखौ खालामसारबाय।",
        "patternHelp": "मॅच खालामनो मोन्नै कार्ड खेबो",
        "facePromptWho": "बेयो सोर?",
        "facePromptWhoRelated": "बेयो सोर? नोंथांजों बेयानि सोमोन्दो मा?",
        "facePromptRelated": "नोंथांजों बेयानि सोमोन्दो मा?",
        "shapeInstCircle": "सबाथे गोलाफोरखौ खेबो",
        "shapeInstSquare": "सबाथे चौखाफोरखौ खेबो",
        "shapeInstTriangle": "सबाथे त्रिभुजफोरखौ खेबो",
        "shapeInstRectangle": "सबाथे आयतफोरखौ खेबो",
        "shapeInstStar": "सबाथे दिनथाफोरखौ खेबो",
        "shapeInstPentagon": "सबाथे पंचभुजफोरखौ खेबो",
        "bodo": "बड़ो",
        "rel_mother": "आमा",
        "rel_father": "आफा",
        "rel_daughter": "फिसा हिनजाव",
        "rel_son": "फिसा होवा",
        "rel_sister": "बिनानाज्व",
        "rel_brother": "दादा / भाई",
        "rel_spouse": "जियनसंगि",
        "rel_neighbor": "खोननाय मानसि",
        "rel_nurse": "नर्स",
        "rel_doctor": "दक्तार",
        "rel_granddaughter": "आयजो हिनजाव",
        "rel_grandson": "आयजो होवा",
        "rel_friend": "महर",
    },
}

VOICES = {
    "en": "en-IN-NeerjaNeural",
    "hi": "hi-IN-SwaraNeural",
    "bn": "bn-IN-TanishaaNeural",
}

# Bhashini (ULCA/Dhruva) pipeline for languages edge-tts cannot emit.
BHASHINI_INFERENCE_KEY = "Kyvhl-2S-mfhow-yfKJWTg0w5laqGqtssYIC0eM0kLP_QMbvh76lS2xYme2XfGU2"
BHASHINI_INFERENCE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
BHASHINI_SERVICES = {
    "as": {"serviceId": "ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4", "scriptCode": "Beng"},
    "mni": {"serviceId": "ai4bharat/indic-tts-coqui-misc-gpu--t4", "scriptCode": "Beng"},
    "brx": {"serviceId": "ai4bharat/indic-tts-coqui-misc-gpu--t4", "scriptCode": "Deva"},
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STORY_LANGS = {"en", "hi", "bn", "as", "mni", "brx"}


def merge_story_phrases():
    script = os.path.join(ROOT, "scripts", "extract-story.js")
    proc = subprocess.run(
        ["node", script], capture_output=True, text=True, encoding="utf-8"
    )
    if proc.returncode != 0:
        print("WARN: story extraction failed", proc.stderr.strip(), file=sys.stderr)
        return
    story = json.loads(proc.stdout)
    for lang, phrases in story.items():
        if lang not in STORY_LANGS or lang not in DATA:
            continue
        pack = DATA[lang]
        for key, text in phrases.items():
            if text not in pack.values():
                pack[key] = text


def bhashini_tts(text, lang):
    svc = BHASHINI_SERVICES[lang]
    payload = {
        "pipelineTasks": [
            {
                "taskType": "tts",
                "config": {
                    "language": {
                        "sourceLanguage": lang,
                        "sourceScriptCode": svc["scriptCode"],
                    },
                    "serviceId": svc["serviceId"],
                    "gender": "female",
                    "samplingRate": 22050,
                },
            }
        ],
        "inputData": {"input": [{"source": text}]},
    }
    req = urllib.request.Request(
        BHASHINI_INFERENCE_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": BHASHINI_INFERENCE_KEY,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return (
        data.get("pipelineResponse", [{}])[0].get("audio", [{}])[0].get("audioContent")
        or None
    )


def convert_wav_to_mp3(wav_path, mp3_path):
    cmd = [
        "ffmpeg", "-y", "-i", wav_path,
        "-codec:a", "libmp3lame", "-q:a", "6",
        mp3_path,
    ]
    subprocess.run(cmd, capture_output=True, check=False)
    return os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 0


merge_story_phrases()
OUT = os.path.join(ROOT, "public", "voice")
os.makedirs(OUT, exist_ok=True)

FILTER_LANG = sys.argv[1] if len(sys.argv) > 1 else None


def gen_one(lang, key, text):
    path = os.path.join(OUT, lang, f"{key}.mp3")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return True
    for attempt in range(4):
        try:
            if lang in BHASHINI_SERVICES:
                audio_b64 = bhashini_tts(text, lang)
                if not audio_b64:
                    raise RuntimeError("empty audio response")
                tmp_fd, tmp_path = tempfile.mkstemp(suffix=".wav")
                os.close(tmp_fd)
                try:
                    with open(tmp_path, "wb") as fh:
                        fh.write(base64.b64decode(audio_b64))
                    return convert_wav_to_mp3(tmp_path, path)
                finally:
                    if os.path.exists(tmp_path):
                        os.remove(tmp_path)
            else:
                cmd = [
                    "edge-tts",
                    "--voice", VOICES[lang],
                    "--text", text,
                    "--write-media", path,
                ]
                result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
                if result.returncode == 0:
                    return True
        except Exception as exc:  # noqa: BLE001
            print("RETRY", lang, key, f"attempt {attempt + 1}", exc, file=sys.stderr)
        time.sleep(1.5)
    print("ERR", lang, key, file=sys.stderr)
    return False


ok = 0
fail = 0
for lang, items in DATA.items():
    if FILTER_LANG and lang != FILTER_LANG:
        continue
    folder = os.path.join(OUT, lang)
    os.makedirs(folder, exist_ok=True)
    for key, text in items.items():
        if gen_one(lang, key, text):
            ok += 1
        else:
            fail += 1

js_body = (
    "/* Generated by scripts/gen-voice.py — bundled offline audio phrases.\n"
    " * Values must match the translated text so speak() can match text->key.\n"
    " */\n"
    "export const VOICE_PHRASES = "
    + json.dumps(DATA, ensure_ascii=False, indent=2)
    + ";\n"
)
with open(os.path.join(ROOT, "src", "voicePhrases.js"), "w", encoding="utf-8") as fh:
    fh.write(js_body)

print(f"generated {ok} mp3s, {fail} failures")