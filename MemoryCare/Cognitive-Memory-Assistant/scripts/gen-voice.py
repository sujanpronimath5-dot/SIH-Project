import json
import os
import subprocess
import sys

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
    },
}

VOICES = {
    "en": "en-IN-NeerjaNeural",
    "hi": "hi-IN-SwaraNeural",
    "bn": "bn-IN-TanishaaNeural",
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STORY_LANGS = {"hi", "bn"}


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


merge_story_phrases()
OUT = os.path.join(ROOT, "public", "voice")
os.makedirs(OUT, exist_ok=True)

FILTER_LANG = sys.argv[1] if len(sys.argv) > 1 else None


def gen_one(lang, key, text):
    path = os.path.join(OUT, lang, f"{key}.mp3")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return True
    cmd = [
        "edge-tts",
        "--voice", VOICES[lang],
        "--text", text,
        "--write-media", path,
    ]
    for attempt in range(4):
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if result.returncode == 0:
            return True
        print("RETRY", lang, key, f"attempt {attempt + 1}", file=sys.stderr)
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