MPR SQUAD P.C.S WORK DETAILS — Android Project

এই ZIP-এ Android Studio/Gradle Android প্রজেক্টের ফাইল, WebView অ্যাপ, আপনার HTML, launcher icon এবং GitHub Actions workflow আছে।

গুরুত্বপূর্ণ: এটি Android project source; APK ফাইল নয়। GitHub Actions দিয়ে APK তৈরি করতে হবে। এই পরিবেশে Android SDK/Gradle build চালিয়ে APK পরীক্ষা করা হয়নি।

ফোন দিয়ে APK তৈরির সহজ ধাপ:
১) ZIP Extract করুন।
২) GitHub অ্যাপ/ব্রাউজারে আপনার আগের MPR SQUAD PCS repository খুলুন।
৩) repository-র Code > Add file > Upload files ব্যবহার করুন।
৪) Extract করা MPR-SQUAD-PCS-ANDROID-PROJECT ফোল্ডারের ভেতরের সব ফাইল ও ফোল্ডার repository-র root-এ আপলোড করুন (ফোল্ডারের ভিতরে আরেকটি project folder তৈরি করবেন না)।
৫) Commit changes করুন।
৬) Actions ট্যাব > “Build MPR SQUAD PCS Android APK” workflow > Run workflow চাপুন।
৭) কাজ সফল হলে workflow run-এর নিচে Artifacts থেকে MPR-SQUAD-PCS-debug-apk ZIP ডাউনলোড করুন।
৮) Artifact ZIP Extract করে app-debug.apk ইনস্টল করুন। Android জিজ্ঞেস করলে এই উৎস থেকে ইনস্টল অনুমতি দিন।

সতর্কতা:
- পুরোনো repository ফাইল overwrite করার আগে repository-র backup রাখুন।
- একই project root-এ settings.gradle.kts, build.gradle.kts, gradle.properties, app/ এবং .github/ থাকতে হবে।
- APK build সফল হলেই সব feature সঠিক প্রমাণ হয় না; ইনস্টল করে duty, bill, expense, payment status, theme, backup/restore এবং PDF পরীক্ষা করুন।
- অ্যাপের তথ্য এই ডিভাইসের local storage-এ থাকে; নিয়মিত JSON backup নিন।
