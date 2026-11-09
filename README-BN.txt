MPR SQUAD P.C.S WORK DETAILS — Android WebView project (v2.9)

এই ফোল্ডারটি Android Studio-তে খোলার উপযোগী একটি Android project source।
এটি নিজে APK নয়। Android SDK ও Gradle দিয়ে Build > Build APK(s) চালাতে হবে।

ফিচার:
- assets/index.html-এ অফলাইন হিসাব অ্যাপ
- WebView DOM storage; অ্যাপের নিজস্ব ডেটা সংরক্ষণ
- PDF রিপোর্টের জন্য Android Print framework
- JSON ব্যাকআপ ও CSV ফাইল Downloads/MPR SQUAD-এ সংরক্ষণ
- JSON ব্যাকআপ বেছে Restore করার file picker

সতর্কতা:
- এই সোর্স এই পরিবেশে Android SDK দিয়ে compile/install পরীক্ষা করা যায়নি।
- নতুন APK ইনস্টল করার আগে পুরোনো অ্যাপ থেকে JSON backup নিন।
- YouTube QR এখনো যোগ করা হয়নি; প্রকৃত QR image অথবা সঠিক YouTube URL দরকার।


v2.9: Developer Details স্ক্রিনে Facebook, Instagram, TikTok, YouTube, WhatsApp, Telegram, Website বা অন্যান্য প্ল্যাটফর্মের URL ও QR ছবি যোগ/পরিবর্তন/মুছতে পারবেন। প্রথমবার Admin PIN তৈরি করতে হবে। QR ছবি ২ MB-এর কম রাখুন। PIN লোকাল ডেটায় থাকে; এটি সার্ভার-স্তরের নিরাপত্তা নয়।
